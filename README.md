[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/mpmiiaolodhanoalpjncddpmnkbjicbo?logo=google&logoColor=white&label=google%20users)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Mozilla Add-on Users](https://img.shields.io/amo/users/hls-video-downloader?logo=mozilla&label=mozilla%20users)](https://addons.mozilla.org/addon/hls-video-downloader)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/mpmiiaolodhanoalpjncddpmnkbjicbo?label=chrome&logo=googlechrome)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/hls-video-downloader?label=firefox&logo=firefox)](https://addons.mozilla.org/addon/hls-video-downloader)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/hls-video-downloader?logo=github)](https://github.com/cssnr/hls-video-downloader/releases/latest)
[![Manifest Version](https://img.shields.io/github/manifest-json/v/cssnr/hls-video-downloader?filename=manifest.json&logo=json&label=manifest)](https://github.com/cssnr/hls-video-downloader/blob/master/manifest.json)
[![Build](https://github.com/cssnr/hls-video-downloader/actions/workflows/build.yaml/badge.svg)](https://github.com/cssnr/hls-video-downloader/actions/workflows/build.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_hls-video-downloader&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_hls-video-downloader)
# HLS Video Downloader

Modern Chrome Web Extension and Firefox Browser Addon to Download HLS Videos using Native FFmpeg.

> [!IMPORTANT]  
> This web extension requires a client app to use native FFmpeg.  
> https://github.com/cssnr/hls-downloader-client

*   [Install](#install)
*   [Features](#features)
*   [Configuration](#configuration)
*   [Development](#development)
    -   [Building](#building)

# Install

*   [Google Chrome Web Store](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
*   [Mozilla Firefox Add-ons](https://addons.mozilla.org/addon/hls-video-downloader)

[![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png)](https://addons.mozilla.org/addon/hls-video-downloader)
[![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Chromium](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chromium/chromium_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Brave](https://raw.githubusercontent.com/alrra/browser-logos/main/src/brave/brave_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Vivaldi](https://raw.githubusercontent.com/alrra/browser-logos/main/src/vivaldi/vivaldi_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)
[![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png)](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo)

All **Chromium** Based Browsers can install the extension from the
[Chrome Web Store](https://chromewebstore.google.com/detail/hls-video-downloader/mpmiiaolodhanoalpjncddpmnkbjicbo).

# Features

Please submit a [Feature Request](https://github.com/cssnr/hls-video-downloader/discussions/categories/feature-requests) for new features.  
For any issues, bugs or concerns; please [Open an Issue](https://github.com/cssnr/hls-video-downloader/issues).

# Configuration

You can pin the Addon by clicking the `Puzzle Piece`, find the Web Extension icon, then;  
**Chrome,** click the `Pin` icon.  
**Firefox,** click the `Settings Wheel` and `Pin to Toolbar`.

To open the options, click on the icon (from above) then click `Open Options`.

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

## Chrome Setup

1.  Build or Download a [Release](https://github.com/cssnr/hls-video-downloader/releases).
1.  Unzip the archive, place the folder where it must remain and note its location for later.
1.  Open Chrome, click the `3 dots` in the top right, click `Extensions`, click `Manage Extensions`.
1.  In the top right, click `Developer Mode` then on the top left click `Load unpacked`.
1.  Navigate to the folder you extracted in step #3 then click `Select Folder`.

## Firefox Setup

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
