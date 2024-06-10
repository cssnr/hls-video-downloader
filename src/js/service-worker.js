// JS Background Service Worker

import {
    activateOrOpen,
    checkPerms,
    nativeApp,
    sendNotification,
} from './export.js'

chrome.runtime.onStartup.addListener(onStartup)
chrome.runtime.onInstalled.addListener(onInstalled)
chrome.contextMenus.onClicked.addListener(onClicked)
chrome.runtime.onMessage.addListener(onMessage)
chrome.storage.onChanged.addListener(onChanged)
chrome.notifications.onClicked.addListener(notificationsClicked)
chrome.webRequest.onCompleted.addListener(onCompleted, {
    urls: ['*://*/*'],
})

const activeDownloads = []

/**
 * On Startup Callback
 * @function onStartup
 */
async function onStartup() {
    console.log('onStartup')
    if (typeof browser !== 'undefined') {
        console.log('Firefox CTX Menu Workaround')
        const { options } = await chrome.storage.sync.get(['options'])
        console.debug('options:', options)
        if (options.contextMenu) {
            createContextMenus()
        }
    }
}

/**
 * On Installed Callback
 * @function onInstalled
 * @param {InstalledDetails} details
 */
async function onInstalled(details) {
    console.log('onInstalled:', details)
    const githubURL = 'https://github.com/cssnr/hls-video-downloader'
    const options = await Promise.resolve(
        setDefaultOptions({
            contextMenu: true,
            showUpdate: false,
        })
    )
    console.debug('options:', options)
    if (options.contextMenu) {
        createContextMenus()
    }
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        const hasPerms = await checkPerms()
        if (hasPerms) {
            await chrome.runtime.openOptionsPage()
        } else {
            const url = chrome.runtime.getURL('/html/permissions.html')
            await chrome.tabs.create({ active: true, url })
        }
        try {
            const response = await chrome.runtime.sendNativeMessage(nativeApp, {
                message: 'Test',
            })
            console.log('response:', response)
        } catch (e) {
            console.log(e)
            const url = chrome.runtime.getURL('/html/client.html')
            await chrome.tabs.create({ active: true, url })
        }
    } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        if (options.showUpdate) {
            const manifest = chrome.runtime.getManifest()
            if (manifest.version !== details.previousVersion) {
                const url = `${githubURL}/releases/tag/${manifest.version}`
                await chrome.tabs.create({ active: false, url })
            }
        }
    }
    await chrome.runtime.setUninstallURL(`${githubURL}/issues`)
}

/**
 * On Clicked Callback
 * @function onClicked
 * @param {OnClickData} ctx
 * @param {chrome.tabs.Tab} tab
 */
async function onClicked(ctx, tab) {
    console.debug('onClicked:', ctx, tab)
    if (ctx.menuItemId === 'openOptions') {
        await chrome.runtime.openOptionsPage()
    } else if (ctx.menuItemId === 'openHome') {
        const url = chrome.runtime.getURL('/html/home.html')
        await activateOrOpen(url)
    } else if (ctx.menuItemId === 'showPanel') {
        await chrome.windows.create({
            type: 'panel',
            url: '/html/panel.html',
            width: 720,
            height: 480,
        })
    } else {
        console.error(`Unknown ctx.menuItemId: ${ctx.menuItemId}`)
    }
}

/**
 * On Message Callback
 * IMPORTANT: This function should NOT async
 * @function onMessage
 * @param {Object} message
 * @param {MessageSender} sender
 * @param {Function} sendResponse
 */
function onMessage(message, sender, sendResponse) {
    console.debug('onMessage: message, sender:', message, sender)
    // console.debug('tabId:', message.tabId || sender.tab?.id)
    if (typeof message.badgeText === 'string') {
        console.debug('message.badgeText:', message.badgeText)
        chrome.action.setBadgeText({
            tabId: message.tabId || sender.tab.id,
            text: message.badgeText,
        })
    }
    if (message.badgeColor) {
        console.debug('message.badgeColor:', message.badgeColor)
        chrome.action.setBadgeBackgroundColor({
            tabId: message.tabId || sender.tab.id,
            color: message.badgeColor,
        })
    }
    if (message === 'getDownloads') {
        console.debug('activeDownloads:', activeDownloads)
        sendResponse(activeDownloads)
    }
    if (message.download) {
        console.log('download:', message.download)
        try {
            // const msg = { download: message.download }
            activeDownloads.push(message.download)
            chrome.runtime
                .sendNativeMessage(nativeApp, message)
                .then((response) => {
                    console.log('response:', response)
                    sendNotification(
                        'Download Complete.',
                        response.path,
                        response.path
                    )
                    const index = activeDownloads.indexOf(message.download)
                    if (index !== -1) {
                        activeDownloads.splice(index, 1)
                    }
                })
        } catch (e) {
            console.log(e)
        }
    }
}

/**
 * On Changed Callback
 * @function onChanged
 * @param {Object} changes
 * @param {String} namespace
 */
function onChanged(changes, namespace) {
    // console.debug('onChanged:', changes, namespace)
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (namespace === 'sync' && key === 'options' && oldValue && newValue) {
            if (oldValue.contextMenu !== newValue.contextMenu) {
                if (newValue?.contextMenu) {
                    console.info('Enabled contextMenu...')
                    createContextMenus()
                } else {
                    console.info('Disabled contextMenu...')
                    chrome.contextMenus.removeAll()
                }
            }
        }
    }
}

/**
 * Notifications On Clicked Callback
 * @function notificationsClicked
 * @param {String} notificationId
 */
async function notificationsClicked(notificationId) {
    console.debug('notifications.onClicked:', notificationId)
    chrome.notifications.clear(notificationId)
    const message = { open: notificationId }
    console.log('message:', message)
    try {
        const response = await chrome.runtime.sendNativeMessage(
            nativeApp,
            message
        )
        console.log('response:', response)
    } catch (e) {
        console.log(e)
    }
}

/**
 * Create Context Menus
 * @function createContextMenus
 */
function createContextMenus() {
    console.debug('createContextMenus')
    chrome.contextMenus.removeAll()
    const contexts = [
        // [['all'], 'openHome', 'normal', 'Home Page'],
        // [['all'], 'showPanel', 'normal', 'Extension Panel'],
        // 'all',
        [['all'], 'openOptions', 'normal', 'Open Options'],
    ]
    contexts.forEach((context) => {
        addContext(context)
    })
}

/**
 * Add Context from Array or Separator from String
 * @function addContext
 * @param {Array,String} context
 */
function addContext(context) {
    if (typeof context === 'string') {
        const id = Math.random().toString().substring(2, 7)
        context = [[context], id, 'separator', 'separator']
    }
    chrome.contextMenus.create({
        contexts: context[0],
        id: context[1],
        type: context[2] || 'normal',
        title: context[3],
    })
}

/**
 * Set Default Options
 * @function setDefaultOptions
 * @param {Object} defaultOptions
 * @return {Object}
 */
async function setDefaultOptions(defaultOptions) {
    console.log('setDefaultOptions', defaultOptions)
    // let { downloaded } = await chrome.storage.local.get(['downloaded'])
    // if (!downloaded) {
    //     downloaded = []
    //     await chrome.storage.local.set({ downloaded })
    // }
    let { options } = await chrome.storage.sync.get(['options'])
    options = options || {}
    let changed = false
    for (const [key, value] of Object.entries(defaultOptions)) {
        // console.log(`${key}: default: ${value} current: ${options[key]}`)
        if (options[key] === undefined) {
            changed = true
            options[key] = value
            console.log(`Set ${key}:`, value)
        }
    }
    if (changed) {
        await chrome.storage.sync.set({ options })
        console.log('changed:', options)
    }
    return options
}

/**
 * @function onCompleted
 * @param {Object} details
 */
async function onCompleted(details) {
    // console.log('onCompleted:', details)
    if (
        details.documentUrl?.startsWith('moz-extension') ||
        details.initiator?.startsWith('chrome-extension')
    ) {
        return
    }
    if (details.url.endsWith('.m3u8')) {
        console.debug('Process m3u8:', details.url)
        try {
            // console.log('checking request:', details)
            const response = await fetch(details.url)
            const text = await response.text()
            // console.debug('text:', text)
            if (text.startsWith('#EXTM3U')) {
                const message = { url: details.url }
                await chrome.tabs.sendMessage(details.tabId, message)
                // await processPlaylist(details, text)

                // const regex = /^#EXTINF:/m
                // if (!regex.test(text)) {
                //     await processPlaylist(details, text)
                // } else {
                //     console.debug('contains #EXTINF')
                // }
            } else {
                console.debug('not #EXTM3U')
            }
        } catch (e) {
            console.log(e)
        }
    }
    // } else if (details.url.endsWith('.mp4')) {
    //     console.debug('mp4:', details.url)
    // }
}

// /**
//  * @function processPlaylist
//  * @param {Object} details
//  * @param {String} text
//  */
// async function processPlaylist(details, text) {
//     console.log('playlist:', details)
//     const lines = text.split('\n')
//     // console.debug('lines:', lines)
//     const urls = []
//     for (const line of lines) {
//         if (!line || line.startsWith('#') || !line.endsWith('.m3u8')) {
//             continue
//         }
//         const url = new URL(line, details.url)
//         urls.push(url.href)
//         // console.debug('url:', url.href)
//     }
//     // console.debug('urls:', urls)
//     const message = {
//         urls: urls,
//         url: details.url,
//     }
//     console.log('sendMessage:', message)
//     await chrome.tabs.sendMessage(details.tabId, message)
// }
