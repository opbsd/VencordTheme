# Installation

[Back to the README](../README.md)

Choose your setup:

- [CSS theme only — all desktop operating systems](#css-theme-only)
- [Choose a wallpaper video — after installing the plugin](#choose-a-wallpaper-video)
- [Upgrade an existing custom build](#upgrade-an-existing-custom-build)
- [Windows — CSS and optional video plugin](#windows)
- [macOS — CSS and optional video plugin](#macos)
- [Linux — CSS and optional video plugin](#linux)
- [Other clients and mobile](#other-clients-and-mobile)
- [Troubleshooting](#troubleshooting)

## CSS theme only

These steps are the same on Windows, macOS and Linux:

1. Install Vencord for your Discord desktop installation using the [official download page](https://vencord.dev/download/).
2. Download [Obsidian-Fallen-Knight.theme.css](https://github.com/opbsd/VencordTheme/releases/latest/download/Obsidian-Fallen-Knight.theme.css).
3. Open Discord → **Settings → Vencord → Themes → Open Themes Folder**.
4. Copy the CSS into that folder and enable **Obsidian Fallen Knight Video** in Local Themes.
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

The commands below create a fresh `ObsidianSetup` workspace containing two repositories. If you already maintain a custom Vencord checkout, keep using it: copy this project's `plugins/obsidianVideo.desktop` folder into its `src/userplugins`, then rebuild that checkout. Do not overwrite your existing custom plugins.

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

Colors are sampled locally from a 64×36 frame every three seconds and update gradually. They remain applied when Discord loses focus or is minimized, even if Discord rewrites its root styles. Turn off **adaptiveColors** in **Plugins → ObsidianVideo → settings** to use the fixed palette.

`obsidian-startup.css` is generated support data, loaded automatically by the main theme. It does not need to be enabled as a separate theme. Keep the main CSS's local startup import. The preview cache stays in Vencord's data directory and is invalidated when the managed video changes or disappears. Do not publish generated cache files or private previews.

### Manual alternative

Use **Themes → Open Themes Folder**, add your MP4 there as exactly `wallpaper.mp4`, then fully quit and reopen Discord. This skips the picker's advance preparation; a video without a matching cache initially uses a neutral fallback until a preview can be generated. The folder button is authoritative for native, custom-XDG and sandboxed installations.

## Upgrade an existing custom build

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
$obsidianWorkspace = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'ObsidianSetup'
New-Item -ItemType Directory -Force -Path $obsidianWorkspace | Out-Null
Set-Location $obsidianWorkspace

git clone https://github.com/opbsd/VencordTheme.git obsidian-fallen-knight
git clone https://github.com/Vendicated/Vencord.git

New-Item -ItemType Directory -Force -Path '.\Vencord\src\userplugins' | Out-Null
Copy-Item -Recurse '.\obsidian-fallen-knight\plugins\obsidianVideo.desktop' '.\Vencord\src\userplugins\'

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
mkdir -p "$HOME/Documents/ObsidianSetup"
cd "$HOME/Documents/ObsidianSetup"

git clone https://github.com/opbsd/VencordTheme.git obsidian-fallen-knight
git clone https://github.com/Vendicated/Vencord.git

mkdir -p Vencord/src/userplugins
cp -R obsidian-fallen-knight/plugins/obsidianVideo.desktop Vencord/src/userplugins/

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
6. Try an MP4 that your Discord/Electron installation can decode. The original development clip was H.264, 1920×1080 at 60 fps.

### Playback stutters

Remove old WebP/GIF wallpaper CSS from QuickCSS and disable older animated themes. Keep a single wallpaper source active. The plugin plays the original MP4, so its bitrate, decoder support, GPU and other running workloads affect playback. Installing this theme does not enable hardware acceleration or change GPU drivers.

### A Discord update removes Vencord

Use the installation procedure for your custom build again. Running the stock installer can replace it with a build that does not contain this plugin. Keep your Vencord source checkout and rebuild after changing plugin source files.

### A page loses styling

Discord can change its CSS classes. Include your operating system, Discord/Vencord versions and a screenshot with private details removed when reporting an issue.
