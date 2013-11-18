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


    // info set
    new PageSet({
        wrap : $(".Js-info-wrap"),
        formAction : "/robot/info/",
        doPreview : function(){

        },
        doReset : function(){
            // var $wrap = $(".Js-chat-wrap"),
            //     $isColor = $wrap.find("[name=isColor]"),
            //     $color = $wrap.find("[name=color]"),
            //     $isImage = $wrap.find("[name=isImage]"),
            //     $isRepeat = $wrap.find("[name=isRepeat]"),
            //     $image = $wrap.find("[name=image]");
            // $isColor.prop("checked", true);
            // $color.val("#fff");
            // $isImage.prop("checked", false);
            // $isRepeat.prop("checked", false);
            // $image.val("");
        },
        doApply : function(){

        }
    });

    // operation set
    new PageSet({
        wrap : $(".Js-operation-wrap"),
        drapWrap : ".Js-drag-wrap",
        formAction : "/robot/info/",
        doPreview : function(){

        },
        doReset : function(){
            // var $wrap = $(".Js-chat-wrap"),
            //     $isColor = $wrap.find("[name=isColor]"),
            //     $color = $wrap.find("[name=color]"),
            //     $isImage = $wrap.find("[name=isImage]"),
            //     $isRepeat = $wrap.find("[name=isRepeat]"),
            //     $image = $wrap.find("[name=image]");
            // $isColor.prop("checked", true);
            // $color.val("#fff");
            // $isImage.prop("checked", false);
            // $isRepeat.prop("checked", false);
            // $image.val("");
        },
        doApply : function(){

        }
    });

    var _imgFlag = false;
    // image crop
    $("#formInfo").on("change", "input:file:last", function(event){
        console.log(event);
        if (typeof FileReader !== "undefined"){
            var _file = event.target.files[0];

            var reader = new FileReader();

            reader.onload = (function(file){
                return function(e){
                    // console.log(e);
                    $(".Js-photo-preview").attr("src", e.target.result);
                };
            })(_file);

            reader.readAsDataURL(_file); // important must be have
        }else{
            $(".Js-photo-preview").attr("src", $(this).val());
        }
        _imgFlag = true;
    });

    $(".Js-photo-preview").load(function(){
        if (_imgFlag) {
            var _$img = $(this),
                _width = _$img.width(),
                _height = _$img.height(),
                _maxSize = Math.max( _width, _height ),
                _minSize = Math.min( _width, _height ),
                _bigType = _width >= _height ? "width" : "height";
            if ( _minSize > 325 ) {
                _$img.css(_bigType, 325);
            }
            // console.log(_middleImgSize);
            // console.log(_$img.width());
            // console.log(_$img.height());
            // $(".cite").show().css({
            //     left : 0,
            //     top : 0,
            //     width : 100,
            //     height : 100
            // });
        }
        // $(".cite").show();
    });
    
});

