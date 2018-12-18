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
                <el-select v-model="params.shopId" placeholder="请选择">
                    <el-option v-for="item in shop" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <!--<div class="tableheader">初审拒件统计</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="门店">
                    <template scope="scope">
                        {{scope.row.shopName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="开店时长(天)">
                    <template scope="scope">
                        {{scope.row.openTimes | number}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="初审通过率">
                    <template scope="scope">
                        {{scope.row.firstApRate | forma}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总部通过率">
                    <template scope="scope">
                        {{scope.row.lastApRate | forma}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="件均额度">
                    <template scope="scope">
                        {{scope.row.avgAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="负面信息">
                    <template scope="scope">
                        {{scope.row.negInfoNum | number}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="虚假信息">
                    <template scope="scope">
                        {{scope.row.falseNum | number}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="系统内异常或黑名单">
                    <template scope="scope">
                        {{scope.row.errorBlackNum | number}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机使用异常">
                    <template scope="scope">
                        {{scope.row.phoneErrorNum | number}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="综合评分不足">
                    <template scope="scope">
                        {{scope.row.scoreLessNum | number}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="无效进件">
                    <template scope="scope">
                        {{scope.row.invalidNum | number}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="不配合调查或直系亲属无法电核">
                    <template scope="scope">
                        {{scope.row.verifErrorNum | number}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { formatTime } from '@src/filters';
export default {
    data() {
        return {
            listLoading: true, //列表加载状态
            params: { //搜索条件
                areaId: '', //区域
                shopId: '', //，门店
                  credit_adminId:'',
                dateFrom: '', //开始
                dateTo: '' //结束时间
            },
            time: [],
            shop: [], //门店
            area: [], //区域
            dataList: []
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
                url: 'PlatformData/firstApprovalRefuseStatistics',
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
        //重置
        reset(formName) {
            this.time = [];
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        }
    },
    filters: {
number (value) {
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


