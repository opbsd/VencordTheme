/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 opbsd and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { PluginNative } from "@utils/types";

import { extractPalette } from "./colors";

type PickerNative = Pick<PluginNative<typeof import("./native")>, "selectWallpaper" | "commitWallpaper" | "discardWallpaper">;

async function previewVideo(data: Uint8Array, signal: AbortSignal) {
    const video = document.createElement("video");
    const url = URL.createObjectURL(new Blob([new Uint8Array(data).buffer], { type: "video/mp4" }));
    video.muted = true;
    video.preload = "auto";
    let cleanup: () => void = () => { };
    try {
        await new Promise<void>((resolve, reject) => {
            const fail = () => reject(new Error("This video could not be decoded. Choose another MP4."));
            const abort = () => reject(new DOMException("Video selection cancelled", "AbortError"));
            const timer = setTimeout(fail, 20000);
            const ready = () => resolve();
            video.addEventListener("loadeddata", ready, { once: true });
            video.addEventListener("error", fail, { once: true });
            signal.addEventListener("abort", abort, { once: true });
            cleanup = () => {
                clearTimeout(timer);
                video.removeEventListener("loadeddata", ready);
                video.removeEventListener("error", fail);
                signal.removeEventListener("abort", abort);
            };
            if (signal.aborted) abort();
            else video.src = url;
        });
        if (!video.videoWidth || !video.videoHeight) throw new Error("Choose a file containing a video track.");
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 960 / Math.max(video.videoWidth, video.videoHeight));
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) throw new Error("The video preview could not be prepared.");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const poster = canvas.toDataURL("image/jpeg", .8);
        canvas.width = 64;
        canvas.height = 36;
        context.drawImage(video, 0, 0, 64, 36);
        const palette = extractPalette(context.getImageData(0, 0, 64, 36).data) ?? [[96, 96, 96], [96, 96, 96]];
        return { poster, palette };
    } finally {
        cleanup();
        video.removeAttribute("src");
        video.load();
        URL.revokeObjectURL(url);
    }
}

export async function chooseWallpaper(native: PickerNative, signal: AbortSignal, progress: (text: string) => void) {
    if (!native.selectWallpaper) throw new Error("Fully restart Discord once to enable the video picker.");
    let selected: Awaited<ReturnType<PickerNative["selectWallpaper"]>>;
    try {
        selected = await native.selectWallpaper();
    } catch {
        throw new Error("The video could not be opened. Choose a readable MP4 file.");
    }
    if (!selected) return;
    try {
        if (signal.aborted) return;
        progress("Preparing your wallpaper…");
        const { poster, palette } = await previewVideo(selected.data, signal);
        if (signal.aborted) return;
        try {
            return await native.commitWallpaper(selected.token, poster, palette);
        } catch {
            throw new Error("The video could not be saved. Try again.");
        }
    } finally {
        await native.discardWallpaper(selected.token).catch(error => {
            console.warn("[ObsidianVideo] Could not remove the temporary selection.", error);
        });
    }
}
