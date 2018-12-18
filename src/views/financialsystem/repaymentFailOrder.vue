<template>
    <div class="app-container calendar-list-container">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getApplyList(true)">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="params.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="借款人" prop="userName">
                <el-input type="text" v-model="params.userName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="订单来源" prop="source">
                <el-select v-model="params.source" placeholder="请选择订单来源">
                    <el-option v-for="item in storage.source" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="还款渠道" prop="repayType">
                <el-select v-model="params.repayType" placeholder="请选择还款渠道">
                    <el-option v-for="item in storage.ReimbursementChannelsSeach" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属门店" prop="shopId">
                <el-select v-model="params.shopId" placeholder="请选择所属门店" @change="shopChange">
                    <el-option v-for="item in shopdataList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务员" prop="adminId">
                <el-select v-model="params.adminId" placeholder="请选择业务员" :disabled="!params.shopId">
                    <el-option v-for="item in adminsData" :key="item.adminId" :label="item.adminName" :value="item.adminId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="实际扣款时间">
                <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="tTimeChange"></el-date-picker>
            </el-form-item>
            <div v-show="false">
                <el-form-item label="开始时间" prop="dateFrom">
                    <el-input v-model="params.dateFrom" placeholder="开始"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="dateTo">
                    <el-input v-model="params.dateTo" placeholder="结束"></el-input>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button class="filter-item" type="primary" icon="search" @click="getApplyList(true)" style="margin-left: 20px;">查询
                </el-button>
                <el-button class="filter-item" @click="reset('params')" type="primary" icon="setting" style="margin-left: 20px;">重置
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">还款失败订单</div>-->
            <div class="tablelayer">
                <!--订单编号	放款时间	借款人	申请产品	合同借款金额	实际放款金额	借款期数	已还期数	每期还款金额	业务员	门店	订单来源	订单状态	当期状态	操作-->
                <div class="tablelayer">
                    <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">

                        <el-table-column align="center" label="序号" width="100">
                            <template scope="scope">
                                <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单编号" width="200">
                            <template scope="scope">
                                <span>{{scope.row.orderNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="借款人">
                            <template scope="scope">
                                 <img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua">
                                {{scope.row.name}}
                                <img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单状态">
                            <template scope="scope">
                                {{scope.row.repaymentStatus | RepaymentOrderStatus}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="手机号码">
                            <template scope="scope">
                                {{scope.row.phone}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="合同借款金额">
                            <template scope="scope">
                                {{scope.row.agreementAmount | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="实际放款金额">
                            <template scope="scope">
                                {{scope.row.realPayAmout | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="每期还款金额">
                            <template scope="scope">
                                {{scope.row.eachmoney | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="已还期数">
                            <template scope="scope">
                                {{scope.row.alreadyPayTerm}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="门店">
                            <template scope="scope">
                                {{scope.row.shopName}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单来源">
                            <template scope="scope">
                                <span v-show="item.id == scope.row.source" v-for="(item,index) in storage.source" v-text="item.label" :key="index"></span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="还款渠道">
                            <template scope="scope">
                                <span v-show="item.id == scope.row.repayType" v-for="(item,index) in storage.ReimbursementChannels" v-text="item.label" :key="index"></span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="$router.push({path:'makemoneyNotMoneyDetail', query:{data: JSON.stringify(scope.row)}})">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { formatTime } from '@src/filters';
import { storage } from '@constants/dataStorage';
export default {
    data() {
        var validatP = (rule, value, callback) => {
            if (!validatPhone(value))
                callback(new Error('手机格式错误!'))
            callback();
        };
        return {
            listLoading: true, //列表加载状态
            params: {
                pageSize: 10,
                pageIndex: 1,
                userName: null,
                source: null, //订单来源
                shopId: null,
                adminId: null,//业务员id
                repayType: '', //还款渠道
                dateFrom: null, //开始
                dateTo: null, //结束时间
            },
            total: 0,
            time: null,
            dataList: [],
            shopdataList: [],//店铺信息
            imgxu: require('@res/img/aa.png'),//续贷图片
            imgxua: require('@res/img/aaa.png'),//续贷图片
            adminsData: [],//业务员信息
            proddataList: [],//店铺信息
            storage: storage, //数据存储
        }
    },
    computed: {},
    created() {
        this.getApplyList();
        this.getShop_area(); //获取门店和区域
    },
    mounted() {
    },
    methods: {
        //获取门店和区域
        getShop_area() {
            ajax({
                url: 'PlatformData/UserPower',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        let data = response.data;
                        this.shopdataList = data.shops ? data.shops : [];
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //门店所属业务员
        shopChange(value) {
            this.params.adminId = '';
            this.adminsData = [];
            this.shopdataList.map((item) => {
                if (value == item.shopId) {
                    this.adminsData = item.children;
                }
            })
        },
        //获取列表
        getApplyList(isSeach) {
            if (isSeach) {
                this.params.pageIndex = 1;
            }
            this.listLoading = true;
            ajax({
                url: 'financeRepay/repayFailOrderList',
                optionParams: this.params
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        this.dataList = res.data;
                        this.total = res.total;
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //选择时间
        tTimeChange(value) {
            formatTime(value, this, 'params', 'dateFrom', 'dateTo');
        },
        // 改变每一页的条数
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.params.pageIndex = 1;
            this.getApplyList();
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.params.pageIndex = val;
            this.getApplyList();
        },
        //重置表单
        reset(formName) {
            this.time = '';
            this.$refs[formName].resetFields();
        }
    },
    filters: {
    }
}
</script>
<style lang="less" scoped>

</style>





