// JS for options.html

import {
    checkVersion,
    checkPerms,
    grantPerms,
    linkClick,
    onAdded,
    onRemoved,
    revokePerms,
    saveOptions,
    showToast,
    testNativeMessage,
    updateManifest,
    updateOptions,
    updateBrowser,
} from './export.js'

chrome.storage.onChanged.addListener(onChanged)
chrome.permissions.onAdded.addListener(onAdded)
chrome.permissions.onRemoved.addListener(onRemoved)

document.addEventListener('DOMContentLoaded', initOptions)
document.getElementById('copy-support').addEventListener('click', copySupport)
document
    .querySelectorAll('.revoke-permissions')
    .forEach((el) => el.addEventListener('click', revokePerms))
document
    .querySelectorAll('.grant-permissions')
    .forEach((el) => el.addEventListener('click', grantPerms))
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', linkClick))
document
    .querySelectorAll('#options-form input')
    .forEach((el) => el.addEventListener('change', saveOptions))
document
    .getElementById('options-form')
    .addEventListener('submit', (e) => e.preventDefault())
document
    .querySelectorAll('.native-message')
    .forEach((el) => el.addEventListener('click', testNativeMessage))
document
    .querySelectorAll('.check-version')
    .forEach((el) => el.addEventListener('click', checkVersion))
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

document.getElementById('chrome-shortcuts').addEventListener('click', () => {
    // noinspection JSIgnoredPromiseFromCall
    chrome.tabs.update({ url: 'chrome://extensions/shortcuts' })
})

/**
 * Initialize Options
 * @function initOptions
 */
async function initOptions() {
    console.debug('initOptions')
    // noinspection ES6MissingAwait
    updateManifest()
    // noinspection ES6MissingAwait
    updateBrowser()
    // noinspection ES6MissingAwait
    setShortcuts()

    checkPerms().then((hasPerms) => {
        if (!hasPerms) console.log('%cMissing Host Permissions', 'color: Red')
    })

    chrome.storage.sync.get(['options']).then((items) => {
        console.debug('options:', items.options)
        updateOptions(items.options)
    })
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
 * Set Keyboard Shortcuts
 * @function setShortcuts
 * @param {String} [selector]
 */
async function setShortcuts(selector = '#keyboard-shortcuts') {
    if (!chrome.commands) {
        return console.debug('Skipping: chrome.commands')
    }
    const table = document.querySelector(selector)
    if (!table) {
        return console.warn(`${selector} table not found`)
    }
    table.classList.remove('d-none')
    const tbody = table.querySelector('tbody')
    const source = table.querySelector('tfoot > tr').cloneNode(true)
    const commands = await chrome.commands.getAll()
    for (const command of commands) {
        try {
            // console.debug('command:', command)
            const row = source.cloneNode(true)
            let description = command.description
            // Note: Chrome does not parse the description for _execute_action in manifest.json
            if (!description && command.name === '_execute_action') {
                description = 'Show Popup Action' // NOTE: Also defined in: manifest.json
            }
            row.querySelector('.description').textContent = description
            row.querySelector('kbd').textContent = command.shortcut || 'Not Set'
            tbody.appendChild(row)
        } catch (e) {
            console.warn('Error adding command:', command, e)
        }
    }
    // Toolbar Pinned Indication
    try {
        const userSettings = await chrome.action.getUserSettings()
        const row = source.cloneNode(true)
        row.querySelector('i').className = 'fa-solid fa-puzzle-piece me-1'
        row.querySelector('.description').textContent = 'Toolbar Icon Pinned'
        row.querySelector('kbd').textContent = userSettings.isOnToolbar ? 'Yes' : 'No'
        tbody.appendChild(row)
    } catch (e) {
        console.log('Error adding pinned setting:', e)
    }
}

/**
 * Copy Support/Debugging Information
 * @function copySupport
 * @param {MouseEvent} event
 */
async function copySupport(event) {
    console.debug('copySupport:', event)
    event.preventDefault()
    const manifest = chrome.runtime.getManifest()
    const { options } = await chrome.storage.sync.get(['options'])
    const permissions = await chrome.permissions.getAll()
    const result = [
        `${manifest.name} - ${manifest.version}`,
        navigator.userAgent,
        `permissions.origins: ${JSON.stringify(permissions.origins)}`,
        `options: ${JSON.stringify(options)}`,
    ]
    await navigator.clipboard.writeText(result.join('\n'))
    showToast('Support Information Copied.')
}
