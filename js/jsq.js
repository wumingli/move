/**
 *
 * @authors Wumingli
 * @date    2015-04-15 21:22:34
 * @version $Id$
 */
$(function () {
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
            change: function () {
                rate = $(this).attr('id').match(/\d+\.\d+/g);
                if (rate !== null) {
                    rate = parseFloat(rate[0]);
                }
            }
        });
        $('#fd-month').selectbox({
            change: function () {
                month = $(this).attr('id').match(/\d+/g);
                if (month !== null) {
                    month = parseFloat(month[0]);
                }
                console.log(month)
            }
        });
        $('#lilv-rate').selectbox({
            change: function () {
                lilv = $(this).attr('id').match(/\d+\.\d+/g);
                if (lilv !== null) {
                    lilv = parseFloat(lilv[0]);
                }
            }
        });
        $parent.find('input[type="submit"]').on('click', function () {
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
            change: function () {
                var id = $(this).attr('id');
                from = id.substring(id.lastIndexOf('_') + 1);
                $('.sum-have-type').text(type[from]);
            }
        });
        $('#i-want').selectbox({
            change: function () {
                var id = $(this).attr('id');
                to = id.substring(id.lastIndexOf('_') + 1);
                $('.sum-cash-type').text(type[to]);
            }
        });
        $('#huilv-btn').on('click', function () {
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
                success: function (data) {
                    if (data.status == 1) {
                        $('.sum-cash input').val(data.data);
                    }
                }
            });
            return false;
        });
    }
    originCountry();
});