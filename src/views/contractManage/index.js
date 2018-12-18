import Template from '@src/template';
import contractManage from './contractManage'; //合同管理
module.exports = {
        path: '/contractManage',
        component: Template,
        meta: {
            title: '合同管理'
        },
        children: [
            {
                path: 'contractManage',
                name: 'contractManage_contractManage',
                component: contractManage,
                meta: {
                    title: '合同管理'
                }
            }
           
        ]
}