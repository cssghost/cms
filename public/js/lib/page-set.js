function PageSet(options){
    var self = this,
        option = $.extend({
            wrap : $(".wrap"),
            dragWrap : ".Js-drag-wrap",
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
        $hidden = $form.find("[name=actionType]"),
        $dragWrap = $wrap.find(option.dragWrap);

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

    if ( $dragWrap.length ) {
        $dragWrap.on("mousedown", ".sort-box", function(event){
            event.preventDefault();
            var $drag = $(this),
                $list = $drag.parent(),
                pos = $drag.position(),
                mdl = event.pageX,
                mdt = event.pageY,
                mml,mmt,oml,omt,
                $clone = $drag.clone(),
                $hold = $('<li class="sort-hold-box"></li>'),
                indexDrag = $drag.index(),
                nChildLength = $list.children().length - 1,
                height = $dragWrap.height() - 22,
                nHold, eqHold;
                console.log($clone);
            $clone.insertBefore($drag);
            $drag.addClass("sort-drag-box").removeClass("Js-hold-box").css({
                left : pos.left,
                top : pos.top
            });
            $(document).on("mousemove", function(e){
                e.preventDefault();
                mml = e.pageX;
                mmt = e.pageY;
                oml = pos.left + mml - mdl;
                omt = pos.top + mmt - mdt;
                nHold = Math.floor(omt/27);
                nHold = nHold < 0 ? 0 : ( nHold > nChildLength ? nChildLength : nHold );
                // omt = omt < 0 ? 0 : ( omt > height ? height : omt );
                // nHold = Math.floor( (omt < 0 ? 0 : omt)/27 );
                console.log(nHold, $hold.index());
                if( nHold >= nChildLength ){
                    $list.append($hold);
                // }else if ( nHold == indexDrag ){
                //     $hold.insertAfter( $list.children(".Js-hold-box").first() );
                }else{
                    $hold.insertAfter( $list.children(".Js-hold-box").eq(nHold) );
                }
                // if ( nHold != ($hold.index() + 1) ) {
                //     if ( nHold == 0 ) {
                //         $list.prepend($hold);
                //     }else if (nHold == nChildLength){
                //         $list.append($hold);
                //     }else{
                //         $hold.insertAfter( $list.children(".sort-box").eq(nHold) );
                //     }
                // }
                $drag.css({
                    left : oml + "px",
                    top : omt + "px"
                });
            }).on("mouseup", function(){
                $clone.remove();
                $drag.removeAttr("style").removeClass("sort-drag-box").addClass("Js-hold-box").insertAfter($hold);
                $dragWrap.find(".sort-hold-box").remove();
                $(document).off("mousemove mouseup");
            });
        });
    }

}