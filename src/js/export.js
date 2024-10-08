// JS Exports

export const githubURL = 'https://github.com/cssnr/hls-video-downloader'
export const nativeApp = 'org.cssnr.hls.downloader'

/**
 * Save Options Callback
 * @function saveOptions
 * @param {InputEvent} event
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
        value = event.target.value.toString()
    } else {
        value = event.target.value
    }
    if (value !== undefined) {
        options[key] = value
        console.info(`Set: ${key}:`, value)
        await chrome.storage.sync.set({ options })
    } else {
        console.warn('No value for key:', key)
    }
}

/**
 * Update Options based on type
 * @function initOptions
 * @param {Object} options
 */
export function updateOptions(options) {
    console.debug('updateOptions:', options)
    for (let [key, value] of Object.entries(options)) {
        if (typeof value === 'undefined') {
            console.warn('Value undefined for key:', key)
            continue
        }
        const el = document.getElementById(key)
        if (!el) {
            continue
        }
        if (el.type === 'checkbox') {
            el.checked = value
        } else {
            el.value = value
        }
        if (el.dataset.related) {
            hideShowElement(`#${el.dataset.related}`, value)
        }
    }
}

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
 * Firefox requires a call to window.close()
 * @function linkClick
 * @param {MouseEvent} event
 * @param {Boolean} close
 */
export async function linkClick(event, close = false) {
    console.debug('linkClick:', event)
    console.debug('close:', close)
    event.preventDefault()
    const anchor = event.target.closest('a')
    if (anchor.dataset.link === 'no') {
        return console.debug('return on dataset.link: no')
    }
    const href = anchor.getAttribute('href').replace(/^\.+/g, '')
    console.debug('href:', href)
    if (href.startsWith('#')) {
        return console.debug('return on anchor link')
    }
    let url
    if (href.endsWith('html/options.html')) {
        await chrome.runtime.openOptionsPage()
        if (close) window.close()
        return
    } else if (href.endsWith('html/panel.html')) {
        await chrome.windows.create({
            type: 'panel',
            url: '/html/panel.html',
            width: 720,
            height: 480,
        })
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
 * @return {Promise<*|Boolean>}
 */
export async function activateOrOpen(url, open = true) {
    console.debug('activateOrOpen:', url)
    const tabs = await chrome.tabs.query({ currentWindow: true })
    // console.debug('tabs:', tabs)
    for (const tab of tabs) {
        if (tab.url === url) {
            console.debug('tab:', tab)
            await chrome.tabs.update(tab.id, { active: true })
            return
        }
    }
    if (open) {
        await chrome.tabs.create({ active: true, url })
    }
}

/**
 * Update DOM with Manifest Details
 * @function updateManifest
 */
export async function updateManifest() {
    const manifest = chrome.runtime.getManifest()
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
 * Check Host Permissions
 * @function checkPerms
 * @return {Promise<*|Boolean>}
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
 * @return {Promise<*|chrome.permissions.request>}
 */
export async function requestPerms() {
    return await chrome.permissions.request({
        origins: ['*://*/*'],
    })
}

/**
 * Revoke Permissions Click Callback
 * NOTE: For many reasons Chrome will determine host_perms are required and
 *       will ask for them at install time and not allow them to be revoked
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
        showToast(e.message, 'danger')
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
    element.querySelector('.toast-body').innerHTML = message
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
