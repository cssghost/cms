function PageSet(options){
    var self = this,
        option = $.extend({
            wrap : $(".wrap"),
            preview : ".preview",
            reset : ".reset",
            set : ".apply",
            form : ".form",
            formAction : "/",
            doPreview : null,
            doReset : null,
            doApply : null
        }, options),
        $wrap = option.wrap,
        $preview = $wrap.find(option.preview),
        $reset = $wrap.find(option.reset),
        $set = $wrap.find(option.set),
        $form = $wrap.find(option.form),
        $hidden = $form.find("[name=actionType]");

    $form.submit(function(){
        var _$form = $(this);
        _$form.ajaxSubmit({
            success: function (result) {
                if(result == "success"){
                    var _src = $("iframe").attr("src");
                    $("iframe").attr("src", _src);
                }
                switch($hidden.val()){
                    case "preview":
                        if( typeof option.doPreview ){
                            option.doPreview(result);
                        }
                    break;
                    case "default":
                    break;
                    case "publish":
                        if( typeof option.doApply ){
                            option.doApply(result);
                        }
                    break;
                    default:
                        alert("未知操作");
                    break;
                }
            },
            error: function (msg) {
                alert("文件上传失败");    
            }
        });
        return false;
    });

    $wrap.on("click", ".preview", function(){
        $hidden.val("preview");
        $form.submit();
    }).on("click", option.reset, function(){
        $hidden.val("default");
        $.ajax({
            url : option.formAction,
            data : {actionType : "default"},
            type : "post",
            dataType : "text",
            beforeSend : function(result){
                if( typeof option.doReset ){
                    option.doReset(result);
                }
            },
            success : function(result){
                if(result == "success"){
                    var _src = $("iframe").attr("src");
                    $("iframe").attr("src", _src);
                }
            }
        });
    }).on("click", option.set, function(){
        $hidden.val("publish");
        $form.submit();
    });
}