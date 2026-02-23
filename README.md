[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/mpmiiaolodhanoalpjncddpmnkbjicbo?logo=google&logoColor=white&label=users)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Mozilla Add-on Users](https://img.shields.io/amo/users/hls-video-downloader?logo=mozilla&label=users)](https://addons.mozilla.org/addon/hls-video-downloader)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/mpmiiaolodhanoalpjncddpmnkbjicbo?label=chrome&logo=googlechrome)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/hls-video-downloader?label=firefox&logo=firefox)](https://addons.mozilla.org/addon/hls-video-downloader)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/hls-video-downloader?logo=github)](https://github.com/cssnr/hls-video-downloader/releases/latest)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_hls-video-downloader&metric=alert_status&label=quality)](https://sonarcloud.io/summary/overall?id=cssnr_hls-video-downloader)
[![Workflow Build](https://img.shields.io/github/actions/workflow/status/cssnr/hls-video-downloader/build.yaml?logo=norton&logoColor=white&label=build)](https://github.com/cssnr/hls-video-downloader/actions/workflows/build.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/hls-video-downloader/lint.yaml?logo=norton&logoColor=white&label=lint)](https://github.com/cssnr/hls-video-downloader/actions/workflows/lint.yaml)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/hls-video-downloader?logo=listenhub&label=updated)](https://github.com/cssnr/hls-video-downloader/pulse)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/hls-video-downloader?logo=buffer&label=repo%20size)](https://github.com/cssnr/hls-video-downloader?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/hls-video-downloader?logo=devbox)](https://github.com/cssnr/hls-video-downloader?tab=readme-ov-file#readme)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/cssnr/hls-video-downloader?logo=southwestairlines)](https://github.com/cssnr/hls-video-downloader/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/cssnr/hls-video-downloader?logo=codeforces&logoColor=white)](https://github.com/cssnr/hls-video-downloader/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/cssnr/hls-video-downloader?logo=theconversation)](https://github.com/cssnr/hls-video-downloader/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/hls-video-downloader?style=flat&logo=forgejo&logoColor=white)](https://github.com/cssnr/hls-video-downloader/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/hls-video-downloader?style=flat&logo=gleam&logoColor=white)](https://github.com/cssnr/hls-video-downloader/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=apachespark&logoColor=white&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# HLS Video Downloader

Modern Chrome Web Extension and Firefox Browser Addon to Download HLS Videos using Native FFmpeg.

This Web Extension is a Work in Progress, may contain bugs or not work as expected.

- [Install](#Install)
- [Features](#Features)
  - [Upcoming Features](#Upcoming-Features)
  - [Known Issues](#Known-Issues)
- [Configuration](#Configuration)
- [Support](#Support)
- [Development](#Development)
  - [Building](#Building)
- [Contributing](#Contributing)

## Install

- [Google Chrome Web Store](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
- [Mozilla Firefox Add-ons](https://addons.mozilla.org/addon/hls-video-downloader)

[![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png)](https://addons.mozilla.org/addon/hls-video-downloader)
[![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Chromium](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chromium/chromium_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Brave](https://raw.githubusercontent.com/alrra/browser-logos/main/src/brave/brave_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Vivaldi](https://raw.githubusercontent.com/alrra/browser-logos/main/src/vivaldi/vivaldi_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)

All **Chromium** Based Browsers can install the extension from the
[Chrome Web Store](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo).

> [!NOTE]  
> This web extension requires the client app to use native FFmpeg.  
> Source: https://github.com/cssnr/hls-downloader-client
>
> [![GitHub Downloads](https://img.shields.io/github/downloads/cssnr/hls-downloader-client/total?logo=github)](https://github.com/cssnr/hls-downloader-client/releases/latest)
> [![GitHub Release](https://img.shields.io/github/v/release/cssnr/hls-downloader-client?logo=github)](https://github.com/cssnr/hls-downloader-client/releases/latest)
>
> - Windows: [install-win.exe](https://github.com/cssnr/hls-downloader-client/releases/latest/download/install-win.exe)
> - Linux: [install-linux.deb](https://github.com/cssnr/hls-downloader-client/releases/latest/download/install-linux.deb)
> - macOS: [install-macos.pkg](https://github.com/cssnr/hls-downloader-client/releases/latest/download/install-macos.pkg)

> [!IMPORTANT]  
> The Client is being rewritten in Go.  
> https://github.com/smashedr/hls-downloader-go

## Features

- Download `*.m3u8` videos using a native [ffmpeg application](https://github.com/cssnr/hls-downloader-client).
- Shows the total number of streams found on the toolbar icon.
- Sends a notification when complete you can click on to open the download folder.

### Upcoming Features

- Playlist parsing to display correct qualities and combine audio/video.

> [!TIP]
> **Don't see your feature here?**
> Request one on the [Feature Request Discussion](https://github.com/cssnr/hls-video-downloader/discussions/categories/feature-requests).

### Known Issues

- Streams with separate video and audio will show up as 2 downloads.
- Stream quality display is not yet accurate.
- Error handling and messages needs improving.

> [!TIP]
> **Don't see your issue here?**
> Open one on the [Issues](https://github.com/cssnr/hls-video-downloader/issues).

## Configuration

You can pin the Addon by clicking the `Puzzle Piece`, find the Web Extension icon, then;  
**Chrome,** click the `Pin` icon.  
**Firefox,** click the `Settings Wheel` and `Pin to Toolbar`.

To open the options, click on the icon (from above) then click `Open Options`.

## Support

Logs can be found inspecting the page (Ctrl+Shift+I), clicking on the Console, and;
Firefox: toggling Debug logs, Chrome: toggling Verbose from levels dropdown.

If you run into any issues or need help getting started, please do one of the following:

- Report an Issue: <https://github.com/cssnr/hls-video-downloader/issues>
- Q&A Discussion: <https://github.com/cssnr/hls-video-downloader/discussions/categories/q-a>
- Request a Feature: <https://github.com/cssnr/hls-video-downloader/issues/new?template=1-feature.yaml>
- Chat with us on Discord: <https://discord.gg/wXy6m2X8wY>

[![Features](https://img.shields.io/badge/features-brightgreen?style=for-the-badge&logo=rocket&logoColor=white)](https://github.com/cssnr/hls-video-downloader/issues/new?template=1-feature.yaml)
[![Issues](https://img.shields.io/badge/issues-red?style=for-the-badge&logo=southwestairlines&logoColor=white)](https://github.com/cssnr/hls-video-downloader/issues)
[![Discussions](https://img.shields.io/badge/discussions-blue?style=for-the-badge&logo=livechat&logoColor=white)](https://github.com/cssnr/hls-video-downloader/discussions)
[![Discord](https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/wXy6m2X8wY)

To support this project, see the [Contributing](#Contributing) section at the bottom.

# Development

**Quick Start**

First, clone (or download) this repository and change into the directory.

Second, install the dependencies:

```shell
npm install
```

Finally, to run Chrome or Firefox with web-ext, run one of the following:

```shell
npm run chrome
npm run firefox
```

Additionally, to Load Unpacked/Temporary Add-on make a `manifest.json` and run from the [src](src) folder, run one of the following:

```shell
npm run manifest:chrome
npm run manifest:firefox
```

Chrome: [https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)  
Firefox: [https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)

For more information on web-ext, [read this documentation](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/).  
To pass additional arguments to an `npm run` command, use `--`.  
Example: `npm run chrome -- --chromium-binary=...`

## Building

Install the requirements and copy libraries into the `src/dist` directory by running `npm install`.
See [gulpfile.js](gulpfile.js) for more information on `postinstall`.

```shell
npm install
```

To create a `.zip` archive of the [src](src) directory for the desired browser run one of the following:

```shell
npm run build
npm run build:chrome
npm run build:firefox
```

For more information on building, see the scripts section in the [package.json](package.json) file.

### Chrome Setup

1.  Build or Download a [Release](https://github.com/cssnr/hls-video-downloader/releases).
1.  Unzip the archive, place the folder where it must remain and note its location for later.
1.  Open Chrome, click the `3 dots` in the top right, click `Extensions`, click `Manage Extensions`.
1.  In the top right, click `Developer Mode` then on the top left click `Load unpacked`.
1.  Navigate to the folder you extracted in step #3 then click `Select Folder`.

### Firefox Setup

1.  Build or Download a [Release](https://github.com/cssnr/hls-video-downloader/releases).
1.  Unzip the archive, place the folder where it must remain and note its location for later.
1.  Go to `about:debugging#/runtime/this-firefox` and click `Load Temporary Add-on...`
1.  Navigate to the folder you extracted earlier, select `manifest.json` then click `Select File`.
1.  Optional: Open `about:config` search for `extensions.webextensions.keepStorageOnUninstall` and set to `true`.

If you need to test a restart, you must pack the addon. This only works in ESR, Development, or Nightly.
You may also use an Unbranded Build: [https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds](https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds)

1.  Run `npm run build:firefox` then use `web-ext-artifacts/{name}-firefox-{version}.zip`.
1.  Open `about:config` search for `xpinstall.signatures.required` and set to `false`.
1.  Open `about:addons` and drag the zip file to the page or choose Install from File from the Settings wheel.

# Contributing

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

Additionally, you can give a 5-star rating
on [Google](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
or [Mozilla](https://addons.mozilla.org/addon/hls-video-downloader) and star this project on GitHub.

Other Web Extensions I have created and published:

- [Link Extractor](https://github.com/cssnr/link-extractor?tab=readme-ov-file#readme)
- [Open Links in New Tab](https://github.com/cssnr/open-links-in-new-tab?tab=readme-ov-file#readme)
- [Auto Auth](https://github.com/cssnr/auto-auth?tab=readme-ov-file#readme)
- [Cache Cleaner](https://github.com/cssnr/cache-cleaner?tab=readme-ov-file#readme)
- [HLS Video Downloader](https://github.com/cssnr/hls-video-downloader?tab=readme-ov-file#readme)
- [Obtainium Extension](https://github.com/cssnr/obtainium-extension?tab=readme-ov-file#readme)
- [SMWC Web Extension](https://github.com/cssnr/smwc-web-extension?tab=readme-ov-file#readme)
- [PlayDrift Extension](https://github.com/cssnr/playdrift-extension?tab=readme-ov-file#readme)
- [ASN Plus](https://github.com/cssnr/asn-plus?tab=readme-ov-file#readme)
- [Aviation Tools](https://github.com/cssnr/aviation-tools?tab=readme-ov-file#readme)
- [Text Formatter](https://github.com/cssnr/text-formatter?tab=readme-ov-file#readme)

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)

<a href="https://github.com/cssnr/hls-video-downloader/stargazers">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=cssnr/hls-video-downloader&type=date&legend=bottom-right&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=cssnr/hls-video-downloader&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=cssnr/hls-video-downloader&type=date&legend=bottom-right" />
 </picture>
</a>
