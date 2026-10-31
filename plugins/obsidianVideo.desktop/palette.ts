/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 opbsd and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

type RGB = [number, number, number];
type Palette = [RGB, RGB];

const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
const mix = (a: RGB, b: RGB, amount: number): RGB => a.map((v, i) => v + (b[i] - v) * amount) as RGB;

function toHsl([r, g, b]: RGB): RGB {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const light = (max + min) / 2;
    if (!delta) return [0, 0, light];
    let hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
    hue = (hue * 60 + 360) % 360;
    return [hue, delta / (1 - Math.abs(2 * light - 1)), light];
}

const hueDistance = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

export function extractPalette(pixels: Uint8ClampedArray, previous?: Palette): Palette | undefined {
    const bins = Array.from({ length: 24 }, () => ({ weight: 0, rgb: [0, 0, 0] as RGB }));
    const average: RGB = [0, 0, 0];
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] < 128) continue;
        const color: RGB = [pixels[i], pixels[i + 1], pixels[i + 2]];
        const [hue, saturation, light] = toHsl(color);
        if (light < .035 || light > .94) continue;
        color.forEach((v, j) => average[j] += v);
        count++;
        if (saturation < .12) continue;
        // Count midtones and saturated details without letting tiny bright highlights dominate.
        const weight = (.25 + saturation) * Math.min(1, light / .15);
        const bin = bins[Math.floor(hue / 15) % 24];
        bin.weight += weight;
        color.forEach((v, j) => bin.rgb[j] += v * weight);
    }
    if (!count) return;
    const ranked = bins.filter(b => b.weight > 0).sort((a, b) => b.weight - a.weight);
    if (!ranked.length) {
        const neutral = average.map(v => v / count) as RGB;
        return [neutral, neutral];
    }
    const colorOf = (bin: typeof bins[number]) => bin.rgb.map(v => v / bin.weight) as RGB;
    let first = ranked[0];
    if (previous) {
        const previousHue = toHsl(previous[0])[0];
        const stable = ranked.find(b => b.weight >= first.weight * .8 && hueDistance(toHsl(colorOf(b))[0], previousHue) < 30);
        if (stable) first = stable;
    }
    const primary = colorOf(first);
    const secondary = ranked.find(b => b.weight >= ranked[0].weight * .15 && hueDistance(toHsl(colorOf(b))[0], toHsl(primary)[0]) >= 45);
    return [primary, secondary ? colorOf(secondary) : primary];
}

export function paletteVariables([primary, secondary]: Palette) {
    const [hue, sat] = toHsl(primary);
    const [otherHue, otherSat] = toHsl(secondary);
    const [surfaceHue, surfaceSat] = toHsl(mix(primary, secondary, .25));
    const color = (h: number, s: number, l: number) => `hsl(${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%)`;
    const surface = (l: number) => color(surfaceHue, Math.min(surfaceSat * .5, .3), l);
    const accentSat = sat < .06 ? 0 : clamp(sat * .72, .14, .58);
    const secondarySat = otherSat < .06 ? 0 : clamp(otherSat * .65, .14, .52);
    return {
        "--obs-black": surface(.035),
        "--obs-sidebar": surface(.065),
        "--obs-chat": surface(.06),
        "--obs-panel": surface(.095),
        "--obs-elevated": surface(.135),
        "--obs-hover": surface(.17),
        "--obs-border": surface(.23),
        "--obs-text": color(hue, accentSat * .16, .93),
        "--obs-secondary": color(hue, accentSat * .22, .81),
        "--obs-muted": color(hue, accentSat * .18, .68),
        "--obs-accent": color(hue, accentSat, .73),
        "--obs-accent-hover": color(hue, accentSat, .82),
        "--obs-accent-pressed": color(hue, accentSat, .65),
        "--obs-on-accent": surface(.065),
        "--obs-accent-secondary": color(otherHue, secondarySat, .74),
        "--obs-border-subtle": surface(.15),
        "--obs-border-muted": surface(.19),
        "--obs-border-strong": surface(.32),
        "--obs-scrollbar": surface(.37),
        "--obs-selection": color(hue, accentSat * .55, .29)
    };
}

export function createAdaptivePalette(video: HTMLVideoElement) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 36;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    let current: Palette | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;
    let failed = false;
    const original = new Map<string, [string, string]>();
    const root = document.documentElement;
    let lastFrame = -1;

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
            for (const [name, value] of Object.entries(paletteVariables(current))) {
                if (!original.has(name)) original.set(name, [root.style.getPropertyValue(name), root.style.getPropertyPriority(name)]);
                root.style.setProperty(name, value, "important");
            }
            lastFrame = video.currentTime;
        } catch (error) {
            failed = true;
            if (timer) clearInterval(timer);
            timer = undefined;
            console.warn("[ObsidianVideo] Adaptive colors unavailable; video playback is unchanged.", error);
        }
    }

    return {
        setActive(active: boolean) {
            if (timer) clearInterval(timer);
            timer = undefined;
            if (!active || failed) return;
            sample();
            if (!failed) timer = setInterval(sample, 3000);
        },
        stop() {
            if (timer) clearInterval(timer);
            timer = undefined;
            for (const [name, [value, priority]] of original) {
                if (value) root.style.setProperty(name, value, priority);
                else root.style.removeProperty(name);
            }
            original.clear();
            canvas.width = canvas.height = 0;
        }
    };
}
