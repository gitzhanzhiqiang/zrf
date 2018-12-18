import Template from '@src/template';
import Overduelists from './Overduelists'; //逾期列表
import overduelists_kan from './overduelists_kan'; //逾期列表
import collectionmember from './collectionmember'; //催收员
import dianOverduelists from './dianOverduelists'; //电催逾期列表
import faOverduelists from './faOverduelists'; //催回列表
import collection from './collection'; //催回列表
import diancollection from './diancollection'; //电催回列表
import methodrushrush from './methodrushrush'; //法催回列表
module.exports = {
	 path: '/Overduelist',
        component: Template,
        meta: {
            title: '逾期列表'
        },
        children: [
        	{
                path: 'Overduelists',
                name: 'Overduelist_Overduelists',
                component: Overduelists,
                meta: {
                    title: '逾期订单',
                    id: 104001
                }
          },
          {
                path: 'overduelists_kan',
                name: 'Overduelist_overduelists_kan',
                component: overduelists_kan,
                meta: {
                    title: '逾期列表',
                    id: 104003
                }
               },
          {
                path: 'collectionmember',
                name: 'Overduelist_collectionmember',
                component: collectionmember,
                meta: {
                    title: '催收员',
                    id: 104002
                }
               },
                {
                path: 'dianOverduelists',
                name: 'Overduelist_dianOverduelists',
                component: dianOverduelists,
                meta: {
                    title: '电催逾期列表',
                    id: 104003
                }
               },
                {
                path: 'faOverduelists',
                name: 'Overduelist_faOverduelists',
                component: faOverduelists,
                meta: {
                    title: '法催逾期列表',
                    id: 104003
                }
               },
                {
                path: 'collection',
                name: 'Overduelist_collection',
                component: collection,
                meta: {
                    title: '催回列表',
                    id: 104003
                }
               },
               {
                path: 'diancollection',
                name: 'Overduelist_diancollection',
                component: diancollection,
                meta: {
                    title: '电催回列表',
                    id: 104003
                }
               },
               {
                path: 'methodrushrush',
                name: 'Overduelist_methodrushrush',
                component: methodrushrush,
                meta: {
                    title: '法催回列表',
                    id: 104003
                }
               },
        ]
}
