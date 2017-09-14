import { preload } from './common';

export default function sketch() {
    if (!(this instanceof sketch)) return new sketch(...arguments);
    this.init(...arguments);
}

sketch.prototype.init = function () {
    const [width, height] = arguments;

    if (typeof width === 'number' && typeof height === 'number') {
        this.width = width;
        this.height = height;
    }

    this.symbols = [];
    this.catch = function() {};
};

sketch.prototype.initCanvas = function (width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    return this.ctx;
};

sketch.prototype.import = function (image) {
    if (typeof image === 'string') {
        this.background = image;
    } else {
        console.log('.import(): import unknown type.');
    }
    return this;
};

sketch.prototype.join = function (image = '', options = {}) {
    if (typeof image === 'string') {
        options.image = image;
        this.symbols.push(options);
    } else {
        console.log('.join(): join unknown type.');
    }
    return this;
};

sketch.prototype.export = function (output = function () {}) {
    preload(this.background, ([background]) => {
        this.width = this.width || background.naturalWidth;
        this.height = this.height || background.naturalHeight;
        const context = this.initCanvas(this.width, this.height);
        context.drawImage(background, 0, 0, this.width, this.height);

        preload(this.symbols.map(symbol => symbol.image), (images) => {
            images.map((image, index) => {
                const option = this.symbols[index];
                const { top, right, bottom, left } = option;
                let width, height, offsetX, offsetY;
                option.ratio = image.naturalHeight / image.naturalWidth;
                if (option.width && option.height == undefined) {
                    width = option.width;
                    height = width * option.ratio;
                } else if (option.height && option.width == undefined) {
                    height = option.height;
                    width = height / option.ratio;
                } else if (option.width && option.height) {
                    width = option.width;
                    height = option.height;
                } else if (option.height == undefined && option.width == undefined) {
                    width = image.naturalWidth;
                    height = image.naturalHeight;
                } else {
                    console.log('joined symbol size error');
                }
                if (left && top) {
                    offsetX = left;
                    offsetY = top;
                } else if (left && bottom) {
                    offsetX = left;
                    offsetY = this.height - (height + bottom);
                } else if (right && top) {
                    offsetX = this.width - (width + right);
                    offsetY = top;
                } else if (right && bottom) {
                    offsetX = this.width - (width + right);
                    offsetY = this.height - (height + bottom);
                } else {
                    console.log('symbol position error: only adjacent sides position are accepted');
                }
                offsetX = offsetX || 0;
                offsetY = offsetY || 0;
                context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, offsetX , offsetY , width, height);
            });
            try {
                output(this.canvas.toDataURL(`image/${sketch.imageType || 'jpeg'}`), context, this.canvas);
            } catch (error) {
                setTimeout(() => this.catch(error), 0);
            }
        });
    });
    return this;
};
