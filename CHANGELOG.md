# Changelog

## 3.0.0 — Fixed wallpaper palettes and desktop fixes

- Extract automatic colors once from a local static image or the first decoded video frame, without periodic analysis or gradual palette changes.
- Add an optional `accentColor` hex override; an empty value adapts to each wallpaper. No personal accent or media is configured by default.
- Detect static wallpaper mode and suppress video playback while the image is selected. Cache unchanged image analysis and invalidate older moving-video palettes.
- Make the pre-join voice lobby transparent and restore the complete rounded Friends navigation panel.
- Darken floating context menus for readable labels over bright backgrounds.
- Replace broad descendant style queries with scoped panel rules to reduce style recalculation during voice activity.
- Include updated static-image, MP4, automatic-color and manual-accent instructions.
- Validation: development build, TypeScript checking, isolated Chromium palette/cache/cleanup checks and live Windows layout checks. Live MP4 playback on Windows has not been re-tested. Performance samples are workload-dependent and do not establish an overall CPU or FPS improvement.

## 2.9.0 — Static wallpapers and desktop layout fixes

- Add a local wallpaper configuration example and separate static-image / animated-MP4 instructions. No personal media or generated cache is distributed.
- Support a viewport-wide static image, with wallpaper-only brightness, contrast and saturation controls.
- Update semantic desktop selectors for glass panels, spacing and rounded corners.
- Remove duplicate bottom-space reservation that clipped server channels above the voice controls.
- Separate the message history from the composer and remove the overlapping decorative edge.
- Apply matching glass styling to the server members/activity sidebar and voice-channel canvas.
- Keep participant surfaces and Discord's speaking outline aligned at an 8px radius without clipping the outer indicator.
- Preserve the existing ObsidianVideo source and animated-wallpaper lifecycle.
- Desktop layout changes were checked in live Windows Discord during chat, screen sharing and voice activity. Animated MP4 playback has not been independently re-tested for this release.

## 2.8.0 — Performance

- Pause video and palette sampling when Discord loses focus by default; the new `pauseWhenUnfocused` setting can opt out.
- After 30 seconds of inactivity, unload the media source and revoke its Blob URL. Reload on return and resume from the saved playback time, retaining the cached poster and palette.
- Defer the initial video read while Discord starts unfocused, hidden or with reduced motion enabled.
- Sample adaptive colors every 10 seconds instead of 3, and skip identical palette stylesheet writes.
- Save startup data on initial preparation and lifecycle events instead of periodic palette samples.
- Disable live backdrop blur while retaining dark translucent panels; use 120 ms interaction transitions and remove entrance animation. Reduced motion remains respected.
- Document an optional Full HD/30 FPS H.264 preparation preset. The player does not automatically transcode or force a resolution.
- Document disabling AlwaysAnimate as an optional Discord/Vencord setting; the theme does not silently change other plugins or hardware-acceleration preferences.
- Validate Full HD playback, focus cycles, idle media release, saved-time resume, lazy startup and stop during a pending video read in Chromium and the main lifecycle inside Linux Discord.


## 2.7.1

- Renamed the theme to Vencord Theme throughout its title, stylesheet filename, documentation and preview page.
- Updated download links and example setup directory names.
- Kept the existing ObsidianVideo plugin identifier and private cache paths for compatibility with installed settings and wallpapers.
- No changes to video playback, adaptive colors or saved media.

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
