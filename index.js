(function (window, document) {
    var EMPY = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        IMAGE_SET_RE = /url\('?([^'\)]+)'?\)\s*([\d\.]+)x?/g,
        devicePixelRatio = window.devicePixelRatio || 1;
        
    function testImageSet() {
        var elem = document.createElement('div'),
            support;

        elem.setAttribute('style', 'background-image:  -webkit-image-set(url(' + EMPY + ') 1.0x)');
        document.body.appendChild(elem);
        support = IMAGE_SET_RE.test(window.getComputedStyle(elem).background);
        elem.parentNode.removeChild(elem);

        return support;
    }

    function getBackground(elem) {
        var style = elem.getAttribute('style'),
            bgs;
        if (!style) {
            return '';
        }
        bgs = style.split(/\s*;\s*/).filter(function (s) {
            return s.indexOf('background') !== -1;
        });
        if (bgs.length) {
            return bgs.pop();
        }
        return '';
    }

    function getBestSize(sizes) {
        var key, set;

        for (key in sizes) {
            if (sizes.hasOwnProperty(key)) {
                set = sizes[key];
                if (set[0] >= devicePixelRatio) {
                    break;
                }
            }
        }

        return 'url(' + set[1] + ')';
    }

    function polyfill(elem) {
        var bg = getBackground(elem),
            match = bg.match(IMAGE_SET_RE),
            sizes = [],
            prop, best;

        while ((match = IMAGE_SET_RE.exec(bg))) {
            image = match[1];
            ratio = Number(match[2]);
            sizes.push([
                Number(match[2]),
                match[1]
            ]);
        }

        if (!sizes.length) {
            return;
        }

        best = getBestSize(sizes);
        elem.style.backgroundImage = best;
    }

    function parseStyle(styles) {
        var findImageSetRE = /(?:\-(?:webkit|moz)\-)?image\-set\((.*)\)/g,
            parseImageSetRE = /url\('?([^\')]+)'?\)\s*([\d\.]+)x?/,
            newStyles = '',
            lastIndex = 0,
            match, urls, best;

        while ((match = findImageSetRE.exec(styles))) {
            urls = match[1].split(/\s*,\s*/).map(function (item) {
                var m = item.match(parseImageSetRE);
                return [
                    Number(m[2]),
                    m[1]
                ];
            });
            best = getBestSize(urls);

            newStyles += styles.slice(lastIndex, match.index) + best;
            lastIndex = match.index + match[0].length;
        }
        newStyles += styles.slice(lastIndex);
        return newStyles;
    }

    function main () {
        // replacing inline styles
        var elems = document.querySelectorAll('*');
        Array.prototype.forEach.call(elems, polyfill);

        // replacing css styles
        Array.prototype.forEach.call(document.querySelectorAll('style'), function (e) {
            e.innerHTML = parseStyle(e.innerHTML);
        });

    }

    document.addEventListener('DOMContentLoaded', function () {
        if (testImageSet()) {
            return;
        }

        main();
    });

}(window, document));
