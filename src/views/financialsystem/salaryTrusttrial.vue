<template>
    <div class="app-container calendar-list-container">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="optionParams" ref="optionParams" class="demo-form-inline" @keyup.enter.native="getApplyList('isseach')">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="optionParams.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="optionParams.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="日期">
               <el-date-picker v-model="optionParams.month" type="month" placeholder="选择月" @change="changeTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="筛选门店" prop="shopId">
                <el-select v-model="optionParams.shopId" placeholder="请选择所属门店" @change="shopChange">
                    <el-option v-for="item in shopdataList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="状态" prop="status">
                <el-select v-model="optionParams.status" placeholder="请选择">
                    <el-option key="1" label="在职" value="1"></el-option>
                    <el-option key="-1" label="离职" value="-1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getApplyList('isseach')">查询</el-button>
                <el-button icon="setting" @click="reset('optionParams')">重置</el-button>
            </el-form-item>
        </el-form>  
         <div class="filter-container" style="overflow:hidden;">
            <div style="float:right;">
                <el-button type="success" class="iconfont icon-xiazai1" @click="mingdao"> 下载</el-button>
            </div>
        </div>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">信审</div>-->
            <div class="tablelayer">
                <el-table :data="dataList" v-loading="listLoading" @current-change="handleCurrentChange" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="门店" width="100">
                        <template scope="scope">
                            <span>{{scope.row.shopName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="姓名">
                        <template scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="职级">
                        <template scope="scope">
                            <span>{{scope.row.level}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="基本工资">
                        <template scope="scope">
                            {{scope.row.money}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="出勤率">
                        <template scope="scope">
                            {{scope.row.attendRate}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="出勤工资">
                        <template scope="scope">
                            {{scope.row.attendMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="用户id">
                        <template scope="scope">
                            {{scope.row.id}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="当月回款率系数">
                        <template scope="scope">
                            <span>{{scope.row.curRate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="欺诈类逾期占比">
                        <template scope="scope">
                            <span>{{scope.row.cheatRateOverRate}}</span>
                        </template>
                    </el-table-column>
                      <el-table-column align="center" label="终审评价">
                        <template scope="scope">
                            <span>{{scope.row.lastAppCom}}%</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="财务评价">
                        <template scope="scope">
                            <span>{{scope.row.financeAppAom}}%</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template scope="scope">
                            <span>{{scope.row.workStatus}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="optionParams.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="optionParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { praseMoney, parseTime, loanStatusFilter } from '@src/filters';
import { storage } from '@constants/dataStorage';
import { downloadExecl } from '@common/downloadExecl';
export default {
    data() {
        return {
            listLoading: true, //列表加载状态
             optionParams: { pageSize: 10, pageIndex: 1, shopId: '', month: parseTime(new Date(), '{y}-{m}'), status:'' },
            total: '',
            dataList: [],
            shopdataList: [],//店铺信息
            adminsData: [], //显示的业务员
            storage: storage, //数据存储
        }
    },
    computed: {

    },
    created() {
        this.getApplyList();
        this.getShop(); //获取门店
    },
    mounted() {
    },
    methods: {
          // 下载
        mingdao() {
            downloadExecl({ url: 'export/exportcreditAuditorSalary', input: this.optionParams, method: 'get' })
        },
         //时间
        changeTime (value) {
            this.optionParams.month = value;
        },
        //获取列表
        getApplyList(isSeach) {
            if (isSeach) {
                this.optionParams.pageIndex = 1;
            }
            this.listLoading = true;
            ajax({
                url: 'financeSalarySystem/creditAuditorSalary',
                optionParams: this.optionParams
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
        //获取门店
        getShop() {
            ajax({
                url: 'PlatformData/XcChoose',
                optionParams: {
                    roleId: 6
                }
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
            this.optionParams.adminId = '';
            this.adminsData = [];
            this.shopdataList.map((item) => {
                if (value == item.shopId) {
                    this.adminsData = item.children;
                }
            })
        },
        //鼠标悬浮当前行
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        // 改变每一页的条数
        handleSizeChange(val) {
            this.optionParams.pageSize = val;
            this.optionParams.pageIndex = 1;
            this.getApplyList();
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.optionParams.pageIndex = val;
            this.getApplyList();
        },
        //重置shopId: '',month:'',adminId:''
        reset(formName) {
            this.optionParams.month = parseTime(new Date(), '{y}-{m}');
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        },
    },
    filters: {
        //获佣金状态    1已发放。0未发放
        awardFilter(val) {
            if (val === 1 || val === '1') {
                return '已发放';
            } else if (val === 0 || val === '0') {
                return '未发放';
            } else {
                return val;
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>





