# sketch

![travis](https://api.travis-ci.org/JustClear/just-sketch.svg?branch=master)
[![dependencies](https://david-dm.org/justclear/just-sketch.svg)](https://david-dm.org/justclear/just-sketch#info=dependencies&view=table)
[![devDependencies](https://david-dm.org/justclear/just-sketch/dev-status.svg)](https://david-dm.org/justclear/just-sketch#info=devDependencies&view=table)

convert image to base64. Of course, you can also join images before convert.

## Installation

```sh
$ yarn add just-sketch
```

## Usage

- convert image to base64:
    ```js
    import sketch from 'just-sketch';

    sketch()
    .import(imageURL)
    .export(base64 => {
        // get base64 here...
    }).catch(error => console.log(error));
    ```

- picture synthesis:
    ```js
    // Specifies the type of the exported picture
    sketch.imageType = 'png';
    sketch()
    .import(imageURL)
    .join(anotherURL)
    .export(base64 => {
        // get png base64 here...
    });

    // call `.join()` by chaining to join multi images
    sketch()
    .import(imageURL)
    .join(anotherURL, {
        top: 0,
        left: 0,
    }).join(anotherURL, {
        right: 0,
        bottom: 0,
    }).export(base64 => {
        // get base64 here...
    });
    ```

### APIs

- `sketch([width: Number, height: Number])`: `width` and `height` is optional, if they are passed in, then the size of exported base64 picture will depend on them. Otherwise, it will depend on the natural size of the imported picture in `.import()`

- `sketch.imageType`: The type(`png`, `jpeg`) of exported base64 picture.(`jpeg` by default)

- `.import(imageURL: String)`: The size of the imported picture will determine the size of the final exported base64 picture.

- `.join(imageURL[, options: Object])`: Join another picture to the imported picture.
    - size:
        - `options.width`: as you known.
        - `options.height`: as you known.
    - position:
        - `options.top`: as you known.
        - `options.right`: as you known.
        - `options.bottom`: as you known.
        - `options.left`: as you known.

**NOTE:** Only **adjacent** sides position are accepted.

- `.export((base64, context, canvas) => {})`: Export base64 picture, or use `context` and `canvas` to do whatever you can.

- `.catch(error => {})`: try catch export.


## License

Licensed under the [MIT License](https://github.com/JustClear/just-sketch/blob/master/LICENSE)
