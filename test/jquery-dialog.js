/*!
 * @desc jquery 对话框插件
 * @require jquery-overlay
 * @require jquery-dialog.css
 * @author zhaoming.me#gmail.com
 * @date 2014-12-23
 */

'use strict';


define(['jquery', 'jquery-overlay'], function ($) {

    var datakey = 'jquery-dialog-',
        defaults = {
            // 标题
            title : '标题',
            // 显示前回调
            onbeforeopen : $.noop,
            // 显示后回调
            onopen : $.noop,
            // 关闭后回调
            onclose : $.noop,
            // 沉浸模式
            isImmerseMode : false,
            // 延时
            time : 200,
            // 需要关闭吗
            isNeedClose : true,
            // 触发元素类名
            openClass : 'J-dialog-open',
            closeClass : 'J-dialog-close'
        },
        dialogId = 0,
        // 显示状态的个数
        dialogShowCount = 0,
        undefined;

    $.fn.dialog = function (settingORmethod) {
        // 第一个参数为字符串，则执行相应的方法名
        var isRun = $.type(settingORmethod) === 'string',
            // 获取其他参数
            args = Array.prototype.slice.call(arguments, 1),
            // 覆盖默认设置
            options = $.extend({}, defaults),
            // dialog的dom元素
            $element,
            // dialog的一个实例
            instance;

        // 下划线开始的方法名都是私有方法，不向外暴露
        if(isRun && settingORmethod[0] !== '_'){
            if(!this.length) return;

            // 取dialog集合中的第一元素
            $element = $(this[0]);
            
            // 1. 取的保存在元素data中的dialog实例
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

        // 所有dialog元素的初始化
        return this.each(function () {
            var element = this,
                instance = $(this).data(datakey);

            // 如果instance不存在，说明是尚未初始化，则初始化对象保存instance到$element
            if(!instance) $(this).data(datakey, instance = new Constructor($(this)[0], options)._init());
        });
    };

    // 暴露插件的默认配置
    $.fn.dialog.defaults = defaults;

    function Constructor (element, options) {
        // 此处的this是dialog的instance对象，而非dialog元素
        var that = this;
        // 参数保存到对象中，方便原型方法access
        that.element = $(element);
        that.options = options;
    }

    Constructor.prototype = {
        constructor : Constructor,
        _init : function () {
            var that = this,
            title = $('<div/>', {class : datakey + 'title', html : that.options.title}),
            content = $('<div class="' + datakey + 'content"></div>').append(that.element);
            
            title.prepend('<span class="' + datakey + 'close">×</span>');
            that.container = $('<div/>', {class : datakey + 'container fn-hide ' + datakey + 'container' + dialogId++}).appendTo('body');
            that.container.append(title);
            that.container.append(content);

            $('.' + datakey + 'close', that.container).add('.' + that.options.closeClass).on('click' ,function (e) {
                e.preventDefault();
                that.close();
            });

            $('.' + that.options.openClass).on('click', function (e) {
                e.preventDefault();

                that.open();
            });
            return this;
        },

        open : function (callback) {
            var that = this,
                winHeight = $(window).height(),
                winWidth = $(window).width(),
                $element = that.element,
                options = that.options,
                container = that.container,
                height, width, top, left, bgIndex;

            options.onbeforeopen.call(that);
            dialogShowCount++;
            $.overlay({
                color : '#fff'
            });
            $.overlay('show');
            bgIndex = $.overlay('options', 'zIndex');
            container.removeClass('fn-hide');

            height = $element.outerHeight();
            width = $element.outerWidth();
            top = (winHeight - height) / 3;
            left = (winWidth - width) / 2;

            if(top < 10) top = 10;

            container.css({
                'z-index' : bgIndex + 1,
                top : -height,
                left : left
            }).animate({
                top : top
            }, options.time, function () {
                options.onopen.call(that);

                if(callback) callback();
            });
        },

        close : function (callback) {
            var that = this,
                options = that.options,
                $element = that.element,
                container = that.container,
                height = $element.outerHeight();

            container.animate({
                top : -height
            }, options.time, function () {
                container.addClass('fn-hide');
                $.overlay('hide');
                dialogShowCount--;

                options.onclose.call(that);

                if(callback) callback();
            });
        },

        /**
         * 重新定位
         * @param {optional} callback
         * @return this
         * @version 1.0
         * 2014-12-24
         */
        position : function (callback) {
            var that = this,
                winHeight = $(window).height(),
                $element = that.element,
                options = that.options,
                height = $element.outerHeight(),
                top = (winHeight - height) / 3;

            if(top < 10) top = 10;

            $element.animate({
                top : top
            }, options.time, function () {
                if(callback) callback();
            });
        },

        options : function (key, val) {
            // get
            if(arguments.length === 1 && $.type(key) === 'string'){
                return this.options[key];
            }
            // set
            else{
                var map = {};
                if($.type(key) === 'object') map = key;
                else map[key] = val;

                this.options = $.extend(this.options, map);

                return this;
            }
        }
    };

});