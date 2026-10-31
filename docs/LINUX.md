# Linux distribution guide

[README](../README.md) · [General installation guide](INSTALLATION.md)

The theme has no separate build for Ubuntu, Fedora or another distribution. It needs a working Vencord desktop installation. The optional MP4 plugin additionally needs a custom Vencord build that the desktop client can load.

Distributions with the same package manager share instructions below. These are installation recipes, **not a claim that every listed distribution has been runtime-tested**. Runtime checks were performed on a Linux/Chromium development environment. Your Discord package format, CPU architecture, C library and sandbox matter more than the distribution's name.

## Choose your family

- [Debian / Ubuntu and derivatives](#debian--ubuntu-and-derivatives): Debian, Ubuntu, Linux Mint, Pop!_OS, Zorin OS, elementary OS, KDE neon, MX Linux, Kali, Parrot, PureOS, Deepin and Pardus when using their APT-based editions.
- [Arch and derivatives](#arch-and-derivatives): Arch, EndeavourOS, Manjaro, CachyOS, Garuda and Artix.
- [Fedora / RHEL family](#fedora--rhel-family): Fedora Workstation, Nobara, Ultramarine, CentOS Stream, RHEL, Rocky Linux and AlmaLinux.
- [openSUSE / SUSE family](#opensuse--suse-family): Tumbleweed, Leap, Slowroll and compatible writable SUSE desktop systems.
- [Solus](#solus).
- [Mageia / OpenMandriva](#mageia--openmandriva).
- [Gentoo](#gentoo).
- [Void Linux](#void-linux).
- [Immutable desktops and SteamOS](#immutable-desktops-and-steamos): Fedora Atomic desktops, Bazzite, Bluefin, Aurora, openSUSE Aeon/Kalpa/MicroOS Desktop, SteamOS, ChimeraOS and similar systems.
- [NixOS](#nixos).
- [Alpine / musl / other distributions](#alpine--musl--other-distributions).

After your family-specific preparation, use the shared sections:

1. [Node.js and pnpm](#shared-nodejs-and-pnpm-setup).
2. [Build the plugin once](#shared-plugin-build).
3. Choose [native Discord](#native-discord), [Discord Flatpak](#discord-flatpak) or [Vesktop](#vesktop-alternative-client).
4. [Add the CSS and MP4](#add-the-css-and-mp4).

For CSS only, you can skip the source-build toolchain and plugin sections entirely and follow [CSS theme only](INSTALLATION.md#css-theme-only).

## Debian / Ubuntu and derivatives

This family uses APT. On a supported, currently maintained desktop release:

```sh
sudo apt update
sudo apt install git curl ca-certificates
```

For native Discord, download the Linux `.deb` from [Discord's download page](https://discord.com/download). Save or rename it to `discord.deb`, open a terminal in its containing directory, then install it with:

```sh
sudo apt install ./discord.deb
```

Open Discord once. Continue with the [shared toolchain](#shared-nodejs-and-pnpm-setup), [build](#shared-plugin-build) and [native-client installation](#native-discord).

If Discord is installed through Flatpak, keep that installation and use the [Flatpak route](#discord-flatpak) instead. On Ubuntu, check whether your existing Discord came from Snap: Vencord's installer does not support that package. The [official Vencord download page](https://vencord.dev/download/) lists supported alternatives.

Do not assume `apt install nodejs` supplies a sufficiently new Node.js on every Ubuntu/Debian release; check the Vencord source checkout's `engines.node` requirement or use the shared LTS setup below.

## Arch and derivatives

On a normal writable Arch-based desktop, use Pacman:

```sh
sudo pacman -Syu --needed git curl ca-certificates
```

Arch provides [Discord in Extra](https://archlinux.org/packages/extra/x86_64/discord/):

```sh
sudo pacman -S --needed discord
```

For derivatives, use the Discord package supplied by your distribution's enabled repositories, or follow the [Flatpak route](#discord-flatpak). Keep your distribution's normal update policy; do not add another distribution's repositories just for this theme.

Open Discord once, then continue with the [shared toolchain](#shared-nodejs-and-pnpm-setup), [build](#shared-plugin-build) and [native-client installation](#native-discord). No AUR helper is required for the theme or this plugin.

SteamOS and other immutable Arch-derived systems should use the [immutable desktop section](#immutable-desktops-and-steamos), not the Pacman instructions above.

## Fedora / RHEL family

On a writable DNF-based desktop:

```sh
sudo dnf install git curl ca-certificates
```

Use a Discord package intended for your distribution. If [Discord's download page](https://discord.com/download) offers an RPM for your platform, download it as `discord.rpm`, open a terminal in that directory, then run:

```sh
sudo dnf install ./discord.rpm
```

If that package is unavailable or its dependencies cannot be satisfied, use the [Flatpak route](#discord-flatpak), rather than forcing an incompatible RPM. Package availability can differ between Fedora and enterprise releases.

Open Discord once, then follow the [shared toolchain](#shared-nodejs-and-pnpm-setup), [build](#shared-plugin-build) and the route matching your Discord installation.

Silverblue, Kinoite, Bazzite, Bluefin and Aurora use the [immutable desktop section](#immutable-desktops-and-steamos). Do not apply host `dnf install` commands to those systems as if they were Fedora Workstation.

Package-manager reference: [Fedora's software-management documentation](https://fedoraproject.org/wiki/User_Guide_-_Managing_Software).

## openSUSE / SUSE family

For writable Tumbleweed, Leap, Slowroll or another compatible Zypper desktop:

```sh
sudo zypper refresh
sudo zypper install git curl ca-certificates
```

Use your distribution's supported Discord package or the [Flatpak route](#discord-flatpak). An RPM built for a different distribution is not automatically compatible just because both systems use RPM.

If you already have a native Discord installation that starts correctly, proceed with the [shared toolchain](#shared-nodejs-and-pnpm-setup), [build](#shared-plugin-build) and [native-client installation](#native-discord).

Aeon, Kalpa and MicroOS-based immutable desktops follow the [immutable desktop section](#immutable-desktops-and-steamos).

Package-manager reference: [openSUSE Zypper documentation](https://doc.opensuse.org/documentation/tumbleweed/zypper/).

## Solus

Install the shared tools through eopkg:

```sh
sudo eopkg install git curl
```

Install Discord using your currently supported Solus software source, or use [Flatpak](#discord-flatpak). Once the client works, continue with the [shared toolchain](#shared-nodejs-and-pnpm-setup) and [plugin build](#shared-plugin-build). Choose the native or Flatpak installation route to match the client you actually installed.

Reference: [Solus package-manager documentation](https://getsol.us/about/technology/).

## Mageia / OpenMandriva

These systems do not necessarily use the same package manager.

For **Mageia with URPMI**:

```sh
sudo urpmi git curl
```

For an **OpenMandriva edition using DNF**:

```sh
sudo dnf install git curl
```

Use a supported Discord package from your distribution or [Flatpak](#discord-flatpak). Then use the [shared toolchain](#shared-nodejs-and-pnpm-setup), [build](#shared-plugin-build) and the matching client route. Do not install a Fedora RPM without checking its compatibility with your distribution.

For different editions or future package-manager changes, use the manager supplied by the distribution. [Mageia's software-management documentation](https://doc.mageia.org/mcc/8/en/content/software-management.html) describes URPMI's graphical front end; [Flathub setup](https://flathub.org/en/setup) includes both distributions.

## Gentoo

Install Git and curl using Portage:

```sh
sudo emerge --ask dev-vcs/git net-misc/curl
```

Use a glibc desktop environment and a Discord/Electron package supported by your Gentoo setup, or use [Flatpak](#discord-flatpak). Node.js is also available as [`net-libs/nodejs`](https://packages.gentoo.org/packages/net-libs/nodejs); if using that package, ensure its version and npm availability satisfy the build requirements. Otherwise use the shared LTS setup on a compatible system.

Continue with the [plugin build](#shared-plugin-build). This project does not provide its own ebuild, USE-flag profile or Electron dependency list. A musl Gentoo installation belongs to the [musl section](#alpine--musl--other-distributions).

## Void Linux

For a **glibc** Void desktop:

```sh
sudo xbps-install -S git curl
```

Use a supported Discord installation or [Flatpak](#discord-flatpak), then continue with the [shared toolchain](#shared-nodejs-and-pnpm-setup) and [build](#shared-plugin-build). Use a compatible Node.js package/version for your system.

For **Void musl**, do not assume the native Discord binary or the usual downloaded Node.js binaries will run; see the [musl section](#alpine--musl--other-distributions).

Package-manager reference: [Void's XBPS handbook](https://docs.voidlinux.org/xbps/).

## Immutable desktops and SteamOS

Examples include Fedora Silverblue/Kinoite, Bazzite, Bluefin, Aurora, openSUSE Aeon/Kalpa/MicroOS Desktop, SteamOS and ChimeraOS. They share the important restriction that the host system should not be treated as an ordinary writable package installation.

1. Install a client using the system's software center or [Flathub setup](https://flathub.org/en/setup).
2. Use the [Flatpak Discord route](#discord-flatpak) if you need the official client. Use a host-side Vencord installer only when it can detect and patch that installation; the custom-plugin setup on a particular immutable system is not certified by this project.
3. If using Vesktop, follow the [separate custom-build route](#vesktop-alternative-client). On SteamOS, Vesktop's [official Linux guide](https://vesktop.dev/install/linux/) describes installing it through Discover in Desktop Mode. Vesktop remains an unverified target for this project's plugin.
4. Build the custom Vencord files in a writable home directory. If your host lacks development tools, use the distro's existing development container rather than unlocking the host just for this theme.

On Fedora Atomic systems that provide **Toolbx**, an example development environment is:

```sh
toolbox create
toolbox enter
sudo dnf install git curl
```

Inside that environment, run the shared toolchain and build steps. Keep `ObsidianSetup` inside your shared home directory so the resulting `Vencord/dist` is accessible outside the container. Some derivatives use Distrobox instead; follow that distribution's container instructions rather than assuming `toolbox` is installed.

Do not run `pnpm inject` inside a development container expecting it to patch the host client. Leave the container and use a host-visible installer, or select the resulting `dist` directory through the alternative client's custom-build settings.

For CSS only, no container or source build is needed. Do not disable SteamOS's read-only protection solely to install this theme.

## NixOS

### CSS theme

Use a Discord package with Vencord enabled through your Nix configuration. The [official NixOS Discord wiki](https://wiki.nixos.org/wiki/Discord) documents `pkgs.discord.override { withVencord = true; }`. Configure Discord's unfree-package permission according to your existing Nix policy, rebuild the configuration, and install the CSS using **Open Themes Folder**.

A minimal package entry to adapt into an existing NixOS module is:

```nix
{ pkgs, ... }: {
  environment.systemPackages = [
    (pkgs.discord.override { withVencord = true; })
  ];
}
```

Merge it into your existing configuration; do not replace the whole configuration with this snippet. Once your configuration is ready, the usual system rebuild command is:

```sh
sudo nixos-rebuild switch
```

### Optional native video plugin

The stock Nixpkgs Vencord package does not automatically include this repository's plugin. Do not run `pnpm inject` against files in `/nix/store` or try to make the store writable.

For a Nix-managed native client, the plugin must be added to the Vencord derivation's source tree before it is built, and that custom Vencord derivation must be supplied to the Discord package. Consult the current [Vencord derivation](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/ve/vencord/package.nix) and [Discord package arguments](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/di/discord/package.nix). They change with Nixpkgs revisions, so this project does not present an untested universal overlay as a working installer.

The CSS route is documented; **native video on a Nix-managed build is an advanced, unverified setup**. A Flatpak client is another possible route, subject to the sandbox notes below. Ordinary `nvm`/prebuilt ELF instructions for other distributions are not a drop-in replacement for Nix packaging.

## Alpine / musl / other distributions

Native Discord/Electron packages and downloaded Node.js binaries can have C-library and architecture requirements. A theme cannot make an incompatible application binary run.

- **Alpine or another musl system:** use a compatible packaged/sandboxed desktop client if your distribution provides one. [Flathub's setup directory](https://flathub.org/en/setup) includes Alpine. The native client and this plugin have not been tested on musl, and compatibility wrappers are not part of this project.
- **Slackware/Salix, PCLinuxOS, ALT, Guix, Endless OS, Vanilla OS and other desktops:** install development tools using your distribution's own documentation. Use the corresponding packaging/container model or a supported Flatpak client; do not copy APT/DNF commands merely because they appear elsewhere in this guide. Flathub provides setup instructions for many of these systems.
- **ARM and other architectures:** first confirm the chosen Discord-compatible client and Node.js support your architecture. This project has not verified ARM video playback.

If a working Vencord desktop client is already available, the CSS installation is the same. For the optional plugin, use the shared build/client route only when the host toolchain and application format support it.

## Shared Node.js and pnpm setup

Use a current Node.js version accepted by the Vencord checkout's `package.json` → `engines.node`. A distro-provided Node.js/npm installation is fine when it meets that requirement.

For ordinary compatible glibc distributions where system packages are too old, one user-level option is [nvm's official installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating). Install nvm from those instructions, then reopen a Bash-compatible terminal and run:

```sh
nvm install --lts
nvm use --lts
npm install --global pnpm

git --version
node --version
pnpm --version
```

Here npm is used only to bootstrap pnpm in the user-managed Node installation. Build Vencord with pnpm, not npm. Do not run `sudo npm install` or build Vencord as root. If you already have a working pnpm setup, keep it instead of installing a second copy.

nvm does not natively integrate with every shell, and prebuilt Node binaries are not universal across musl/Nix systems. Use the distribution-specific route in those cases.

## Shared plugin build

Run these commands as your normal user in a terminal where Node.js and pnpm work. They assume a fresh workspace; if you already have a custom Vencord checkout, add the plugin there and preserve your other plugins.

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

Upstream references: [Vencord source builds](https://docs.vencord.dev/installing/) and [custom plugins](https://docs.vencord.dev/installing/custom-plugins/).

## Native Discord

This route applies to a working, writable native Discord installation from a distro package or a compatible portable archive.

1. Launch Discord at least once, then quit it completely, including the tray process.
2. In your custom `Vencord` source folder, run:

   ```sh
   pnpm inject
   ```

3. Select the actual Discord installation in the installer. If it is in a nonstandard location, use the installer's supported location-selection options. Let the installer handle any permissions prompt; do not make broad system directories world-writable.
4. Reopen Discord and follow [Add the CSS and MP4](#add-the-css-and-mp4).

Keep a portable client in a stable directory rather than a temporary extraction path. If your distribution/client updater replaces Discord's installation files, the custom build may need to be installed again.

## Discord Flatpak

This route is shared by distributions that support Flatpak. Vencord lists [Discord Flatpak](https://flathub.org/apps/com.discordapp.Discord) as an alternative to unsupported Snap installations. The custom video plugin still requires your personal Vencord build; the theme CSS alone needs no plugin.

1. Set up Flatpak/Flathub using the [instructions for your distribution](https://flathub.org/en/setup). Choose either a user or a system installation consistently. For an existing user-level Flathub remote:

   ```sh
   flatpak install --user flathub com.discordapp.Discord
   flatpak run com.discordapp.Discord
   ```

2. Quit Discord fully. Build Vencord on the host using the shared instructions. Run `pnpm inject` from that checkout and choose the detected Flatpak Discord installation. If the installer cannot support that installation, do not substitute paths from native-package instructions.
3. A custom build stored in your home directory must be readable by the sandbox. For the example workspace in this guide, grant access only to that Vencord source/build directory:

   ```sh
   flatpak override --user --filesystem="$HOME/Documents/ObsidianSetup/Vencord:ro" com.discordapp.Discord
   ```

4. Reopen Discord, use **Open Themes Folder** to locate the configuration *inside that client*, and add the CSS and MP4 there. Do not assume the host's `~/.config/Vencord/themes` is the active folder.
5. Fully quit and reopen Discord again and check **Plugins → ObsidianVideo**.

These sandbox access instructions follow [Flatpak's filesystem permission model](https://docs.flatpak.org/en/latest/sandbox-permissions.html). The exact Flatpak/custom-plugin combination has not been runtime-tested by this project. If its native helper cannot load, keep the CSS-only setup or use a verified native desktop installation.

## Vesktop (alternative client)

Vesktop is not the official Discord client. This project's plugin targets desktop APIs but has **not been runtime-tested on Vesktop**.

Use [Vesktop's official Linux installation guide](https://vesktop.dev/install/linux/) for its native DEB/RPM, Arch/AUR, AppImage, portable or Flatpak choices. Do not use `pnpm inject` to patch Vesktop.

After building Vencord with the plugin:

1. Open **Vesktop Settings → Open Developer Settings**.
2. Set **Vencord Location** to your custom checkout's `dist` folder, as described in [Vencord's official guide](https://docs.vencord.dev/installing/).
3. Fully close and reopen Vesktop.
4. Use its **Open Themes Folder** button for both CSS and MP4 placement.

For Vesktop Flatpak, the host build directory must also be readable. With this guide's workspace:

```sh
flatpak override --user --filesystem="$HOME/Documents/ObsidianSetup/Vencord:ro" dev.vencord.Vesktop
```

Select the persistent host `dist` path rather than a temporary `/run/...` portal path. If the client disallows a read-only custom location or needs to update that directory, manage/rebuild the checkout on the host rather than granting access to your entire home directory.

## Add the CSS and MP4

For every working client route above:

1. Download [Obsidian-Fallen-Knight.theme.css](https://github.com/opbsd/VencordTheme/releases/latest/download/Obsidian-Fallen-Knight.theme.css).
2. Open **Settings → Vencord → Themes → Open Themes Folder**.
3. Add the CSS, enable **Obsidian Fallen Knight Video**, and disable other themes.
4. For video, add your MP4 to the same folder with the exact name **`obsidian-fallen-knight.mp4`**.
5. Fully quit the client, reopen it, and enable **ObsidianVideo** if necessary.

A typical unsandboxed path is `~/.config/Vencord/themes`. Custom XDG paths, environment overrides and sandboxed clients differ: the folder button is authoritative.

If reduced motion is enabled, the plugin deliberately pauses and hides the video. If it stutters, remove old WebP/GIF wallpaper CSS, keep one background source active, and check the media-decoder support of the actual client you run. The theme does not install codecs or alter GPU drivers.

## Unsupported or unverified is not the same as a different theme

- **Snap Discord:** unsupported by Vencord's official installer. Change the client package, not the CSS.
- **Android/iOS:** this native desktop plugin does not run in the mobile apps.
- **Old/EOL distributions or incompatible architectures/C libraries:** first obtain a compatible maintained desktop client and toolchain.
- **NixOS, immutable systems, Flatpak and alternative clients:** use their specific setup paths and respect the unverified-status notes; no universal successful runtime claim is made here.

For an installation problem, report your distribution/version, architecture, client/package format and whether CSS-only or the MP4 plugin is affected. Those details are more useful than the distro name alone.
