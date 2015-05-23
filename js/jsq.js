//房生钱贷款计算器
function houseToMoney() {
    var $parent = $('.fangdai-form'),
        $acount = $('.market-ipt'),
        $years = $('.years'),
        rate = 0.7,
        month = 12,
        lilv = 1.2,
        total = 0,
        lixiMonth = 0,
        needReturn = 0;
    $('#fsq-rate').selectbox({
        change: function() {
            rate = $(this).attr('id').match(/\d+\.\d+/g);
            if (rate !== null) {
                rate = parseFloat(rate[0]);
            }
        }
    });
    $('#fd-month').selectbox({
        change: function() {
            month = $(this).attr('id').match(/\d+/g);
            if (month !== null) {
                month = parseFloat(month[0]);
            }
            console.log(month)
        }
    });
    $('#lilv-rate').selectbox({
        change: function() {
            lilv = $(this).attr('id').match(/\d+\.\d+/g);
            if (lilv !== null) {
                lilv = parseFloat(lilv[0]);
            }
        }
    });
    //购房能力
    $('#gfnl-years').selectbox({
        change: function() {
            console.log($('#gfnl-years').val());
        }
    });
    $('#fsq-btn').on('click', function() {
        if (!/^\d+$/.test($acount.val())) {
            alert('贷款总额必须为正整数！');
            return false;
        }
        total = $acount.val() * rate;
        total = (total + '').indexOf('.') !== -1 ? total.toFixed(2) : total;
        $('#fd-total').text(total + '万');
        lixiMonth = total * 10000 * (5.35 / 100) * lilv / month;
        lixiMonth = (lixiMonth + '').indexOf('.') !== -1 ? lixiMonth.toFixed(2) : lixiMonth;
        $('#fd-lixi').text(parseInt(lixiMonth));
        needReturn = total * 10000 + lixiMonth * month;
        needReturn = (needReturn + '').indexOf('.') !== -1 ? needReturn.toFixed(2) : needReturn;
        $('#fd-return').text(needReturn);
        return false;
    });
}
houseToMoney();
//目标国汇率计算
function originCountry() {
    var from = 'CNY',
        to = 'USD',
        type = {
            CNY: '人民币',
            USD: '美元'
        },
        amount = 100,
        $amount = $('.sum-have').find('input');
    $('#i-have').selectbox({
        change: function() {
            var id = $(this).attr('id');
            from = id.substring(id.lastIndexOf('_') + 1);
            $('.sum-have-type').text(type[from]);
        }
    });
    $('#i-want').selectbox({
        change: function() {
            var id = $(this).attr('id');
            to = id.substring(id.lastIndexOf('_') + 1);
            $('.sum-cash-type').text(type[to]);
        }
    });
    $('#huilv-btn').on('click', function() {
        if (!/^\d+$/.test($amount.val())) {
            alert('持有金额必须为正整数！');
            return false;
        }
        amount = $amount.val();
        $.ajax('index.php?g=api&m=rateList&a=convert', {
            type: 'get',
            dataType: 'json',
            data: {
                from: from,
                to: to,
                amount: amount
            },
            success: function(data) {
                if (data.status == 1) {
                    $('.sum-cash input').val(data.data);
                }
            }
        });
        return false;
    });
}
originCountry();


function showJSQ($obj) {
    var id = $obj.attr('id');
    $('.jsq-container').show();
    $('.jsq-container .jsq-con').each(function() {
        if ($(this).data('jsq-type') === id) {
            $(this).show().siblings('.jsq-con').hide();
            return;
        }
    });
}
//
$('.count-list li, .jsq-selector a').on('click', function() {
    showJSQ($(this));
});
//关闭
$('.jsq-container .s-title em').on('click', function() {
    $(this).parents('.jsq-container').hide();
});
//});

//投资回报率计算器
$("#touzistart").click(function() {
    var touzizongjia = $("#touzizongjia").val().replace(/(^\s*)/g, "");
    var touzizujin = $("#touzizujin").val().replace(/(^\s*)/g, "");

    var regx = new RegExp("^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$");
    var regMonth = /^[1-9]\d*$/;

    if (touzizongjia == "") {
        alert("购房总价不能为空");
        $("#touzizongjia").focus();
        return false;
    }
    if (!regMonth.test(touzizongjia)) {
        alert("购房总价金额不正确");
        $("#touzizongjia").focus();
        return false;
    }
    if (touzizujin == "") {
        alert("每月租金费不能为空");
        $("#touzizujin").focus();
        return false;
    }
    if (!regMonth.test(touzizujin)) {
        alert("每月租金费金额不正确");
        $("#touzizujin").focus();
        return false;
    }

    $("#touzijieguo").text(((touzizujin * 12) / touzizongjia * 100).toFixed(2));

    return false;
});
//客户购房能力评估
$("#nlstart").click(function() {
    var zijin = $("#zijin").val().replace(/(^\s*)/g, "");
    var shouru = $("#shouru").val().replace(/(^\s*)/g, "");
    var zhichu = $("#zhichu").val().replace(/(^\s*)/g, "");
    var mianji = $("#mianji").val().replace(/(^\s*)/g, "");
    var regx = new RegExp("^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$");
    var regMonth = /^[1-9]\d*$/;

    if (zijin == "") {
        alert("请填写可用于购房的资金");
        $("#zijin").focus();
        return false;
    }
    if (!regMonth.test(zijin)) {
        alert("资金金额不正确");
        $("#zijin").focus();
        return false;
    }
    if (shouru == "") {
        alert("请填写家庭月收入");
        $("#shouru").focus();
        return false;
    }
    if (!regMonth.test(shouru)) {
        alert("家庭月收入金额不正确");
        $("#shouru").focus();
        return false;
    }
    if (zhichu == "") {
        alert("请填写预计家庭每月固定支出");
        $("#zhichu").focus();
        return false;
    }
    if (!regMonth.test(zhichu)) {
        alert("家庭每月固定支出金额不正确");
        $("#zhichu").focus();
        return false;
    }

    if (mianji == "") {
        alert("请填写计划购买的房屋面积");
        $("#mianji").focus();
        return false;
    }
    if (!regMonth.test(mianji)) {
        alert("房屋面积不正确");
        $("#mianji").focus();
        return false;
    }


    //您可购买的房屋总价=（家庭月收入-家庭月固定支出）×( (（1＋月利率）＾还款月数)－1  )÷［月利率×（1＋月利率）＾还款月数］+持有资金 
    var month = parseInt($('#gfnl-years').val());
    var year = parseInt(month / 12);
    var lilu = 0.00576;
    if (year > 5)
        lilu = 0.00594;
    js00 = parseFloat(zijin); //现持有
    js01 = parseFloat(shouru); //月收入
    js02 = parseFloat(zhichu); //月支出
    js03 = parseFloat(mianji); //面积

    var d1 = js01 - js02;
    var d2 = Math.pow(1 + lilu, month) - 1;
    var d3 = lilu * Math.pow(1 + lilu, month)
    var dj = (parseFloat(Math.round(((d1 * d2) / d3) + js00)) / js03).toFixed(2);
    $("#zongjia").text(Math.round(((d1 * d2) / d3) + js00));
    $("#danjia").text(dj);
    return false;
});
//海外房贷计算器
var arrayusa = new Array("华美银行,4.2", "汇丰银行,3.8", "国泰银行,4", "富国银行,4");
var arrayau = new Array("西太平洋银行,4.59", "国家银行,4.59", "联邦银行,4.59", "汇丰银行,4.59", "澳新银行,4.59");
var arrayca = new Array("皇家银行,2.1");
var arrayen = new Array("中国银行,3.89");
var arrayja = new Array("中国银行,2.5");
//海外房贷
$('#hwfd-country').selectbox({
    change: function() {
        var array_bank;
        var country = $("#hwfd-country").val();
        $("#loadYearRate").val('');
        switch (country) {
            case "美国":
                array_bank = arrayusa;
                break;
            case "澳洲":
                array_bank = arrayau;
                break;
            case "加拿大":
                array_bank = arrayca;
                break;
            case "英国":
                array_bank = arrayen;
                break;
            case "新西兰":
                array_bank = arrayja;
                break;
        };

        $("#hwfd-bank").html("<option>请选择银行</option>");
        if (array_bank != null) {
            $("#hwfd-bank").selectbox('destory');
            for (var i = 0; i < array_bank.length; i++) {
                var _value = array_bank[i];
                // alert(_value);
                $("#hwfd-bank").append("<option value='" + _value.split(',')[1] + "'>" + _value.split(',')[0] + "</option>");
            }
            $("#hwfd-bank").selectbox({
                change: function() {
                    var bank = $('#hwfd-bank').val();
                    $("#loadYearRate").val(bank.split(",")[0]);
                }
            });
        }
    }
});
$('#hwfd-bank').selectbox();

$("#cal").click(function() {
    if (CheckVal()) {
        ext_total();
    }
    return false;
});

var loadMoney, loadDate, loadYearRate;

function CheckVal() {
    loadMoney = $("#loadMoney").val().replace(/(^\s*)/g, "");
    loadDate = $("#loadDate").val().replace(/(^\s*)/g, "");
    loadYearRate = $("#loadYearRate").val().replace(/(^\s*)/g, "");
    var regx = new RegExp("^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$");
    var regMonth = /^[1-9]\d*$/;
    if (loadMoney == "") {
        alert("贷款金额不能为空");
        $("#loadMoney").focus();
        return false;
    }
    if (!regMonth.test(loadMoney)) {
        alert("贷款金额不正确");
        $("#loadMoney").focus();
        return false;
    }
    if (loadDate == "") {
        alert("贷款期限不能为空");
        $("#loadDate").focus();
        return false;
    }
    if (!regMonth.test(loadDate)) {
        alert("贷款期限不正确");
        $("#loadDate").focus();
        return false;
    }
    if (loadYearRate == "") {
        alert("年利率不能为空");
        $("#loadYearRate").focus();
        return false;
    }
    if (!regx.test(loadYearRate)) {
        alert("年利率不正确");
        $("#loadYearRate").focus();
        return false;
    }
    return true;
}
//本息还款的月还款额(参数: 年利率/贷款总额/贷款总月份)
function getMonthMoney1(lilv, total, month) {
    var lilv_month = lilv / 12; //月利率
    return total * lilv_month * Math.pow(1 + lilv_month, month) / (Math.pow(1 + lilv_month, month) - 1);
}

function ext_total() {
    var month = $("#loadDate").val();
    var lilv = $("#loadYearRate").val() / 100;
    var daikuan_total = $("#loadMoney").val();
    var daikuantotal = daikuan_total;
    var month_money1 = getMonthMoney1(lilv, daikuantotal, month);
    $("#monthPayMoney").text(Math.round(month_money1));
    var all_total1 = month_money1 * month;
    var all_total1 = Math.round(all_total1);
    all_total1 = Math.round(all_total1 * 100) / 100;
    $("#totalRateMoney").text(Math.round((all_total1 - daikuan_total) * 100) / 100);
}