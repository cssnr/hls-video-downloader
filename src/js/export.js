// JS Exports

export const githubURL = 'https://github.com/cssnr/hls-video-downloader'
export const nativeApp = 'org.cssnr.hls.downloader'

/**
 * Save Options Callback
 * @function saveOptions
 * @param {UIEvent} event
 */
export async function saveOptions(event) {
    console.debug('saveOptions:', event)
    const { options } = await chrome.storage.sync.get(['options'])
    let key = event.target.id
    let value
    if (event.target.type === 'radio') {
        key = event.target.name
        const radios = document.getElementsByName(key)
        for (const input of radios) {
            if (input.checked) {
                value = input.id
                break
            }
        }
    } else if (event.target.type === 'checkbox') {
        value = event.target.checked
    } else if (event.target.type === 'number') {
        const number = Number.parseFloat(event.target.value)
        let min = Number.parseFloat(event.target.min)
        let max = Number.parseFloat(event.target.max)
        if (!Number.isNaN(number) && number >= min && number <= max) {
            event.target.value = number.toString()
            value = number
        } else {
            event.target.value = options[event.target.id]
            return
        }
    } else {
        value = event.target.value
    }
    if (value === undefined) {
        console.warn(`No Value for key: ${key}`)
    } else {
        options[key] = value
        console.log(`Set %c${key}:`, 'color: Khaki', value)
        await chrome.storage.sync.set({ options })
    }
}

/**
 * Update Options
 * @function initOptions
 * @param {Object} options
 */
export function updateOptions(options) {
    console.debug('updateOptions:', options)
    for (let [key, value] of Object.entries(options)) {
        if (value === undefined) {
            console.warn('Value undefined for key:', key)
            continue
        }
        // Option Key should be `radioXXX` and values should be the option IDs
        if (key.startsWith('radio')) {
            key = value //NOSONAR
            value = true //NOSONAR
        }
        // console.debug(`${key}: ${value}`)
        const el = document.getElementById(key)
        if (!el) {
            continue
        }
        if (el.tagName !== 'INPUT') {
            el.textContent = value.toString()
        } else if (typeof value === 'boolean') {
            el.checked = value
        } else {
            el.value = value
        }
        if (el.dataset.related) {
            hideShowElement(`#${el.dataset.related}`, value)
        }
    }
}

/**
 * Hide or Show Element with JQuery
 * @function hideShowElement
 * @param {String} selector
 * @param {Boolean} [show]
 * @param {String} [speed]
 */
function hideShowElement(selector, show, speed = 'fast') {
    const element = $(`${selector}`)
    // console.debug('hideShowElement:', show, element)
    if (show) {
        element.show(speed)
    } else {
        element.hide(speed)
    }
}

/**
 * Link Click Callback
 * Note: Firefox popup requires a call to window.close()
 * @function linkClick
 * @param {MouseEvent} event
 * @param {Boolean} [close]
 */
export async function linkClick(event, close = false) {
    console.debug('linkClick:', close, event)
    const target = event.currentTarget
    const href = target.getAttribute('href').replace(/^\.+/, '')
    console.debug('href:', href)
    let url
    if (href.startsWith('#')) {
        console.debug('return on anchor link')
        return
    }
    event.preventDefault()
    if (href.endsWith('html/options.html')) {
        await chrome.runtime.openOptionsPage()
        if (close) window.close()
        return
    } else if (href.endsWith('html/panel.html')) {
        await showPanel()
        if (close) window.close()
        return
    } else if (href.startsWith('http')) {
        url = href
    } else {
        url = chrome.runtime.getURL(href)
    }
    console.debug('url:', url)
    await activateOrOpen(url)
    if (close) window.close()
}

/**
 * Activate or Open Tab from URL
 * @function activateOrOpen
 * @param {String} url
 * @param {Boolean} [open]
 * @return {Promise<chrome.tabs.Tab>}
 */
export async function activateOrOpen(url, open = true) {
    console.debug('activateOrOpen:', url, open)
    // Note: To Get Tab from Tabs (requires host permissions or tabs)
    const tabs = await chrome.tabs.query({ currentWindow: true })
    console.debug('tabs:', tabs)
    for (const tab of tabs) {
        if (tab.url === url) {
            console.debug('%cTab found, activating:', 'color: Lime', tab)
            return await chrome.tabs.update(tab.id, { active: true })
        }
    }
    if (open) {
        console.debug('%cTab not found, opening url:', 'color: Yellow', url)
        return await chrome.tabs.create({ active: true, url })
    }
    console.warn('tab not found and open not set!')
}

/**
 * Update DOM with Manifest Details
 * @function updateManifest
 */
export async function updateManifest() {
    const manifest = chrome.runtime.getManifest()
    console.debug('updateManifest:', manifest)
    document.querySelectorAll('.version').forEach((el) => {
        el.textContent = manifest.version
    })
    document.querySelectorAll('[href="homepage_url"]').forEach((el) => {
        el.href = manifest.homepage_url
    })
    document.querySelectorAll('[href="version_url"]').forEach((el) => {
        el.href = `${githubURL}/releases/tag/${manifest.version}`
    })
}

/**
 * @function updateBrowser
 * @return {Promise<void>}
 */
export async function updateBrowser() {
    let selector = '.chrome'
    // noinspection JSUnresolvedReference
    if (
        typeof browser !== 'undefined' &&
        typeof browser?.runtime?.getBrowserInfo === 'function'
    ) {
        selector = '.firefox'
    }
    console.debug('updateBrowser:', selector)
    document.querySelectorAll(selector).forEach((el) => el.classList.remove('d-none'))
}

/**
 * Check Host Permissions
 * @function checkPerms
 * @return {Promise<Boolean>}
 */
export async function checkPerms() {
    const hasPerms = await chrome.permissions.contains({
        origins: ['*://*/*'],
    })
    console.debug('checkPerms:', hasPerms)
    // Firefox still uses DOM Based Background Scripts
    if (typeof document === 'undefined') {
        return hasPerms
    }
    const hasPermsEl = document.querySelectorAll('.has-perms')
    const grantPermsEl = document.querySelectorAll('.grant-perms')
    if (hasPerms) {
        hasPermsEl.forEach((el) => el.classList.remove('d-none'))
        grantPermsEl.forEach((el) => el.classList.add('d-none'))
    } else {
        grantPermsEl.forEach((el) => el.classList.remove('d-none'))
        hasPermsEl.forEach((el) => el.classList.add('d-none'))
    }
    return hasPerms
}

/**
 * Grant Permissions Click Callback
 * @function grantPerms
 * @param {MouseEvent} event
 * @param {Boolean} [close]
 */
export async function grantPerms(event, close = false) {
    console.debug('grantPerms:', event)
    // noinspection ES6MissingAwait
    requestPerms()
    if (close) {
        window.close()
    }
}

/**
 * Request Host Permissions
 * @function requestPerms
 * @return {Promise<Boolean>}
 */
export async function requestPerms() {
    return await chrome.permissions.request({
        origins: ['*://*/*'],
    })
}

/**
 * Revoke Permissions Click Callback
 * Note: This method does not work on Chrome if permissions are required.
 * @function revokePerms
 * @param {MouseEvent} event
 */
export async function revokePerms(event) {
    console.debug('revokePerms:', event)
    const permissions = await chrome.permissions.getAll()
    console.debug('permissions:', permissions)
    try {
        await chrome.permissions.remove({
            origins: permissions.origins,
        })
        await checkPerms()
    } catch (e) {
        console.log(e)
        showToast(e.toString(), 'danger')
    }
}

/**
 * Permissions On Added Callback
 * @param {chrome.permissions} permissions
 */
export async function onAdded(permissions) {
    console.debug('onAdded', permissions)
    await checkPerms()
}

/**
 * Permissions On Removed Callback
 * @param {chrome.permissions} permissions
 */
export async function onRemoved(permissions) {
    console.debug('onRemoved', permissions)
    await checkPerms()
}

/**
 * Open Popup Click Callback
 * NOTE: Requires Chrome>=127
 * @function openPopup
 * @param {Event} [event]
 */
export async function openPopup(event) {
    console.debug('openPopup:', event)
    event?.preventDefault()
    // Note: This fails if popup is already open (ex. double clicks)
    try {
        await chrome.action.openPopup()
    } catch (e) {
        console.debug(e)
    }
}

/**
 * Open Extension Panel
 * @function openExtPanel
 * @param {String} [url]
 * @param {Number} [width]
 * @param {Number} [height]
 * @param {String} [type]
 * @return {Promise<chrome.windows.Window|undefined>}
 */
export async function showPanel(
    url = '/html/panel.html',
    width = 720,
    height = 480,
    type = 'panel',
) {
    console.debug(`openExtPanel: ${url}`, width, height)
    if (!chrome.windows) {
        console.log('Browser does not support: chrome.windows')
        showToast('Browser does not support windows', 'danger')
        return
    }
    const { lastPanelID } = await chrome.storage.local.get(['lastPanelID'])
    console.debug('lastPanelID:', lastPanelID)

    try {
        const window = await chrome.windows.get(lastPanelID)
        if (window) {
            console.debug(`%c Window found: ${window.id}`, 'color: Lime')
            return await chrome.windows.update(lastPanelID, {
                focused: true,
            })
        }
    } catch (e) {
        console.log(e)
    }

    // noinspection JSCheckFunctionSignatures
    const window = await chrome.windows.create({ type, url, width, height })
    // NOTE: Code after windows.create is not executed on the first pop-out...
    console.debug(`%c Created new window: ${window.id}`, 'color: Yellow')
    // noinspection ES6MissingAwait
    // chrome.storage.local.set({ lastPanelID: window.id })
    return window
}

/**
 * Show Bootstrap Toast
 * @function showToast
 * @param {String} message
 * @param {String} type
 */
export function showToast(message, type = 'success') {
    console.debug(`showToast: ${type}: ${message}`)
    const clone = document.querySelector('.d-none .toast')
    const container = document.getElementById('toast-container')
    if (!clone || !container) {
        return console.warn('Missing clone or container:', clone, container)
    }
    const element = clone.cloneNode(true)
    element.querySelector('.toast-body').textContent = message
    element.classList.add(`text-bg-${type}`)
    container.appendChild(element)
    const toast = new bootstrap.Toast(element)
    element.addEventListener('mousemove', () => toast.hide())
    toast.show()
}

/**
 * Send Notification
 * @function sendNotification
 * @param {String} title
 * @param {String} text
 * @param {String} id - Optional
 * @param {Number} timeout - Optional
 */
export async function sendNotification(title, text, id = '', timeout = 30) {
    console.debug('sendNotification', title, text, id, timeout)
    const options = {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('/images/logo96.png'),
        title: title,
        message: text,
    }
    chrome.notifications.create(id, options, function (notification) {
        setTimeout(function () {
            chrome.notifications.clear(notification)
        }, timeout * 1000)
    })
}

/**
 * Test Native Message and Show Toast
 * TODO: Refactor this function to be more portable
 * @function testNativeMessage
 * @param {Event} [e]
 * @param {String} [toast]
 * @return {Promise<*|Boolean>}
 */
export async function testNativeMessage(e, toast = 'all') {
    try {
        console.debug('testNativeMessage:', toast)
        const msg = { message: 'Test' }
        const response = await chrome.runtime.sendNativeMessage(nativeApp, msg)
        console.log('response:', response)
        if (['all', 'success'].includes(toast)) showToast(response.message)
        return true
    } catch (e) {
        console.log(e)
        if (['all', 'error'].includes(toast)) showToast(e.message, 'warning')
        return false
    }
}

export async function checkVersion(event) {
    console.debug('checkVersion:', event)
    const btn = event.target.closest('button')
    btn.classList.add('disabled')
    const version = await checkClientVersion()
    console.debug('version:', version)
    if (!version) {
        btn.classList.remove('disabled')
        showToast('Error Checking Client Version.', 'danger')
        return
    }
    const versionInfo = document.getElementById('version-info')
    versionInfo.querySelector('.current').textContent = version.current
    versionInfo.querySelector('.latest').textContent = version.latest
    versionInfo.classList.remove('d-none')
    if (version.update) {
        showToast('New Version Available.', 'warning')
        versionInfo.classList.add('text-danger-emphasis')
    } else {
        showToast('Client Version is Up to Date.', 'success')
        versionInfo.classList.add('text-success-emphasis')
    }
}

/**
 * Check Native Client Version
 * @function checkClientVersion
 * @return {Promise<*|Object>}
 */
async function checkClientVersion() {
    try {
        console.debug('checkClientVersion')
        const msg = { version: true }
        const response = await chrome.runtime.sendNativeMessage(nativeApp, msg)
        console.log('response:', response)
        if (!response.success) {
            return null
        }
        // noinspection JSUnresolvedReference
        const current = response.current_version
        console.log('current:', current)
        if (!current) {
            return null
        }
        const latest = await checkLatestVersion()
        console.log('latest:', latest)
        if (!latest) {
            return null
        }
        const cmp = current.localeCompare(latest, undefined, {
            numeric: true,
            sensitivity: 'base',
        })
        console.log('cmp:', cmp)
        const update = cmp === -1
        console.log('update:', update)
        return { latest, current, update }
    } catch (e) {
        console.log(e)
        return null
    }
}

/**
 * Check Latest Native Client Version
 * @function checkLatestVersion
 * @return {Promise<*|Response>}
 */
async function checkLatestVersion() {
    console.debug('checkLatestVersion')
    const url = 'https://github.com/cssnr/hls-downloader-client/releases/latest'
    const response = await fetch(url, { method: 'HEAD' })
    console.log('response:', response)
    if (!response.url.includes('/releases/tag/')) {
        return null
    }
    return response.url.split('/').pop()
}
