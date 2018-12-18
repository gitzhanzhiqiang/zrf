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
            <el-form-item label="日期">
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
            <el-form-item label="区域" prop="areaId">
                <el-select v-model="params.areaId" placeholder="请选择区域">
                    <el-option v-for="item in area" :key="item.id" :label="item.name" :value="item.id + ''">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="区域信审" prop="credit_adminId">
                <el-select v-model="params.credit_adminId" placeholder="请选择区域">
                    <el-option v-for="item in areacredit" :key="item.id" :label="item.login_code" :value="item.id + ''">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="筛选门店" prop="shopId">
                <el-select v-model="params.shopId" placeholder="请选择" @change="shopChange">
                    <el-option v-for="item in shop" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务员" prop="adminId">
                <el-select v-model="params.adminId" placeholder="请选择" :disabled="!params.shopId">
                    <el-option v-for="item in admins" :key="item.adminId" :label="item.adminName" :value="item.adminId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <!--<div class="tableheader">放款统计</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="门店">
                    <template scope="scope">
                        {{scope.row.shopName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="进件量">
                    <template scope="scope">
                        {{scope.row.applyNum | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="终审通过笔数">
                    <template scope="scope">
                        {{scope.row.lastApprovalNum  | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="放款笔数">
                    <template scope="scope">
                        {{scope.row.loanSucNum  | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="放款金额">
                    <template scope="scope">
                        {{scope.row.realPayAmout | formatMoney}}
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="放款合同金额">
                    <template scope="scope">
                        {{scope.row.agreementAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="件平均金额">
                    <template scope="scope">
                        {{scope.row.avgAgreementAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="初审通过率">
                    <template scope="scope">
                        {{scope.row.firstApPassRate | forma}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="终审通过率">
                    <template scope="scope">
                        {{scope.row.lastApPassRate | forma}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="放款通过率">
                    <template scope="scope">
                        {{scope.row.loanPassRate | forma}}%
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { formatTime } from '@src/filters';
import { Common } from '@common/common';
export default {
    data() {
        return {
            listLoading: true, //列表加载状态
            params: { //搜索条件
                areaId: '', //区域
                shopId: '', //，门店
                adminId: '', //业务员
                credit_adminId:'',
                dateFrom: Common.getAgoDate(0), //开始
                dateTo: Common.getAgoDate(0) //结束时间
            },
            time: [new Date(), new Date()],
            shop: [], //门店
            admins: [], //业务员
            area: [], //区域
            areacredit:[],
            dataList: []
        }
    },
    computed: {
    },
    created() {
        this.getShop_area(); //获取门店和区域
    },
    mounted() {
        this.getTable();
    },
    methods: {
        getTable() {
            this.listLoading = true;
            ajax({
                url: 'PlatformData/loanStatistics',
                optionParams: this.params
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.dataList = response.data ? response.data : [];
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
                        this.shop = data.shops ? data.shops : [];
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
        //门店所属业务员
        shopChange(value) {
            this.params.adminId = '';
            this.admins = [];
            this.shop.map((item) => {
                if (value == item.shopId) {
                    this.admins = item.children;
                }
            })
        },
        //选择时间
        tTimeChange(value) {
            formatTime(value, this, 'params', 'dateFrom', 'dateTo');
        },
        //重置
        reset(formName) {
            this.time = [new Date(), new Date()];
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        }
    },
    filters: {
        isNumber (value) {
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


