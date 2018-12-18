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
            <el-form-item label="姓名" prop="userName">
                <el-input type="text" v-model="params.userName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号" prop="cardNum">
                <el-input  v-model="params.cardNum" placeholder="请输入银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="所属门店" prop="shopId">
                <el-select v-model="params.shopId " placeholder="请选择所属门店">
                    <el-option v-for="item in shop" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
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
            <el-form-item label="商户订单号（易宝）" prop="orderId" style="">
                <el-input type="text" v-model="params.orderId " placeholder="请输入商户订单号"></el-input>
            </el-form-item>
            <el-form-item label="订单状态" prop="status">
                <el-select v-model="params.status" placeholder="请选择订单状态">
                    <el-option v-for="item in orderstatus" :key="item.id" :label="item.label" :value="item.id"></el-option>
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
        <!--序号	订单编号	支付订单时间	借款人姓名	商户订单号（易宝）	支付银行	银行卡号	订单金额	订单状态	错误信息	流水号（备注）-->
        <!--					订单状态		-->
        <div class="filter-container">
            <!--<div class="tableheader">打款记录</div>-->
            <div class="tablelayer">
                <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="序号" width="100">
                        <template scope="scope">
                            <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单编号">
                        <template scope="scope">
                            <span>{{scope.row.orderNum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支付订单时间" width="200">
                        <template scope="scope">
                            <span>{{scope.row.timeCreate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="借款人姓名">
                        <template scope="scope">
                             <img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua">
                            {{scope.row.name}}
                            <img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单状态">
                        <template scope="scope">
                            {{scope.row.status | MoneyRecord}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商户订单号（易宝）">
                        <template scope="scope">
                            {{scope.row.orderId}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支付银行">
                        <template scope="scope">
                            {{scope.row.bankName}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="银行卡号">
                        <template scope="scope">
                            {{scope.row.bankCardNumber}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单金额">
                        <template scope="scope">
                            {{scope.row.amount | formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="错误信息">
                        <template scope="scope">
                            {{scope.row.loanMsg}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="流水号（备注）">
                        <template scope="scope">
                            {{scope.row.batchNo}}
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
import { formatTime, orderStatusnewFilter } from '@filters/index';
export default {
    data() {
        var validatP = (rule, value, callback) => {
            if (!validatPhone(value))
                callback(new Error('手机格式错误!'))
            callback();
        };
        return {
            listLoading: false, //列表加载状态
            params: {
                pageSize: 10,
                pageIndex: 1,
                userName: '',
                cardNum: '',
                shopId: '',
                orderId: '',
                status: '',
                dateFrom: '',
                dateTo: ''
            },
            total: '',
            time: '',
            dataList: [],
            shop: [],//店铺信息
            imgxu: require('@res/img/aa.png'),//续贷图片
            imgxua: require('@res/img/aaa.png'),//续贷图片
            storage: storage, //数据存储
            orderstatus: [
                { label: '请求中', id: '10' },
                { label: '放款中', id: '11' },
                { label: '放款失败', id: '12' },
                { label: '放款成功', id: '13' },
            ]
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
                        this.shop = data.shops ? data.shops : [];
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //获取列表
        getApplyList(isSeach) {
            console.log("================")
            console.log(this.params)
            if (isSeach) {
                this.params.pageIndex = 1;
            }
            this.listLoading = true;
            ajax({
                url: 'financeBalanceAccount/listThirdOrderPaymentLog',
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
        }
    },
    filters: {
        MoneyRecord(code) { //打款记录状态
            if (code == '10') {
                return "请求中"
            } else if (code == '11') {
                return "放款中"
            } else if (code == '12') {
                return "放款失败"
            } else if (code == '13') {
                return "放款成功"
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>





