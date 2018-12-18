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
             <!--<el-form-item label="区域" prop="areaId">
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
            </el-form-item>-->
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
            
             <el-form-item label="离职状态" prop="status">
                <el-select v-model="params.status" placeholder="请选择">
                    <el-option v-for="item in storage.zaizhi" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <!--<el-form-item label="日期">
                <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="tTimeChange"></el-date-picker>
            </el-form-item>
            <div v-show="false">
                <el-form-item label="开始时间" prop="dateFrom">
                    <el-input v-model="params.dateFrom" placeholder="开始"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="dateTo">
                    <el-input v-model="params.dateTo" placeholder="结束"></el-input>
                </el-form-item>
            </div>-->
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <!--<div class="tableheader">排名统计（客户经理）</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%"  :default-sort="{prop: order, order: dir}" @sort-change="sort"> 
                <el-table-column align="center" label="排名" width="100">
                    <template scope="scope">
                        <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="门店">
                    <template scope="scope">
                        {{scope.row.shopName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="业务员">
                    <template scope="scope">
                        {{scope.row.admin}}
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="放款笔数">
                    <template scope="scope">
                        {{scope.row.succNum  | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="合同金额">
                    <template scope="scope">
                        {{scope.row.agreementAmount | formatMoney}}
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="逾期笔数" sortable="custom" prop="overNum">
                    <template scope="scope">
                        {{scope.row.overNum  | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="逾期本金金额" sortable="custom" prop="overMoney">
                    <template scope="scope">
                        {{scope.row.overMoney  | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="笔数占比" sortable="custom" prop="overNumRate">
                    <template scope="scope">
                        {{scope.row.overNumRate  | forma}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="金额占比" sortable="custom" prop="overMonryRate">
                    <template scope="scope">
                        {{scope.row.overMonryRate  | forma}}%
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
import { Common } from '@common/common';
export default {
    data() {
        return {
            listLoading: true, //列表加载状态
            params: { //搜索条件
                pageSize: 10,
                pageIndex: 1,
                status:'',
                // areaId: '', //区域
                shopId: '', //，门店
                adminId: '', //业务员
                sortField:'',
                sort:'',
               //  credit_adminId:'',
               // dateFrom: '', //开始
               // dateTo: '', //结束时间
            },
            time: [],
            storage: storage, //数据存储
            shop: [], //门店
            admins: [], //业务员
             area: [], //区域
            total: 0, //总页数
            dataList: [],
             order: 'overNum',
            dir: 'ascending',
            shenxu:true,
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
                this.params.pageIndex = 1;
                this.order = 'overNum';
                this.dir = 'ascending';
            }
            ajax({
                url: 'PlatformData/getAdminOver',
                optionParams: this.params
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.dataList = response.data ? response.data : [];
                        this.total = response.total;
                       // this.splice('overNum', true);  //升序
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
            console.log(positiveSequence)
            let obj = {};
            let idx = 0;
            this.dataList.map((itm, index) => {
                console.log(itm.shopName)
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
        //门店所属业务员
        shopChange(value) {
            console.log(value)
            this.admins = []
             ajax({
                url: 'PlatformData/getAdminByShop',
                optionParams: {
                    roleId:1,
                    shopId:value,
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response.data)
                       this.admins = response.data.admins
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })


            // this.params.adminId = '';
            // this.admins = [];
            // this.shop.map((item) => {
            //     if (value == item.shopId) {
            //         this.admins = item.children;
            //     }
            // })
        },
        //选择时间
        tTimeChange(value) {
            formatTime(value, this, 'params', 'dateFrom', 'dateTo');
        },
        //重置
        reset(formName) {
            this.time = []
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
        sort(column, prop, order) {
            //  column.prop //排序字段
            // column.order=== 'descending' ? 'desc' : 'asc'; //升降序
            console.log(column.prop)
            console.log(this.shenxu)
            if(this.shenxu == true){
                this.params.sortField = column.prop
                this.params.sort = 'DESC'
                this.shenxu = false
                 this.getTable();
            }else if(this.shenxu == false){
                     this.params.sortField = column.prop
                        this.params.sort = 'ASC'
                        this.shenxu = true
                        this.getTable();
            }
            // if (column.prop && column.order) {
            //     let a = column.order == 'descending' ? undefined : true;
            //     let obj = {};
            //     let idx = 0;
            //     this.splice(column.prop, a)
            // }
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


