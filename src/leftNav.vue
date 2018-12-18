<template>
    <div class='leftNav2' :style="leftBackground">
        <!-- <div class="leftNav-img"></div> -->
        <div class="left_login" :class="{Collapse2:isCollapse}">
            <div class="left_logo">
                <img :src="loginUrl" alt="">
            </div>
            <div class="collapseImg" @click="Collapse();" :class="{Collapse3:isCollapse}" v-show="false">
                <img :src="collapseUrl" alt="">
            </div>
        </div>
        <ul class='listBox' :class="{Collapse:isCollapse}">
            <el-menu background-color="red" text-color="#fff" active-text-color="#ffd04b" default-active="111111" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" unique-opened>
                <el-submenu :index="item.id + ''" v-for="(item, index) in listInfo1" :key="item.id">
                    <template slot="title">
                        <!--<i class="el-icon-menu"></i>-->
                        <i class="nav_img" v-for="logo in nav_logo" v-show="item.label == logo.label"><img :src="logo.url" /></i>
                        <i class="el-icon-message" v-show="item.label == '通知栏目'"></i>
                        <span v-text="item.label"></span>
                    </template>
                    <el-menu-item-group>
                        <template v-for="itm in item.children">
                            <el-menu-item :index="itm.id + ''" v-text="itm.label" v-if="!itm.children" @click="$router.push(itm.url)"></el-menu-item>
                            <el-submenu :index="itm.id + ''" v-else>
                                <span slot="title" v-text="itm.label"></span>
                                <el-menu-item :index="list.id + ''" v-for="list in itm.children" :key="list.id" v-text="list.label" @click="$router.push(list.url)"> </el-menu-item>
                            </el-submenu>
                        </template>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </ul>
    </div>
</template>

<script>
import _ from "underscore";
import { authInfo } from "./common/auth.js";
import { mapGetters } from 'vuex';
import ajax from '@utils/config';
export default {
    data() {
        return {
            leftBackground: {
                background: 'url(' + require("@res/img/zuo.png") + ') no-repeat'
            },
            //isCollapse: this.$store.getters.isCollapse,
            activeIndex: '0',
            collapseUrl: require("@res/img/icon-liebiao.png"),
            arrow: require("@res/img/arrow.png"),
            arrowTop: require("@res/img/arrow2.png"),
            loginUrl: require("@res/img/logo_left.png"),
            // listInfo: this.$store.getters.router,
            listInfo1: [],
            nav_logo: [
                {label: '权限', url: require('@res/img/aa1.png')},
                {label: '申请件管理', url: require('@res/img/aa2.png')},
                {label: '终审系统', url: require('@res/img/zhongshen.png')},
                {label: '财务系统', url: require('@res/img/caiwu.png')},
                {label: '逾期列表', url: require('@res/img/yuqi.png')},
                {label: '平台数据', url: require('@res/img/pingtaishuju.png')},
                {label: '合同管理', url: require('@res/img/hetong.png')},
                 {label: '催回列表', url: require('@res/img/hetong.png')},

            ],
            listInfo: [
                {
                    img: require("@res/img/icon-yewu.png"),
                    name: "权限",
                    hash: "/jurisdiction",
                    status: false,
                    id: 110000,
                    list: [
                        {
                            hash: '/jurisdiction/menuMessage',
                            nameTwo: '菜单管理',
                            id: 110006,
                            childrenList: []
                        },
                        {
                            hash: '/jurisdiction/userGroup',
                            nameTwo: '用户组',
                            id: 110001,
                            childrenList: []
                        },
                        {
                            hash: '/jurisdiction/user',
                            nameTwo: '用户',
                            id: 110003,
                            childrenList: []
                        },
                        {
                            hash: '/jurisdiction/skipAuthentication',
                            nameTwo: '跳过认证状态',
                            id: 110004,
                            childrenList: []
                        },
                        {
                            hash: '/jurisdiction/storeManagement',
                            nameTwo: '门店管理',
                            id: 110005,
                            childrenList: []
                        },
                         {
                            hash: '/jurisdiction/topup',
                            nameTwo: '充值',
                            id: 110006,
                            childrenList: []
                        },
                        {
                            hash: '/jurisdiction/arefund',
                            nameTwo: '退款',
                            id: 110006,
                            childrenList: []
                        }
                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    name: "申请件管理",
                    hash: "/applyManage",
                    status: false,
                    id: 120000,
                    list: [
                        {
                            hash: '/applyManage/clientMessageEntering',
                            nameTwo: '客户信息录入',
                            id: 120001,
                            childrenList: []
                        },
                        {
                            hash: '/applyManage/applyMessageEntering',
                            nameTwo: '申请信息录入',
                            id: 120002,
                            childrenList: []
                        },
                        {
                            hash: '/applyManage/clientSeach',
                            nameTwo: '客户查询',
                            id: 120003,
                            childrenList: []
                        },
                        {
                            hash: '/applyManage/contractUpload',
                            nameTwo: '合同上传',
                            id: 120004,
                            childrenList: []
                        },
                        {
                            hash: '/applyManage',
                            nameTwo: '店长还款',
                            id: 120005,
                            childrenList: [
                                {
                                    hash: '/applyManage/managerRepayment',
                                    nameTwo: '店长还款',
                                    id: 120006

                                },
                                {
                                    hash: '/applyManage/managerRepaymentStatus',
                                    nameTwo: '店长还款状态',
                                    id: 120007
                                },
                                {
                                    hash: '/applyManage/tiedcard',
                                    nameTwo: '店长绑卡',
                                    id: 120008
                                },
                                 {
                                    hash: '/applyManage/stayStillbasket',
                                    nameTwo: '店长绑卡',
                                    id: 120008
                                }
                            ]
                        },
                        {
                            hash: '/applyManage/noRepaymentDetailsDay',
                            nameTwo: '当日未回款明细',
                            id: 120008,
                            childrenList: []
                        },
                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    name: "终审系统",
                    hash: "/finaljudgment",
                    status: false,
                    id: 130000,
                    list: [
                        {
                            hash: '/finaljudgment/finaljudgmentlist',
                            nameTwo: '终审系统',
                            id: 130001,
                            childrenList: []
                        },

                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    name: "财务系统",
                    hash: "/financialsystem",
                    status: false,
                    id: 140000,
                    list: [
                        {
                            hash: '/financialsystem',
                            nameTwo: '对账系统',
                            id: 140001,
                            childrenList: [
                                {
                                    hash: '/financialsystem/accoutthreemakemoney',
                                    nameTwo: '第三方打款',
                                    id: 140011,
                                }, {
                                    hash: '/financialsystem/accoutthreewithdrawing',
                                    nameTwo: '第三方扣款',
                                    id: 140012,
                                }, {
                                    hash: '/financialsystem/accoutthreemakemoneylist',
                                    nameTwo: '打款记录',
                                    id: 140013,
                                }, {
                                    hash: '/financialsystem/accoutthreewithdrawinglist',
                                    nameTwo: '扣款记录',
                                    id: 140014,
                                }, {
                                    hash: '/financialsystem/delayedPayment',
                                    nameTwo: '延迟支付',
                                    id: 140015,
                                },{
                                    hash: '/financialsystem/delayedZayment',
                                    nameTwo: '操作记录',
                                    id: 140016,
                                },{
                                    hash: '/financialsystem/refunddismiss',
                                    nameTwo: '退款驳回列表',
                                    id: 140016,
                                },]
                        },
                        {
                            hash: '/financialsystem',
                            nameTwo: '放款订单',
                            id: 140002,
                            childrenList: [
                                {
                                    hash: '/financialsystem/makemoneynotmoney',
                                    nameTwo: '待放款订单',
                                    id: 140021,
                                }, {
                                    hash: '/financialsystem/makemoneyongoingmoney',
                                    nameTwo: '放款中订单',
                                    id: 140022,
                                }, {
                                    hash: '/financialsystem/makemoneysuccessmoney',
                                    nameTwo: '已放款订单',
                                    id: 140023,
                                }, {
                                    hash: '/financialsystem/makemoneyfailmoney',
                                    nameTwo: '放款失败订单',
                                    id: 140024,
                                }, {
                                    hash: '/financialsystem/makemoneyrefusemoney',
                                    nameTwo: '财务拒绝订单',
                                    id: 140025,
                                }, {
                                    hash: '/financialsystem/Loanordertoday',
                                    nameTwo: '今日放款订单',
                                    id: 140026,
                                },
                            ]
                        },
                        {
                            hash: '/financialsystem',
                            nameTwo: '还款订单',
                            id: 140003,
                            childrenList: [
                                {
                                    hash: '/financialsystem/repaymentnownotorder',
                                    nameTwo: '本期待还款订单',
                                    id: 140031,
                                }, {
                                    hash: '/financialsystem/repaymentongoingorder',
                                    nameTwo: '还款中订单',
                                    id: 140032,
                                }, {
                                    hash: '/financialsystem/repaymentsuccessorder',
                                    nameTwo: '已还款订单',
                                    id: 140033,
                                }, {
                                    hash: '/financialsystem/repaymentorder',
                                    nameTwo: '还款失败订单',
                                    id: 140034,
                                },]
                        },
                        {
                            hash: '/financialsystem',
                            nameTwo: '店长还款订单',
                            id: 140004,
                            childrenList: [
                                {
                                    hash: '/financialsystem/shopkeepersuccessorder',
                                    nameTwo: '店长还款-财务',
                                    id: 140041,
                                }, {
                                    hash: '/financialsystem/shopkeeperongingorder',
                                    nameTwo: '店长还款中-财务',
                                    id: 140042,
                                }, {
                                    hash: '/financialsystem/shopkeeperfailorder',
                                    nameTwo: '店长还款失败-财务',
                                    id: 140043,
                                },]
                        },
                        {
                            hash: '/financialsystem',
                            nameTwo: '财务数据',
                            id: 140005,
                            childrenList: [{
                                hash: '/financialsystem/financedatarepayment',
                                nameTwo: '还款一览表',
                                id: 140051,
                            }, {
                                hash: '/financialsystem/financedataloan',
                                nameTwo: '放款一览表',
                                id: 140052,
                            },]
                        },
                        {
                            hash: '/financialsystem',
                            nameTwo: '薪酬体系',
                            id: 140006,
                            childrenList: [{
                                hash: '/financialsystem/salarycustomermanager',
                                nameTwo: '客户经理',
                                id: 140061,
                            }, {
                                hash: '/financialsystem/salarysalesmanager',
                                nameTwo: '营业部经理',
                                id: 140062,
                            }, {
                                hash: '/financialsystem/salarytrusttrial',
                                nameTwo: '信审',
                                id: 140063,
                            }, {
                                hash: '/financialsystem/salaryTrusttrialqu',
                                nameTwo: '区域信审',
                                id: 140063,
                            }, {
                                hash: '/financialsystem/salarytimesheet',
                                nameTwo: '考勤',
                                id: 140064,
                            }, {
                                hash: '/financialsystem/Regionaltotal',
                                nameTwo: '区域总',
                                id: 140067,
                            }, {
                                hash: '/financialsystem/salesmanEvaluation',
                                nameTwo: '业务员操作评价',
                                id: 140067,
                            },
                             {
                                hash: '/financialsystem/Rewardspunishment',
                                nameTwo: '还款比例奖惩',
                                id: 140067,
                            },]
                        }
                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    name: "逾期列表",
                    hash: "/Overduelist",
                    status: false,
                    id: 160000,
                    list: [
                        {
                            hash: '/Overduelist/Overduelists',
                            nameTwo: '逾期列表',
                            id: 160001,
                            childrenList: []
                        },

                        {
                            hash: '/Overduelist/collectionmember',
                            nameTwo: '催收员',
                            id: 160002,
                            childrenList: []
                        },
                         {
                            hash: '/Overduelist/dianOverduelists',
                            nameTwo: '电催逾期列表',
                            id: 160003,
                            childrenList: []
                        },
                         {
                            hash: '/Overduelist/faOverduelists',
                            nameTwo: '法催逾期列表',
                            id: 160004,
                            childrenList: []
                        },
                        {
                            hash: '/Overduelist/collection',
                            nameTwo: '催回列表',
                            id: 160004,
                            childrenList: []
                        },
                        {
                            hash: '/Overduelist/diancollection',
                            nameTwo: '电催回列表',
                            id: 160004,
                            childrenList: []
                        },
                        {
                            hash: '/Overduelist/methodrushrush',
                            nameTwo: '法催回列表',
                            id: 160004,
                            childrenList: []
                        }
                    ]



                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    name: "平台数据",
                    hash: "/platformData",
                    status: false,
                    id: 150000,
                    list: [
                        {
                            hash: '/platformData/loanStatistics',
                            nameTwo: '放款统计',
                            id: 150001,
                            childrenList: []
                        },
                        {
                            hash: '/platformData/repaymentStatistics',
                            nameTwo: '还款统计',
                            id: 150002,
                            childrenList: []
                        },
                        {
                            hash: '/platformData/repaymentDetailsDayStatistics',
                            nameTwo: '当日还款统计',
                            id: 150009,
                            childrenList: []
                        },
                        {
                            hash: '/platformData/pushBackRate',
                            nameTwo: '催回率',
                            id: 150003,
                            childrenList: []
                        },
                        {
                            hash: '/platformData/overdueStatistics',
                            nameTwo: '逾期统计',
                            id: 150004,
                            childrenList: []
                        },
                        {
                            hash: '/platformData/firstTrialRejectionStatistics',
                            nameTwo: '初审拒件统计',
                            id: 150005,
                            childrenList: []
                        },
                        {
                            hash: '/platformData/rankingStatisticsSalesDepartment',
                            nameTwo: '排名统计（营业部经理）',
                            id: 150006
                        },
                        {
                            hash: '/platformData/rankingStatisticsAddress',
                            nameTwo: '排名统计（区域）',
                            id: 150007,
                            childrenList: []
                        },
                        {
                            hash: '/platformData/rankingStatisticsClient',
                            nameTwo: '排名统计（客户经理）',
                            id: 150008,
                            childrenList: []
                        },
                        {
                            hash: '/platformData/TomorrowStatistics',
                            nameTwo: '明日还款统计',
                            id: 150008,
                            childrenList: []
                        },
                         {
                            hash: '/platformData/deductPercentage',
                            nameTwo: '扣款比例',
                            id: 150009,
                            childrenList: []
                        },
                        {
                            hash: '/platformData/earlywarning',
                            nameTwo: '业务员逾期预警',
                            id: 150009,
                            childrenList: []
                        },

                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    name: "合同管理",
                    hash: "/contractManage",
                    status: false,
                    id: 180000,
                    list: [
                        {
                            hash: '/contractManage/contractManage',
                            nameTwo: '合同管理',
                            id: 180001,
                            childrenList: []
                        }


                    ]
                },
                {
                    img: require("@res/img/icon-yewu.png"),
                    name: "通知栏目",
                    hash: "/noticesAre",
                    status: false,
                    id: 170000,
                    list: [
                        {
                            hash: '/noticesAre/noticesAre',
                            nameTwo: '通知栏目',
                            id: 160001,
                            childrenList: []
                        }


                    ]
                }

            ]
        };
    },
    computed: {
        list() {
            let leftList = [];
            for (let key in this.listInfo) {
                if (authInfo.ids.indexOf(this.listInfo[key].id) >= 0) {
                    let childrenList = [];
                    if (this.listInfo[key].list) {
                        for (let key2 in this.listInfo[key].list) {
                            if (authInfo.ids.indexOf(this.listInfo[key].list[key2].id) >= 0) {
                                childrenList.push(this.listInfo[key].list[key2]);
                            }
                        }
                        this.listInfo[key].list = childrenList;
                    }
                    leftList.push(this.listInfo[key]);
                }
            }
            return leftList;
        },
        ...mapGetters([
            'isCollapse'
        ])
    },
    created() {
        this.getMenuList(); //获取菜单
    },
    mounted() {
        this.listInfo.map((item, index) => {
            if (window.location.href.indexOf(item.hash) != -1) {
                item.status = true;
            }
        })
    },
    methods: {
        statusFlag: function(item, listInfo) {
            let status = !item.status;
            for (let list in listInfo) {
                listInfo[list].status = false;
            }
            item.status = status;
        },
        setActiveIndex(index) {
            this.activeIndex = index + '';
        },
        //获取菜单
        getMenuList() {
            ajax({
                url: 'auth/getAccessControlUrl',
            }).post()
                .then(res => {
                    // console.log(res)
                    this.listInfo1 = res.data ? res.data : [];
                    // console.log(res.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        Collapse() {
            // console.log(this.$store.getters.isCollapse);
            this.$store.dispatch('SETISCOLLAPSE', { isCollapse: this.$store.getters.isCollapse });
        },
        go_url(childrenList) {
            if (childrenList.childrenList.length == 0) {
                this.$router.push(childrenList.hash)
            }
        }
    }
    //.el-menu-item-group__title
};
</script>
<style rel="stylesheet/less" lang="less">
.leftNav2 {
    transition: width .28s;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 11;
    height: 100%;
    background: #ffffff;
    .left_login {
        width: 228px;
        height: 50px;
        background: #000;
        position: relative;
        &.Collapse2 {
            width: 64px;
            height: 50px;
            background: #000;
            .left_logo{
                img{
                    width:64px;
                    height:50px;
                }
            }
        }
        .collapseImg {
            position: absolute;
            right: 10px;
            top: 16px;
            img {
                width: 15px;
                height: 15px;
            }
            &.Collapse3 {
                position: absolute;
                top: 16px;
            }
        }
    }
    /*// 导航*/
    .listBox{
        margin: 0 15px;
        padding-top:15px;
        max-height:100%;
        overflow-y: auto;
        /*三角箭头的颜色*/
        scrollbar-arrow-color: transparent;
        /*滚动条滑块按钮的颜色*/
        scrollbar-face-color: transparent;
        /*滚动条整体颜色*/
        scrollbar-highlight-color: transparent;
        /*滚动条阴影*/
        scrollbar-shadow-color: transparent;
        /*滚动条轨道颜色*/
        scrollbar-track-color: transparent;
        /*滚动条整体部分,必须要设置*/
        &::-webkit-scrollbar{
            width: 2px;
            height: 2px;
            background-color: transparent;
        }
        /*滚动条的轨道*/
        &::-webkit-scrollbar-track{
            box-shadow: none;
            background-color: transparent;
        }
        >.el-menu{
            >.el-submenu{
                position: relative;
                /*// title颜色*/
                >.el-submenu__title{
                    background: #1e282c;
                    color:#fff;
                    font-size:12px!important;
                }
                /*//title加遮罩*/
                >.el-submenu__title::before{
                    content: "";
                    display: block;
                    width:100%;
                    height:100%;
                    background: rgba(80,99,119,0.5);
                    position: absolute;
                    z-index: 1;
                    left: 0;
                    top: 0;
                }
                /*//导航打开遮罩消失*/
                &.is-opened{
                    >.el-submenu__title::before{
                        display: none;
                    }
                     >.el-submenu__title{
                        border-left: 3px solid #3c8dbc;
                    }
                }
                /*//二级背景和鼠标滑过颜色和字体颜色*/
                >.el-menu{
                    background: #2c3b41;
                    border-radius: 0;
                    >.el-menu-item-group{
                        >ul{
                            >.el-menu-item{
                                color: #b8c7ce;
                                font-size:12px!important;
                            }
                             >.el-menu-item:hover{
                                color: #fff;
                                background: #2c3b41;
                            }
                             /*//2级头*/
                            >.el-submenu{
                                >.el-submenu__title{
                                    color: #b8c7ce;
                                    font-size:12px!important;
                                }
                                >.el-submenu__title:hover{
                                    color: #fff;
                                    background: #2c3b41;
                                }
                                /*// 三级*/
                                >.el-menu {
                                    background: #2c3b41;
                                    >.el-menu-item{
                                        color: #b8c7ce;
                                        font-size:12px!important;
                                    }
                                    >.el-menu-item:hover{
                                    color: #fff;
                                        background: #2c3b41;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            /*//鼠标滑过title*/
            >.el-submenu:hover {
                 >.el-submenu__title::before{
                    display: none;
                }
                >.el-submenu__title{
                   border-left: 3px solid #3c8dbc;
                }
            }
        }
        &.Collapse{
            height: 100%;
            border: none;
            overflow: auto;
            position: absolute;
            width: 64px;
            margin: 0;
            /*三角箭头的颜色*/
            scrollbar-arrow-color: transparent;
            /*滚动条滑块按钮的颜色*/
            scrollbar-face-color: transparent;
            /*滚动条整体颜色*/
            scrollbar-highlight-color: transparent;
            /*滚动条阴影*/
            scrollbar-shadow-color: transparent;
            /*滚动条轨道颜色*/
            scrollbar-track-color: transparent;
            /*滚动条整体部分,必须要设置*/
            &::-webkit-scrollbar{
                width: 2px;
                height: 2px;
                background-color: transparent;
            }
            /*滚动条的轨道*/
            &::-webkit-scrollbar-track{
                box-shadow: none;
                background-color: transparent;
            }
            /*滚动条的滑块按钮*/
            &::-webkit-scrollbar-thumb{
                border-radius: 0;
                background-color: transparent;
                box-shadow: none;
            }
            /*滚动条的上下两端的按钮*/
            &::-webkit-scrollbar-button{
                height: 0;
                background-color: transparent;
            }
        }
    }  
}

.nav_img {
    width: 24px;
    text-align: center;
    margin-right: 10px;
    display: inline-block;
}
</style>

