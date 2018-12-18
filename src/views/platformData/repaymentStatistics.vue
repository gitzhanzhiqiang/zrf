<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getTable('')">
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
            <!--<div class="tableheader">还款统计</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="门店">
                    <template scope="scope">
                        {{scope.row.shopName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="应还款笔数">
                    <template scope="scope">
                        {{scope.row.dueNum | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="实际还款笔数">
                    <template scope="scope">
                        {{scope.row.alNum | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="应还款金额">
                    <template scope="scope">
                        {{scope.row.dueAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="实际还款金额">
                    <template scope="scope">
                        {{scope.row.alAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="已提前还款笔数">
                    <template scope="scope">
                        {{scope.row.bfNum | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="未还款笔数">
                    <template scope="scope">
                        {{scope.row.unNum | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="未还款金额">  
                    <template scope="scope">
                        {{scope.row.unAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="明日应还笔数">
                    <template scope="scope">
                        {{scope.row.toNum}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="明日应回款金额">
                    <template scope="scope">
                        {{scope.row.toAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="累计应还本金">
                    <template scope="scope">
                        {{scope.row.sumdueprincipalamount | formatMoney}}
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
                shopId: '', //，门店
                adminId: '', //业务员
                 credit_adminId:'',
                areaId: '', //区域
                dateFrom:'2017-05-01', //开始
                dateTo: Common.getAgoDate(0) //结束时间
            },
            time: ['2017-05-01', new Date()],
            shop: [], //门店
            admins: [], //业务员
            area: [], //区域
            dataList: [],
            areacredit:[],
        }
    },
    computed: {
    },
    created() {
        this.getShop_area(); //获取门店和区域
        this.getTable();
    },
    mounted() {
    },
    methods: {
        getTable(isseach) {
            this.listLoading = true;
            ajax({
                url: 'PlatformData/repayStatistics',
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
            this.time = ['2017-05-01', new Date()]
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        }
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


