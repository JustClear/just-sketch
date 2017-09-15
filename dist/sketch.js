(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('sketch', factory) :
	(global.sketch = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function preload(imageURLs, done) {
    var images = [];
    var count = 0;
    imageURLs = (typeof imageURLs === 'undefined' ? 'undefined' : _typeof(imageURLs)) != 'object' ? [imageURLs] : imageURLs;

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
        count++;
        if (count == imageURLs.length) done(images);
    }
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function sketch() {
    if (!(this instanceof sketch)) return new (Function.prototype.bind.apply(sketch, [null].concat(Array.prototype.slice.call(arguments))))();
    this.init.apply(this, arguments);
}

sketch.prototype.init = function () {
    var _arguments = Array.prototype.slice.call(arguments),
        width = _arguments[0],
        height = _arguments[1];

    if (typeof width === 'number' && typeof height === 'number') {
        this.width = width;
        this.height = height;
    }

    this.symbols = [];
    this.catch = function () {};
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

sketch.prototype.join = function () {
    var image = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof image === 'string') {
        options.image = image;
        this.symbols.push(options);
    } else {
        console.log('.join(): join unknown type.');
    }
    return this;
};

sketch.prototype.rect = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    options.type = 'rect';
    this.symbols.push(options);
    return this;
};

sketch.prototype.export = function () {
    var _this = this;

    var output = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

    preload(this.background, function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            background = _ref2[0];

        _this.width = _this.width || background.naturalWidth;
        _this.height = _this.height || background.naturalHeight;
        _this.initCanvas(_this.width, _this.height);
        _this.ctx.drawImage(background, 0, 0, _this.width, _this.height);

        preload(_this.symbols.map(function (symbol) {
            return symbol.image || '';
        }), function (images) {
            images.map(function (image, index) {
                var option = _this.symbols[index];
                var _option$top = option.top,
                    top = _option$top === undefined ? 0 : _option$top,
                    _option$right = option.right,
                    right = _option$right === undefined ? 0 : _option$right,
                    _option$bottom = option.bottom,
                    bottom = _option$bottom === undefined ? 0 : _option$bottom,
                    _option$left = option.left,
                    left = _option$left === undefined ? 0 : _option$left;

                var width = void 0,
                    height = void 0,
                    offsetX = void 0,
                    offsetY = void 0;
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
                    offsetY = _this.height - (height + bottom);
                } else if (right !== 0 && top !== 0) {
                    offsetX = _this.width - (width + right);
                    offsetY = top;
                } else if (right !== 0 && bottom !== 0) {
                    offsetX = _this.width - (width + right);
                    offsetY = _this.height - (height + bottom);
                } else {
                    console.log('symbol position error: only adjacent sides position are accepted');
                }
                width = width || 0;
                height = height || 0;
                offsetX = offsetX || 0;
                offsetY = offsetY || 0;
                if (option.type == 'rect') {
                    if (option.backgroundColor) {
                        _this.ctx.fillStyle = option.backgroundColor || '#000';
                        _this.ctx.fillRect(offsetX + option.borderWidth, offsetY + option.borderWidth, width, height);
                    }
                    if (option.borderWidth) {
                        _this.ctx.beginPath();
                        _this.ctx.lineWidth = option.borderWidth;
                        _this.ctx.strokeStyle = option.borderColor || '#000';
                        _this.ctx.rect(offsetX + option.borderWidth, offsetY + option.borderWidth, width, height);
                        _this.ctx.stroke();
                    }
                } else {
                    _this.ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, offsetX, offsetY, width, height);
                }
            });
            try {
                output(_this.canvas.toDataURL('image/' + (sketch.imageType || 'jpeg')), _this.ctx, _this.canvas);
            } catch (error) {
                setTimeout(function () {
                    return _this.catch(error);
                }, 0);
            }
        });
    });
    return this;
};

return sketch;

})));
//# sourceMappingURL=sketch.js.map
