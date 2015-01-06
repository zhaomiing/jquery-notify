/*!
 * @desc jQuery 通知插件
 * @require jquery
 * @require jquery-overlay
 * @require jquery-notify.css
 * @author zhaoming.me#gmail.com
 * @date 2015-01-03
 */

'use strict';

define(['jquery', './test/jquery-overlay'], function ($) {
    var dataKey = 'jquery-notify___',
        defaults = {
            title : '',
            message : '这是测试内容，你不必在意',
            // 按钮和点击之后的回调
            buttons : [
            {
                text : '确定',
                callback : $.noop
            },
            {
                text : '取消',
                callback : $.noop
            }
            ],
            // 延时
            timer : 300,
            // 显示前回调
            onbeforeshow : $.noop,
            // 显示后回调
            onshow : $.noop,
            // 隐藏后回调
            onhide : $.noop
        },undefined;

    $.notify = function (settingORmethod) {
        var isRun = $.type(settingORmethod) === 'string',
            args = [].slice.call(arguments, 1),
            options = $.extend({}, defaults),
            $element = $('body'),
            instance;

        // 在notify对象上执行方法
        if(isRun && settingORmethod[0] !== '_'){
            instance = $element.data(dataKey);

            if(typeof instance === 'undefined') {
                $element.data(dataKey, instance = new Constructor(options)._init());
            }

            return Constructor.prototype[settingORmethod] ? Constructor.prototype[settingORmethod].apply(instance, args) : undefined;
        }
        // 传递配置对象初始化
        else{
            instance = $element.data(dataKey);

            options = $.extend({}, defaults, settingORmethod);
            if(!instance) {
                $element.data(dataKey, instance = new Constructor(options)._init());
            }
        }
    };

    $.notify.defaults = defaults;

    function Constructor (options) {
        this.options = options;
    }

    Constructor.prototype = {
        constructor : Constructor,
        _init : function () {
            // 分兩種情況初始化 $.notify('confirm') 和 $.notify('msg')
            var that = this,
                options = that.options,
                $confirmWrap = $('<div/>', {class : dataKey + 'confirm fn-hide'}).appendTo('body'),
                $content = $('<div/>', {class: dataKey + 'content', html : options.message}).appendTo($confirmWrap),
                $title;

            if(options.title !== ''){
                $title = $('<div/>', {class : dataKey + 'title', html : options.title}).prependTo($confirmWrap);
                $title.prepend('<span class="' + dataKey + 'close">×</span>');
                $('.' + dataKey + 'close', $confirmWrap).on('click', function () {
                    that.hide.call(that);
                });
            }

            $confirmWrap.append(that._createBtn());
            $confirmWrap.find('.u-btn').each(function (i) {
                $(this).on('click', function () {
                    options.buttons[i]['callback'].call(that);
                    that.hide();
                });
            });

            that.el = that.el || {};
            that.el.confirmEl = $confirmWrap;
            return this;
        },

        /**
         * 生成按钮
         * @return {string} DOM字符串
         * @version 1.0
         * 2015-01-03
         */
        _createBtn : function () {
            var that = this,
                options = that.options,
                btnArr = options.buttons,
                confirmFoot = '<div class="' + dataKey + 'foot">',
                btns = '';

            $.each(btnArr, function (i, obj) {
                btns =  btns + '<a href="javascript:void(0);" class="u-btn">' + obj['text'] + '</a>';
            });

            confirmFoot = confirmFoot + btns + '</div>';
            return confirmFoot;
        },

        /**
         * 显示confirm
         * @version 1.0
         * 2015-01-03
         */
        show : function () {
            var that = this,
                options = that.options,
                bgZindex;

            options.onbeforeshow.call(that);
            $.overlay({
                color : '#fff'
            });
            $.overlay('show');
            bgZindex = $.overlay('options', 'zIndex');
            that.position();
            that.el.confirmEl.css('z-index', bgZindex + 1).removeClass('fn-hide');
            options.onshow.call(that);
        },

        /**
         * 隐藏confirm
         * @version 1.0
         * 2015-01-03
         */
        hide : function () {
            var that = this,
                options = that.options;

            that.el.confirmEl.addClass('fn-hide');
            $.overlay('hide');
            options.onhide.call(that);
        },

        /**
         * 上层抽象方法 confirm
         * @param {string} 提示文案
         * @return {boolean}
         * @version 1.0
         * 2015-01-05
         */
        confirm : function (str) {
            var content = $('.' + dataKey + 'content', this.confirmEl);

            content.html(str);
            this.show();
        },

        /**
         * 定位
         * @version 1.0
         * 2015-01-05
         */
        position : function () {
            var that = this,
                options = that.options,
                W,H,w,h,x,y;

            w = that.el.confirmEl.outerWidth();
            h = that.el.confirmEl.outerHeight();
            W = $(window).width();
            H = $(window).height();

            x = (W - w) / 2;
            y = (H - h) / 3;
            if(y < 10){
                y = 10;
            }

            that.el.confirmEl.css({left : x,top : y});
        },

        /**
        * 销毁实例
        * @version 1.0
        * 2015-01-05
        */
        destroy : function () {
            var that = this,
                els = that.el,
                i;

            for(i in els){
                if(els.hasOwnProperty(i)) {
                    els[i].remove();
                }
            }

            $('body').removeData(dataKey);
            $.overlay('destroy');
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
