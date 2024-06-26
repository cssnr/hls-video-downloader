// JS for client.html

import { checkVersion, testNativeMessage } from './export.js'

document.addEventListener('DOMContentLoaded', domContentLoaded)
document
    .querySelectorAll('.open-options')
    .forEach((el) => el.addEventListener('click', openOptions))
document
    .querySelectorAll('.native-message')
    .forEach((el) => el.addEventListener('click', testNativeMessage))
document
    .querySelectorAll('.check-version')
    .forEach((el) => el.addEventListener('click', checkVersion))

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.debug('domContentLoaded')
    // TODO: Add Native Test onLoad
}

async function openOptions(event) {
    event.preventDefault()
    await chrome.runtime.openOptionsPage()
}
