$(document).ready(function() {

    $('.picker-chat-box-bc').farbtastic('.palette-chat-box-bc');
    $('.picker-chat-box-bc').hide();
    $('.palette-chat-box-bc').focus(function () {
        $('.picker-chat-box-bc').show();
    }).blur(function () {
        $('.picker-chat-box-bc').hide();
    });

    // chat set
    new PageSet({
        wrap : $(".Js-chat-wrap"),
        formAction : "/robot/chat/",
        doPreview : function(){

        },
        doReset : function(){
            var $wrap = $(".Js-chat-wrap"),
                $isColor = $wrap.find("[name=isColor]"),
                $color = $wrap.find("[name=color]"),
                $isImage = $wrap.find("[name=isImage]"),
                $isRepeat = $wrap.find("[name=isRepeat]"),
                $image = $wrap.find("[name=image]");
            $isColor.prop("checked", true);
            $color.val("#fff");
            $isImage.prop("checked", false);
            $isRepeat.prop("checked", false);
            $image.val("");
        },
        doApply : function(){

        }
    });
    
});

