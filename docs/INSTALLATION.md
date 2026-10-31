# Installation

[Back to the README](../README.md)

Choose your setup:

- [CSS theme only — all desktop operating systems](#css-theme-only)
- [Windows — CSS and optional video plugin](#windows)
- [macOS — CSS and optional video plugin](#macos)
- [Linux — CSS and optional video plugin](#linux)
- [Other clients and mobile](#other-clients-and-mobile)
- [Troubleshooting](#troubleshooting)

## CSS theme only

These steps are the same on Windows, macOS and Linux:

1. Install Vencord for your Discord desktop installation using the [official download page](https://vencord.dev/download/).
2. Download [Obsidian-Fallen-Knight.theme.css](https://github.com/LeoxMinei/obsidian-fallen-knight/releases/latest/download/Obsidian-Fallen-Knight.theme.css).
3. Open Discord → **Settings → Vencord → Themes → Open Themes Folder**.
4. Copy the CSS into that folder and enable **Obsidian Fallen Knight Video** in Local Themes.
5. Disable other themes and select a dark Discord appearance.

Without the optional plugin, the theme uses a dark fallback. To load the CSS online instead, paste the raw URL from the README into **Online Themes**. Online loading installs only the stylesheet, not the native video plugin.

### Before adding video

Install **Git, Node.js and pnpm** using the current requirements in the [official Vencord source-build guide](https://docs.vencord.dev/installing/). Verify your terminal can run:

```sh
git --version
node --version
pnpm --version
```

The commands below create a fresh `ObsidianSetup` workspace containing two repositories. If you already maintain a custom Vencord checkout, keep using it: copy this project's `plugins/obsidianVideo.desktop` folder into its `src/userplugins`, then rebuild that checkout. Do not overwrite your existing custom plugins.

The [official custom-plugin guide](https://docs.vencord.dev/installing/custom-plugins/) explains Vencord's build model. This project is a custom plugin, not a built-in Vencord plugin.

## Windows

### 1. Build the plugin in PowerShell

Open PowerShell as your normal user. Use the following commands in order:

```powershell
$obsidianWorkspace = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'ObsidianSetup'
New-Item -ItemType Directory -Force -Path $obsidianWorkspace | Out-Null
Set-Location $obsidianWorkspace

git clone https://github.com/LeoxMinei/obsidian-fallen-knight.git
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
- Open **Themes → Open Themes Folder** and place your MP4 there as `obsidian-fallen-knight.mp4`.
- A typical standard-install path is `%APPDATA%\Vencord\themes`. The folder opened by Vencord is authoritative if your configuration differs.
- Fully quit Discord from the tray and reopen it. Check **Plugins → ObsidianVideo** is enabled.

## macOS

### 1. Build the plugin in Terminal

Open Terminal and run:

```sh
mkdir -p "$HOME/Documents/ObsidianSetup"
cd "$HOME/Documents/ObsidianSetup"

git clone https://github.com/LeoxMinei/obsidian-fallen-knight.git
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
- Use **Themes → Open Themes Folder** and add `obsidian-fallen-knight.mp4` there.
- A typical standard-install path is `~/Library/Application Support/Vencord/themes`. In Finder, **Go → Go to Folder…** can open it. Use Vencord's folder button if your installation differs.
- Quit Discord with Command-Q and reopen it. Check **Plugins → ObsidianVideo** is enabled.

## Linux

### 1. Choose the Discord package

These instructions target Discord desktop with Vencord. Vencord's official installer does not support Discord's Snap package; use a supported installation listed on the [official download page](https://vencord.dev/download/). Sandboxed installations can use different configuration locations and permissions.

### 2. Build the plugin in Terminal

```sh
mkdir -p "$HOME/Documents/ObsidianSetup"
cd "$HOME/Documents/ObsidianSetup"

git clone https://github.com/LeoxMinei/obsidian-fallen-knight.git
git clone https://github.com/Vendicated/Vencord.git

mkdir -p Vencord/src/userplugins
cp -R obsidian-fallen-knight/plugins/obsidianVideo.desktop Vencord/src/userplugins/

cd Vencord
pnpm install --frozen-lockfile
pnpm build --dev
```

### 3. Install your custom build

Quit Discord completely, including its tray process if present. In the same Terminal window, still inside `Vencord`, run:

```sh
pnpm inject
```

Choose the appropriate Discord installation and follow the installer's prompts. Reopen Discord.

### 4. Add the theme and video

- Follow [CSS theme only](#css-theme-only).
- Open **Themes → Open Themes Folder** and add `obsidian-fallen-knight.mp4` there.
- A typical standard-install path is `~/.config/Vencord/themes`; XDG settings, environment overrides and sandboxed packages may change it. Use the folder opened by Vencord rather than assuming the default.
- Fully quit and reopen Discord. Check **Plugins → ObsidianVideo** is enabled.

## Other clients and mobile

- **Vesktop:** this project has not been runtime-tested there. Vencord documents a separate custom-build setup using Vesktop's developer settings, rather than `pnpm inject`. Consult the [official source-build guide](https://docs.vencord.dev/installing/) for the `dist` location and Linux Flatpak access requirements. The theme-folder button remains the preferred way to locate the video directory.
- **Browser extensions:** the CSS can be loaded through Online Themes, but the included native video plugin requires desktop APIs and cannot read local files through the browser extension.
- **Android and iOS:** this package targets desktop. Discord's mobile apps cannot load this Vencord desktop plugin.

## Troubleshooting

### The theme appears, but the video does not

1. Make sure you installed and enabled the custom **ObsidianVideo** plugin, not only the CSS.
2. Confirm the exact file name is `obsidian-fallen-knight.mp4` and that your file manager did not add a second extension.
3. Put the file in the folder opened by **Open Themes Folder**, not the Vencord source folder or Discord's installation directory.
4. Fully quit and reopen Discord. The native plugin helper requires a full restart after installation; reloading the renderer alone does not load it.
5. If your system has reduced motion enabled, the plugin intentionally pauses and hides the video.
6. Try an MP4 that your Discord/Electron installation can decode. The original development clip was H.264, 1920×1080 at 60 fps.

### Playback stutters

Remove old WebP/GIF wallpaper CSS from QuickCSS and disable older animated themes. Keep a single wallpaper source active. The plugin plays the original MP4, so its bitrate, decoder support, GPU and other running workloads affect playback. Installing this theme does not enable hardware acceleration or change GPU drivers.

### A Discord update removes Vencord

Use the installation procedure for your custom build again. Running the stock installer can replace it with a build that does not contain this plugin. Keep your Vencord source checkout and rebuild after changing plugin source files.

### A page loses styling

Discord can change its CSS classes. Include your operating system, Discord/Vencord versions and a screenshot with private details removed when reporting an issue.
