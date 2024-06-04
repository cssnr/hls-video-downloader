// JS for popup.html

import {
    checkPerms,
    linkClick,
    grantPerms,
    saveOptions,
    showToast,
    updateOptions,
    updateManifest,
    nativeApp,
} from './export.js'

chrome.storage.onChanged.addListener(onChanged)

document.addEventListener('DOMContentLoaded', initPopup)
document
    .querySelectorAll('.grant-permissions')
    .forEach((el) => el.addEventListener('click', (e) => grantPerms(e, true)))
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', (e) => linkClick(e, true)))
document
    .querySelectorAll('#options-form input')
    .forEach((el) => el.addEventListener('change', saveOptions))
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

const downloadsWrapper = document.getElementById('downloads-wrapper')
const mediaWrapper = document.getElementById('media-wrapper')
const mediaList = document.getElementById('media-list')

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    console.debug('initPopup')
    updateManifest()

    // Options
    const { options } = await chrome.storage.sync.get(['options'])
    updateOptions(options)

    // Host Permissions
    const hasPerms = await checkPerms()
    if (!hasPerms) {
        mediaWrapper.classList.add('d-none')
        return console.debug('Missing Host Permissions.')
    }

    // Tab Permissions
    const hostDiv = document.getElementById('host-div')
    const [tab, url] = await checkTab()
    // console.debug('tab, url:', tab, url)
    if (!tab || !url) {
        hostDiv.classList.add('border-danger-subtle')
    } else {
        hostDiv.querySelector('kbd').textContent = url.hostname
        hostDiv.classList.add('border-success-subtle')
    }

    // Native Permissions
    // TODO: Refactor this to use portable function from exports
    try {
        console.debug('sendNativeMessage')
        const msg = { message: 'Test' }
        const response = await chrome.runtime.sendNativeMessage(nativeApp, msg)
        console.log('response:', response)
    } catch (e) {
        console.log(e)
        document.getElementById('error-wrapper').classList.remove('d-none')
    }

    // Active Downloads
    const downloads = await chrome.runtime.sendMessage('getDownloads')
    console.log('downloads:', downloads)
    if (downloads.length) {
        processDownloads(downloads)
    }

    // Available Downloads
    console.log('tab:', tab.id)
    try {
        const urls = await chrome.tabs.sendMessage(tab.id, 'getURLs')
        processURLs(urls, downloads)
    } catch (e) {
        console.debug(e)
    }
}

function processDownloads(downloads) {
    console.log('processDownloads:', downloads)
    downloadsWrapper.classList.remove('d-none')
    for (const link of downloads) {
        const url = new URL(link)
        const div = document.createElement('div')
        div.style.overflow = 'hidden'
        const a = document.createElement('a')
        a.href = url.href
        a.textContent = url.pathname.substring(1)
        a.classList.add('text-nowrap', 'pb-1')
        div.appendChild(a)
        downloadsWrapper.appendChild(div)
    }
    const div = document.getElementById('downloads-text')
    div.textContent = `Active Downloads: ${downloads.length}`
}

function processURLs(urls, downloads) {
    console.log('urls:', urls, downloads)
    mediaWrapper.classList.remove('d-none')
    if (!urls?.length) {
        return console.debug('no urls')
    }
    mediaWrapper.classList.add('border-success')

    let extra = 0
    let available = 0
    for (const data of urls) {
        extra += data.urls.length
        console.log('data:', data)
        if (downloads.includes(data.url)) {
            console.log('url being downloaded:', data.url)
        } else {
            addLink(data.url)
            available += 1
        }
    }
    const div = document.getElementById('media-text')
    div.textContent = `Found ${available} videos with ${extra} extra links:`
}

/**
 * Append Link
 * @function addLink
 * @param {String} link
 */
function addLink(link) {
    const url = new URL(link)
    const div = document.createElement('div')
    div.style.overflow = 'hidden'
    div.classList.add('text-nowrap', 'pb-1')
    const btn = document.querySelector('#clone > button').cloneNode(true)
    btn.classList.add('me-2')
    btn.textContent = 'Download'
    btn.dataset.url = url.href
    btn.addEventListener('click', downloadMedia)
    div.appendChild(btn)
    const a = document.createElement('a')
    a.href = url.href
    a.title = url.href
    a.textContent = url.pathname.substring(1)
    a.target = '_blank'
    a.classList.add('text-nowrap')
    div.appendChild(a)
    mediaList.appendChild(div)
}

async function downloadMedia(event) {
    console.debug('downloadMedia:', event)
    const url = event.target.dataset.url
    console.debug('url:', url)
    event.target.classList.add('disabled')
    await chrome.runtime.sendMessage({ download: url })
    showToast('Download Started.')
}

/**
 * On Changed Callback
 * @function onChanged
 * @param {Object} changes
 * @param {String} namespace
 */
function onChanged(changes, namespace) {
    console.debug('onChanged:', changes, namespace)
    for (const [key, { newValue }] of Object.entries(changes)) {
        if (namespace === 'sync') {
            if (key === 'options') {
                updateOptions(newValue)
            }
        }
    }
}

/**
 * Check Tab Scripting
 * @function checkTab
 * @return {Boolean}
 */
async function checkTab() {
    try {
        const [tab] = await chrome.tabs.query({
            currentWindow: true,
            active: true,
        })
        const url = new URL(tab.url)
        if (!tab?.id || !url.hostname) {
            return [false, false]
        }
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            injectImmediately: true,
            func: function () {
                return true
            },
        })
        return [tab, url]
    } catch (e) {
        console.log(e)
        return [false, false]
    }
}
