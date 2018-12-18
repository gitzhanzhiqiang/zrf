export function parseTime(time, cFormat) {


    if (arguments.length === 0) {
        return null;
    }
    if (time === undefined || time === null)
        return '';

    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time == 'object') {
        date = time;
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000;

        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
}
export function formatMoney(value) {
    if (value) {
        return (value / 100).toFixed(2);
    } else {
        return '0.00';
    }
}
export function forma(value) {
    if (value) {
        return (value * 100).toFixed(2);
    } else {
        return '0.0';
    }
}
export function forma1(value) {
    if (value) {
        return value.toFixed(1);
    } else {
        return '0.0';
    }
}
export function forma2(value) {
    if (value) {
        return value.toFixed(2);
    } else {
        return '0.0';
    }
}
export function formatTime(value, that, params, startName, endName) {
    if (value) {
        let start = value.match(/(\S*)至/)[1];
        let end = value.match(/至(\S*)/)[1];
        if (params) {
            that[params][startName] = start;
            that[params][endName] = end;
        } else {
            that[startName] = start;
            that[endName] = end;
        }
    } else {
        if (params) {
            that[params][startName] = '';
            that[params][endName] = '';
        } else {
            that[startName] = '';
            that[endName] = '';
        }
    }
}

export function bankStatusFilter(type) {  //银行状态：bankStatus "SUCCESS"成功 "FAIL"失败 "DOING"银行处理中 "WAITINGTOBANK" 等待发送银行
    if (type == "SUCCESS") {
        return "成功";
    } else if (type == "FAIL") {
        return "失败";
    } else if (type == "DOING") {
        return "银行处理中";
    } else if (type == "WAITINGTOBANK") {
        return "等待发送银行";
    }
}

export function payStatusFilter(code) {//扣款状态：payStatus    1 已扣款 0 未扣款
    if (code) {
        return "已扣款";
    } else {
        return "未扣款";
    }
}
export function ybStatusFilter(type) {//易宝状态：ybStatus  "YPDOING" 已受理 "AUDIT" 待复核  "CANCELLED" 已撤销   REFUNDED" 已退回
    if (type == "YPDOING") {
        return "已受理";
    } else if (type == "AUDIT") {
        return "待复核";
    } else if (type == "CANCELLED") {
        return "已撤销";
    } else if (type == "REFUNDED") {
        return "已退回";
    }
}
export function isBalancedFilter(code) {//平账状态 isBalanced 0 否 1 是
    if (code) {
        return '是';
    } else {
        return '否';
    }
}
export function sourceFilter(code) {//订单来源过滤
    if (code == '0') {
        return '线下';
    } else if (code == '1') {
        return 'IOS';
    } else if (code == '2') {
        return 'Android';
    }
}
export function orderstatusFilter(code) {//订单状态
    if (code == '1') {
        return '申请成功';
    } else if (code == '2') {
        return '初审拒绝';
    } else if (code == '3') {
        return '初审通过';
    } else if (code == '4') {
        return '终审拒绝';
    } else if (code == '5') {
        return '终审通过';
    } else if (code == '6') {
        return '财务拒绝';
    } else if (code == '7') {
        return '财务通过';
    } else if (code == '8') {
        return '放款中';
    } else if (code == '9') {
        return '放款成功';
    } else if (code == '10') {
        return '放款失败';
    } else if (code == '11') {
        return '待放款';
    } else if (code == '20') {
        return '订单完成';
    } else if (code == '21') {
        return '订单完成';
    } else if (code == '30') {
        return '自动拒单';
    } else if (code == '31') {
        return '自动拒单';
    } else {
        return '无';
    }
}
export function orderStatusnewFilter(code) {//订单状态
    if (code == '1') {
        return '申请成功';
    } else if (code == '2') {
        return '自动拒件（初审）';
    } else if (code == '3') {
        return '初审同意';
    } else if (code == '4') {
        return '初审拒绝';
    } else if (code == '5') {
        return '终审通过';
    } else if (code == '6') {
        return '终审拒绝';
    } else if (code == '7') {
        return '终审驳回';
    } else if (code == '8') {
        return '合同上传成功';
    } else if (code == '9') {
        return '财务通过';
    } else if (code == '10') {
        return '财务拒绝';
    } else if (code == '11') {
        return '财务驳回';
    } else if (code == '12') {
        return '自动拒件（合同）';
    } else if (code == '30') {
        return '放款中';
    } else if (code == '31') {
        return '放款失败';
    } else if (code == '32') {
        return '放款成功';
    } else if (code == '40') {
        return '完成';
    } else {
        return "未知状态"
    }
}
export function consumeTypeFilter(code) {//借款用途
    if (code == '2') {
        return '商户扩大经营';
    } else if (code == '3') {
        return '装修';
    } else if (code == '4') {
        return '旅游';
    } else if (code == '5') {
        return '教育';
    } else if (code == '1') {
        return '个人日常消费';
    }
}
//还款模块 已还款订单状态
export function RepaymentOrderStatus(code) {
    if (code == '0') {
        return '待还款';
    } else if (code == '1') {
        return '还款失败';
    } else if (code == '2') {
        return '还款成功';
    } else if (code == '3') {
        return '处理中';
    }
}

export function getAge(identityCard) {
    if (identityCard) {
        var len = (identityCard + "").length;
        if (len == 0) {
            return 0;
        } else {
            if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
            {
                return 0;
            }
        }
        var strBirthday = "";
        if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
        {
            strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
        }
        if (len == 15) {
            strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
        }
        //时间字符串里，必须是“/”
        var birthDate = new Date(strBirthday);
        var nowDateTime = new Date();
        var age = nowDateTime.getFullYear() - birthDate.getFullYear();
        //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
        if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    } else {
        return '';
    }

}










