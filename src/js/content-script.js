// JS Content Script

console.info('HLS Video Downloader - RUNNING content-script.js')

chrome.runtime.onMessage.addListener(onMessage)

let urls = []

/**
 * On Message Callback
 * IMPORTANT: This function should NOT async
 * @function onMessage
 * @param {Object} message
 * @param {MessageSender} sender
 * @param {function} sendResponse
 */
function onMessage(message, sender, sendResponse) {
    console.debug('onMessage:', message, sender)
    if (message.url) {
        urls.push(message)
        console.debug('push urls:', urls)
        chrome.runtime.sendMessage({
            badgeText: urls.length,
            badgeColor: 'yellow',
        })
    } else if (message === 'getURLs') {
        console.debug(`return urls: ${urls.length}`, urls)
        sendResponse(urls)
    }
}
