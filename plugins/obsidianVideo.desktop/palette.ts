/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 opbsd and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { managedStyleRootNode } from "@api/Styles";
import { createAndAppendStyle } from "@utils/css";

import { extractPalette, Palette, paletteVariables } from "./colors";

export { extractPalette, paletteVariables } from "./colors";

export function createAdaptivePalette(video: HTMLVideoElement, initial?: Palette, onPalette?: (palette: Palette) => void) {
    const style = createAndAppendStyle("obsidian-adaptive-palette", managedStyleRootNode);
    let sampled = !!initial;
    let stopped = false;
    const apply = (colors: Palette) => {
        const declarations = Object.entries(paletteVariables(colors)).map(([k, v]) => `${k}:${v}!important;`).join("");
        style.textContent = `:root:root{${declarations}}`;
    };
    if (initial) apply(initial);

    function sample() {
        if (sampled || stopped || video.readyState < 2) return;
        sampled = true;
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 36;
        try {
            const context = canvas.getContext("2d");
            if (!context) return;
            context.drawImage(video, 0, 0, 64, 36);
            const colors = extractPalette(context.getImageData(0, 0, 64, 36).data) ?? [[96, 96, 96], [96, 96, 96]];
            apply(colors);
            onPalette?.(colors);
        } catch (error) {
            console.warn("[ObsidianVideo] First-frame palette unavailable.", error);
        } finally {
            canvas.width = canvas.height = 0;
        }
    }

    return {
        captureFirstFrame: sample,
        setActive(active: boolean) { if (active) sample(); },
        stop() { stopped = true; style.remove(); }
    };
}
