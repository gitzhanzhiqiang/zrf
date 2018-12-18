<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="params.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="区域" prop="areaName">
                <el-select v-model="params.areaName" placeholder="请选择区域">
                    <el-option v-for="item in area" :key="item.id" :label="item.name" :value="item.id + ''">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="信审区域" prop="creditAdminName">
                <el-select v-model="params.creditAdminName" placeholder="请选择区域">
                    <el-option v-for="item in areacredit" :key="item.id" :label="item.login_code" :value="item.id + ''">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期">
                <el-date-picker v-model="params.month" type="month" placeholder="选择月" ></el-date-picker>
            </el-form-item>
             <el-form-item label="职位" prop="roleId">
                <el-select v-model="params.roleId" placeholder="请选择">
                    <el-option key="4" label="营业部经理" value="4"></el-option>
                    <el-option key="6" label="信审" value="6"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('isSeach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <!--<div class="tableheader">放款统计</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="登录名">
                    <template scope="scope">
                        {{scope.row.loginCode}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="职位">
                    <template scope="scope">
                        {{scope.row.roleId}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="区域">
                    <template scope="scope">
                        {{scope.row.areaName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="信审区域">
                    <template scope="scope">
                        {{scope.row.creditAdminName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="还款比例">
                    <template scope="scope">
                        {{(scope.row.payRate*100).toFixed(2) | isNumber}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="奖金区域">
                    <template scope="scope">
                        {{scope.row.money | isNumber}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { formatTime, parseTime} from '@src/filters';
import { Common } from '@common/common';
export default {
    data() {
        return {
            listLoading: true, //列表加载状态
            params: { //搜索条件
                pageSize: 10,
                pageIndex: 1,
                areaName: '', //区域
                roleId:'',
                month: new Date(),
                creditAdminName:'',
            },
            area: [], //区域
            dataList: [],
             total: 0, //总页数
             areacredit:[],
        }
    },
    computed: {
    },
    created() {
        // this.yue()
        this.getShop_area(); //获取门店和区域
    },
    mounted() {
        this.getTable();
    },
    methods: {
        getTable(isSeach) {
            this.listLoading = true;
            this.params.month = parseTime(this.params.month, '{y}-{m}');
            ajax({
                url: 'financeSalarySystem/repaymentRewards',
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
        //获取门店和区域
        getShop_area() {
            ajax({
                url: 'PlatformData/UserPower',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response.data)
                        let data = response.data;
                        this.area = data.areas ? data.areas : [];
                       this.areacredit = data.areacredit ? data.areacredit : []

                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        yue() {
            let date = new Date;
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            month = (month < 10 ? "0" + month : month);
            this.params.month = year + '-' + month;
        },
        //重置
        reset(formName) {
            this.yue()
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
        isNumber(value) {
            if (value) {
                return value;
            } else {
                return 0;
            }

        }
    }
}
</script>
<style lang="less" scoped>

</style>


