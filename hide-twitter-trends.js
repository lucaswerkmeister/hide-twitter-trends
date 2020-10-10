'use strict';

function removeTrends() {
    for (let trends of document.querySelectorAll('a[href="/settings/trends"]')) {
        if (trends.closest('article')) {
            // trends link in a tweet
            continue;
        }
        trends = trends.closest('section');
        let parent;
        while ((parent = trends.parentElement).childElementCount == 1)
            trends = parent;
        trends.remove();
    }
}

setTimeout(removeTrends, 3 * 1000);
setInterval(removeTrends, 60 * 1000);
