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
                <el-input type="text" v-model="params.userName" placeholder="请输入借款人"></el-input>
            </el-form-item>
            <el-form-item label="申请产品" prop="prodId">
                <el-select v-model="params.prodId" placeholder="请选择申请产品">
                    <el-option v-for="item in  proddataList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单来源" prop="source">
                <el-select v-model="params.source" placeholder="请选择订单来源">
                    <el-option v-for="item in storage.source" :key="item.id" :label="item.label" :value="item.id"></el-option>
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
            <el-form-item label="放款时间">
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
                <el-button type="primary" icon="search" @click="getApplyList(true)">查询</el-button>
                <el-button @click="reset('params')" icon="setting">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">放款中订单</div>-->
            <div class="tablelayer">
                <!--序号 	订单编号	放款时间	借款人	申请产品	合同借款金额	实际放款金额	借款期数	已还期数	每期还款金额	业务员	门店	订单来源	订单状态	当期状态	操作	刷新放款状态-->
                <div class="tablelayer">
                    <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                        <el-table-column align="center" label="序号" width="100">
                            <template scope="scope">
                                <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单编号" width="180">
                            <template scope="scope">
                                <span>{{scope.row.orderNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="放款时间" width="160">
                            <template scope="scope">
                                <span>{{scope.row.loanReleaseTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="借款人">
                            <template scope="scope">
                                 <img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua">
                                {{scope.row.name}}
                                <img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单状态" width="90">
                            <template scope="scope">
                                {{scope.row.loan_status|loan_statusFilter}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="申请产品" width="90">
                            <template scope="scope">
                                {{scope.row.productName}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="合同借款金额" width="120">
                            <template scope="scope">
                                {{scope.row.agreementAmount | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="实际放款金额" width="120">
                            <template scope="scope">
                                {{scope.row.realPayAmout | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="借款期数" width="90">
                            <template scope="scope">
                                {{scope.row.loanTerm}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="已还期数" width="90">
                            <template scope="scope">
                                {{scope.row.alreadyPayTerm}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="每期还款金额" width="120">
                            <template scope="scope">
                                {{scope.row.eachmoney | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="业务员" width="90">
                            <template scope="scope">
                                {{scope.row.adminName}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="门店" width="100">
                            <template scope="scope">
                                {{scope.row.shopName}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单来源" width="90">
                            <template scope="scope">
                                {{scope.row.source|sourceFilter}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="当期状态" width="90">
                            <template scope="scope">
                                {{scope.row.repaymentStatus|noworderstatusFilter}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="70" fixed="right">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="$router.push({path:'makemoneyongoingmoneydetail', query:{data: JSON.stringify(scope.row)}})">查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="刷新放款状态" fixed="right">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="getApplyList">刷新</el-button>
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
        return {
            listLoading: false, //列表加载状态
            params: {
                pageSize: 10,
                pageIndex: 1,
                userName: null,
                prodId: null,
                source: null,
                shopId: null,
                adminId: null,//业务员id
                dateFrom: '',
                dateTo: ''
            },
            total: 0,
            time: null,
            dataList: [],
            shopdataList: [],//店铺信息
            imgxu: require('@res/img/aa.png'),//续贷图片
            imgxua: require('@res/img/aaa.png'),//续贷图片
            adminsData: [], //显示业务员
            proddataList: [],//产品信息
            storage: storage, //数据存储
        }
    },
    computed: {},
    created() {
        this.getApplyList();
        this.getShop_area(); //获取门店和区域
        this.getprodList();
    },
    mounted() {
    },
    methods: {
        // 获取产品信息
        getprodList() {
            ajax({
                url: 'choicesData/queryByKey',
                optionParams: { key: "product" },
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        this.proddataList = res.data;
                    } else {
                        this.$message.warning(res.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
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
                url: 'financeLoan/listLoanIn',
                optionParams: this.params
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        this.dataList = res.data;
                        this.total = res.total;
                    } else {
                        this.$message.warning(res.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                })
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
        },
        //选择时间
        tTimeChange(value) {
            formatTime(value, this, 'params', 'dateFrom', 'dateTo');
        },
    },
    filters: {
        noworderstatusFilter(code) {//当期订单状态
            if (code == '0') {
                return "无"
            } else if (code == '10') {
                return "未还款（正常）"
            } else if (code == '11') {
                return "逾期"
            } else if (code == '20') {
                return "已还款"
            }
        },
        // 10:请求中 11 放款执行中(锁住入队列) 12、放款中(待确认是否成功) 13、放款失败 14、放款成功', ,
        loan_statusFilter(code) {//订单状态
            if (code == '10') {
                return "请求中"
            } else if (code == '11') {
                return "放款执行中"
            } else if (code == '12') {
                return "放款中(待确认是否成功)"
            } else if (code == '13') {
                return "放款失败"
            } else if (code == '14') {
                return "放款成功"
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>





