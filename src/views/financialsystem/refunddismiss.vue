<template>
    <div class="app-container calendar-list-container ggg_user">
         <!-- 搜索条件 -->
        <!--<el-form :inline="true" :model="params"  ref="params"  class="demo-form-inline" @keyup.enter.native="getTable('isseach')">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input  v-model="params.pageIndex"></el-input>
            </el-form-item>
                <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input  v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="用户" prop="name">
                <el-input  v-model="params.name"  placeholder="用户"></el-input>
            </el-form-item>
             <el-form-item label="手机号" prop="phone">
                <el-input  v-model="params.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
                 <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                 <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>-->
         <div class="filter-container">
            <!--<div class="tableheader">跳过认证状态</div>-->
            <el-table :data="dataList" v-loading="listLoading"  border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="100">
                    <template scope="scope">
                        <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单号">
                    <template scope="scope">
                        {{scope.row.orderNum}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="借款人">
                    <template scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="银行卡号">
                    <template scope="scope">
                        {{scope.row.bankCardNum}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="退款金额">
                    <template scope="scope">
                        {{scope.row.amount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="时间">
                    <template scope="scope">
                        {{scope.row.time}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" >
                    <template scope="scope">
                        <span v-if='scope.row.status==1'>退款中</span>
                        <span v-if='scope.row.status==2'>退款失败</span>
                        <span v-if='scope.row.status==3'>退款成功</span>
                        <span v-if='scope.row.status==4'>驳回</span>
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
export default {
    data() {
        return {
            listLoading: false, //列表加载状态
            params: { //搜索条件
                pageSize: 10, 
                pageIndex: 1, 
//              name: '', //用户名字
//              phone: ''//手机号码
            },
            row:'',//认证状态数据
            total: 0, //总页数
            dataList: [
                {name: 1}
            ],
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
        getTable (isseach) {
            this.listLoading = true;
            if (isseach) {
                this.params.pageIndex = 1;
            }
            ajax({
                url: 'financeBalanceAccount/showRefundList',
                optionParams: this.params
            }).post()
            .then(response => {
                if (response.code === 200) {
                    this.dataList = response.data ? response.data : [];
                    this.total = response.total
                } else {
                    this.$message.warning(response.message)
                }
                this.listLoading = false;
            })
            .catch(error => {
                console.log(error)
                this.listLoading = false;
            })
        },
       
         //重置
        reset(formName) {
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
.isRote{
    transform: rotate(90deg);
}
.tablelayer{
    // padding:20px 0!important;
}
</style>


