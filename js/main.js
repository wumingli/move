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

    /*var loc = window.location.search,
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
            searchHtml += '<div class="s-option"><span><a href=""><em>X</em></a><i>' + text + '</i></span></div>';
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
    });*/
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

    //调查Ajax
    $('.move-survey').on('submit', function() {
        /*if ($.trim($('[name="contact"]').val()) === '') {
            alert('请输入您的联系方式');
            $('[name="contact"]').focus();
            return false;
        }*/
        if ($.trim($('[name="user_name"]').val()) === '') {
            alert('请输入您的姓名');
            $('[name="user_name"]').focus();
            return false;
        }
        if ($.trim($('[name="user_email"]').val()) === '') {
            alert('请输入您的邮箱');
            $('[name="user_email"]').focus();
            return false;
        } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($('[name="user_email"]').val())) {
            alert('邮箱格式不正确');
            $('[name="user_email"]').select();
            return false;
        }
        $.ajax({
            url: 'index.php?m=Survey&a=setInfo', //这里改成调查的URL
            data: $('.move-survey').serialize(),
            dataType: 'json',
            success: function(data) {
                if (data.status == 1) {
                    alert('问卷提交成功，感谢您的参与');
                } else {
                    alert('问卷提交失败');
                }
                
            }
        });
        return false;
    });
    //快速咨询您感兴趣的房源
    $('.consult-form').on('submit', function() {
        if ($.trim($('[name="user_name"]').val()) === '') {
            alert('请输入您的姓名');
            $('[name="user_name"]').focus();
            return false;
        }
        if ($.trim($('[name="user_phone"]').val()) === '') {
            alert('请输入手机号码');
            $('[name="user_phone"]').focus();
            return false;
        } else if (!/^1[34578]\d{9}$/.test($('[name="user_phone"]').val())) {
            alert('手机号码格式不正确');
            $('[name="user_phone"]').select();
            return false;
        }
        if ($.trim($('[name="user_email"]').val()) === '') {
            alert('请输入您的邮箱');
            $('[name="user_email"]').focus();
            return false;
        } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($('[name="user_email"]').val())) {
            alert('邮箱格式不正确');
            $('[name="user_email"]').select();
            return false;
        }
        $.ajax({
            url: 'index.php?m=Survey&a=setMessage', //这里改成调查的URL
            data: $('.consult-form').serialize(),
            dataType: 'json',
            success: function(data) {
                if (data.status == 1) {
                    alert('咨询提交成功');
                } else {
                    alert('咨询提交失败');
                }
            }
        });
        return false;
    });
    //投资列表中更多条件下拉选择移到这里
    if ($.fn.Checkable) {
        $('input.fd-radio').Checkable({
            color: 'blue'
        });
        $(".fd-select1").selectbox();
        $(".fd-select2").selectbox({
            containerClass:"h_selectbox-wrapper",
            hoverClass:"h_current",
            selectedClass:"h_selected",
            inputClass:"h_selectbox",
            change: function(){
                location.href = $(".fd-select2").val();
            }
        });
        $(".fd-select3").selectbox({
            containerClass:"h_selectbox-wrapper",
            hoverClass:"h_current",
            selectedClass:"h_selected",
            inputClass:"h_selectbox",
            //bindDiv:["select_tab1","select_tab2","select_tab3"],
            change: function(){
                location.href = $(".fd-select3").val();
            }
        });
    }
});