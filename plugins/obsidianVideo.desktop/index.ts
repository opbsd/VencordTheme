/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 LeoxMinei and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin, { PluginNative } from "@utils/types";

const Native = VencordNative.pluginHelpers.ObsidianVideo as PluginNative<typeof import("./native")>;

let layer: HTMLDivElement | undefined;
let video: HTMLVideoElement | undefined;
let objectUrl: string | undefined;
let observer: MutationObserver | undefined;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updatePlayback() {
    if (!video?.src || !layer) return;
    layer.hidden = reducedMotion.matches;
    if (document.hidden || reducedMotion.matches) {
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
    authors: [{ name: "LeoxMinei", id: 0n }],
    tags: ["Appearance"],
    enabledByDefault: true,

    start() {
        const mount = document.getElementById("app-mount");
        if (!mount || layer || !Native?.readWallpaper) return;

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
        });
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
        Native.readWallpaper().then(data => {
            if (layer !== currentLayer) return;
            objectUrl = URL.createObjectURL(new Blob([new Uint8Array(data).buffer], { type: "video/mp4" }));
            currentVideo.src = objectUrl;
            updatePlayback();
        }).catch(() => {
            if (layer === currentLayer) currentLayer.hidden = true;
        });
    },

    stop() {
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
    }
});
