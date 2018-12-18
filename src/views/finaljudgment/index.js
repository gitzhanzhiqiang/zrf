import Template from '@src/template';

import finaljudgmentlist from './finaljudgmentlist';
import finaljudgmentlistDetail from './finaljudgmentlistDetail';
module.exports = {
    path: 'finaljudgment',
    component: Template,
    meta: {
        title: '终审系统'
    },
    children: [
        {
            path: 'finaljudgmentlist',
            name: 'finaljudgment_finaljudgmentlist',
            component: finaljudgmentlist,
            meta: {
                title: '终审系统'
            }
        },
        {
            path: 'finaljudgmentlistDetail',
            name: 'finaljudgment_finaljudgmentlistDetail',
            component: finaljudgmentlistDetail,
            meta: {
                title: '终审系统'
            }
        }


    ]

}