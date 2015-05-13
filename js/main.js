/**
 *
 * @authors Wumingli
 * @date    2015-04-15 21:22:34
 * @version $Id$
 */
$(function () {
    if ($('.ck-slide').length !== 0) {
        $('.ck-slide').ckSlide({
            autoPlay: true
        });
    }
    //导航
    $('.hasSubNav').hover(function () {
        $(this).find('.subnav').show();
    }, function () {
        $(this).find('.subnav').hide();
    });
    //目标国推荐
    $('.country li').click(function () {
        var $img = $(this).find('img'),
            index = $img.data('index');
        $img.attr('src', $(this).find('img').data('hover-src'));
        $(this).siblings().each(function () {
            $(this).find('img').attr('src', $(this).find('img').data('origin-src'));
        });
        $('.country-container').eq(parseInt(index)).show().siblings().hide();
    }).eq(0).trigger('click');

    //根据搜索条件，高亮当前选项
    function getValueByKey(key) {
            var searchStr = location.search;
            if (searchStr === '') {
                return '';
            }
            console.log(searchStr)
            searchStr = searchStr.substring(1).split('&');
            for (var i = 0; i < searchStr.length; i++) {
                var kv = searchStr[i].split('=');
                if (key === kv[0] && kv[1]) {
                    return kv[1];
                }
            }
            return '';
        }
    /*高亮功能*/
    function highLight(type) {
        var str = getValueByKey(type);
        if (str) {
            $('.' + type + '-option a').each(function () {
                if ($(this).text() === decodeURIComponent(str)) {
                    $(this).addClass('active');
                    return;
                }
            });
        } else {
            $('.' + type + '-option a:eq(0)').addClass('active');
        }
    }
    highLight('city');
    highLight('property');
    highLight('price');
});