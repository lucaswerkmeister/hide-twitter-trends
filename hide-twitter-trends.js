'use strict';

/**
 * Try to remove the Trends widget.
 * We mainly identify it using the cogwheel link in the corner of the widget,
 * then look at some of the neighboring DOM trying to reduce false positives.
 * (The many class names on the elements don’t look stable,
 * so we only match on element names, hoping they’re more reliable.)
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
}

setTimeout(removeTrends, 3 * 1000);
setInterval(removeTrends, 60 * 1000);
