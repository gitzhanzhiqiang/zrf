import Template from '@src/template';
import loanStatistics from './loanStatistics'; //放款统计
import repaymentStatistics from './repaymentStatistics'; //还款统计
import repaymentDetailsDayStatistics from './repaymentDetailsDayStatistics'; //当日回款统计
import pushBackRate from './pushBackRate'; //摧回率
import overdueStatistics from './overdueStatistics'; //逾期统计
import firstTrialRejectionStatistics from './firstTrialRejectionStatistics'; //初审拒件统计
import rankingStatisticsSalesDepartment from './rankingStatisticsSalesDepartment'; //排名统计（营业部经理）
import rankingStatisticsAddress from './rankingStatisticsAddress'; //排名统计（区域）
import rankingStatisticsClient from './rankingStatisticsClient'; //排名统计（客户经理）
import TomorrowStatistics from './TomorrowStatistics'; //明日还款统计
import platformData from './platformData'; // 平台数据
import deductPercentage from './deductPercentage'; // 扣款比例
import earlywarning from './earlywarning'; // 业务员逾期预警
module.exports = {
    path: '/platformData',
    component: Template,
    meta: {
        title: '平台数据'
    },
    children: [{
            path: 'loanStatistics',
            name: 'platformData_loanStatistics',
            component: loanStatistics,
            meta: {
                title: '放款统计'
            }
        },
        {
            path: 'repaymentStatistics',
            name: 'platformData_repaymentStatistics',
            component: repaymentStatistics,
            meta: {
                title: '还款统计'
            }
        },
        {
            path: 'repaymentDetailsDayStatistics',
            name: 'platformData_repaymentDetailsDayStatistics',
            component: repaymentDetailsDayStatistics,
            meta: {
                title: '当日还款统计'
            }
        },
        {
            path: 'pushBackRate',
            name: 'platformData_pushBackRate',
            component: pushBackRate,
            meta: {
                title: '催回率'
            }
        },
        {
            path: 'overdueStatistics',
            name: 'platformData_overdueStatistics',
            component: overdueStatistics,
            meta: {
                title: '逾期统计'
            }
        },
        {
            path: 'firstTrialRejectionStatistics',
            name: 'platformData_firstTrialRejectionStatistics',
            component: firstTrialRejectionStatistics,
            meta: {
                title: '初审拒件统计'
            }
        },
        {
            path: 'rankingStatisticsSalesDepartment',
            name: 'platformData_rankingStatisticsSalesDepartment',
            component: rankingStatisticsSalesDepartment,
            meta: {
                title: '排名统计（营业部经理）'
            }
        },
        {
            path: 'rankingStatisticsAddress',
            name: 'platformData_rankingStatisticsAddress',
            component: rankingStatisticsAddress,
            meta: {
                title: '排名统计（区域）'
            }
        },
        {
            path: 'rankingStatisticsClient',
            name: 'platformData_rankingStatisticsClient',
            component: rankingStatisticsClient,
            meta: {
                title: '排名统计（客户经理）'
            }
        },
        {
            path: 'TomorrowStatistics',
            name: 'platformData_TomorrowStatistics',
            component: TomorrowStatistics,
            meta: {
                title: '明日还款统计'
            }
        },
        {
            path: 'platformData',
            name: 'platformData_platformData',
            component: platformData,
            meta: {
                title: '平台数据'
            }
        },
         {
            path: 'deductPercentage',
            name: 'platformData_deductPercentage',
            component: deductPercentage,
            meta: {
                title: '扣款比例'
            }
        },
         {
            path: 'earlywarning',
            name: 'platformData_earlywarning',
            component: earlywarning,
            meta: {
                title: '业务员逾期预警'
            }
        }
    ]
}