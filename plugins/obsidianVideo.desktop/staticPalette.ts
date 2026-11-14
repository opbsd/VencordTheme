/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 opbsd and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { managedStyleRootNode } from "@api/Styles";
import { addThemeChangeListener, removeThemeChangeListener } from "@api/Themes";
import { createAndAppendStyle } from "@utils/css";
import type { PluginNative } from "@utils/types";

import { extractPalette, Palette, paletteVariables } from "./colors";

type Native = PluginNative<typeof import("./native")>;

export function attachStaticPalette(native: Native, enabled: () => boolean, changed: () => void) {
    const style = createAndAppendStyle("obsidian-static-palette", managedStyleRootNode);
    let identity = "";
    let colors: Palette | undefined;
    let active = false;
    let stopped = false;
    let generation = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function refresh() {
        const request = ++generation;
        const value = getComputedStyle(document.documentElement).getPropertyValue("--theme-wallpaper-image").trim();
        const url = /^url\(\s*["']?(vencord:\/\/\/themes\/[^"')]+)["']?\s*\)$/i.exec(value)?.[1];
        const wasActive = active;
        active = !!url;
        if (active !== wasActive) changed();
        if (!url || !enabled()) { style.textContent = ""; return; }
        try {
            const result = await native.readStaticWallpaper(url, identity);
            if (stopped || request !== generation) return;
            if (result.data) {
                const objectUrl = URL.createObjectURL(new Blob([new Uint8Array(result.data).buffer], { type: result.mime }));
                try {
                    const image = new Image();
                    image.src = objectUrl;
                    await image.decode();
                    if (stopped || request !== generation) return;
                    const canvas = document.createElement("canvas");
                    canvas.width = 64;
                    canvas.height = 36;
                    const context = canvas.getContext("2d");
                    if (!context) return;
                    context.drawImage(image, 0, 0, 64, 36);
                    colors = extractPalette(context.getImageData(0, 0, 64, 36).data) ?? [[96, 96, 96], [96, 96, 96]];
                    identity = result.identity;
                    canvas.width = canvas.height = 0;
                } finally { URL.revokeObjectURL(objectUrl); }
            }
            if (colors) {
                const declarations = Object.entries(paletteVariables(colors)).map(([k, v]) => `${k}:${v}!important;`).join("");
                style.textContent = `:root:root{${declarations}}`;
            }
        } catch (error) {
            if (!stopped && request === generation) style.textContent = "";
            console.warn("[ObsidianVideo] Static wallpaper palette unavailable.", error);
        }
    }

    function schedule() {
        clearTimeout(timer);
        timer = setTimeout(() => void refresh(), 150);
    }
    function onStyleLoad(event: Event) {
        if ((event.target as HTMLElement)?.id === "vencord-themes") schedule();
    }
    addThemeChangeListener(schedule);
    document.addEventListener("load", onStyleLoad, true);
    schedule();
    return {
        get active() { return active; },
        refresh: schedule,
        stop() {
            stopped = true;
            generation++;
            clearTimeout(timer);
            removeThemeChangeListener(schedule);
            document.removeEventListener("load", onStyleLoad, true);
            style.remove();
        }
    };
}
