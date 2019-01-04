import { preload, getSize, getCoordinate } from 'common';

export default function sketch() {
    if (!(this instanceof sketch)) return new sketch(...arguments);
    this.init(...arguments);
}

sketch.prototype.init = function () {
    const [width, height, backgroundColor] = arguments;
    const defaultColor = '#000';
    this.actions = [];
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context.fillStyle = backgroundColor || defaultColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = defaultColor;
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
            // const imageSize = getSize(image);
            const type = typeof position;
            if (type === 'string') {
                const coordinate = getCoordinate(this.canvas, image, position);
                this.context.drawImage(image, 0, 0, image.width, image.height, coordinate.x, coordinate.y, image.width, image.height);
            } else if(type == 'object') {
                const rotate = position.rotate || 0;
                const coordinate = {
                    x: position.x || 0,
                    y: position.y || 0,
                };
                const rotateCoordinate = {
                    x: coordinate.x + image.width / 2,
                    y: coordinate.y + image.height / 2,
                };
                // const spriteCanvas = document.createElement('canvas');
                // const spriteContext = spriteCanvas.getContext('2d');
                // const rotatedSize = getRotatedSize(imageSize, rotate);

                // spriteCanvas.width = rotatedSize.width;
                // spriteCanvas.height = rotatedSize.height;

                // const diffWidth = Math.abs(rotatedSize.width - imageSize.width);
                // const diffHeight = Math.abs(rotatedSize.height - imageSize.height);

                // this.context.rect(0, 0, image.width, image.height);
                // this.context.stroke();

                this.context.translate(rotateCoordinate.x, rotateCoordinate.y);
                this.context.rotate(rotate * Math.PI / 180);
                this.context.translate(-rotateCoordinate.x, -rotateCoordinate.y);
                this.context.drawImage(image, 0, 0, image.width, image.height, coordinate.x, coordinate.y, image.width, image.height);
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
