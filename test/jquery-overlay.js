/*!
 * @desc 全局遮罩 jQuery 插件，一般用作其他组件的依赖
 * @require jquery
 * @author zhaoming.me#gmail.com
 * @date 2014-12-17
 */

'use strict';

define(['jquery'], function ($, udf) {

    var undefined = udf,
        datakey = '___overlay___',
        defaults = {
            color : 'transparent',
            opacity : 0.2,
            zIndex : 99999,
            onshow : $.noop,
            onhide : $.noop
        };

    $.overlay = function (settingORmothod) {
        var isRun = $.type(settingORmothod) === 'string',
            args = Array.prototype.slice.call(arguments, 1),
            options = $.extend({}, defaults),
            $element = $('body'),
            instance;

        if(isRun && settingORmothod[0] !== '_'){
            instance = $element.data(datakey);

            if(!instance) $element.data(datakey, new Constructor(options)._init());

            return Constructor.prototype[settingORmothod] ? Constructor.prototype[settingORmothod].apply(instance, args) : undefined;
        }
        else{
            options = $.extend(options, settingORmothod);
            $element.data(datakey, new Constructor(options)._init());
        }
    };

    $.overlay.defaults = defaults;

    function Constructor(options) {
        var that = this;

        that.options = options;
    }

    Constructor.prototype = {
        constructor : Constructor,
        _init : function () {
            this.el = $('.' + datakey + 'bg').length
                ? $('.' + datakey + 'bg')
                : $('<div/>', {class : datakey + 'bg', style : 'display:none;'});

            $('body').append(this.el);
            // this.show();

            return this;
        },

        show : function () {
            var color = this.options.color,
                opacity = this.options.opacity,
                zIndex = this.options.zIndex;

            this.el.attr('style', 'position:fixed;top:0;bottom:0;left:0;right:0;background-color:' + color + ';opacity:' + opacity + ';z-index:' + zIndex + ';display:block;');
            this.options.onshow.call(this);
        },

        hide : function () {
            this.el.hide();
            this.options.onhide.call(this);
        },

        destroy : function () {
            this.el.remove();
            $('body').removeData(datakey);
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
            if($.type(key) === 'string' && arguments.length === 1){
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
