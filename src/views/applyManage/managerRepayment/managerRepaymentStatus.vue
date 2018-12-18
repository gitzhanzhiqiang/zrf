<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getTable('isseach')">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="params.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="借款人" prop="userName">
                <el-input v-model="params.userName" placeholder="请输入借款人"></el-input>
            </el-form-item>
            <el-form-item label="订单编号" prop="orderNum">
                <el-input v-model="params.orderNum" placeholder="请输入订单编号"></el-input>
            </el-form-item>
            <el-form-item label="申请时间">
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
                <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <!--<div class="tableheader">店长还款状态</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="100">
                    <template scope="scope">
                        <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单编号" width="130">
                    <template scope="scope">
                        {{scope.row.orderNum}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="借款人">
                    <template scope="scope">
                         <img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua">
                        {{scope.row.name}}
                        <img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号">
                    <template scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="合同放款金额">
                    <template scope="scope">
                        {{scope.row.agreementAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="借款期数">
                    <template scope="scope">
                        {{scope.row.loanTerm}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单状态">
                    <template scope="scope">
                        已放款
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单来源">
                    <template scope="scope">
                        <span v-for="item in storage.source" v-text="item.label" v-show="item.id == scope.row.source"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="还款金额" width="">
                    <template scope="scope">
                       {{scope.row.realPayAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属门店" width="130">
                    <template scope="scope">
                        {{scope.row.shopName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="提交时间" width="170">
                    <template scope="scope">
                        {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="错误信息" width="150">
                    <template scope="scope">
                        {{scope.row.errorMsg}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="错误信息" width="150">
                    <template scope="scope">
                        <span v-if='scope.row.repaySource == 1'>使用店长银行卡</span>
                         <span v-if='scope.row.repaySource == 2' style="color: red;">使用用户银行卡</span>  
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template scope="scope">
                        <span v-for="item in status" :key="item.id" v-text="item.label" v-show="item.id == scope.row.status"></span>
                    </template>
                </el-table-column>
            </el-table>
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
            params: { //搜索条件
                pageSize: 10,
                pageIndex: 1,
                userName: null, //用户名字
                orderNum: null,//订单编号
                dateFrom: null, //开始
                dateTo: null, //结束时间
            },
            time: null,
            storage: storage, //数据存储
            total: 1, //总页数
            dataList: [],
            imgxu: require('@res/img/aa.png'),//续贷图片
            imgxua: require('@res/img/aaa.png'),//续贷图片
            status: [
                { label: '待审核', id: 10 },
                { label: '驳回(失败)', id: 11 },
                { label: '待扣款', id: 20 },
                { label: '处理中', id: 21 },
                { label: '接口失败', id: 22 },
                { label: '成功', id: 23 }
            ]
        }
    },
    computed: {
    },
    created() {
        this.getTable();
    },
    mounted() {
    },
    methods: {
        getTable(isseach) {
            console.log(this.params)
            this.listLoading = true;
            if (isseach) {
                this.params.pageIndex = 1;
            }
            ajax({
                url: 'shopOwnerRepay/shopOwnerRepayOrderList',
                optionParams: this.params
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.dataList = response.data ? response.data : [];
                        this.total = response.total;
                    } else {
                        this.$message.warning(response.message)
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
        //重置
        reset(formName) {
            this.time = '';
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        },
        // 改变每一页的条数
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.params.pageIndex = 1;
            this.getTable(); //更新列表
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.params.pageIndex = val;
            this.getTable(); //更新列表
        },
    },
    filters: {

    }
}
</script>
<style lang="less" scoped>
.table {
    width: 700px;
    tr {
        td:first-child {
            text-align: center;
        }
        td:last-child {
            padding-left: 200px!important;
        }
    }
    tr:first-child {
        td {
            text-align: left;
            padding-left: 10px!important;
        }
    }
}
</style>


