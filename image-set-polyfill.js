(function (window, document) {

    var EMPY = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        IMAGE_SET_RE_TEPMLATE = 'url\\([\'"]?([^\'"\\)]+)[\'"]?\\)\\s*([\\d\\.]+)x?',
        IMAGE_SET_RE = new RegExp(IMAGE_SET_RE_TEPMLATE, 'g'),
        PARSE_IMAGE_SER_RE = new RegExp(IMAGE_SET_RE_TEPMLATE, ''),
        devicePixelRatio = window.devicePixelRatio || 1;
        
    /**
     * image-set() feature detect
     *
     * @returns {Boolean}
     */
    function testImageSet() {
        var elem = document.createElement('div'),
            style = [
                'background-image:  -webkit-image-set(url(' + EMPY + ') 1.0x)',
                'background-image:  image-set(url(' + EMPY + ') 1.0x)'
            ].join(';'),
            support;

        elem.setAttribute('style', style);
        document.body.appendChild(elem);
        support = IMAGE_SET_RE.test(window.getComputedStyle(elem).background);
        elem.parentNode.removeChild(elem);

        return support;
    }

    /**
     * Gerring background from inline styles
     *
     * @returns {String}
     */
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

    /**
     * Getting best image for current DPI
     *
     * @param {Array} array of devicePixelRatio - image url pairs
     *    [[1, 'url1'], [2, 'url2']]
     *
     * @returns {String} 'url(url1)'
     */
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

    /**
     * Trying polyfill DOM node
     *
     * @param {HTMLElement}
     */
    function polyfillNode(elem) {
        var bg = getBackground(elem),
            match = bg.match(IMAGE_SET_RE),
            sizes = [],
            best;

        IMAGE_SET_RE.lastIndex = 0;
        while ((match = IMAGE_SET_RE.exec(bg))) {
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

    /**
     * Trying modify current styles
     *
     * @param {HTMLStyleElement}
     */
    function polyfillStyle(styleTag) {
        var styles = styleTag.innerHTML,
            findImageSetRE = /(?:\-(?:webkit|moz)\-)?image\-set\((.*)\)/g,
            newStyles = '',
            lastIndex = 0,
            match, urls, best;

        function urlMap(item) {
            var m = item.match(PARSE_IMAGE_SER_RE);
            return [
                Number(m[2]),
                m[1]
            ];
        }

        while ((match = findImageSetRE.exec(styles))) {
            urls = match[1].split(/\s*,\s*/).map(urlMap);
            best = getBestSize(urls);

            newStyles += styles.slice(lastIndex, match.index) + best;
            lastIndex = match.index + match[0].length;
        }
        newStyles += styles.slice(lastIndex);
        styleTag.innerHTML = newStyles;
    }

    /**
     * Running on document load
     */
    function main() {
        // replacing inline styles
        Array.prototype.forEach.call(document.querySelectorAll('*'), polyfillNode);

        // replacing css styles
        Array.prototype.forEach.call(document.querySelectorAll('style'), polyfillStyle);

    }

    /**
     * Make polyfill on new nodes and after modify styles
     */
    function eventsAttach() {
        var div = document.createElement('div'),
            supported = false,
            appendChild = HTMLElement.prototype.appendChild,
            setAttribute = HTMLElement.prototype.setAttribute;

        div.addEventListener('DOMNodeInserted', function () {
            supported = true;
        });
        div.appendChild(div.cloneNode(true));

        if (supported) {
            window.addEventListener('DOMNodeInserted', function (e) {
                polyfillNode(e.originalTarget);
            }, false);
            window.addEventListener('DOMAttrModified', function (e) {
                polyfillNode(e.originalTarget);
            }, false);
        } else {
            HTMLElement.prototype.appendChild = function (elem) {
                polyfillNode(elem);
                return appendChild.apply(this, arguments);
            };
            HTMLElement.prototype.setAttribute = function (name, val) {
                var r = setAttribute.apply(this, arguments);
                if (name === 'style' && val.indexOf('background') !== -1) {
                    polyfillNode(this);
                }
                return r;
            };
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (testImageSet()) {
            return;
        }

        main();
        eventsAttach();
    });

}(window, document));
