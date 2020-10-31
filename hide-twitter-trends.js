/**
 * Content script.
 * Hides Twitter Trends on page load
 * and when receiving a removeTrends message.
 */

'use strict';

/**
 * Try to remove the Trends widget.
 * We mainly identify it using the cogwheel link in the corner of the widget,
 * then look at some of the neighboring DOM trying to reduce false positives.
 * (The many class names on the elements don’t look stable,
 * so we only match on element names, hoping they’re more reliable.)
 *
 * There is also a version of the Trends widget without the cogwheel.
 * We can try to identify this using the “trending with…” links,
 * which, if they exist, have &src=trend_click in the URL.
 * (The actual trends themselves aren’t links at all, but divs with event handlers.)
 * If none of the trends are “trending with” something, we’re out of luck.
 */
function removeTrends() {
    for (let trends of document.querySelectorAll('a[href="/settings/trends"]')) {
        if (trends.closest('article')) {
            // trends link in a tweet
            continue;
        }
        trends = trends.closest('h2');
        if (!trends) {
            // trends link in settings? maybe?
            continue;
        }
        trends = trends.closest('section');
        if (!trends) {
            // (unclear if this can happen)
            continue;
        }
        if (trends.firstElementChild.tagName !== 'H1') {
            // (unclear if this can happen)
            continue;
        }
        let parent;
        while ((parent = trends.parentElement).childElementCount == 1)
            trends = parent;
        trends.remove();
    }
    for (let trends of document.querySelectorAll('a[href*="&src=trend_click"]')) {
        if (!document.body.contains(trends)) {
            // we already removed the parent trends widget
            continue;
        }
        if (trends.closest('article')) {
            // trends link in a tweet
            continue;
        }
        trends = trends.closest('section');
        if (!trends) {
            // (unclear if this can happen)
            continue;
        }
        if (trends.firstElementChild.tagName !== 'H1') {
            // (unclear if this can happen)
            continue;
        }
        let parent;
        while ((parent = trends.parentElement).childElementCount == 1)
            trends = parent;
        trends.remove();
    }
}

setTimeout(removeTrends, 3000);

browser.runtime.onMessage.addListener(request => {
    if (request === 'removeTrends') {
        removeTrends();
        setTimeout(removeTrends, 3000);
    } else {
        throw new Error(`Unknown request ${request}`);
    }
});
