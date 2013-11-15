$(document).ready(function() {
    $('.two-column').find('.setting').each(function () {
        $(this).click(function () {
            if ($(this).parents('.right-column').siblings('.left-column').is(':visible')) {
                $(this).parents('.right-column').siblings('.left-column').hide();
                $(this).parents('.right-column').siblings('.setting-column').show();
            } else {
                $(this).parents('.right-column').siblings('.left-column').show();
                $(this).parents('.right-column').siblings('.setting-column').hide();
            }
        });
        $('.turn-back').click(function () {
            $(this).parents('.setting-column').hide().siblings('.left-column').show();
        });
    });

    $(window).resize(function () {
        $('.cms-layout').height($(window).height() - 100);
        $('.cms-layout').width($(window).width() - 650);
        $('.cms-page-name').width($('.cms-layout').width());
        $('.cms-option').height($(window).height() - 60);
    });
    $(window).resize();

    $('.group-title').click(function () {
        $('.opt-content-wrap').slideUp();
        if ($(this).siblings('.opt-content-wrap').is(':hidden')) {
            $(this).siblings('.opt-content-wrap').slideDown();
        }
    });
    $('.opt-group:not(":first")').find('.opt-content-wrap').hide();
});
