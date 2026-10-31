/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 opbsd and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { THEMES_DIR } from "@main/utils/constants";
import { IpcMainInvokeEvent } from "electron";
import { readFile } from "fs/promises";
import { join } from "path";

export function readWallpaper(_: IpcMainInvokeEvent) {
    return readFile(join(THEMES_DIR, "wallpaper.mp4"));
}
