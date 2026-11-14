/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 opbsd and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { managedStyleRootNode } from "@api/Styles";
import { createAndAppendStyle } from "@utils/css";

type Choose = (signal: AbortSignal, progress: (text: string) => void) => Promise<string | undefined>;

export function attachWallpaperPicker(mount: HTMLElement, choose: Choose) {
    const style = createAndAppendStyle("obsidian-wallpaper-picker-style", managedStyleRootNode);
    style.textContent = `
        .obsidian-wallpaper-picker{padding:16px;margin-bottom:16px;border:1px solid var(--obs-border,var(--border-subtle));border-radius:12px;background:var(--background-surface-high);color:var(--text-normal)}
        .obsidian-wallpaper-picker h3{font-size:18px;font-weight:600;margin:0 0 8px}
        .obsidian-wallpaper-picker p{margin:0 0 12px;line-height:1.5;color:var(--text-secondary)}
        .obsidian-wallpaper-picker button{padding:10px 16px;border:0;border-radius:8px;font:inherit;cursor:pointer;background:var(--obs-accent,var(--brand-500));color:var(--obs-on-accent,white)}
        .obsidian-wallpaper-picker button:disabled{opacity:.6;cursor:wait}
        .obsidian-wallpaper-picker button:focus-visible{outline:2px solid var(--obs-accent-hover,var(--brand-400));outline-offset:3px}
        .obsidian-wallpaper-picker [role=status]{margin:12px 0 0;overflow-wrap:anywhere}
    `;
    const card = document.createElement("section");
    card.className = "obsidian-wallpaper-picker";
    card.setAttribute("aria-label", "Wallpaper video");
    const title = document.createElement("h3");
    title.textContent = "Wallpaper video";
    const description = document.createElement("p");
    description.textContent = "Choose an MP4 from your computer. It will become your wallpaper after you fully restart Discord.";
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Choose wallpaper video";
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.hidden = true;
    card.append(title, description, button, status);
    let controller: AbortController | undefined;
    let grid: HTMLElement | null = null;

    function message(text: string) {
        status.hidden = !text;
        status.textContent = text;
    }
    button.onclick = async () => {
        if (button.disabled) return;
        controller = new AbortController();
        button.disabled = true;
        message("Choose an MP4 in the file picker.");
        try {
            const name = await choose(controller.signal, message);
            if (!controller.signal.aborted) message(name ? `${name} saved. Fully restart Discord to use your new wallpaper.` : "Selection cancelled. Your wallpaper has not changed.");
        } catch (error) {
            if (!controller.signal.aborted) message(error instanceof Error ? error.message : "The video could not be saved. Try again.");
        } finally {
            button.disabled = false;
        }
    };

    function attach(candidate: Element | null) {
        if (!(candidate instanceof HTMLElement)) return;
        grid = candidate;
        const section = grid.closest("section");
        if (section) section.prepend(card);
    }
    attach(mount.querySelector(".vc-settings-theme-grid"));
    const observer = new MutationObserver(records => {
        if (card.isConnected) return;
        if (grid?.isConnected) return attach(grid);
        for (const record of records) for (const node of record.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            const candidate = node.matches(".vc-settings-theme-grid") ? node : node.querySelector(".vc-settings-theme-grid");
            if (candidate) return attach(candidate);
        }
    });
    observer.observe(mount, { childList: true, subtree: true });
    return {
        stop() {
            controller?.abort();
            observer.disconnect();
            card.remove();
            style.remove();
        }
    };
}
