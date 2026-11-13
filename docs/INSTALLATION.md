# Installation

[Back to the README](../README.md)

Choose your setup:

- [CSS theme only — all desktop operating systems](#css-theme-only)
- [Choose a wallpaper video — after installing the plugin](#choose-a-wallpaper-video)
- [Performance preset — Full HD at 30 FPS](#performance-preset-full-hd-at-30-fps)
- [Upgrade an existing custom build](#upgrade-an-existing-custom-build)
- [Windows — CSS and optional video plugin](#windows)
- [macOS — CSS and optional video plugin](#macos)
- [Linux — CSS and optional video plugin](#linux)
- [Other clients and mobile](#other-clients-and-mobile)
- [Troubleshooting](#troubleshooting)

## Choose a static or animated wallpaper (2.9.0)

All wallpaper files are supplied by you and stay on your computer. This release does not bundle personal wallpaper images, videos, generated previews, or Vencord settings. Keep only **Vencord Theme** enabled in the theme list.

### Static image — JPG, PNG or WebP

1. Install `Vencord-Theme.theme.css` in the folder opened by **Settings → Vencord → Themes → Open Themes Folder**, and enable **Vencord Theme** under Local Themes.
2. Copy your own image into that folder. For example, name it `wallpaper.jpg` (make sure the actual file format matches the extension).
3. Copy `wallpaper-settings.example.css` into the same folder and rename the copy to `wallpaper-settings.css`.
4. Edit the image URL in that local file to match your filename, for example `url("vencord:///themes/wallpaper.jpg")` or `url("vencord:///themes/my-background.png")`. Keep the `vencord:///themes/` prefix.
5. Disable **ObsidianVideo** if installed. A static image needs only Vencord and the CSS; it does not require compiling a custom plugin. Reload Discord to apply changes. The local configuration is imported automatically; do not enable it as a separate theme.

The image fills the window, keeps its aspect ratio and may crop at the edges. Brightness, contrast and saturation affect only the static wallpaper, not text, avatars or shared screens. In `wallpaper-settings.css`, use `1` for the original value; try brightness `1.12`, contrast `1.10` and saturation `1.35` for a more vivid image. Keep your original image unchanged. Desktop Local Themes are required for these local file URLs; Online Themes alone cannot access another user's files.

### Animated wallpaper — MP4

1. Install the CSS and build/install **ObsidianVideo** using the platform instructions below. Preserve any other userplugins already in your Vencord checkout.
2. If you previously used a static image, set `--theme-wallpaper-image: none;` in your local `wallpaper-settings.css`. This removes the static layer so it cannot cover the video.
3. Enable **ObsidianVideo**, then fully quit and reopen Discord so its native helpers load.
4. Open **Vencord → Themes → Local Themes → Choose wallpaper video**, select your own MP4, and wait for the saved message. Fully quit and reopen Discord again.
5. Alternatively copy your own MP4 into the themes folder as exactly `wallpaper.mp4`, then fully restart Discord. H.264 MP4 is recommended for compatibility.

The video is muted and loops. Adaptive colors and focus-based pause remain plugin options. Static-image filter settings do not affect the video. Switching back to a photo requires disabling ObsidianVideo and restoring the image URL. No wallpaper is downloaded or uploaded automatically.

### Updating an existing installation

Replace the main theme CSS with 2.9.0 and keep your local `wallpaper-settings.css` and wallpaper files. Users coming from a personalized CSS with an embedded photo should configure their own local image as above; do not distribute that personalized CSS. For video installations keep the plugin enabled and follow the plugin upgrade steps below. The plugin source remains unchanged from 2.8.0.

## CSS theme only

These steps are the same on Windows, macOS and Linux:

1. Install Vencord for your Discord desktop installation using the [official download page](https://vencord.dev/download/).
2. Download [Vencord-Theme.theme.css](https://raw.githubusercontent.com/opbsd/VencordTheme/main/Vencord-Theme.theme.css).
3. Open Discord → **Settings → Vencord → Themes → Open Themes Folder**.
4. Copy the CSS into that folder and enable **Vencord Theme** in Local Themes.
5. Disable other themes and select a dark Discord appearance.

Without the optional plugin, the theme uses a dark fallback. To load the CSS online instead, paste the raw URL from the README into **Online Themes**. Online loading installs only the stylesheet, not the native video plugin.

### Before adding video

The **Choose wallpaper video** button handles the filename and folder automatically. It requires this project's updated custom plugin, not only the CSS. For the optional manual route, the required filename remains **`wallpaper.mp4`**; avoid a duplicate extension such as `wallpaper.mp4.mp4`.

Install **Git, Node.js and pnpm** using the current requirements in the [official Vencord source-build guide](https://docs.vencord.dev/installing/). Verify your terminal can run:

```sh
git --version
node --version
pnpm --version
```

The commands below create a fresh `VencordThemeSetup` workspace containing two repositories. If you already maintain a custom Vencord checkout, keep using it: copy this project's `plugins/obsidianVideo.desktop` folder into its `src/userplugins`, then rebuild that checkout. Do not overwrite your existing custom plugins.

The [official custom-plugin guide](https://docs.vencord.dev/installing/custom-plugins/) explains Vencord's build model. This project is a custom plugin, not a built-in Vencord plugin.

## Choose a wallpaper video

These steps are the same on Windows, macOS and supported Linux desktop setups, **after installing this project's custom plugin and CSS**:

1. Fully quit Discord and reopen it once after plugin installation. A renderer reload alone does not load new native helpers.
2. Check **Vencord → Plugins → ObsidianVideo** is enabled.
3. Open **Vencord → Themes → Local Themes**.
4. In **Wallpaper video**, click **Choose wallpaper video** and select an MP4 from your computer. You do not need to rename or move the original.
5. Wait while the plugin checks that the video can be decoded and prepares its preview and colors.
6. When the saved message appears, fully quit Discord and reopen it. The selected video is now the wallpaper.

The plugin copies the selection into the themes folder as `wallpaper.mp4`. The source file keeps its name and location. Cancelling the picker or selecting an unreadable video keeps the previous wallpaper. A successful selection replaces the managed wallpaper; it takes effect after restarting, while the current session continues using its already-loaded video.

To quit completely, use **Quit Discord** in the system tray on Windows/Linux, or **Discord → Quit Discord / Command-Q** on macOS. Closing the window can leave Discord running.

### Startup preview and adaptive colors

The plugin prepares a small local JPEG preview and its palette before confirming a selection. On the next start, that still and its associated colors appear while the MP4 decoder gets ready; the animation then starts at its original resolution and frame rate. No video re-encoding, frame interpolation or upscaling is performed.

Colors are sampled locally from a 64×36 frame every ten seconds and update gradually. They remain applied when Discord loses focus or is minimized, even if Discord rewrites its root styles. Turn off **adaptiveColors** in **Plugins → ObsidianVideo → settings** to use the fixed palette.

`obsidian-startup.css` is generated support data, loaded automatically by the main theme. It does not need to be enabled as a separate theme. Keep the main CSS's local startup import. The preview cache stays in Vencord's data directory and is invalidated when the managed video changes or disappears. Do not publish generated cache files or private previews.

### Manual alternative

Use **Themes → Open Themes Folder**, add your MP4 there as exactly `wallpaper.mp4`, then fully quit and reopen Discord. This skips the picker's advance preparation; a video without a matching cache initially uses a neutral fallback until a preview can be generated. The folder button is authoritative for native, custom-XDG and sandboxed installations.

## Performance preset: Full HD at 30 FPS

For lower video workload, prepare a separate **H.264 MP4 at up to 1920×1080 and 30 FPS** and select that copy with the picker. The plugin does not transcode videos automatically. Keep the original file.

With FFmpeg installed, this command creates a silent copy, preserves the source aspect ratio, avoids upscaling smaller videos and caps the video bitrate at 5 Mbit/s. Replace `source.mp4` with your input filename and use a different output filename:

```sh
ffmpeg -i "source.mp4" -map 0:v:0 -vf "scale=w='min(1920,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos,fps=30" -c:v libx264 -preset fast -crf 22 -maxrate 5M -bufsize 10M -pix_fmt yuv420p -an -movflags +faststart "wallpaper-1080p30.mp4"
```

The same single-line command works in PowerShell and common macOS/Linux shells. Install FFmpeg separately if the command is unavailable; the theme does not install it. Select the output through **Choose wallpaper video**, then fully quit and reopen Discord. Preparing a 16:9 video at 1080p rather than 1440p, both at 30 FPS, reduces its pixels per second by 43.75%; that is not a measured reduction in the resources used by the whole Discord app.

By default, **pauseWhenUnfocused** stops the video and palette sampling as soon as another window is active. After 30 seconds of inactivity the plugin removes the video source and revokes its Blob URL. Returning reloads the file and resumes from the saved time; the cached poster and palette remain visible. Discord starting in the background does not read the video until playback is allowed. Disable **pauseWhenUnfocused** in ObsidianVideo settings if background playback is preferred; hidden windows and reduced motion still pause it.

Optional Discord/Vencord adjustments:

- Disable **AlwaysAnimate** if enabled, so it does not force animations on avatars, emoji, banners and other supported elements.
- Check Discord's hardware-acceleration setting on your machine. It was enabled for the local Linux verification; the theme does not change it, and the best setting depends on the driver and workload.
- Keep one theme/background source enabled. The performance CSS retains dark translucent surfaces but disables live backdrop blur, uses 120 ms interactions and removes entrance animation while respecting reduced motion.

These settings are guidance. Installing this release does not automatically re-encode your wallpaper or change other plugins or Discord preferences.

## Upgrade an existing custom build

The stylesheet is now `Vencord-Theme.theme.css` and appears as **Vencord Theme**. Replace the previous theme file instead of enabling both copies. If you use Online Themes, replace its URL with the current Download CSS link. The existing **ObsidianVideo** plugin name, settings and generated cache paths are retained for compatibility; your chosen wallpaper does not need to be selected again.

Download the latest theme/plugin ZIP and replace the CSS with its updated version. Copy **all files** from `plugins/obsidianVideo.desktop` into the matching `src/userplugins/obsidianVideo.desktop` folder in your existing Vencord checkout, overwriting older versions. Keep the other plugins in your checkout.

The current plugin includes `index.ts`, `native.ts`, `colors.ts`, `palette.ts`, `picker.ts` and `selection.ts`. Do not copy only `index.ts` or put these source files in the themes folder.

From the Vencord source directory, run:

```sh
pnpm install --frozen-lockfile
pnpm build --dev
```

Install the resulting custom build using the route for your client below (`pnpm inject` for supported Discord installations; Vesktop uses its separate custom-build settings). Fully quit and reopen Discord to load the new native helpers, then use [Choose a wallpaper video](#choose-a-wallpaper-video). The usual video choice requires no rebuilding after this initial installation/update.

## Windows

### 1. Build the plugin in PowerShell

Open PowerShell as your normal user. Use the following commands in order:

```powershell
$themeWorkspace = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'VencordThemeSetup'
New-Item -ItemType Directory -Force -Path $themeWorkspace | Out-Null
Set-Location $themeWorkspace

git clone https://github.com/opbsd/VencordTheme.git vencord-theme
git clone https://github.com/Vendicated/Vencord.git

New-Item -ItemType Directory -Force -Path '.\Vencord\src\userplugins' | Out-Null
Copy-Item -Recurse '.\vencord-theme\plugins\obsidianVideo.desktop' '.\Vencord\src\userplugins\'

Set-Location '.\Vencord'
pnpm install --frozen-lockfile
pnpm build --dev
```

### 2. Install your custom build

Quit Discord completely using **Quit Discord** in its system-tray menu. In the same PowerShell window, still inside `Vencord`, run:

```powershell
pnpm inject
```

Select the Discord installation you use in the installer. Follow the official installer's prompts; do not launch the Windows installer as Administrator. Reopen Discord after installation. [Official installer guidance](https://vencord.dev/download/).

### 3. Add the theme and video

- Follow [CSS theme only](#css-theme-only).
- Fully quit Discord from the tray and reopen it. Check **Plugins → ObsidianVideo** is enabled.
- Follow [Choose a wallpaper video](#choose-a-wallpaper-video).
- For manual setup, a typical themes path is `%APPDATA%\Vencord\themes`; **Open Themes Folder** is authoritative if your configuration differs.

## macOS

### 1. Build the plugin in Terminal

Open Terminal and run:

```sh
mkdir -p "$HOME/Documents/VencordThemeSetup"
cd "$HOME/Documents/VencordThemeSetup"

git clone https://github.com/opbsd/VencordTheme.git vencord-theme
git clone https://github.com/Vendicated/Vencord.git

mkdir -p Vencord/src/userplugins
cp -R vencord-theme/plugins/obsidianVideo.desktop Vencord/src/userplugins/

cd Vencord
pnpm install --frozen-lockfile
pnpm build --dev
```

### 2. Install your custom build

Quit Discord with **Discord → Quit Discord** or **Command-Q**. In the same Terminal window, still inside `Vencord`, run:

```sh
pnpm inject
```

Select your Discord installation in the installer. Follow any platform-specific prompts described by [Vencord's official installer](https://vencord.dev/download/). Reopen Discord.

### 3. Add the theme and video

- Follow [CSS theme only](#css-theme-only).
- Quit Discord with Command-Q and reopen it. Check **Plugins → ObsidianVideo** is enabled.
- Follow [Choose a wallpaper video](#choose-a-wallpaper-video).
- For manual setup, a typical themes path is `~/Library/Application Support/Vencord/themes`; **Open Themes Folder** is authoritative if your configuration differs.

## Linux

Use the dedicated **[Linux distribution guide](LINUX.md)**. It groups systems that share the same package manager and separates native, Flatpak, immutable and Nix-managed installations.

- [Debian / Ubuntu and derivatives](LINUX.md#debian--ubuntu-and-derivatives)
- [Arch and derivatives](LINUX.md#arch-and-derivatives)
- [Fedora / RHEL family](LINUX.md#fedora--rhel-family)
- [openSUSE / SUSE](LINUX.md#opensuse--suse-family)
- [Solus](LINUX.md#solus), [Mageia / OpenMandriva](LINUX.md#mageia--openmandriva), [Gentoo](LINUX.md#gentoo), [Void](LINUX.md#void-linux)
- [Immutable desktops / SteamOS](LINUX.md#immutable-desktops-and-steamos), [NixOS](LINUX.md#nixos), [musl / other distributions](LINUX.md#alpine--musl--other-distributions)

The shared build instructions appear once in that guide. Distribution-specific sections explain which route to use and which combinations remain unverified.

## Other clients and mobile

- **Vesktop:** this project has not been runtime-tested there. Vencord documents a separate custom-build setup using Vesktop's developer settings, rather than `pnpm inject`. Consult the [official source-build guide](https://docs.vencord.dev/installing/) for the `dist` location and Linux Flatpak access requirements. The theme-folder button remains the preferred way to locate the video directory.
- **Browser extensions:** the CSS can be loaded through Online Themes, but the included native video plugin requires desktop APIs and cannot read local files through the browser extension.
- **Android and iOS:** this package targets desktop. Discord's mobile apps cannot load this Vencord desktop plugin.

## Troubleshooting

### The video picker button is missing

Enable **ObsidianVideo**, open the **Local Themes** tab, and fully quit and reopen Discord after installing the custom build. The stock Vencord build and the CSS alone do not include this button. If you upgraded, copy all six plugin files, rebuild/install that checkout and restart the complete app.

### The video could not be opened or decoded

Choose a readable local MP4 with a video track and a codec supported by your Discord/Electron installation. H.264 MP4 was used during testing. Cancelling or failing validation does not replace the managed wallpaper.

### The theme appears, but the video does not

1. Make sure you installed and enabled the custom **ObsidianVideo** plugin, not only the CSS.
2. If using the picker, wait for the saved message before quitting Discord.
3. For manual setup, confirm the file is exactly `wallpaper.mp4` in **Open Themes Folder**, without a second extension. Do not put it in the Vencord source folder or Discord installation directory.
4. Fully quit and reopen Discord. The native plugin helper requires a full restart after installation; reloading the renderer alone does not load it.
5. If your system has reduced motion enabled, the plugin intentionally pauses and hides the video.
6. Focus the Discord window. The performance preset defers video loading while the window is inactive. A cached poster remains visible until playback starts.
7. Try an MP4 that your Discord/Electron installation can decode; H.264 at 1920×1080 and 30 FPS was verified locally.

### Playback stutters

Try the [Full HD/30 FPS preset](#performance-preset-full-hd-at-30-fps). Remove old WebP/GIF wallpaper CSS from QuickCSS and disable older animated themes. Keep a single wallpaper source active. The plugin plays the original MP4, so its bitrate, decoder support, GPU and other running workloads affect playback. Installing this theme does not enable hardware acceleration or change GPU drivers.

### A Discord update removes Vencord

Use the installation procedure for your custom build again. Running the stock installer can replace it with a build that does not contain this plugin. Keep your Vencord source checkout and rebuild after changing plugin source files.

### A page loses styling

Discord can change its CSS classes. Include your operating system, Discord/Vencord versions and a screenshot with private details removed when reporting an issue.
