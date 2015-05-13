$(function () {
    var lbToPos = 0; // 当前第几个顶在最前面
    var currentPosi = 0;
    var anchorPosi = 0;
    var lbTotalNum = $("#imageShowSmall li").length;
    var anchorNum = 4;
    $("#imageShowBig li")[0].style.display = "block";

    function SmallImgSliderTo(ind) {
        // 判断imageShowSmall的第几个顶到第一个的位置上
        ind = (ind < 0) ? 0 : ind;
        ind = (ind > lbTotalNum - 1) ? (lbTotalNum - 1) : ind;
        if (ind >= lbToPos && ind < lbToPos + anchorNum) { // 当前显示范围内挪动，则不动
            toPos = lbToPos;
        } else if (ind < lbToPos) {
            toPos = ind;
        } else {
            var maxInd = lbTotalNum - anchorNum;
            if (ind > maxInd) {
                toPos = maxInd;
            } else {
                toPos = ind;
            }
        }
        if (ind !== currentPosi) {
            setLbBigImgShow(ind);
        }
        currentPosi = ind;
        lbToPos = toPos;
        SmallImgSliderMoveto(toPos);
        $("#imageShow ul.imagepoint a").each(function (ind1, Ele1) {
            if (ind == ind1) {
                $(this).addClass("hover");
            } else {
                $(this).removeClass("hover");
            }
        });
    }

    function setLbBigImgShow(ind) {
        $("#imageShowBig li").each(function (index, ele) {
            if (ind == index) {
                $(this).show().css("display", "block");
            } else {
                $(this).hide();
            }
        });
    }

    function SmallImgSliderMoveto(pos) {
        var wid = parseInt($("#imageShowSmall li").css("width").replace("px", "")) + parseInt($("#imageShowSmall li").css("margin-right").replace("px", ""));
        var toleft = 0 - wid * pos;
        $("#imageShowSmall").animate({
            left: toleft + 'px'
        }, 200);
        // 设置anchor的位置
        var chazhi = currentPosi - lbToPos;
        var toleft = wid * chazhi;
        /*$("#imageShowSmallAnchor").animate({
            left: toleft + 'px'
        }, 200);*/
    }
    $("#imageShow ul.imagepoint a").each(function (ind, Ele) {
        $(this).click(function () {
            SmallImgSliderTo(ind);
        });
    });
    $("#imageShowSmall li img").each(function (ind, Ele) {
        $(this).click(function () {
            SmallImgSliderTo(ind);
        });
    });
    $("#imageShowSmallNext").click(function () {
        SmallImgSliderTo(currentPosi + 1);
    });
    $("#imageShowSmallPre").click(function () {
        SmallImgSliderTo(currentPosi - 1);
    });
});