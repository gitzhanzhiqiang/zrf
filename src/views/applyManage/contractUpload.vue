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
            <el-form-item label="申请产品" prop="prodID">
                <el-select v-model="params.prodID" placeholder="请选择">
                    <el-option v-for="item in product" :key="item.id" :label="item.name" :value="item.id + ''"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="希望借款金额" prop="applyAmount">
                <el-input type="number" v-model="params.applyAmount" placeholder="请输入希望借款金额"></el-input>
            </el-form-item>
            <el-form-item label="申请时间">
                <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="tTimeChange"></el-date-picker>
            </el-form-item>
            <el-form-item label="订单来源" prop="source">
                <el-select v-model="params.source" placeholder="请选择">
                    <el-option v-for="item in storage.source" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属门店" prop="shopId">
                <el-select v-model="params.shopId" placeholder="请选择">
                    <el-option v-for="item in shop" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
            </el-form-item>
            <div v-show="false">
                <el-form-item label="开始时间" prop="startTime">
                    <el-input v-model="params.startTime" placeholder="开始"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-input v-model="params.endTime" placeholder="结束"></el-input>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <!--<div class="tableheader">申请信息录入</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="100">
                    <template scope="scope">
                        <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单编号" width="180">
                    <template scope="scope">
                        {{scope.row.orderNum}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单时间" width="150">
                    <template scope="scope">
                        {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="借款人" width="80">
                    <template scope="scope">
                         <img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua">
                        {{scope.row.name}}
                        <img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单状态" width="90">
                    <template scope="scope">
                        {{scope.row.orderStatus|orderStatusnewFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="申请产品" width="90">
                    <template scope="scope">
                        {{scope.row.productName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="希望借款金额" width="120">
                    <template scope="scope">
                        {{scope.row.applyAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="合同放款金额" width="120">
                    <template scope="scope">
                        {{scope.row.agreementAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="借款期数" width="90">
                    <template scope="scope">
                        {{scope.row.loanTerm}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="已还期数" width="90">
                    <template scope="scope">
                        {{scope.row.alreadyPayTerm}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="每期还款金额" width="120">
                    <template scope="scope">
                        {{scope.row.eachmoney | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="业务员" width="100">
                    <template scope="scope">
                        {{scope.row.adminName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="门店" width="100">
                    <template scope="scope">
                        {{scope.row.shopName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单来源" width="90">
                    <template scope="scope">
                        <span v-for="item in storage.source" v-text="item.label" v-show="scope.row.source == item.id"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号" width="110">
                    <template scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="当期状态" width="90">
                    <template scope="scope">
                        <span v-for="item in storage.repaymentStatus1" :key="item.id" v-text="item.label" v-show="item.id == scope.row.repaymentStatus"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="70">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="$router.push({path:'contractUploadDetail', query:{data: JSON.stringify(scope.row)}})">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="130">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="tijiao(scope.row)">确认提交</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!--弹框编辑-->
        <el-dialog title="" :visible.sync="editAlert" width="30%" class="autoAlert">
            <!--编辑-->
           <p style="text-align: center;font-size: 18px;">已生成合同，是否提交</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEdit()" :loading="loading">确 定</el-button>
                <el-button @click="editAlert= false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { formatTime } from '@src/filters';
import { storage } from '@constants/dataStorage';
export default {
    data() {
        return {
            loading:false,
            editAlert:false,
            listLoading: true, //列表加载状态
            params: { //搜索条件
                type: 4, //必传 type 查询类型 1：行政查询 2：初审查询 *3：终审查询* 4：待合同上传界面查询* 5:财务待放款查询* 6：财务拒绝查询
                pageSize: 10,
                pageIndex: 1,
                name: null, //用户名字
                orderNum: null, //订单编号
                prodID: null, //产品id
                applyAmount: null, //希望借款金额
                source: null, //订单来源
                shopId: null, //所属门店
                startTime: null, //开始
                endTime: null, //结束时间
            },
            time: null,
            storage: storage, //数据存储
            product: [], //产品
            shop: [], //门店
            total: 0, //总页数
            imgxu: require('@res/img/aa.png'),//续贷图片
            imgxua: require('@res/img/aaa.png'),//续贷图片
            dataList: [],
            orderNum:'',//订单
        }
    },
    computed: {
    },
    created() {
        this.getShop_area(); //获取门店和区域
        this.getTable();
        this.getProduct();
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
                url: '/processList/auditList',
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
        //获取产品
        getProduct() {
            ajax({
                url: 'product/listQueryConFee',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.product = response.data ? response.data : [];
                    } else {
                        this.$message.warning(response.message)
                    }
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
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //合同提交
        tijiao(rew){
             ajax({
                url: 'sign/isExistSign',
                optionParams: {
                    orderNum:rew.orderNum
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.editAlert = true
                        this.orderNum = rew.orderNum
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        submitEdit(){
            this.loading=true
             ajax({
                url: 'sign/commitContract',
                optionParams: {
                    orderNum:this.orderNum
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                         this.getTable();
                         this.loading = false
                        this.editAlert = false                       
                      this.$message.success(response.message)
                    } else {
                         this.editAlert = false   
                         this.loading = false
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
.isRote {
    transform: rotate(90deg);
}

.tablelayer {
    // padding:20px 0!important;
}
</style>


