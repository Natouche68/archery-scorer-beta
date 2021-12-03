# Archery Scorer

This is a tool for note the score in archery.

This website uses :

-   [Halfmoon](https://www.gethalfmoon.com/) : A CSS framework with a built-in dark mode.
-   [Web Components](https://developer.mozilla.org/fr/docs/Web/Web_Components) : A native API for building components.
-   [zipcelx](https://github.com/egeriis/zipcelx) : A very small library for creating `.xlsx` files.
-   [Progressive Web Apps](https://developers.google.com/web/ilt/pwa?hl=en) : With PWA, you can dowload a website and use it offline.

There is no dependicies. All is native or imported via CDN.

## Structure of a `.archeryscorer` file

A `.archeryscorer` file is like a JSON file. It looks like this :

``` json
{
    "volee_number": 6,
    "arrow_number": 6,
    "score": [
        [ 10, 10, 9, 9, 8, 7 ],
        [ 10, 9, 9, 9, 8, 7 ],
        [ 10, 10, 10, 9, 8, 7 ],
        [ 10, 10, 9, 8, 8, 7 ],
        [ 10, 10, 9, 9, 7, 7 ],
        [ 10, 10, 9, 9, 8, 6 ]
    ]
}
```

*It can be a little different, because the indentation is the JS file is also in the `.archeryscorer` file.*
