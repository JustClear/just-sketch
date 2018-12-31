export function preload(imageURLs) {
    const images = [];
    let count = 0,
        doneAction = function () {},
        progressAction = function () {};

    imageURLs = (typeof imageURLs != 'object') ? [imageURLs] : imageURLs;

    imageURLs.length === 0 && doneAction(images);

    imageURLs.map((image, i) => {
        images[i] = new Image();
        images[i].src = image;
        images[i].onload = imageLoad;
        images[i].onerror = imageLoad;
    });

    function imageLoad() {
        progressAction((count + 1) * 100 / images.length, images[count]);
        count++;
        if (count == imageURLs.length) doneAction(imageURLs.length === 1 ? images[0] : images);
    }

    return {
        done() {
            doneAction = arguments[0] || doneAction;
        },
        progress() {
            progressAction = arguments[0] || progressAction;
        },
    };
}

export function getSize(node) {
    if (!node.tagName) return console.log('Invalid element.');

    const name = node.tagName;
    const type = name === 'IMG' ? 'image' : (name === 'CANVAS' ? 'canvas' : 'normal');

    const result = {
        image: {
            width: node.naturalWidth,
            height: node.naturalHeight,
        },
        canvas: {
            width: node.width,
            height: node.height,
        },
        normal: {
            width: node.offsetWidth,
            height: node.offsetHeight,
        },
    };

    return result[type];
}

export function getCoordinate(canvas, imageSize, position) {
    const POSITION_STRING = ['center', 'left-top', 'right-top', 'right-bottom', 'left-bottom'];
    if (!POSITION_STRING.includes(position)) console.log(`Invalid position string.\nExcept [${POSITION_STRING}]`);

    const { width: imageWidth, height: imageHeight } = imageSize;
    const { width: canvasWidth, height: canvasHeight } = canvas;
    const offsetX = canvasWidth - imageWidth;
    const offsetY = canvasHeight - imageHeight;
    const result = {
        [POSITION_STRING[0]]: {
            x: offsetX / 2,
            y: offsetY / 2,
        },
        [POSITION_STRING[1]]: {
            x: 0,
            y: 0,
        },
        [POSITION_STRING[2]]: {
            x: offsetX,
            y: 0,
        },
        [POSITION_STRING[3]]: {
            x: offsetX,
            y: offsetY,
        },
        [POSITION_STRING[4]]: {
            x: 0,
            y: offsetY,
        },
    };

    return result[position];
}
