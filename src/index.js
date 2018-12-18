import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import * as filters from './filters/index.js'
import echarts from 'echarts';
// 赋值到Vue的原型上面，在页面就可以使用this.$echarts获取到了
Vue.prototype.$echarts = echarts;
//全局过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
import store from '@src/store';
import App from './index.vue';
import main from './main.vue';
import login from './login.vue';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条 样式
import Cookies from 'js-cookie';
import ajax from '@utils/config';
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);



// 路由
import jurisdiction from '@views/jurisdiction'; //权限
import applyManage from '@views/applyManage'; //申请件管理
import finaljudgment from "@views/finaljudgment"; // 终审系统
import financialsSystem from "@views/financialsystem"; // 财务系统
import platformData from '@views/platformData'; //平台数据
import Overduelist from '@views/Overduelist'; //逾期
import contractManage from '@views/contractManage'; //合同管理
import noticesAre from '@views/noticesAre'; //通知栏目
// 路由结束
const defaultRoute = {
    path: '/',
    component: App,
    meta: {
        id: '100000',
    },
    children: [
        jurisdiction,
        applyManage,
        finaljudgment,
        financialsSystem,
        platformData,
        Overduelist,
        contractManage,
        noticesAre
    ]
};
const routes = [{
        path: '/login',
        name: '登录',
        hidden: true,
        component: login
    },
    {
        path: '/',
        redirect: '/login'
    },
    defaultRoute,
];

export default routes;
Vue.filter('statusFilter', function(value) {
    var statusInfo = '';
    if (value == '0') statusInfo = '成功';
    if (value == '1') statusInfo = '失败';
    if (value == '2') statusInfo = '未审核';
    return statusInfo;
})
Vue.filter('statusColorFilter', function(value) {
    var statusInfo = '';
    if (value == '0') statusInfo = 'w-btnGreen';
    if (value == '1') statusInfo = 'w-btnWarning';
    if (value == '2') statusInfo = 'w-btnGray';
    return statusInfo;
})


const router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes
})

let toHome = false;
//全局钩子作用于所有路由，里面的参数to表示即将要进入的路由对象，from表示即将要离开的路由对象 路由进入之前
router.beforeEach((to, from, next) => {
    // 开启Progress
    NProgress.start();
    //重定向到login时
    if (from.path === '/' && to.path === '/login') {
        if (store.getters.token && !store.getters.user) {
            toHome = true;
        }

    }
    //登录且有用户信息
    if (store.getters.user) {
        if (!to.name) {
            // 404
            console.log(11112);
        }
        if (to.path === '/login') {
            console.log(11111);
            next();

        } else {
            // headerSelected(to, vm);
            // detailLink(to);
            console.log(11113);
            next();
        }
    } else if (!store.getters.user && Cookies.get('user')) {
        // 登录且没有用户信息
        console.log(11114);
        next();
    } else if (to.path === '/login') {
        console.log(11115);
        // 未登录
        next();
    } else {
        next('/login');
        console.log(11116);
    }
    next();
    NProgress.done();
});
// //路由进入之后
router.afterEach((to, from) => {
    NProgress.done(); // 结束Progress
});
new Vue({
    el: '#app',
    store,
    router,
    template: '<App />',
    components: { App },
    mounted() {

    }
});