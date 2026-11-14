/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 opbsd and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { managedStyleRootNode } from "@api/Styles";
import { createAndAppendStyle } from "@utils/css";
import definePlugin, { OptionType, PluginNative } from "@utils/types";

import { Palette, paletteVariables, RGB } from "./colors";
import { createAdaptivePalette } from "./palette";
import { attachWallpaperPicker } from "./picker";
import { chooseWallpaper } from "./selection";
import { attachStaticPalette } from "./staticPalette";

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
let focused = document.hasFocus();
let releaseTimer: ReturnType<typeof setTimeout> | undefined;
let loading: Promise<void> | undefined;
let resumeTime = 0;
let staticPalette: ReturnType<typeof attachStaticPalette> | undefined;
let accentStyle: HTMLStyleElement | undefined;

function playbackAllowed() {
    return !staticPalette?.active && !document.hidden && !reducedMotion.matches && (!settings.store.pauseWhenUnfocused || focused);
}

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
    palette?.captureFirstFrame();
    rememberStartup();
    if (video && resumeTime > 0 && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(resumeTime, Math.max(0, video.duration - .1));
        resumeTime = 0;
    }
    updatePlayback();
}

function updatePalette() {
    updateAccent();
    staticPalette?.refresh();
    document.documentElement.toggleAttribute("data-obsidian-palette-disabled", !settings.store.adaptiveColors);
    if (!video || !settings.store.adaptiveColors) {
        palette?.stop();
        palette = undefined;
        return;
    }
    // Decoders can emit loadeddata again after the window is restored.
    palette ??= createAdaptivePalette(video, lastPalette, colors => {
        lastPalette = colors;
        if (!savedWithPalette) rememberStartup();
    });
    palette.setActive(playbackAllowed());
}

function updateAccent() {
    accentStyle ??= createAndAppendStyle("obsidian-manual-accent", managedStyleRootNode);
    const value = settings.store.accentColor.trim();
    if (!settings.store.adaptiveColors || !/^#[a-f\d]{6}$/i.test(value)) {
        accentStyle.textContent = "";
        return;
    }
    const rgb = [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16)) as RGB;
    const variables = {
        ...paletteVariables([rgb, rgb]),
        "--obs-accent": value,
        "--obs-accent-hover": `color-mix(in srgb, ${value} 80%, white)`,
        "--obs-accent-pressed": `color-mix(in srgb, ${value} 80%, black)`
    };
    const declarations = Object.entries(variables).map(([k, v]) => `${k}:${v}!important;`).join("");
    accentStyle.textContent = `:root:root:root{${declarations}}`;
}

const settings = definePluginSettings({
    adaptiveColors: {
        type: OptionType.BOOLEAN,
        description: "Extract a fixed palette from a static image or the video's first frame.",
        default: true,
        onChange: updatePalette
    },
    accentColor: {
        type: OptionType.STRING,
        description: "Optional accent override (#RRGGBB). Leave empty to choose automatically for each wallpaper.",
        default: "",
        onChange: updateAccent
    },
    pauseWhenUnfocused: {
        type: OptionType.BOOLEAN,
        description: "Pause video playback while another window is active.",
        default: true,
        onChange: updatePlayback
    }
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function clearReleaseTimer() {
    if (releaseTimer) clearTimeout(releaseTimer);
    releaseTimer = undefined;
}

function releaseVideo() {
    releaseTimer = undefined;
    if (!video || playbackAllowed()) return;
    resumeTime = video.currentTime || resumeTime;
    video.removeAttribute("src");
    video.load();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = undefined;
}

function loadWallpaper() {
    if (loading || !video || !layer) return;
    const currentVideo = video;
    const currentLayer = layer;
    const request = (async () => {
        try {
            const data = await Native.readWallpaper();
            if (video !== currentVideo || !playbackAllowed()) return;
            objectUrl = URL.createObjectURL(new Blob([new Uint8Array(data).buffer], { type: "video/mp4" }));
            currentVideo.src = objectUrl;
        } catch {
            if (layer === currentLayer) {
                currentLayer.hidden = true;
                palette?.setActive(false);
            }
        }
    })();
    loading = request;
    request.finally(() => {
        if (loading === request) loading = undefined;
    });
}

function updatePlayback() {
    if (!video || !layer) return;
    layer.hidden = reducedMotion.matches || !!staticPalette?.active;
    const active = playbackAllowed();
    palette?.setActive(active);
    if (!active) {
        if (!video.paused) {
            lastSave = 0;
            rememberStartup();
        }
        video.pause();
        if (video.hasAttribute("src") && !releaseTimer)
            releaseTimer = setTimeout(releaseVideo, 30000);
    } else {
        clearReleaseTimer();
        if (!video.hasAttribute("src")) {
            if (startup) loadWallpaper();
            return;
        }
        video.play().catch(() => {
            if (layer) layer.hidden = true;
        });
    }
}

function onFocus() {
    focused = true;
    updatePlayback();
}

function onBlur() {
    focused = false;
    updatePlayback();
}

export default definePlugin({
    name: "ObsidianVideo",
    description: "Local MP4 playback and fixed palettes from static wallpapers or the first video frame.",
    authors: [{ name: "opbsd", id: 0n }],
    tags: ["Appearance"],
    settings,
    enabledByDefault: true,

    start() {
        const mount = document.getElementById("app-mount");
        if (!mount || layer || !Native?.readWallpaper) return;
        focused = document.hasFocus();
        staticPalette = attachStaticPalette(Native, () => settings.store.adaptiveColors, updatePlayback);
        updateAccent();

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
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
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
        clearReleaseTimer();
        loading = undefined;
        resumeTime = 0;
        picker?.stop();
        picker = undefined;
        staticPalette?.stop();
        staticPalette = undefined;
        accentStyle?.remove();
        accentStyle = undefined;
        document.documentElement.setAttribute("data-obsidian-video-disabled", "");
        lastSave = 0;
        rememberStartup();
        palette?.stop();
        palette = undefined;
        video?.removeEventListener("loadeddata", onVideoReady);
        observer?.disconnect();
        observer = undefined;
        document.removeEventListener("visibilitychange", updatePlayback);
        window.removeEventListener("focus", onFocus);
        window.removeEventListener("blur", onBlur);
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
