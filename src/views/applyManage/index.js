import Template from '@src/template';
import clientMessageEntering from './clientMessageEntering'; //客户信息录入
import clientMessageDetail from './clientMessageDetail'; //客户信息录入详情
import applyMessageEntering from './applyMessageEntering'; //申请信息录入
import applyMessageDetail from './applyMessageDetail'; //申请信息详情
import clientSeach from './clientSeach'; //客户查询
import clientSeachDetail from './clientSeachDetail'; //客户查询详情
import contractUpload from './contractUpload'; //合同上传
import contractUploadDetail from './contractUploadDetail'; //合同上传
import managerRepayment from './managerRepayment/managerRepayment'; //店长还款
import managerRepaymentStatus from './managerRepayment/managerRepaymentStatus'; //店长还款状态
import stayStillbasket from './managerRepayment/stayStillbasket'; //代扣蓝
import tiedcard from './managerRepayment/tiedcard'; //绑卡
import tiedcardtail from './managerRepayment/tiedcardtail'; //绑卡
import noRepaymentDetailsDay from './noRepaymentDetailsDay'; //当日未还款明细
import certification from './certification';//ToS跳过认证
import amendPersonMessage from './amendPersonMessage';//修改个人信息  
module.exports = {
    path: '/applyManage',
    component: Template,
    meta: {
        title: '申请件管理'
    },
    children: [
        {
            path: 'clientMessageEntering',
            name: 'applyManage_clientMessageEntering',
            component: clientMessageEntering,
            meta: {
                title: '客户信息录入'
            }
        },
        {
            path: 'clientMessageDetail',
            name: 'applyManage_clientMessageDetail',
            component: clientMessageDetail,
            meta: {
                title: '客户信息录入'
            }
        },
        {
            path: 'applyMessageEntering',
            name: 'applyManage_applyMessageEntering',
            component: applyMessageEntering,
            meta: {
                title: '申请信息录入'
            }
        },
        {
            path: 'applyMessageDetail',
            name: 'applyManage_applyMessageDetail',
            component: applyMessageDetail,
            meta: {
                title: '申请信息录入'
            }
        },
        {
            path: 'clientSeach',
            name: 'applyManage_clientSeach',
            component: clientSeach,
            meta: {
                title: '客户查询'
            }
        },
        {
            path: 'clientSeachDetail',
            name: 'applyManage_clientSeachDetail',
            component: clientSeachDetail,
            meta: {
                title: '客户查询'
            }
        },
        {
            path: 'contractUpload',
            name: 'applyManage_contractUpload',
            component: contractUpload,
            meta: {
                title: '合同上传'
            }
        },
        {
            path: 'contractUploadDetail',
            name: 'applyManage_contractUploadDetail',
            component: contractUploadDetail,
            meta: {
                title: '合同上传'
            }
        },
        {
            path: 'managerRepayment',
            name: 'applyManage_managerRepayment',
            component: managerRepayment,
            meta: {
                title: '店长还款'
            }
        },
        {
            path: 'managerRepaymentStatus',
            name: 'applyManage_managerRepaymentStatus',
            component: managerRepaymentStatus,
            meta: {
                title: '店长还款状态'
            }
        },

        {
            path: 'tiedcard',
            name: 'applyManage_tiedcard',
            component: tiedcard,
            meta: {
                title: '绑卡'
            }
        },

        {
            path: 'tiedcardtail',
            name: 'applyManage_tiedcardtail',
            component: tiedcardtail,
            meta: {
                title: '绑卡详情'
            }
        },
         {
            path: 'stayStillbasket',
            name: 'applyManage_stayStillbasket',
            component: stayStillbasket,
            meta: {
                title: '待扣篮'
            }
        },

        {
            path: 'noRepaymentDetailsDay',
            name: 'applyManage_noRepaymentDetailsDay',
            component: noRepaymentDetailsDay,
            meta: {
                title: '当日未回款明细'
            }
        },
        {
            path: 'certification',
            name: 'applyManage_certification',
            component: certification,
            meta: {
                title: '跳过记账'
            }
        },
        {
            path: 'amendPersonMessage',
            name: 'applyManage_amendPersonMessage',
            component: amendPersonMessage,
            meta: {
                title: '修改个人信息'
            }
        }
    ]
}