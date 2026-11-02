/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 opbsd and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { managedStyleRootNode } from "@api/Styles";
import { createAndAppendStyle } from "@utils/css";

import { extractPalette, mix, Palette, paletteVariables } from "./colors";

export { extractPalette, paletteVariables } from "./colors";

export function createAdaptivePalette(video: HTMLVideoElement, initial?: Palette, onPalette?: (palette: Palette) => void) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 36;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    let current = initial;
    let timer: ReturnType<typeof setInterval> | undefined;
    let failed = false;
    // Discord owns the root inline style and can replace it during window state updates.
    const style = createAndAppendStyle("obsidian-adaptive-palette", managedStyleRootNode);
    let lastFrame = -1;
    let lastDeclarations = "";

    function apply() {
        if (!current) return;
        const declarations = Object.entries(paletteVariables(current))
            .map(([name, value]) => `${name}:${value}!important;`).join("");
        if (declarations === lastDeclarations) return;
        lastDeclarations = declarations;
        style.textContent = `:root:root{${declarations}}`;
    }
    apply();

    function sample() {
        if (!context || failed || video.readyState < 2 || document.hidden || video.currentTime === lastFrame) return;
        try {
            const cover = getComputedStyle(video).objectFit === "cover";
            const targetRatio = video.clientWidth / video.clientHeight || video.videoWidth / video.videoHeight;
            let width = video.videoWidth;
            let height = video.videoHeight;
            if (cover && width / height > targetRatio) width = height * targetRatio;
            else if (cover) height = width / targetRatio;
            context.drawImage(video, (video.videoWidth - width) / 2, (video.videoHeight - height) / 2, width, height, 0, 0, 64, 36);
            const next = extractPalette(context.getImageData(0, 0, 64, 36).data, current);
            if (!next) return;
            current = current ? [mix(current[0], next[0], .22), mix(current[1], next[1], .22)] : next;
            apply();
            lastFrame = video.currentTime;
            onPalette?.(current);
        } catch (error) {
            failed = true;
            if (timer) clearInterval(timer);
            timer = undefined;
            console.warn("[ObsidianVideo] Adaptive colors unavailable; video playback is unchanged.", error);
        }
    }

    return {
        setActive(active: boolean) {
            if (!active) {
                if (timer) clearInterval(timer);
                timer = undefined;
                return;
            }
            if (timer || failed) return;
            // Preserve the established palette on resume; only the first activation samples immediately.
            if (!current) sample();
            if (!failed) timer = setInterval(sample, 10000);
        },
        stop() {
            if (timer) clearInterval(timer);
            timer = undefined;
            style.remove();
            canvas.width = canvas.height = 0;
        }
    };
}
