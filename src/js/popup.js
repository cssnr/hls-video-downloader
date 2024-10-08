// JS for popup.html

import {
    checkPerms,
    linkClick,
    grantPerms,
    saveOptions,
    showToast,
    updateOptions,
    updateManifest,
    testNativeMessage,
} from './export.js'

chrome.storage.onChanged.addListener(onChanged)

document.addEventListener('DOMContentLoaded', initPopup)
// noinspection JSCheckFunctionSignatures
document
    .querySelectorAll('.grant-permissions')
    .forEach((el) => el.addEventListener('click', (e) => grantPerms(e, true)))
// noinspection JSCheckFunctionSignatures
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
    // noinspection ES6MissingAwait
    updateManifest()
    chrome.storage.sync.get(['options']).then((items) => {
        console.debug('options:', items.options)
        updateOptions(items.options)
    })

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
    if (!(await testNativeMessage(null, 'none'))) {
        document.getElementById('error-wrapper').classList.remove('d-none')
    }

    // Active Downloads
    const downloads = await chrome.runtime.sendMessage('getDownloads')
    console.log('downloads:', downloads)
    if (downloads.length) {
        await processDownloads(downloads)
    }

    // Available Downloads
    console.log('tab:', tab.id)
    try {
        const urls = await chrome.tabs.sendMessage(tab.id, 'getURLs')
        await processURLs(urls, downloads)
    } catch (e) {
        console.debug(e)
    }
}

async function processDownloads(downloads) {
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
    div.innerHTML = `Active Downloads: <b>${downloads.length}</b>`
}

async function processURLs(urls, downloads) {
    console.log('processURLs:', urls, downloads)
    mediaWrapper.classList.remove('d-none')
    if (!urls?.length) {
        return console.debug('no urls')
    }
    mediaWrapper.classList.add('border-success')

    // const { downloaded } = await chrome.storage.local.get(['downloaded'])
    // let extra = 0
    let available = 0
    for (const data of urls) {
        // if (downloaded.includes(data.url)) {
        //     console.debug('already downloaded:', data.url)
        //     continue
        // }
        if (downloads.includes(data.url)) {
            console.log('currently downloading:', data.url)
            continue
        }
        // extra += data.urls.length
        console.log('data:', data)
        addLink(data)
        available += 1
    }
    const div = document.getElementById('media-text')
    div.innerHTML = `Found <b>${available}</b> Resources:`
}

/**
 * Append Link
 * @function addLink
 * @param {Object} data
 */
function addLink(data) {
    const url = new URL(data.url)
    const div = document.createElement('div')
    div.style.overflow = 'hidden'
    div.classList.add('text-nowrap', 'pb-1')
    const btn = document.querySelector('#clone > button').cloneNode(true)
    btn.classList.add('me-2')
    btn.textContent = 'Download'
    btn.dataset.url = url.href
    if (data.extra) {
        btn.dataset.extra = data.extra
    }
    btn.addEventListener('click', downloadMedia)
    div.appendChild(btn)
    const a = document.createElement('a')
    a.href = url.href
    a.title = url.href
    if (data.extra) {
        a.title = `${a.title} + ${data.extra}`
    }
    const qualities = ['2160', '1440', '1080', '720', '480', '360', '240']
    const parsed = qualities.find((quality) => url.href.includes(quality))
    if (parsed) {
        // a.textContent = `${parsed}p - `
        div.appendChild(document.createTextNode(`${parsed}p `))
    }
    a.textContent += url.pathname.substring(1)
    a.target = '_blank'
    a.classList.add('text-nowrap')
    div.appendChild(a)
    mediaList.appendChild(div)
}

async function downloadMedia(event) {
    console.debug('downloadMedia:', event)
    const url = event.target.dataset.url
    console.debug('url:', url)
    const extra = event.target.dataset.extra
    console.debug('extra:', extra)
    if (!(await testNativeMessage(null, 'error'))) {
        return
    }
    event.target.classList.add('disabled')
    // const { downloaded } = await chrome.storage.local.get(['downloaded'])
    // downloaded.push(url)
    // await chrome.storage.local.set({ downloaded })
    const [tab] = await chrome.tabs.query({
        currentWindow: true,
        active: true,
    })
    await chrome.tabs.sendMessage(tab.id, { download: url })
    await chrome.runtime.sendMessage({
        download: url,
        extra: extra,
        title: tab.title,
    })
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
 * @return {Promise<*|Boolean>}
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
