/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 opbsd and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType, PluginNative } from "@utils/types";

import { Palette } from "./colors";
import { createAdaptivePalette } from "./palette";
import { attachWallpaperPicker } from "./picker";
import { chooseWallpaper } from "./selection";

const Native = VencordNative.pluginHelpers.ObsidianVideo as PluginNative<typeof import("./native")>;

let picker: ReturnType<typeof attachWallpaperPicker> | undefined;
let layer: HTMLDivElement | undefined;
let video: HTMLVideoElement | undefined;
let objectUrl: string | undefined;
let observer: MutationObserver | undefined;
let palette: ReturnType<typeof createAdaptivePalette> | undefined;
let startup: Awaited<ReturnType<typeof Native.getStartup>> | undefined;
let poster: string | undefined;
let lastPalette: Palette | undefined;
let lastSave = 0;
let savedWithPalette = false;

function rememberStartup(colors?: Palette) {
    if (colors) lastPalette = colors;
    if (!startup || !video || video.readyState < 2) return;
    if (!poster) {
        try {
            const canvas = document.createElement("canvas");
            canvas.width = Math.min(960, video.videoWidth);
            canvas.height = Math.max(1, Math.round(canvas.width * video.videoHeight / video.videoWidth));
            const context = canvas.getContext("2d");
            if (!context) return;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            poster = canvas.toDataURL("image/jpeg", .8);
            video.poster = poster;
        } catch { return; }
    }
    if (Date.now() - lastSave < 15000 && (savedWithPalette || !lastPalette)) return;
    lastSave = Date.now();
    savedWithPalette = !!lastPalette;
    Native.saveStartup({ identity: startup.identity, poster, palette: lastPalette }).catch(error => {
        console.warn("[ObsidianVideo] Startup cache could not be saved.", error);
    });
}

function onVideoReady() {
    updatePalette();
    rememberStartup();
}

function updatePalette() {
    document.documentElement.toggleAttribute("data-obsidian-palette-disabled", !settings.store.adaptiveColors);
    if (!video || !settings.store.adaptiveColors) {
        palette?.stop();
        palette = undefined;
        return;
    }
    // Decoders can emit loadeddata again after the window is restored.
    palette ??= createAdaptivePalette(video, lastPalette, rememberStartup);
    palette.setActive(!document.hidden && !reducedMotion.matches);
}

const settings = definePluginSettings({
    adaptiveColors: {
        type: OptionType.BOOLEAN,
        description: "Adapt the dark theme palette to the wallpaper colors.",
        default: true,
        onChange: updatePalette
    }
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updatePlayback() {
    if (!video?.src || !layer) return;
    layer.hidden = reducedMotion.matches;
    palette?.setActive(!document.hidden && !reducedMotion.matches);
    if (document.hidden || reducedMotion.matches) {
        lastSave = 0;
        rememberStartup();
        video.pause();
    } else {
        video.play().catch(() => {
            if (layer) layer.hidden = true;
        });
    }
}

export default definePlugin({
    name: "ObsidianVideo",
    description: "Plays a local Fallen Knight MP4 wallpaper without animated WebP backgrounds.",
    authors: [{ name: "opbsd", id: 0n }],
    tags: ["Appearance"],
    settings,
    enabledByDefault: true,

    start() {
        const mount = document.getElementById("app-mount");
        if (!mount || layer || !Native?.readWallpaper) return;

        picker = attachWallpaperPicker(mount, (signal, progress) => chooseWallpaper(Native, signal, progress));
        document.documentElement.removeAttribute("data-obsidian-video-disabled");
        document.documentElement.toggleAttribute("data-obsidian-palette-disabled", !settings.store.adaptiveColors);
        layer = document.createElement("div");
        layer.id = "obsidian-video-wallpaper";
        layer.hidden = true;
        Object.assign(layer.style, { position: "fixed", inset: "0", zIndex: "-1", pointerEvents: "none", overflow: "hidden" });
        layer.setAttribute("aria-hidden", "true");
        video = document.createElement("video");
        Object.assign(video.style, { position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" });
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.disablePictureInPicture = true;
        video.disableRemotePlayback = true;

        video.addEventListener("error", () => {
            if (layer) layer.hidden = true;
            palette?.setActive(false);
        });
        video.addEventListener("loadeddata", onVideoReady);
        layer.append(video);
        mount.prepend(layer);
        observer = new MutationObserver(() => {
            if (layer && !layer.isConnected) mount.prepend(layer);
        });
        observer.observe(mount, { childList: true });
        document.addEventListener("visibilitychange", updatePlayback);
        reducedMotion.addEventListener("change", updatePlayback);
        const currentLayer = layer;
        const currentVideo = video;
        (async () => {
            try {
                const initial = await Native.getStartup();
                if (layer !== currentLayer) return;
                startup = initial;
                poster = initial.cached?.poster;
                lastPalette = initial.cached?.palette;
                savedWithPalette = !!lastPalette;
                lastSave = initial.cached ? Date.now() : 0;
                if (poster) currentVideo.poster = poster;
                updatePalette();
                const data = await Native.readWallpaper();
                if (layer !== currentLayer) return;
                objectUrl = URL.createObjectURL(new Blob([new Uint8Array(data).buffer], { type: "video/mp4" }));
                currentVideo.src = objectUrl;
                updatePlayback();
            } catch {
                if (layer === currentLayer) {
                    currentLayer.hidden = true;
                    palette?.setActive(false);
                }
            }
        })();
    },

    stop() {
        picker?.stop();
        picker = undefined;
        document.documentElement.setAttribute("data-obsidian-video-disabled", "");
        lastSave = 0;
        rememberStartup();
        palette?.stop();
        palette = undefined;
        video?.removeEventListener("loadeddata", onVideoReady);
        observer?.disconnect();
        observer = undefined;
        document.removeEventListener("visibilitychange", updatePlayback);
        reducedMotion.removeEventListener("change", updatePlayback);
        video?.pause();
        video?.removeAttribute("src");
        video?.load();
        layer?.remove();
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = undefined;
        video = undefined;
        layer = undefined;
        startup = undefined;
        poster = undefined;
        lastPalette = undefined;
        lastSave = 0;
        savedWithPalette = false;
    }
});
