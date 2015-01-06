require(['./jquery-dialog', './jquery-poptip', '../jquery-notify'], function () {
    var p4 = '<p class="p4" style="width:500px">\
            我又想到了他<br/>\
            他也像我一样轻轻的吻过你的眉尖吗<br/>\
            他那时很幸福的<br/>\
            就像那时的你一样<br/>\
            外面有人来了<br/>\
            听到了吗他给你送衣服来了<br/>\
            那是你路上要穿的<br/>\
            想到即在的离别<br/>\
            心中好压抑<br/>\
            就像他曾经不舍得松开你的拳头一样吧<br/>\
            看着他们和你渐行渐远<br/>\
            我知道这只是暂别<br/>\
            现在我是那么的恨自己<br/>\
            一个不愿旁观的入殓师<br/>\
            <button type="button" class="btn btn-default J-dialog-close">确定</button>\
            <button type="button" class="btn btn-default J-dialog-close">取消</button>\
            </p>';

    $(p4).dialog({
        onopen : function () {
            $('.J-dialog-open').text('打开啦 : )')
        }
        ,
        onclose : function () {
            $('.J-dialog-open').text('关闭啦 : (')
        }
    });

    $('<div/>').poptip({
        target : $('.J-dialog-open'),
        content : '点我点我点我点我'
    });


    $.notify();
});