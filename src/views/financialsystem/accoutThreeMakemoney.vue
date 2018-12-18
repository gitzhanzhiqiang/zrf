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
            <el-form-item label="姓名" prop="userName">
                <el-input type="text" v-model="params.userName" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item label="商户订单号" prop="orderNum">
                <el-input v-model="params.orderNum" placeholder="请输入商户订单号"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号" prop="cardNum">
                <el-input v-model="params.cardNum" placeholder="请输入银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="银行状态" prop="status">
                <el-select v-model="params.status" placeholder="请选择银行状态">
                    <el-option v-for="item in storage.bankStatus" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="平账状态" prop="isBalanced">
                <el-select v-model="params.isBalanced" placeholder="请选择平账状态">
                    <el-option v-for="item in storage.isBalancedStatus" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getApplyList(true)">搜索</el-button>
                <el-button @click="reset('params')" icon="setting">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container" style="overflow:hidden;">
            <div style="float:right;">
                <el-button type="primary" class="iconfont icon-xiazai1" @click=""> 下载</el-button>
            </div>
        </div>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">第三方打款</div>-->
            <div class="tablelayer">
                <!--序号	商户批次号	商户订单号	创建时间	银行名称	户名	账号 	打款金额	手续费	实付金额	易宝状态	扣账状态	银行状态	平账状态-->
                <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="序号" width="50">
                        <template scope="scope">
                            <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商户批次号" width="150">
                        <template scope="scope">
                            <span>{{scope.row.batchNum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商户订单号" width="150">
                        <template scope="scope">
                            {{scope.row.orderNum}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="创建时间">
                        <template scope="scope">
                            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="银行名称" width="100">
                        <template scope="scope">
                            <span>{{scope.row.bankName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="户名">
                        <template scope="scope">
                            <span>{{scope.row.username}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="账号">
                        <template scope="scope">
                            <span>{{scope.row.cardNum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="打款金额">
                        <template scope="scope">
                            <span>{{scope.row.payMoney | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="手续费">
                        <template scope="scope">
                            <span>{{scope.row.fee | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="实付金额">
                        <template scope="scope">
                            <span>{{scope.row.actMoney |formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="易宝状态">
                        <template scope="scope">
                            <span>{{scope.row.ybStatus |ybStatusFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="扣账状态">
                        <template scope="scope">
                            <span>{{scope.row.payStatus | payStatusFilter }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="银行状态">
                        <template scope="scope">
                            <span>{{scope.row.bankStatus | bankStatusFilter }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="平账状态">
                        <template scope="scope">
                            <span>{{scope.row.isBalanced | isBalancedFilter}}</span>
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
import { formatTime } from '@src/filters';
import { storage } from '@constants/dataStorage';
export default {
    data() {
        return {
            listLoading: true, //列表加载状态
            params: {
                pageSize: 10,
                pageIndex: 1,
                userName: '',
                orderNum: '',
                cardNum: '',
                status: null,//银行状态
                isBalanced: '', //平账状态
                dateFrom: null, //开始
                dateTo: null, //结束时间
            },
            total: 0,
            dataList: [],
            time: '',
            storage: storage //数据存储
        }

    },
    computed: {},
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
                url: 'financeBalanceAccount/listThirdPaymentBalance',
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





