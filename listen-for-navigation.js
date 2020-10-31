/**
 * Background script.
 * Listens for history state update events
 * and sends removeTrends messages to the content script.
 */

'use strict';

browser.webNavigation.onHistoryStateUpdated.addListener(({ tabId }) => {
    browser.tabs.sendMessage(tabId, 'removeTrends');
}, {
    url: [
        { hostEquals: 'twitter.com' },
    ],
});
