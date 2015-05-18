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
        $(this).siblings().each(function() {
            $(this).find('img').attr('src', $(this).find('img').data('origin-src'));
        });
        $('.country-container').eq(parseInt(index)).show().siblings().hide();
    }).eq(0).trigger('click');

    //根据搜索条件，高亮当前选项
    /*
    function getValueByKey(key) {
        var searchStr = location.search;
        if (searchStr === '') {
            return '';
        }
        searchStr = searchStr.substring(1).split('&');
        console.log(searchStr)
        for (var i = 0; i < searchStr.length; i++) {
            var kv = searchStr[i].split('=');
            if (key === kv[0] && kv[1]) {
                return kv[1];
            }
        }
        return '';
    }
    */
    /*高亮功能*/
    /*function highLight(type) {
        var str = getValueByKey(type);
        if (str) {
            $('.' + type + '-option a').each(function() {
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
    highLight('price');*/

    var loc = window.location.search,
        arrLoc,
        searchHtml = '';
    if (loc !== '') {
        arrLoc = loc.substring(1).split('&');
        $('.search-active').addClass('search-active-show');
        for (var i = 0; i < arrLoc.length; i++) {
            var currSearch = arrLoc[i].split('='),
                text;
            if (currSearch.length !== 2) {
                break;
            }
            text = decodeURIComponent(currSearch[1]);
            searchHtml += '<div class="s-option"><span><em>X</em><i>' + text + '</i></span></div>';
        }
        $('.s-option-t').after(searchHtml);
    }
    //删除搜索条件
    function deleteByText(sText) {
        for (var i = 0; i < arrLoc.length; i++) {
            var currSearch = arrLoc[i].split('='),
                text;
            if (currSearch.length !== 2) {
                break;
            }
            text = decodeURIComponent(currSearch[1]);
            if (sText === text) {
                arrLoc.splice(i, 1);
            }
        }
        location.search = arrLoc.join('&');
    }
    $('.s-option span em').on('click', function () {
        deleteByText($(this).next('i').text());
    });
    /*地图---》已迁移至页面中
    function initialize() {
        var obj = $("#map-info");
        var point = new google.maps.LatLng(51.3279330000,-0.2987030000);// location, （纬度, 经度）
        var option = {
            zoom: 12,
            center: point,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map($("#map-info")[0], option);
    }
    $("#map-info").length && initialize();*/
    //目标国推荐小图切换
    $('.tz-left ul li a').attr('href', 'javascript:void(0);');
    $('.tz-left ul li').on('click', function() {
        $('.tz-left .tz-left-img img').attr('src', $(this).find('img').attr('src'));
        return false;
    });
});