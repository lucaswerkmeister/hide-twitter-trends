/**
 * Content script.
 * Hides Twitter Trends on page load
 * and when receiving a removeTrends message.
 */

'use strict';

/**
 * Try to remove the Trends widget. We try several approaches to identify it.
 * They all try to identify the widget without relying on localized strings,
 * and also without any class names, which don’t look very stable.
 * Checks on the surrounding DOM try to reduce false positives.
 *
 * 1. Trends widget with a cogwheel link in the corner of the widget;
 *    the cogwheel is a real link with a constant href.
 * 2. Trends widget with a “show more” link at the end;
 *    another real link with a constant href.
 * 3. Trends widget with some “trending with…” links in the trends;
 *    real links with &src=trend_click in the URL.
 *
 * Most other things in these widgets, including the trends themselves,
 * are unfortunately not links but divs with event handlers,
 * so we can’t match on them very well.
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
        return;
    }

    for (let trends of document.querySelectorAll('a[href="/i/trends"]')) {
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
        return;
    }

    for (let trends of document.querySelectorAll('a[href*="&src=trend_click"]')) {
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
        return;
    }
}

/**
 * Call removeTrends() immediately,
 * and also a few more times with a delay,
 * in case Twitter hadn’t finished updating the page yet.
 */
function removeTrendsAFewTimes() {
    removeTrends();
    for (const delay of [100, 500, 3000]) {
        setTimeout(removeTrends, delay);
    }
}

/**
 * Call removeTrends() every so often,
 * since Twitter occasionally seems to re-render itself
 * even without any navigation activity.
 */
function removeTrendsPeriodically() {
    setInterval(removeTrends, 30 * 60 * 1000); // every 30 minutes
}

removeTrendsAFewTimes();
removeTrendsPeriodically();

browser.runtime.onMessage.addListener(request => {
    if (request === 'removeTrends') {
        removeTrendsAFewTimes();
    } else {
        throw new Error(`Unknown request ${request}`);
    }
});
