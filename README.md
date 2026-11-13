# Vencord Theme

A dark **Vencord desktop** theme with translucent glass and a warm fallback palette. The optional **ObsidianVideo** plugin plays your own local MP4 wallpaper and adapts the interface colors to it.

![Vencord Theme Friends page with friend identities pixelated](assets/preview-discord-friends-redacted.png)

*Actual Discord desktop screenshot supplied by the maintainer, showing the Friends page with the local video wallpaper. Friends' names and avatars have been pixelated for privacy; the pixelation is a screenshot edit, not a theme effect. The MP4 must be added separately.*

[Download CSS](https://raw.githubusercontent.com/opbsd/VencordTheme/main/Vencord-Theme.theme.css) · [Download theme + plugin](https://github.com/opbsd/VencordTheme/archive/refs/tags/v2.9.0.zip) · [Installation guide](docs/INSTALLATION.md) · [Releases](https://github.com/opbsd/VencordTheme/releases/latest)

The theme/plugin download is GitHub's source ZIP for this release; extract it to access the CSS, `plugins` and `docs` folders.

## Features

- Dark translucent panels, rounded corners and restrained highlights.
- Adaptive primary and secondary colors extracted locally from the wallpaper, with dark tinted surfaces and readable text.
- Small 64×36 frame samples every ten seconds, gradual palette updates and no continuous full-resolution analysis.
- A fixed bronze, charcoal and ivory fallback when adaptive colors are disabled.
- Separate Friends and Active Now panels with the background visible.
- Coordinated Nitro, Shop and Quests surfaces.
- Local MP4 playback with no animated WebP or GIF conversion.
- Muted looping video, pause on focus loss, deferred background startup and reduced-motion support.
- Media source release after 30 seconds in the background, with saved-time resume.
- A local startup preview and palette cache, validated against the current MP4 before the theme loads.
- Dark translucent panels without live backdrop blur, shorter interactions and no entrance animation.

## Installation

The CSS theme works without the video plugin and uses a dark fallback background. Start with the instructions for your operating system:

- **[Windows — PowerShell](docs/INSTALLATION.md#windows)**
- **[macOS — Terminal](docs/INSTALLATION.md#macos)**
- **[Linux — distribution families, native packages and Flatpak](docs/LINUX.md)**

The [installation guide](docs/INSTALLATION.md) covers the CSS theme, building the optional desktop plugin, the video picker, manual MP4 setup, full restarts and troubleshooting. If you already use the plugin, follow [Upgrade an existing custom build](docs/INSTALLATION.md#upgrade-an-existing-custom-build) to install all updated helpers. Video playback requires a custom Vencord desktop build; copying TypeScript into the themes folder does not install a plugin.

For **Online Themes**, use:

```text
https://raw.githubusercontent.com/opbsd/VencordTheme/main/Vencord-Theme.theme.css
```

## Static or animated wallpaper

**Static image:** use your own JPG/PNG/WebP and `wallpaper-settings.example.css`; no custom plugin build is needed. **Animated:** enable ObsidianVideo and select your own MP4. Read the [static and animated setup guide](docs/INSTALLATION.md#choose-a-static-or-animated-wallpaper-290) before choosing your mode. No personal wallpaper or preview cache is included.

Version 2.9.0 also fixes channel-list clipping, the message composer gap, server-member glass surfaces, transparent voice panels and participant corners aligned with Discord's speaking outline.

## Local wallpaper (animated mode)

After installing the updated custom plugin and CSS, fully quit and reopen Discord once, then:

1. Open **Vencord → Themes → Local Themes**.
2. Click **Choose wallpaper video** in the **Wallpaper video** section and select an MP4.
3. Wait for the saved message, then fully quit Discord and reopen it to apply the selection.

The plugin checks that the MP4 can be decoded, copies it into place and prepares a startup preview with matching colors. The original file keeps its name and location; no manual renaming is needed. Cancelling or choosing an unreadable video keeps the previous wallpaper. See the [complete picker instructions](docs/INSTALLATION.md#choose-a-wallpaper-video).

For manual setup:

Name your file **`wallpaper.mp4`** and place it in the folder opened by **Settings → Vencord → Themes → Open Themes Folder**. The plugin loads the video from that named local file and does not upload it. When upgrading from an earlier release, rename your existing video to **`wallpaper.mp4`**, rebuild/install the updated plugin, and fully quit and reopen Discord.

The original preview wallpaper was obtained from [Wallpaper Waves](https://wallpaperwaves.com/). Video files and standalone wallpaper assets are not bundled; the README includes a preview screenshot. You can use another MP4 that you have permission to use.

On startup, the theme uses a small cached still and its associated colors until the MP4 decoder is ready. The plugin generates `obsidian-startup.css` locally in the themes folder and stores its cache in Vencord's data directory. Keep the theme's local startup import; replacing or removing `wallpaper.mp4` invalidates the old cache on the next full start. First-time setup of an uncached video uses a neutral fallback while the first preview is generated. Cache files contain your private media preview and must not be distributed.

For lower resource use, prepare a **1920×1080, 30 FPS H.264 MP4** using the [optional performance preset](docs/INSTALLATION.md#performance-preset-full-hd-at-30-fps), then select that copy with the picker. The player preserves the selected file's resolution and frame rate; it does not automatically transcode, interpolate frames or upscale.

## Customization

With the updated plugin, **adaptiveColors** is enabled by default. It coordinates accents, buttons, selections, borders and glass surfaces with the video's main and secondary colors. Open **Vencord → Plugins → ObsidianVideo → settings** and disable **adaptiveColors** to restore the fixed palette or use manual colors. Status, warning and danger colors remain recognizable. Analysis stays local and pauses while Discord is unfocused, hidden or reduced motion is enabled. **pauseWhenUnfocused** is enabled by default; disable it if the wallpaper should continue while another window is active. With the default setting, 30 seconds in the background releases the video source; returning reloads it and resumes from its saved time. The cached poster and colors stay available, and an unfocused startup avoids the initial video read. The palette lives in a separate Vencord-managed stylesheet so Discord can rewrite its root inline styles on focus changes without erasing the colors. Minimizing and restoring the window retains the established palette, including when the video decoder reloads its frame data; normal gradual updates resume on the sampling timer.

Edit `--obs-accent`, `--obs-text`, `--obs-gap` and `--obs-radius` near the top of the CSS. The final wallpaper surfaces section defines `--obs-chat-surface` and `--obs-matte-background`: increase their opacity percentages for darker panels.

The plugin can be disabled in **Vencord → Plugins → ObsidianVideo**. When the video is unavailable, the dark fallback remains visible. Reduced motion hides the animation and can retain the cached still and its palette.

## Compatibility and testing

The source targets **Vencord on Discord desktop**. Setup instructions are provided for Windows, macOS and Linux; runtime testing has been performed on Linux/Chromium, not independently on all three operating systems. Other clients and the browser extension have not been verified for this native plugin. The plugin does not run in Discord's Android/iOS apps.

For 2.8.0, `pnpm build --dev`, TypeScript checking and plugin lint passed. Chromium checks used a real 1920×1080/30 FPS H.264 MP4 and covered five focus pause/resume cycles, a single 10-second palette timer, hidden/reduced-motion handling, persistent colors, no periodic cache saves, cleanup, deferred unfocused startup, idle source release, saved-time resume and stopping during a pending video read.

Live Linux Discord checks confirmed Full HD playback, immediate focus-loss pause, media source removal after the 30-second timeout, retained poster/colors and playback resumption from the saved time. No overall CPU, RAM or GPU reduction percentage has been established. The lower resolution reduces the video workload; Chromium may retain internal memory pools after the source is released.

Earlier development also checked Friends, Nitro, Shop and Quests layouts in simulated previews at three viewport widths, palette contrast, picker cancellation/validation and native cache operations. These checks are not independent validation of every operating system. The preview above is a maintainer-provided desktop screenshot.

Discord may change its CSS classes. Report styling issues with your client version and a screenshot that excludes private information.

## License and credits

Theme and plugin code: **GPL-3.0-or-later**; see [LICENSE](LICENSE). Created by [opbsd](https://github.com/opbsd).

The plugin uses [Vencord](https://github.com/Vendicated/Vencord). This is an independent project, not affiliated with Discord or Vencord.

Third-party wallpaper rights remain with their respective owners and are not covered by the code license. Obtain and use media according to its provider's terms. The README preview is a maintainer-provided screenshot. Third-party artwork and avatars visible in it retain their respective rights.
