function PageSet(options){
    var self = this,
        option = $.extend({
            wrap : $(".wrap"),
            moduleSort : {
                bindDrag : false,
                bindToggle : false
            },
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

    self.option = option;
    self.doms = {
        wrap : $wrap,
        form : $form,
        dragWrap : $dragWrap
    };

    $form.submit(function(){
        var _$form = $(this);
        self.parseSort();
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

    if ( option.moduleSort ) {
        self.bindSort();
    }
}
// bind sort methods
PageSet.prototype.bindSort = function(){
    var self = this,
        oSort = self.option.moduleSort,
        bindDrag = oSort.bindDrag,
        bindSort = oSort.bindSort,
        $dragWrap = self.doms.dragWrap;
    if ( bindDrag ) {
        $dragWrap.on("mousedown", function(event){
            event.preventDefault();
            var $event = $(event.target);
            if ( $event.hasClass("Js-hold-box") ) {
                var $drag = $event,
                    $list = $drag.parent(),
                    pos = $drag.position(),
                    mdt = event.pageY,
                    mmt, omt,
                    $clone = $drag.clone().addClass("sort-drag-box").removeClass("Js-hold-box"),
                    $hold = $('<li class="sort-hold-box"></li>'),
                    indexDrag = $drag.index(),
                    nChildLength = $list.children().length,
                    height = $list.children().outerHeight(true) * (nChildLength),
                    isLast = false,
                    nHold;
                $list.append($clone);
                $drag.addClass("sort-choose-box");
                $clone.css({
                    top : pos.top
                });
                $(document).on("mousemove", function(e){
                    e.preventDefault();
                    mmt = e.pageY;
                    omt = pos.top + mmt - mdt;
                    omt = omt < 0 ? 0 : ( omt > height ? height : omt );
                    nHold = Math.floor( omt / 27 );
                    nHold = nHold < 0 ? 0 : nHold;
                    
                    if ( nHold != $hold.index() ) {
                        if( nHold == nChildLength ){
                            !isLast && $list.append($hold);
                            isLast = true;
                        }else{
                            $hold.insertBefore( $list.children(".Js-hold-box").eq(nHold) );
                            isLast = false;
                        }  
                    }
                    $clone.css({
                        top : omt + "px"
                    });
                }).on("mouseup", function(){
                    $clone.remove();
                    $drag.removeClass("sort-choose-box").insertAfter($hold);
                    $dragWrap.find(".sort-hold-box").remove();
                    $(document).off("mousemove mouseup");
                });
            }else{
                return false;
            }
        });
    }
    
    if ( bindSort ) {
        $dragWrap.on("click", ".switch", function(event){
            event.preventDefault();
            var $toggle = $(this),
                $sortItem = $toggle.closest(".Js-hold-box");
            if ( $toggle.hasClass("off") ) {
                $toggle.removeClass("off");
                $sortItem.data("toggle", true);
            } else{
                $toggle.addClass("off");
                $sortItem.data("toggle", false);
            }
        });
    }
}
// do parse sort data before submit form
PageSet.prototype.parseSort = function(){
    var self = this,
        hasSort = self.option.moduleSort,
        $dragWrap = self.doms.dragWrap,
        $form = self.doms.form,
        $hidden = $form.find(".Js-sort-hidden"),
        str = "";
    if( !!hasSort ) {
        if ( !$hidden.length ) {
            $form.append('<input type="hidden" name="sort" class="Js-sort-hidden" />');
            $hidden = $form.find(".Js-sort-hidden");
        }
        // create sort post data
        // item once loop : id + #=# + toggleValue
        // =#=
        $dragWrap.find(".sort-box").each(function(){
            var $item = $(this),
                id = $item.data("id"),
                isOpen = $item.data("toggle");
            str += id + "#=#" + isOpen + "=#=";
        });
        str = str.replace(/\=\#\=$/, "");
        $hidden.val(str);
    }
}


















