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
                <el-form-item label="开始时间" prop="startTime">
                    <el-input v-model="params.startTime" placeholder="开始"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-input v-model="params.endTime" placeholder="结束"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="放款时间">
                <el-date-picker v-model="timea" type="daterange" range-separator="至" start-placeholder="开始日期" :picker-options="pickerOptions1a" end-placeholder="结束日期" @change="tTimeChangea"></el-date-picker>
            </el-form-item>
            <div v-show="false">
                <el-form-item label="开始时间" prop="crestartTime">
                    <el-input v-model="params.crestartTime" placeholder="开始"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="creendTime">
                    <el-input v-model="params.creendTime" placeholder="结束"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="筛选门店" prop="shopId" v-if="false">
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
            <!--<div class="tableheader">扣款比例</div>-->
            <!--门店id id; 
                门店名字 name; 
                门店所有数据 alldata; 主动支付 
                active; 主动支付百分比 active_b; 
                被动支付 passive; 
                被动支付百分比passive_b; 
                支付宝 alipay; 
                支付宝百分比 alipay_b; 
                店长还款(店长银行卡) shopself; 
                店长还款(店长银行卡)百分比 shopself_b; 
                店长还款(用户银行卡) shopuser; 
                店长还款(用户银行卡)百分比 shopuser_b; 
                管理员 admin; 
               管理员百分比 admin_b;-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%" :default-sort="{prop: order, order: dir}" @sort-change="sort">
                <el-table-column align="center" label="门店">
                    <template scope="scope">
                        {{scope.row.name}}
                    </template>i
                </el-table-column>
                <el-table-column align="center" label="主动支付" sortable="custom" prop="active" width="182">
                    <template scope="scope">
                        {{scope.row.active}} ({{scope.row.active_b}})
                    </template>
                </el-table-column>
                <el-table-column align="center" label="被动扣款">
                    <template scope="scope">
                        {{scope.row.passive}} ({{scope.row.passive_b}})
                    </template>
                </el-table-column>
                <el-table-column align="center" label="店长还款" sortable="custom" prop="shopself" width="184">
                    <template scope="scope">
                        {{scope.row.shopself}} ({{scope.row.shopself_b}})
                    </template>
                </el-table-column>
                <el-table-column align="center" label="店长代扣">
                    <template scope="scope">
                        {{scope.row.shopuser}} ({{scope.row.shopuser_b}})
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付宝">
                    <template scope="scope">
                        {{scope.row.alipay}} ({{scope.row.alipay_b}})
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="微信支付">
                    <template scope="scope">
                        {{scope.row.wwy}} ({{scope.row.wwy_b}})
                    </template>
                </el-table-column>
                <el-table-column align="center" label="管理员操作">
                    <template scope="scope">
                        {{scope.row.admin}} ({{scope.row.admin_b}})
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
                startTime: '', //开始
                endTime: '', //结束时间
                crestartTime: '',
                creendTime:'',
            },
            time: [],
            timea: [],
            shop: [], //门店
            order: 'active',
            dir: 'descending',
            area: [], //区域
            areacredit:[],
            dataList: [],
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            pickerOptions1a: {
                disabledDate(timea) {
                    return timea.getTime() > Date.now();
                },
            }
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
                this.order = 'active';
                this.dir = 'descending';
            }
            ajax({
                url: 'PlatformData/getRepaymentMethod',
                optionParams: this.params
            }).post()
                .then(response => {
                    console.log(response)
                    if (response.code === 200) {
                        this.dataList = response.data ? response.data : [];
                        this.splice('active', true);  //升序
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
                if (itm.name == '合计') {
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
            formatTime(value, this, 'params', 'startTime', 'endTime');
        },
        //选择时间
        tTimeChangea(value) {
            formatTime(value, this, 'params', 'crestartTime', 'creendTime');
        },
        //重置
        reset(formName) {
            this.time = [];
             this.timea = [];
             console.log(this.time)
              console.log(this.timea)
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


