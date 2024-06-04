// JS for client.html

import { testNativeMessage } from './export.js'

document.addEventListener('DOMContentLoaded', domContentLoaded)
document
    .querySelectorAll('.open-options')
    .forEach((el) => el.addEventListener('click', openOptions))
document
    .querySelectorAll('.native-message')
    .forEach((el) => el.addEventListener('click', testNativeMessage))

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
