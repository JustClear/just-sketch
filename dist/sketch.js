(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.sketch = factory();
}(typeof self !== 'undefined' ? self : this, function () { 'use strict';

    function preload(imageURLs) {
        var images = [];
        var count = 0,
            doneAction = function () {},
            progressAction = function () {};

        imageURLs = (typeof imageURLs != 'object') ? [imageURLs] : imageURLs;

        imageURLs.length === 0 && doneAction(images);

        imageURLs.map(function (image, i) {
            images[i] = new Image();
            images[i].src = image;
            images[i].onload = imageLoad;
            images[i].onerror = imageLoad;
        });

        function imageLoad() {
            progressAction((count + 1) * 100 / images.length, images[count]);
            count++;
            if (count == imageURLs.length) { doneAction(imageURLs.length === 1 ? images[0] : images); }
        }

        return {
            done: function done() {
                doneAction = arguments[0] || doneAction;
            },
            progress: function progress() {
                progressAction = arguments[0] || progressAction;
            },
        };
    }

    function getSize(node) {
        if (!node.tagName) { return console.log('Invalid element.'); }

        var name = node.tagName;
        var type = name === 'IMG' ? 'image' : (name === 'CANVAS' ? 'canvas' : 'normal');

        var result = {
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

    function getCoordinate(canvas, imageSize, position) {
        var POSITION_STRING = ['center', 'left-top', 'right-top', 'right-bottom', 'left-bottom'];
        if (!POSITION_STRING.includes(position)) { console.log(("Invalid position string.\nExcept [" + POSITION_STRING + "]")); }

        var imageWidth = imageSize.width;
        var imageHeight = imageSize.height;
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var offsetX = canvasWidth - imageWidth;
        var offsetY = canvasHeight - imageHeight;
        var result = {};
        result[POSITION_STRING[0]] = {
                x: offsetX / 2,
                y: offsetY / 2,
            };
        result[POSITION_STRING[1]] = {
                x: 0,
                y: 0,
            };
        result[POSITION_STRING[2]] = {
                x: offsetX,
                y: 0,
            };
        result[POSITION_STRING[3]] = {
                x: offsetX,
                y: offsetY,
            };
        result[POSITION_STRING[4]] = {
                x: 0,
                y: offsetY,
            };

        return result[position];
    }

    function sketch() {
        var i = arguments.length, argsArray = Array(i);
        while ( i-- ) argsArray[i] = arguments[i];
        var ref;

        if (!(this instanceof sketch)) { return new (Function.prototype.bind.apply( sketch, [ null ].concat( argsArray) )); }
        (ref = this).init.apply(ref, arguments);
    }

    sketch.prototype.init = function () {
        var width = arguments[0];
        var height = arguments[1];

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.sprites = [];
        this.actions = [];
    };

    sketch.prototype.import = function (imageURL) {
        var this$1 = this;

        this.actions.push(function () {
            preload(imageURL).done(function (image) {
                var ref = getSize(image);
                var width = ref.width;
                var height = ref.height;
                this$1.canvas.width = this$1.width || width;
                this$1.canvas.height = this$1.height || height;
                this$1.context.drawImage(image, 0, 0);
                this$1.next();
            });
        });
        return this;
    };

    sketch.prototype.push = function (options) {
        var this$1 = this;
        if ( options === void 0 ) options = {};

        var position = options.position;

        this.actions.push(function () {
            preload(options.image).done(function (image) {
                var imageSize = getSize(image);
                var type = typeof position;
                if (type === 'string') {
                    var coordinate = getCoordinate(this$1.canvas, imageSize, position);
                    this$1.context.drawImage(image, 0, 0, imageSize.width, imageSize.height, coordinate.x, coordinate.y, imageSize.width, imageSize.height);
                } else if(type == 'object') {
                    var rotate = position.rotate || 0;
                    var coordinate$1 = {
                        x: position.x || 0,
                        y: position.y || 0,
                    };
                    var spriteCanvas = document.createElement('canvas');
                    var spriteContext = spriteCanvas.getContext('2d');

                    spriteCanvas.width = imageSize.width;
                    spriteCanvas.height = imageSize.height;

                    spriteContext.translate(spriteCanvas.width / 2, spriteCanvas.height / 2);
                    spriteContext.rotate(rotate * Math.PI / 180);
                    spriteContext.translate(-spriteCanvas.width / 2, -spriteCanvas.height / 2);
                    spriteContext.drawImage(image, spriteCanvas.width / 2 - image.width / 2, spriteCanvas.height / 2 - image.height / 2);
                    spriteContext.translate(spriteCanvas.width / 2, spriteCanvas.height / 2);
                    spriteContext.rotate(-rotate * Math.PI / 180);
                    spriteContext.translate(-spriteCanvas.width / 2, -spriteCanvas.height / 2);

                    this$1.context.drawImage(spriteCanvas, 0, 0, spriteCanvas.width, spriteCanvas.height, coordinate$1.x, coordinate$1.y, spriteCanvas.width, spriteCanvas.height);
                } else {
                    console.log('`options.position` should be a string or object');
                }
                this$1.next();
            });
        });
        return this;
    };

    sketch.prototype.next = function () {
        this.actions.length === 0 ? this.done() : this.actions.shift()();
    };

    sketch.prototype.export = function (output) {
        var this$1 = this;

        this.done = function () { return output(this$1.canvas.toDataURL('image/jpeg')); };
        this.next();
    };

    return sketch;

}));
//# sourceMappingURL=sketch.js.map
