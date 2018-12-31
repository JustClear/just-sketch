import { getSize, preload } from 'common';

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
            this.canvas.width = width;
            this.canvas.height = height;
            this.context.drawImage(image, 0, 0);
            this.next();
        });
    });
    return this;
};

sketch.prototype.push = function (options = {}) {
    this.actions.push(() => {
        preload(options.image).done(image => {
            const { width, height } = getSize(image);
            this.context.drawImage(image, 0, 0, width, height);
            this.next();
        });
    });
    return this;
};

sketch.prototype.next = function () {
    this.actions.length === 0 ? this.done() : this.actions.shift()();
};

sketch.prototype.export = function (output) {
    this.done = function () {
        const base = this.canvas.toDataURL('image/jpeg');
        output(base);
    };
    this.next(this.context);
};
