import Template from '@src/template';
import userGroup from './userGroup'; //用户组
import user from './user'; //用户
import userDetails from './userDetails';
import skipAuthentication from './skipAuthentication';
import storeManagement from './storeManagement';
import greetPage from './greetPage';
import menuMessage from './menuMessage'; //菜单管理
import availableBank from './availableBank'; //可用银行卡
import topup from './topup'; //充值
import arefund from './arefund'; //退款
module.exports = {
    path: '/jurisdiction',
    component: Template,
    meta: {
        title: '权限'
    },
    children: [
        {
            path: 'menuMessage',
            name: 'applyManage_menuMessage',
            component: menuMessage,
            meta: {
                title: '菜单管理'
            }
        },
        {
            path: 'userGroup',
            name: 'jurisdiction_userGroup',
            component: userGroup,
            meta: {
                title: '用户组',
                id: 102011
            }
        },
        {
            path: 'user',
            name: 'jurisdiction_user',
            component: user,
            meta: {
                title: '用户',
                id: 102012
            }
        },
        {
            path: 'userDetails',
            name: 'jurisdiction_userDetails',
            component: userDetails,
            meta: {
                title: '详情',
                id: 102013
            }
        },
        {
            path: 'skipAuthentication',
            name: 'jurisdiction_skipAuthentication',
            component: skipAuthentication,
            meta: {
                title: '跳过认证状态',
                id: 102014
            }
        },
        {
            path: 'storeManagement',
            name: 'jurisdiction_storeManagement',
            component: storeManagement,
            meta: {
                title: '门店管理',
                id: 102015
            }
        },
        {
            path: 'greetPage',
            name: 'jurisdiction_greetPage',
            component: greetPage,
            meta: {
                title: '欢迎进入',
                id: 102011
            },
        },
        {
            path: 'availableBank',
            name: 'jurisdiction_availableBank',
            component: availableBank,
            meta: {
                title: '可用银行卡',
                id: 102012
            },
        },
        {
            path: 'topup',
            name: 'jurisdiction_topup',
            component: topup,
            meta: {
                title: '充值',
                id: 102013
            },
        },
        {
            path: 'arefund',
            name: 'jurisdiction_arefund',
            component: arefund,
            meta: {
                title: '退款',
                id: 102013
            },
        }
    ]
}