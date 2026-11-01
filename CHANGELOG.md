# Changelog

## 2.7.0

- Added a Choose wallpaper video button to Vencord's Local Themes page, with an MP4 file picker, preview validation, automatic file placement and restart guidance.
- Included the focus/root-style palette fix developed in 2.6.3.
- Added a local startup still and palette cache, restored before the MP4 is decoded.
- Validated the cache against the current wallpaper file at main-process startup; replaced/missing videos cannot reuse a stale preview.
- Generated a local startup stylesheet and kept adaptive-color/video disable settings respected.
- Kept the original MP4 unchanged and generated only a small JPEG preview.

## 2.6.3

- Moved adaptive colors from Discord-owned root inline styles to a dedicated Vencord-managed stylesheet.
- Preserved the palette when root inline styles are rewritten during focus/window state updates, without waiting for the next video sample.
- Kept decoder recovery, background pausing and complete cleanup when adaptive colors are disabled.

## 2.6.2

- Changed the required local video filename to the generic `wallpaper.mp4`; existing users must rename their file and rebuild/install the updated plugin.
- Preserved the established adaptive palette across repeated video `loadeddata` events and minimize/restore cycles.
- Resumed sampling on its regular timer without immediately resampling or restoring fallback colors.
- Updated Windows, macOS and Linux video setup instructions, including duplicate-extension and upgrade notes.

## 2.6.1

- Updated repository, raw stylesheet, download and clone URLs to the renamed `opbsd/VencordTheme` repository.
- Includes all adaptive color features from 2.6.0.

## 2.6.0

- Added local wallpaper-driven primary and secondary colors, dark tinted surfaces, coordinated borders, selections and glass highlights.
- Added the enabled-by-default `adaptiveColors` plugin setting; disabling it restores the fixed palette.
- Sampled a 64×36 frame every three seconds with gradual palette changes; background/reduced-motion pausing and cleanup are preserved.
- Kept video resolution and frame rate unchanged; no video, poster or private media is bundled.
- Fixed clone commands to explicitly use the directory expected by the subsequent installation steps.

## 2.5.3

- Updated author credits and repository links to `opbsd/VencordTheme`.
- Refreshed downloadable packages to use the current GitHub username.
- No changes to theme declarations or video playback behavior.

## 2.5.2

- Added a Linux guide grouped by distribution family and package manager.
- Documented native Discord, Flatpak, immutable desktops, SteamOS, NixOS and unverified musl/alternative-client setups.
- Consolidated shared Node.js, plugin-build and media-placement steps.
- Included the maintainer-provided preview with friend identities pixelated for privacy.
- Theme declarations and plugin behavior are unchanged.

## 2.5.1

- Added an illustrative preview with sample content and an original CSS backdrop.
- Translated documentation, theme comments and plugin description into English.
- Added separate Windows, macOS and Linux setup instructions, default folder hints and troubleshooting.
- Clarified desktop, browser, mobile and untested-client support.
- No changes to theme declarations or video playback behavior.

## 2.5.0

First public release.

- Warm translucent theme for Vencord desktop.
- Optional ObsidianVideo plugin with local MP4 playback, muted looping and background pausing.
- Reduced-motion support.
- Friends panel fixes and server-rail top spacing.
- Coordinated Nitro, Shop and Quests surfaces.
- Code-only distribution without bundled third-party videos or extracted frames.
