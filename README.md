## image-set polyfill

polyfill for css4 function ```image-set()``` (http://dev.w3.org/csswg/css-images/#image-set-notation)

## usage

in html
```html
<script type="text/javascript" src="image-set-polyfill.js"></script>
```

in css
```css
.smart-image 
{
    background-image:  -webkit-image-set(
        url('http://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Cat_poster_2.jpg/297px-Cat_poster_2.jpg') 1.0x,
        url('http://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Cat_poster_2.jpg/594px-Cat_poster_2.jpg') 2.0x
    );
}
```
