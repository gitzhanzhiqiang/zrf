<template>
    <div class="app-container calendar-list-container ggg_user">
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

            <el-form-item label="商户订单号" prop="requestNo">
                <el-input  v-model="params.requestNo" placeholder="请输入商户订单号"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号" prop="bankCardNo">
                <el-input v-model="params.bankCardNo" placeholder="请输入银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="所属门店" prop="shopId">
                <el-select v-model="params.shopId " placeholder="请选择所属门店">
                    <el-option v-for="item in shop" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getApplyList(true)">搜索</el-button>
                <el-button @click="reset('params')" icon="setting">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">操作记录</div>-->
            <div class="tablelayer">
                <!--序号	商户批次号	商户订单号	创建时间	银行名称	户名	账号 	打款金额	手续费	实付金额	易宝状态	扣账状态	银行状态	平账状态-->
                <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="序号" width="80">
                        <template scope="scope">
                            <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单编号" width="150">
                        <template scope="scope">
                            <span>{{scope.row.orderNum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="借款人姓名" width="100">
                        <template scope="scope">
                            <span>{{scope.row.userName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="开始期数" width="180">
                        <template scope="scope">
                            <span>{{scope.row.periodTop }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="结束期数" width="180">
                        <template scope="scope">
                            <span>{{scope.row.periodLast}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商户订单号" width="180">
                        <template scope="scope">
                            {{scope.row.requestNo}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="还款方式" width="100">
                        <template scope="scope">
                            <span v-show="item.id == scope.row.repayType" v-for="(item,index) in storage.ReimbursementChannels" v-text="item.label" :key="index"></span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="订单金额">
                        <template scope="scope">
                            <span>{{scope.row.amount | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作记录">
                        <template scope="scope">
                            <span v-if='scope.row.type==0'>修改失败</span>
                            <span v-if='scope.row.type==1'>修改成功</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作时间">
                        <template scope="scope">
                            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
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
                requestNo: '',//商户订单号
                bankCardNo: '',//银行卡号
                shopId: '',//门店
                dateFrom: null, //开始
                dateTo: null //结束时间
            },
            total: 0,
            dataList: [],
            shop: [],//店铺信息
            time: '',
            storage: storage //数据存储
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
            if (isSeach) {
                this.params.pageIndex = 1;
            }
            this.listLoading = true;
            ajax({
                url: 'financeDelayPay/repayDelayHandLogList',
                optionParams: this.params
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        console.log(res)
                        this.dataList = res.data;
                         this.total = res.total
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





