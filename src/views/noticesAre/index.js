import Template from '@src/template';
import noticesAre from './noticesAre'; //合息
import instantInformation from './instantInformation'; //及时通讯
module.exports = {
        path: '/noticesAre',
        component: Template,
        meta: {
            title: '通知栏目'
        },
        children: [
            {
                path: 'noticesAre',
                name: 'noticesAre_noticesAre',
                component: noticesAre,
                meta: {
                    title: '通知栏目'
                }
            },
             {
                path: 'instantInformation',
                name: 'noticesAre_instantInformation',
                component: instantInformation,
                meta: {
                    title: '实时通讯'
                }
            }
           
        ]
}