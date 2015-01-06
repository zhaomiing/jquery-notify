/*!
 * @desc poptip操作提示框
 * @author zhaoming.me#gmail.com
 * @require jquery
 * @date 2014-12-10
 */

'use strict';

define(['jquery'], function ($) {

    var datakey = 'jquery-poptip',
        defaults = {
            content : 'hello world',
            // 与目标元素的相对位置r|l|t|b
            position : 'right',
            // 依附于某个元素
            target : $('body'),
            // 延时出现
            wait : 300,
            // 显示后 callback
            onshow : $.noop,
            // 隐藏后 callback
            onhide : $.noop
        };

    $.fn.poptip = function (settingORmethod) {
        // 第一个参数为字符串，则执行相应的方法名
        var isRun = $.type(settingORmethod) === 'string',
            // 获取其他参数
            args = Array.prototype.slice.call(arguments, 1),
            // 覆盖默认设置
            options = $.extend({}, defaults),
            // poptip的dom元素
            $element,
            // poptip的一个实例
            instance;

        // 下划线开始的方法名都是私有方法，不向外暴露
        if(isRun && settingORmethod[0] !== '_'){
            if(!this.length) return;

            // 取poptip集合中的第一元素
            $element = $(this[0]);
            
            // 1. 取的保存在元素data中的poptip实例
            instance = $element.data(datakey);

            // 2. 如果instance不存在，说明是尚未初始化，则初始化对象保存instance到$element
            if(!instance) $element.data(datakey, instance = new Constructor($element[0], options)._init());

            // 3. 如果[settingORmethod]方法存在，则在该对象实例上执行
            return Constructor.prototype[settingORmethod] ? Constructor.prototype[settingORmethod].apply(instance, args) : undefined;
        }
        // 参数为配置对象
        else{
            options = $.extend(options, settingORmethod);
        }

        // 所有poptip元素的初始化
        return this.each(function () {
            var element = this,
                instance = $(this).data(datakey);

            // 如果instance不存在，说明是尚未初始化，则初始化对象保存instance到$element
            if(!instance) $(this).data(datakey, instance = new Constructor($(this)[0], options)._init());
        });
    };

    // 暴露插件的默认配置
    $.fn.poptip.defaults = defaults;

    function Constructor (element, options) {
        // 此处的this是poptip的instance对象，而非poptip元素
        var that = this;
        // 参数保存到对象中，方便原型方法access
        that.element = $(element);
        that.options = options;
    }

    // 原型
    Constructor.prototype = {
        // constructor重新指会本体
        constructor : Constructor,
        /**
         * 初始化
         * @param 
         * @return this
         * @version 1.0
         * 2014-12-10
         */
         _init : function () {
            var that = this,
                options = this.options,
                $element = this.element;

            $element.html(options.content);

            options.target
            .on('mouseenter', function (e) {
                e.preventDefault();
                that.show();
            })
            .on('mouseleave', function (e) {
                e.preventDefault();
                that.hide();
            });

            return this;
         },
         show : function () {
            var that = this;

            this._wait = setTimeout(function () {
                // poptip 元素插入/移动到body
                that.element.appendTo('body');
                that._createArrow();

                that.element.attr('style', 'position: absolute; padding: 10px; background: #fff; border: 1px solid #666666; border-radius: 3px; z-index: 999; box-shadow: 3px 3px 6px #ddd;');
                that._setPosition();
                that.options.onshow.call(that);
            }, that.options.wait);
         },
         hide : function () {
            clearTimeout(this._wait);
            delete this._wait;

            this.element.hide();
            this.options.onhide.call(this);
         },


         /**
         * 计算poptip出现的位置
         * @param 
         * @return 
         * @version 1.0
         * 2014-12-10
         */
         _setPosition : function () {
            var $target = this.options.target,
                w = $target.outerWidth(),
                h = $target.outerHeight(),
                x = $target.offset().left,
                y = $target.offset().top;

            var $element = this.element,
                W = $element.outerWidth(),
                H = $element.outerHeight(),
                X,Y;

            switch(this.options.position) {
                case 'right':
                    X = x + w + 10;
                    Y = y - (H - h) / 2;
                break;
                case 'left': 
                    X = x - W - 10;
                    Y = y - (H - h) / 2;
                break;
                case 'top':
                    X = x - (W - w) / 2;
                    Y = y - H - 10;
                break;
                case 'bottom':
                    X = x - (W - w) / 2;
                    Y = y + h + 10;
                break;
            }

            $element.attr('style', $element.attr('style') + 'left:' + X + 'px;top:' + Y + 'px;');
         },
         /**
         * 生成小箭头
         * @param 
         * @return 
         * @version 1.0
         * 2014-12-10
         */
         _createArrow : function () {

            var $arrow = !!$('.' + datakey + '-arrow', this.element).length
                ? $('.' + datakey + '-arrow', this.element)
                : $('<i class="' + datakey + '-arrow"></i>').appendTo(this.element);

            var cssTxt = 'display: inline-block; border: 5px solid transparent; border-'
                + this.options.position + ': 5px solid #666666; position: absolute; ' 
                + this._createArrowPosition();

            $arrow.attr('style', cssTxt);
         },
         /**
         * 根据postion的参数不同设置不同的arrow位置
         * @param
         * @return {string} css文本片段
         * @version 1.0
         * 2014-12-10
         */
         _createArrowPosition : function () {
            var cssTxt = '';

            switch(this.options.position) {
                case 'right':
                    cssTxt = 'top:50%; left: -10px; margin-top: -3px; ';
                break;
                case 'left': 
                    cssTxt = 'top:50%; right: -10px; margin-top: -3px; ';
                break;
                case 'top':
                    cssTxt = 'left:50%; bottom: -10px; margin-left: -3px; ';
                break;
                case 'bottom':
                    cssTxt = 'left:50%; top: -10px; margin-left: -3px; ';
                break;
            }

            return cssTxt;
         },
         /**
         * 设置或者获取配置项
         * @param {string/object} key 或者 配置对象
         * @param {*} val
         * @return 获取时返回获取结果否则返回 this
         * @version 1.0
         * 2014-12-10
         */
         options : function (key, val) {
            // get
            if($.type(key) === 'string' && arguments.length === 1) return this.options[key];

            // set
            var map = {};
            if($.type(key) === 'object') map = key;
            else map[key] = val;

            this.options = $.extend(this.options, map);

            return this;
         }
    };

});

