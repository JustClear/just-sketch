(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.sketch = factory();
}(typeof self !== 'undefined' ? self : this, function () { 'use strict';

    function preload(imageURLs, done) {
        var images = [];
        var count = 0;
        imageURLs = (typeof imageURLs != 'object') ? [imageURLs] : imageURLs;

        imageURLs.length === 0 && done(images);

        imageURLs.map(function (imageURL) {
            var image = new Image();
            image.src = imageURL;
            image.crossOrigin = '*';
            image.addEventListener('load', imageOnLoad);
            image.addEventListener('error', imageOnLoad);
            images.push(image);
        });

        function imageOnLoad() {
            count ++;
            if (count == imageURLs.length) { done(images); }
        }
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

    sketch.prototype.join = function (image, options) {
        if ( image === void 0 ) image = '';
        if ( options === void 0 ) options = {};

        if (typeof image === 'string') {
            options.image = image;
            this.symbols.push(options);
        } else {
            console.log('.join(): join unknown type.');
        }
        return this;
    };

    sketch.prototype.rect = function (options) {
        if ( options === void 0 ) options = {};

        options.type = 'rect';
        this.symbols.push(options);
        return this;
    };

    sketch.prototype.export = function (output) {
        var this$1 = this;
        if ( output === void 0 ) output = function () {};

        preload(this.background, function (ref) {
            var background = ref[0];

            this$1.naturalRatio = background.naturalHeight / background.naturalWidth;
            this$1.width = this$1.width || background.naturalWidth;
            this$1.height = this$1.height || background.naturalHeight;
            this$1.initCanvas(this$1.width, this$1.height);
            this$1.ctx.drawImage(background, 0, 0, this$1.width, this$1.width * this$1.naturalRatio);

            preload(this$1.symbols.map(function (symbol) { return symbol.image || ''; }), function (images) {
                images.map(function (image, index) {
                    var option = this$1.symbols[index];
                    var top = option.top; if ( top === void 0 ) top = 0;
                    var right = option.right; if ( right === void 0 ) right = 0;
                    var bottom = option.bottom; if ( bottom === void 0 ) bottom = 0;
                    var left = option.left; if ( left === void 0 ) left = 0;
                    var width, height, offsetX, offsetY;
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
                    if (left !== 0 && top !== 0) {
                        offsetX = left;
                        offsetY = top;
                    } else if (left !== 0 && bottom !== 0) {
                        offsetX = left;
                        offsetY = this$1.height - (height + bottom);
                    } else if (right !== 0 && top !== 0) {
                        offsetX = this$1.width - (width + right);
                        offsetY = top;
                    } else if (right !== 0 && bottom !== 0) {
                        offsetX = this$1.width - (width + right);
                        offsetY = this$1.height - (height + bottom);
                    } else {
                        console.log('symbol position error: only adjacent sides position are accepted');
                    }
                    width = width || 0;
                    height = height || 0;
                    offsetX = offsetX || 0;
                    offsetY = offsetY || 0;
                    if (option.type == 'rect') {
                        if (option.backgroundColor) {
                            this$1.ctx.fillStyle = option.backgroundColor || '#000';
                            this$1.ctx.fillRect(offsetX + option.borderWidth, offsetY + option.borderWidth, width, height);
                        }
                        if (option.borderWidth) {
                            this$1.ctx.beginPath();
                            this$1.ctx.lineWidth = option.borderWidth;
                            this$1.ctx.strokeStyle = option.borderColor || '#000';
                            this$1.ctx.rect(offsetX + option.borderWidth, offsetY + option.borderWidth, width, height);
                            this$1.ctx.stroke();
                        }
                    } else {
                        this$1.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, offsetX , offsetY , width, height);
                    }
                });
                try {
                    output(this$1.canvas.toDataURL(("image/" + (sketch.imageType || 'jpeg'))), this$1.ctx, this$1.canvas);
                } catch (error) {
                    setTimeout(function () { return this$1.catch(error); }, 0);
                }
            });
        });
        return this;
    };

    return sketch;

}));
//# sourceMappingURL=sketch.js.map
