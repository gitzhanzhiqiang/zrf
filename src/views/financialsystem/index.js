import Template from '@src/template';

//对账系统
import accoutthreemakemoney from './accoutThreeMakemoney'; //对账系统-第三方打款
import accoutthreewithdrawing from './accoutThreeWithdrawing'; //对账系统-第三方扣款
import accoutthreemakemoneylist from './accoutThreeMakemoneyList'; //对账系统-打款记录
import accoutthreewithdrawinglist from './accoutThreeWithdrawingList'; //对账系统-扣款记录   
import refunddismiss from './refunddismiss'; //退款驳回列表
//放款订单
import makemoneynotmoney from './makemoneyNotMoney'; //放款订单-待放款
import makemoneynotmoneydetail from './makemoneyNotMoneyDetail'; //放款订单-待放款详情
import makemoneyongoingmoney from './makemoneyOngoingMoney'; //放款订单-放款中
import makemoneyongoingmoneydetail from './makemoneyOngoingMoneyDetail'; //放款订单-放款中详情
import makemoneysuccessmoney from './makemoneySuccessMoney'; //放款订单-成功
import makemoneysuccessmoneydetail from './makemoneySuccessMoneyDetail'; //放款订单-成功详情
import makemoneyfailmoney from './makemoneyFailMoney'; //放款订单-失败
import makemoneyfailmoneydetail from './makemoneyFailMoneyDetail'; //放款订单-失败详情
import makemoneyrefusemoney from './makemoneyRefuseMoney'; //放款订单-拒绝
import makemoneyrefusemoneydetail from './makemoneyRefuseMoneyDetail'; //放款订单-拒绝详情
import Loanordertoday from './Loanordertoday'; //今日放款订单
import LoanordertodayDetaill from './LoanordertodayDetaill'; //今日放款订单详情
//
// //还款订单
import repaymentnownotorder from './repaymentNowNotOrder'; //还款订单-当前未还款
import repaymentongoingorder from './repaymentOngoingOrder'; //还款订单-还款中
import repaymentsuccessorder from './repaymentSuccessOrder'; //还款成功订单
import repaymentorder from './repaymentFailOrder'; //还款失败订单
//
// // 店长还款
import shopkeepersuccessorder from './shopkeeperSuccessOrder'; //店长还款成功订单
import shopkeeperongingorder from './shopkeeperOngingOrder'; //店长还款中订单
import shopkeeperfailorder from './shopkeeperFailOrder'; //店长还款失败订单


//财务数据
import financedatarepayment from './financedataRepayment'; //财务-还款
import financedataloan from './financedataLoan'; //财务-放款

//薪酬体系
import salarycustomermanager from './salaryCustomerManager'; //薪酬体系-客户经理
import salarysalesmanager from './salarySalesManager'; //薪酬体系-销售经理
import salarytrusttrial from './salaryTrusttrial'; //薪酬体系-信审
import salarytimesheet from './salaryTimesheet'; //薪酬体系-考勤
import staffStatus from './staffStatus'; //在离职状态表
import Regionaltotal from './Regionaltotal'; //区域总
import salesmanEvaluation from './salesmanEvaluation'; //业务员评价  
import salaryTrusttrialqu from './salaryTrusttrialqu'; //区域-信审
import Rewardspunishment from './Rewardspunishment'; //区域-信审

// 延迟支付
import delayedPayment from './delayedPayment'; //延迟支付
import delayedZayment from './delayedZayment'; //操作记录
// //支付宝修改数据
import alipayModifyData from './alipayModifyData'; //支付宝修改数据
module.exports = {
    path: '/financialsystem',
    component: Template,
    meta: {
        title: '财务系统'
    },
    children: [{
            path: 'accoutthreemakemoney',
            name: 'financialsystem_accoutthreemakemoney',
            component: accoutthreemakemoney,
            meta: {
                title: '第三方打款'
            }
        },
        {
            path: 'accoutthreewithdrawing',
            name: 'financialsystem_accoutthreewithdrawing',
            component: accoutthreewithdrawing,
            meta: {
                title: '第三方扣款'
            }
        },
        {
            path: 'accoutthreemakemoneylist',
            name: 'financialsystem_accoutthreemakemoneylist',
            component: accoutthreemakemoneylist,
            meta: {
                title: '打款记录'
            }
        },
        {
            path: 'accoutthreewithdrawinglist',
            name: 'financialsystem_accoutthreewithdrawinglist',
            component: accoutthreewithdrawinglist,
            meta: {
                title: '扣款记录'
            }
        },
         {
            path: 'refunddismiss',
            name: 'financialsystem_refunddismiss',
            component: refunddismiss,
            meta: {
                title: '退款驳回列表'
            }
        },
        // 放款订单  
        {
            path: 'makemoneynotmoney',
            name: 'financialsystem_makemoneynotmoney',
            component: makemoneynotmoney,
            meta: {
                title: '待放款订单'
            }
        },
        {
            path: 'makemoneynotmoneydetail',
            name: 'financialsystem_makemoneynotmoneydetail',
            component: makemoneynotmoneydetail,
            meta: {
                title: '还款订单'
            }
        },
        {
            path: 'makemoneyongoingmoney',
            name: 'financialsystem_makemoneyongoingmoney',
            component: makemoneyongoingmoney,
            meta: {
                title: '放款中订单'
            }
        }, {
            path: 'makemoneyongoingmoneydetail',
            name: 'financialsystem_makemoneyongoingmoneydetail',
            component: makemoneyongoingmoneydetail,
            meta: {
                title: '放款中订单详情'
            }
        },
        {
            path: 'makemoneysuccessmoney',
            name: 'financialsystem_makemoneysuccessmoney',
            component: makemoneysuccessmoney,
            meta: {
                title: '已放款订单'
            }
        },
        {
            path: 'makemoneysuccessmoneydetail',
            name: 'financialsystem_makemoneysuccessmoneydetail',
            component: makemoneysuccessmoneydetail,
            meta: {
                title: '已放款订单详情'
            }
        },
        {
            path: 'makemoneyfailmoney',
            name: 'financialsystem_makemoneyfailmoney',
            component: makemoneyfailmoney,
            meta: {
                title: '放款失败订单'
            }
        },
        {
            path: 'makemoneyfailmoneydetail',
            name: 'financialsystem_makemoneyfailmoneydetail',
            component: makemoneyfailmoneydetail,
            meta: {
                title: '放款失败订单详情'
            }
        },
        {
            path: 'makemoneyrefusemoney',
            name: 'financialsystem_makemoneyrefusemoney',
            component: makemoneyrefusemoney,
            meta: {
                title: '财务拒绝订单'
            }
        },
        {
            path: 'makemoneyrefusemoneydetail',
            name: 'financialsystem_makemoneyrefusemoneydetail',
            component: makemoneyrefusemoneydetail,
            meta: {
                title: '财务拒绝订单详情'
            }
        },
        {
            path: 'Loanordertoday',
            name: 'financialsystem_Loanordertoday',
            component: Loanordertoday,
            meta: {
                title: '今日放款订单'
            }
        },
        {
            path: 'LoanordertodayDetaill',
            name: 'financialsystem_LoanordertodayDetaill',
            component: LoanordertodayDetaill,
            meta: {
                title: '今日放款订单详情'
            }
        },
        // 还款订单
        {
            path: 'repaymentnownotorder',
            name: 'financialsystem_repaymentnownotorder',
            component: repaymentnownotorder,
            meta: {
                title: '本期待还款订单'
            }
        },
        {
            path: 'repaymentongoingorder',
            name: 'financialsystem_repaymentongoingorder',
            component: repaymentongoingorder,
            meta: {
                title: '还款中订单'
            }
        },
        {
            path: 'repaymentsuccessorder',
            name: 'financialsystem_repaymentsuccessorder',
            component: repaymentsuccessorder,
            meta: {
                title: '已还款订单'
            }
        },
        {
            path: 'repaymentorder',
            name: 'financialsystem_repaymentorder',
            component: repaymentorder,
            meta: {
                title: '还款失败订单'
            }
        }, // 店长还款
        {
            path: 'shopkeepersuccessorder',
            name: 'financialsystem_shopkeepersuccessorder',
            component: shopkeepersuccessorder,
            meta: {
                title: '店长还款-财务'
            }
        },
        {
            path: 'shopkeeperongingorder',
            name: 'financialsystem_shopkeeperongingorder',
            component: shopkeeperongingorder,
            meta: {
                title: '店长还款中-财务'
            }
        },
        {
            path: 'shopkeeperfailorder',
            name: 'financialsystem_shopkeeperfailorder',
            component: shopkeeperfailorder,
            meta: {
                title: '店长还款失败-财务'
            }
        },

        // 财务数据
        {
            path: 'financedatarepayment',
            name: 'financialsystem_financedatarepayment',
            component: financedatarepayment,
            meta: {
                title: '还款一览表'
            }
        },
        {
            path: 'financedataloan',
            name: 'financialsystem_financedataloan',
            component: financedataloan,
            meta: {
                title: '放款一览表'
            }
        },

        // 薪酬体系
        {
            path: 'salarycustomermanager',
            name: 'financialsystem_salarycustomermanager',
            component: salarycustomermanager,
            meta: {
                title: '客户经理'
            }
        },
        {
            path: 'salarysalesmanager',
            name: 'financialsystem_salarysalesmanager',
            component: salarysalesmanager,
            meta: {
                title: '营业部经理'
            }
        },
        {
            path: 'salarytrusttrial',
            name: 'financialsystem_salarytrusttrial',
            component: salarytrusttrial,
            meta: {
                title: '信审'
            }
        },
        {
            path: 'salaryTrusttrialqu',
            name: 'financialsystem_salaryTrusttrialqu',
            component: salaryTrusttrialqu,
            meta: {
                title: '区域信审'
            }
        },
        {
            path: 'salarytimesheet',
            name: 'financialsystem_salarytimesheet',
            component: salarytimesheet,
            meta: {
                title: '考勤'
            }
        },
         {
            path: 'Regionaltotal',
            name: 'financialsystem_Regionaltotal',
            component: Regionaltotal,
            meta: {
                title: '区域总'
            }
        },
        {
            path: 'staffStatus',
            name: 'financialsystem_staffStatus',
            component: staffStatus,
            meta: {
                title: '在离职状态表'
            }
        },
        {
            path: 'salesmanEvaluation',
            name: 'financialsystem_salesmanEvaluation',
            component: salesmanEvaluation,
            meta: {
                title: '业务操作评价'
            }
        },
        {
            path: 'Rewardspunishment',
            name: 'financialsystem_Rewardspunishment',
            component: Rewardspunishment,
            meta: {
                title: '还款比例奖惩'
            }
        },
        //延时支付
        {
            path: 'delayedPayment',
            name: 'financialsystem_delayedPayment',
            component: delayedPayment,
            meta: {
                title: '延迟支付'
            }
        },
        {
            path: 'delayedZayment',
            name: 'financialsystem_delayedZayment',
            component: delayedZayment,
            meta: {
                title: '操作记录'
            }
        },
        // 
        {
            path: 'alipayModifyData',
            name: 'financialsystem_alipayModifyData',
            component: alipayModifyData,
            meta: {
                title: '支付宝修改数据'
            }
        },


    ]

}