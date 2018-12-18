<template>
    <div class="app-container calendar-list-container">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getApplyList">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="params.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="时间">
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
            <el-form-item label="客户订单号" prop="orderNum">
                <el-input type="text" v-model="params.orderNum" placeholder="请输入客户订单号"></el-input>
            </el-form-item>
            <el-form-item label="平账状态" prop="isBalanced ">
                <el-select v-model="params.isBalanced" placeholder="请选择平账状态">
                    <el-option v-for="item in storage.isBalancedStatus" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" type="primary" icon="search" @click="getApplyList" style="margin-left: 20px;">搜索
                </el-button>
                <el-button class="filter-item" @click="reset('params')" type="primary" icon="setting" style="margin-left: 20px;">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">第三方扣款</div>-->
            <div class="tablelayer">
                <!--序号	商户账户编号	客户订单号	易宝流水号	请求时间	订单金额	手续费	手续费明细(鉴权手续费/元;支付手续费/元)	清算时间	商户批次号	易宝批次号	交易成功时间	备注	支付状态	支付方式	是否平账	详情-->

                <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="序号" width="60">
                        <template scope="scope">
                            <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商户账户编号" width="120">
                        <template scope="scope">
                            <span>{{scope.row.batchNum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="客户订单号" width="170">
                        <template scope="scope">
                            {{scope.row.orderNum}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="易宝流水号" width="200">
                        <template scope="scope">
                            <span>{{scope.row.yborderid}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="请求时间" width="160">
                        <template scope="scope">
                            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单金额" width="90">
                        <template scope="scope">
                            {{scope.row.orderMoney | formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="手续费" width="90">
                        <template scope="scope">
                            {{scope.row.fee | formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="手续费明细(鉴权手续费/元;支付手续费/元)" width="150">
                        <template scope="scope">
                            {{scope.row.feeDetails}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="清算时间" width="160">
                        <template scope="scope">
                            <span>{{scope.row.overTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商户批次号" width="120">
                        <template scope="scope">
                            {{scope.row.orderNo}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="易宝批次号" width="120">
                        <template scope="scope">
                            {{scope.row.ybNo}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="交易成功时间" width="160">
                        <template scope="scope">
                            <span>{{scope.row.successDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="备注" width="100">
                        <template scope="scope">
                            {{scope.row.note}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支付状态" width="90">
                        <template scope="scope">
                            {{scope.row.status|payStatusFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支付方式" width="90">
                        <template scope="scope">
                            {{scope.row.way}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否平账" width="90">
                        <template scope="scope">
                            {{scope.row.isBalanced | isBalancedFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="详情" fixed="right" width:="80">
                        <template scope="scope">
                            {{scope.row.result}}
                        </template>
                    </el-table-column>
                </el-table>
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
import { storage } from '@constants/dataStorage';
import { formatTime } from '@filters/index';
export default {
    data() {
        return {
            listLoading: true, //列表加载状态
            params: {
                pageSize: 10,
                pageIndex: 1,
                orderNum: '', //订单号
                isBalanced: '', //平账状态
                dateFrom: '', //开始时间
                dateTo: '' //结束时间
            },
            total: 0,
            time: null,
            dataList: [],
            storage: storage, //数据存储
            datevalue: [], //搜索时间
        }
    },
    computed: {

    },
    created() {
        this.getApplyList();
    },
    mounted() {
    },
    methods: {
        //获取列表
        getApplyList(isSeach) {
            if (isSeach) {
                this.params.pageIndex = 1;
            }
            this.listLoading = true;
            ajax({
                url: 'financeBalanceAccount/thirdRepayBalance',
                optionParams: this.params
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        this.dataList = res.data;
                        this.total = res.total;
                    } else {

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
            this.params.pageIndex = val;
            this.getApplyList();
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.params.pageIndex = val;
            this.getApplyList();
        },
        //重置
        reset(formName) {
            this.time = '';
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        }

    },
    filters: {}
}
</script>
<style lang="less" scoped>

</style>





