// JS Content Script

// console.info('HLS Video Downloader - RUNNING content-script.js')

chrome.runtime.onMessage.addListener(onMessage)

let urls = []
// let downloaded = []

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
    if (message.download) {
        console.debug('downloaded url:', message.download)
        // const index = urls.indexOf(message.download)
        const index = urls.findIndex((x) => x.url === message.download)
        console.debug('urls:', urls)
        console.debug('index:', index)
        if (index !== -1) {
            urls.splice(index, 1)
            // downloaded.push(message.download)
            console.debug('urls.length:', urls.length)
            console.debug('text:', urls.length ? urls.length.toString() : '')
            console.debug('color:', urls.length ? 'yellow' : null)
            chrome.runtime.sendMessage({
                badgeText: urls.length ? urls.length.toString() : '',
                badgeColor: urls.length ? 'yellow' : null,
            })
        }
    } else if (message.url) {
        addUrl(message)
        chrome.runtime.sendMessage({
            badgeText: urls.length.toString(),
            badgeColor: 'yellow',
        })
    } else if (message === 'getURLs') {
        console.debug(`return urls: ${urls.length}`, urls)
        sendResponse(urls)
    }
}

const termSplits = ['ext_tw_video', 'amplify_video']

function addUrl(message) {
    console.debug('addUrl:', message)
    let id
    for (const term of termSplits) {
        if (message.url.includes(term)) {
            id = message.url.split(`${term}/`)[1].split('/', 1)[0]
            console.log('id:', id)
            break
        }
    }

    for (const url of urls) {
        console.log('url:', url)
        if (url.url === message.url || url.extra === message.url) {
            console.log('skipping exiting url:', message.url)
            return
        }
        if (id && url.url.includes(id)) {
            console.log('combining urls:', url.url, message.url)
            url.extra = message.url
            return
        }
    }

    urls.push(message)
    console.debug('push urls:', urls)
}
