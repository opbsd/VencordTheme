/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 opbsd and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { RendererSettings } from "@main/settings";
import { DATA_DIR, THEMES_DIR } from "@main/utils/constants";
import { ensureSafePath } from "@main/utils/ensureSafePath";
import { randomUUID } from "crypto";
import { BrowserWindow, dialog, IpcMainInvokeEvent } from "electron";
import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "fs";
import { copyFile, mkdir, open, readFile, rename, rm } from "fs/promises";
import { basename, extname, join } from "path";

import { Palette, paletteVariables } from "./colors";

interface StartupCache {
    identity: string;
    poster: string;
    palette?: Palette;
    paletteVersion?: number;
}

const wallpaper = join(THEMES_DIR, "wallpaper.mp4");
const cacheDir = join(DATA_DIR, "obsidianVideo");
const cachePath = join(cacheDir, "startup.json");
const cssPath = join(THEMES_DIR, "obsidian-startup.css");
let startupIdentity: string | undefined;

function identity() {
    const stat = statSync(wallpaper);
    return `${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}:${stat.ino}`;
}

function validCache(data: StartupCache): boolean {
    return typeof data?.identity === "string"
        && typeof data.poster === "string" && data.poster.length < 512_000
        && /^data:image\/(jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(data.poster)
        && (data.palette === undefined || (Array.isArray(data.palette) && data.palette.length === 2
            && data.palette.every(rgb => Array.isArray(rgb) && rgb.length === 3
                && rgb.every(v => Number.isFinite(v) && v >= 0 && v <= 255))));
}

function readCache(): StartupCache | undefined {
    try {
        const data: StartupCache = JSON.parse(readFileSync(cachePath, "utf8"));
        if (validCache(data) && data.identity === identity()) return {
            ...data,
            palette: data.paletteVersion === 2 ? data.palette : undefined
        };
    } catch { }
}

function writeAtomic(path: string, content: string) {
    writeFileSync(`${path}.tmp`, content);
    renameSync(`${path}.tmp`, path);
}

function refreshStartup() {
    const cached = readCache();
    const config = RendererSettings.plain.plugins?.ObsidianVideo as { enabled?: boolean; adaptiveColors?: boolean; } | undefined;
    let css = "/* Generated locally by ObsidianVideo. Do not distribute. */\n";
    startupIdentity = cached?.identity;
    if (config?.enabled !== false) {
        const poster = cached ? `url("${cached.poster}")` : "none";
        css += `:where(:root:not([data-obsidian-video-disabled])){--obs-wallpaper-still:${poster}!important;}\n`;
        if (config?.adaptiveColors !== false) {
            const colors = cached?.palette ?? [[96, 96, 96], [96, 96, 96]];
            const declarations = Object.entries(paletteVariables(colors)).map(([k, v]) => `${k}:${v}!important;`).join("");
            css += `:where(:root:not([data-obsidian-video-disabled]):not([data-obsidian-palette-disabled])){${declarations}}\n`;
        }
    }
    try {
        mkdirSync(THEMES_DIR, { recursive: true });
        writeAtomic(cssPath, css);
    } catch (error) {
        console.warn("[ObsidianVideo] Could not prepare startup styles.", error);
    }
    return cached;
}

// Validate before the renderer loads its theme, including when the MP4 changed while Discord was closed.
refreshStartup();

export function getStartup(_: IpcMainInvokeEvent) {
    const cached = readCache();
    const currentIdentity = identity();
    if (startupIdentity !== currentIdentity) refreshStartup();
    return { identity: currentIdentity, cached };
}

export function saveStartup(_: IpcMainInvokeEvent, cache: StartupCache) {
    if (!validCache(cache) || cache.identity !== identity()) return false;
    mkdirSync(cacheDir, { recursive: true });
    writeAtomic(cachePath, JSON.stringify({ ...cache, paletteVersion: 2 }));
    if (startupIdentity !== cache.identity) refreshStartup();
    return true;
}

export function readWallpaper(_: IpcMainInvokeEvent) {
    return readFile(wallpaper);
}

export async function readStaticWallpaper(_: IpcMainInvokeEvent, url: string, previousIdentity: string) {
    const prefix = "vencord:///themes/";
    if (!url.startsWith(prefix)) throw new Error("Use an image in the themes folder.");
    const relative = decodeURIComponent(url.slice(prefix.length));
    const path = ensureSafePath(THEMES_DIR, relative);
    const types: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
    const mime = types[extname(relative).toLowerCase()];
    if (!path || !mime) throw new Error("Choose a local JPG, PNG or WebP image.");
    const stat = statSync(path);
    if (!stat.isFile()) throw new Error("Wallpaper is not a file.");
    const fileIdentity = `${relative}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}:${stat.ino}`;
    return { identity: fileIdentity, mime, data: previousIdentity === fileIdentity ? undefined : await readFile(path) };
}

let selecting = false;
let pending: { token: string; path: string; name: string; } | undefined;

export async function selectWallpaper(event: IpcMainInvokeEvent) {
    if (selecting) throw new Error("A video picker is already open.");
    selecting = true;
    try {
        const options = {
            title: "Choose wallpaper video",
            filters: [{ name: "MP4 video", extensions: ["mp4"] }],
            properties: ["openFile"] as ["openFile"]
        };
        const parent = BrowserWindow.fromWebContents(event.sender);
        const choice = await (parent ? dialog.showOpenDialog(parent, options) : dialog.showOpenDialog(options));
        if (choice.canceled || !choice.filePaths.length) return;
        const source = choice.filePaths[0];
        if (extname(source).toLowerCase() !== ".mp4") throw new Error("Choose an MP4 video.");
        const file = await open(source, "r");
        try {
            const header = Buffer.alloc(12);
            const { bytesRead } = await file.read(header, 0, header.length, 0);
            if (!(await file.stat()).isFile() || bytesRead < 12 || header.toString("ascii", 4, 8) !== "ftyp")
                throw new Error("This file is not an MP4 video.");
        } finally { await file.close(); }
        await mkdir(cacheDir, { recursive: true });
        if (pending) await rm(pending.path, { force: true });
        const token = randomUUID();
        const path = join(cacheDir, `selection-${token}.mp4`);
        try {
            await copyFile(source, path);
            const data = await readFile(path);
            pending = { token, path, name: basename(source) };
            return { token, name: pending.name, data };
        } catch (error) {
            await rm(path, { force: true });
            throw error;
        }
    } finally { selecting = false; }
}

export async function discardWallpaper(_: IpcMainInvokeEvent, token: string) {
    if (pending?.token !== token) return;
    const { path } = pending;
    pending = undefined;
    await rm(path, { force: true });
}

export async function commitWallpaper(_: IpcMainInvokeEvent, token: string, poster: string, palette: Palette) {
    if (pending?.token !== token) throw new Error("Choose the video again.");
    if (!validCache({ identity: "selection", poster, palette })) throw new Error("The video preview could not be prepared.");
    const selected = pending;
    const temporary = join(THEMES_DIR, `wallpaper-${token}.tmp`);
    try {
        await mkdir(THEMES_DIR, { recursive: true });
        await copyFile(selected.path, temporary);
        await rename(temporary, wallpaper);
        try {
            saveStartup(_, { identity: identity(), poster, palette });
            refreshStartup();
        } catch (error) {
            console.warn("[ObsidianVideo] Video saved, but startup cache could not be prepared.", error);
        }
        return selected.name;
    } finally {
        await rm(temporary, { force: true }).catch(error => console.warn("[ObsidianVideo] Could not remove temporary video.", error));
        await discardWallpaper(_, token).catch(error => console.warn("[ObsidianVideo] Could not remove video selection.", error));
    }
}
