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
             <el-form-item label="日期">
                <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" :picker-options="pickerOptions1" end-placeholder="结束日期" @change="tTimeChange"></el-date-picker>
            </el-form-item>
            <div v-show="false">
                <el-form-item label="开始时间" prop="dateFrom">
                    <el-input v-model="params.dateFrom" placeholder="开始"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="dateTo">
                    <el-input v-model="params.dateTo" placeholder="结束"></el-input>
                </el-form-item>
            </div>
             <el-form-item label="放款时间">
                <el-date-picker v-model="timea" type="daterange" range-separator="至" start-placeholder="开始日期" :picker-options="pickerOptions1" end-placeholder="结束日期" @change="tTimeChangea"></el-date-picker>
            </el-form-item>
            <div v-show="false">
                <el-form-item label="开始时间" prop="dateStart">
                    <el-input v-model="params.dateStart" placeholder="开始"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="dateEnd">
                    <el-input v-model="params.dateEnd" placeholder="结束"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="筛选门店" prop="shopId">
                <el-select v-model="params.shopId" placeholder="请选择">
                    <el-option v-for="item in shop" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
            </el-form-item>
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
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <div class="tableheader">逾期统计</div>
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%" :default-sort="{prop: order, order: dir}" @sort-change="sort">
                <el-table-column align="center" label="门店" width="100">
                    <template scope="scope">
                        {{scope.row.shopName}}
                    </template>i
                </el-table-column>
                <el-table-column align="center" label="逾期率（笔数）" sortable="custom" prop="overDueRate" width="100">
                    <template scope="scope">
                        {{scope.row.overDueRate | forma}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="逾期笔数" width="100" sortable="custom" prop="overDueOrdNum">
                    <template scope="scope">
                        {{scope.row.overDueOrdNum | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="欺诈逾期笔数 " width="100" sortable="custom" prop="cheatNum" >
                    <template scope="scope">
                        {{scope.row.cheatNum | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="逾期剩余金额（本金）" width="100" sortable="custom" prop="unRePayPrincAmount" >
                    <template scope="scope">
                        {{scope.row.unRePayPrincAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="欺诈逾期率" width="100" sortable="custom" prop="cheatNumRate">
                    <template scope="scope">
                        {{scope.row.cheatNumRate | forma}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="欺诈类逾期占比" width="130" sortable="custom" prop="cheatAgreeAmountRate">
                    <template scope="scope">
                        {{scope.row.cheatAgreeAmountRate | forma}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="逾期率（期供）" sortable="custom" prop="unRePayPriInsAmountRate">
                    <template scope="scope">
                        {{scope.row.unRePayPriInsAmountRate | forma}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="逾期率（剩余本金）" sortable="custom" prop="unRePayPrincAmountRate">
                    <template scope="scope">
                        {{scope.row.unRePayPrincAmountRate | forma}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="1-7天" sortable="custom" prop="sevenOverPrincRate" width="200">
                    <template scope="scope">
                      ( {{scope.row.yqbs17}})  {{scope.row.sevenOverPrincRate | forma}}% ( {{scope.row.sevenOverPrinc}})
                    </template>
                </el-table-column>
                <el-table-column align="center" label="8-40天" sortable="custom" prop="eigtoThirtyOverPrincRate"  width="200">
                    <template scope="scope">
                      ( {{scope.row.yqbs840}})  {{scope.row.eigtoThirtyOverPrincRate | forma}}%  ({{scope.row.eigtoThirtyOverPrinc }})
                    </template>
                </el-table-column>
                <el-table-column align="center" label="41天" sortable="custom" prop="thirtyMoreOverPrincRate"  width="200">
                    <template scope="scope">
                    (  {{scope.row.yqbs41}} )  {{scope.row.thirtyMoreOverPrincRate | forma }}% ({{scope.row.thirtyMoreOverPrinc}})
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
                areaId: '',
                 credit_adminId:'',
                dateFrom:'', //开始
                dateTo:'', //结束时间
                 dateStart:'', //开始
                dateEnd:'' //结束时间
            },
            time: '',
            timea: '',
            shop: [], //门店
            order: 'overDueRate',
            dir: 'ascending',
            area: [], //区域
            dataList: [],
              areacredit:[],
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
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
            if (isseach) {
                this.order = 'overDueRate';
                this.dir = 'ascending';
            }
            ajax({
                url: 'PlatformData/overDueStatistics',
                optionParams: this.params
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.dataList = response.data ? response.data : [];
                        this.splice('overDueRate', true);  //升序
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //截取合计
        splice(name, positiveSequence) {
            let obj = {};
            let idx = 0;
            this.dataList.map((itm, index) => {
                if (itm.shopName == '合计') {
                    obj = itm;
                    idx = index;
                }
            })
            this.dataList.splice(idx, 1)
            this.dataList = this.dataList.sort(Common.compare(name, positiveSequence))
            this.dataList.push(obj);
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
        //选择时间
        tTimeChange(value) {
            formatTime(value, this, 'params', 'dateFrom', 'dateTo');
        },
         //选择时间
        tTimeChangea(value) {
            formatTime(value, this, 'params', 'dateStart', 'dateEnd');
        },
        //重置
        reset(formName) {
            this.time = '';
             this.timea = '';
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        },
        sort(column, prop, order) {
            //  column.prop //排序字段
            // column.order=== 'descending' ? 'desc' : 'asc'; //升降序
            console.log(column)
            if (column.prop && column.order) {
                let a = column.order == 'descending' ? undefined : true;
                let obj = {};
                let idx = 0;
                this.splice(column.prop, a)
            }
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


