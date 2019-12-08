## image-set polyfill

Polyfill for css4 function `image-set()` (http://dev.w3.org/csswg/css-images/#image-set-notation)

## Install
You can install `image-set-polyfill` with `bower` or with `npm`:

bower:
```sh
bower install --save image-set-polyfill
```
npm:
```sh
npm install --save image-set-polyfill
```

## Usage
You should only include `image-set-polyfill.js` on your page

```html
<script type="text/javascript" src="image-set-polyfill.min.js"></script>
```

## Supports

CSS styles
```css
.smart-image 
{
    background-image:  -webkit-image-set(
        url('http://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Cat_poster_2.jpg/297px-Cat_poster_2.jpg') 1.0x,
        url('http://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Cat_poster_2.jpg/594px-Cat_poster_2.jpg') 2.0x
    );
}
```

Inline styles
```html
<div style="background-image: -webkit-image-set(url(lowdpi.png) 1.0x, url(highydpi.png) 2.0x )"></div>
```
