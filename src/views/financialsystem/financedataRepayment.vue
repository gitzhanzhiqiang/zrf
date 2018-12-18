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
            <el-form-item>
                <el-button class="filter-item" type="primary" icon="search" @click="getApplyList" style="margin-left: 20px;">搜索
                </el-button>
                <el-button class="filter-item" @click="reset('params')" type="primary" icon="setting" style="margin-left: 20px;">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <!--序号	订单编号	支付订单时间	借款人姓名	商户订单号（易宝）	支付银行	银行卡号	订单金额	订单状态	错误信息	流水号（备注）-->
        <!--					订单状态		-->
        <div class="filter-container">
            <!--<div class="tableheader">还款一览表</div>-->
            <!--@ApiModelProperty(value = "门店shopID") private Integer shopID; 
                @ApiModelProperty(value = "门店名") private String shopName; 
                @ApiModelProperty(value = "应还款额") private String shouldRepay;
                 @ApiModelProperty(value = "逾期费") private String overdueMoney; 
                 @ApiModelProperty(value = "实还款额") private String factRepay; 
                 @ApiModelProperty(value = "应还与实还差异额") private String diffMoney; 
                 @ApiModelProperty(value = "累计应还款额") private String accuShouldRepay; 
                 @ApiModelProperty(value = "累计逾期费") private String accuOverdueMoney; 
                 @ApiModelProperty(value = "累计实还款额") private String accuFactRepay; 
                 @ApiModelProperty(value = "累计应还与实还差异额") private String accuDiffMoney;-->
            <div class="tablelayer">
                <el-table :data="dataList" v-loading="listLoading" @current-change="handleCurrentChange" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="序号" width="100">
                        <template scope="scope">
                            <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="门店">
                        <template scope="scope">
                            <span>{{scope.row.shopName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应还款额">
                        <template scope="scope">
                            {{scope.row.shouldRepay}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="逾期费">
                        <template scope="scope">
                            {{scope.row.overdueMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="实际还款额">
                        <template scope="scope">
                            {{scope.row.factRepay}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应还与实还差异额">
                        <template scope="scope">
                            {{scope.row.diffMoney}}
                        </template>
                    </el-table-column>
                     <el-table-column align="center" label="支付宝还款金额">
                        <template scope="scope">
                            {{scope.row.aliAmount}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="累计逾期费">
                        <template scope="scope">
                            {{scope.row.accuOverdueMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="累计到期应还总额">
                        <template scope="scope">
                            {{scope.row.accuShouldRepay}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="累计已还总额">
                        <template scope="scope">
                            {{scope.row.accuFactRepay}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="累计应还与实还差异额">
                        <template scope="scope">
                            {{scope.row.accuDiffMoney}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 分页 -->
        <!--<div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>-->
    </div>
</template>
<script>
import ajax from '@utils/config';
import { validatPhone } from '@src/utils/validate';
import { storage } from '@constants/dataStorage';
import { parseTime, loanStatusFilter, bankStatusFilter, payStatusFilter, ybStatusFilter, isBalancedFilter, formatTime } from '@filters/index';
export default {
    data() {
        return {
            listLoading: true, //列表加载状态
            params: {
                pageSize: 100,
                pageIndex: 1,
                dateFrom: null,//查找开始时间
                dateTo: null//查找结束时间
            },
            total: '',
            dataList: [],
            storage: storage, //数据存储
            time: null, //时间
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
        getApplyList() {
            this.listLoading = true;
            ajax({
                url: 'PlatformData/getRepayViewTable',
                optionParams: this.params
            }).post()
                .then(res => {
                    console.log(res)
                    if (res.code === 200) {
                        this.dataList = res.data;
                        this.total = res.total;
                    } else {
                        this.$message.warning(res.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.listLoading = false;
                })
        },
        //鼠标悬浮当前行
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        // 改变每一页的条数
        handleSizeChange(val) {
            this.params.pageSize = val;
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
            this.$refs[formName].resetFields();
        },
        //选择时间
        tTimeChange(value) {
            formatTime(value, this, 'params', 'dateFrom', 'dateTo');
        },
    },
    filters: {
        orderstatusFilters(code) {
            if (code == '10') {
                return "请求中"
            } else if (code == '11') {
                return "放款中"
            } else if (code == '12') {
                return "放款失败"
            } else if (code == '13') {
                return "放款成功"
            } else {
                return "未知状态"
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>





