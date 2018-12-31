import { preload, getSize, getCoordinate } from 'common';

export default function sketch() {
    if (!(this instanceof sketch)) return new sketch(...arguments);
    this.init(...arguments);
}

sketch.prototype.init = function () {
    const [width, height] = arguments;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.sprites = [];
    this.actions = [];
};

sketch.prototype.import = function (imageURL) {
    this.actions.push(() => {
        preload(imageURL).done(image => {
            const { width, height } = getSize(image);
            this.canvas.width = this.width || width;
            this.canvas.height = this.height || height;
            this.context.drawImage(image, 0, 0);
            this.next();
        });
    });
    return this;
};

sketch.prototype.push = function (options = {}) {
    const { position } = options;

    this.actions.push(() => {
        preload(options.image).done(image => {
            const imageSize = getSize(image);
            const type = typeof position;
            if (type === 'string') {
                const coordinate = getCoordinate(this.canvas, imageSize, position);
                this.context.drawImage(image, 0, 0, imageSize.width, imageSize.height, coordinate.x, coordinate.y, imageSize.width, imageSize.height);
            } else if(type == 'object') {
                const rotate = position.rotate || 0;
                const coordinate = {
                    x: position.x || 0,
                    y: position.y || 0,
                };
                const spriteCanvas = document.createElement('canvas');
                const spriteContext = spriteCanvas.getContext('2d');

                spriteCanvas.width = imageSize.width;
                spriteCanvas.height = imageSize.height;

                spriteContext.translate(spriteCanvas.width / 2, spriteCanvas.height / 2);
                spriteContext.rotate(rotate * Math.PI / 180);
                spriteContext.translate(-spriteCanvas.width / 2, -spriteCanvas.height / 2);
                spriteContext.drawImage(image, spriteCanvas.width / 2 - image.width / 2, spriteCanvas.height / 2 - image.height / 2);
                spriteContext.translate(spriteCanvas.width / 2, spriteCanvas.height / 2);
                spriteContext.rotate(-rotate * Math.PI / 180);
                spriteContext.translate(-spriteCanvas.width / 2, -spriteCanvas.height / 2);

                this.context.drawImage(spriteCanvas, 0, 0, spriteCanvas.width, spriteCanvas.height, coordinate.x, coordinate.y, spriteCanvas.width, spriteCanvas.height);
            } else {
                console.log('`options.position` should be a string or object');
            }
            this.next();
        });
    });
    return this;
};

sketch.prototype.next = function () {
    this.actions.length === 0 ? this.done() : this.actions.shift()();
};

sketch.prototype.export = function (output) {
    this.done = () => output(this.canvas.toDataURL('image/jpeg'));
    this.next();
};
