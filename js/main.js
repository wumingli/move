/**
 *
 * @authors Wumingli
 * @date    2015-04-15 21:22:34
 * @version $Id$
 */
$(function() {
    if ($('.ck-slide').length !== 0) {
        $('.ck-slide').ckSlide({
            autoPlay: true
        });
    }
    //导航
    $('.hasSubNav').hover(function() {
        $(this).find('.subnav').show();
    }, function() {
        $(this).find('.subnav').hide();
    });
    //目标国推荐
    $('.country li').click(function() {
        var $img = $(this).find('img'),
            index = $img.data('index');
            $img.attr('src', $(this).find('img').data('hover-src'));
        $(this).siblings().each(function () {
            $(this).find('img').attr('src', $(this).find('img').data('origin-src'));
        });
        $('.country-container').eq(parseInt(index)).show().siblings().hide();
    }).eq(0).trigger('click');
});