<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getApplyList(true)">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="params.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="userName">
                <el-input type="text" v-model="params.userName" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item label="商户订单号" prop="requestNo">
                <el-input v-model="params.requestNo" placeholder="请输入商户订单号"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号" prop="bankCardNo">
                <el-input  v-model="params.bankCardNo" placeholder="请输入银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="所属门店" prop="shopId">
                <el-select v-model="params.shopId " placeholder="请选择所属门店">
                    <el-option v-for="item in shop" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getApplyList(true)">搜索</el-button>
                <el-button @click="reset('params')" icon="setting">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">第三方打款</div>-->
            <div class="tablelayer">
                <!--序号	商户批次号	商户订单号	创建时间	银行名称	户名	账号 	打款金额	手续费	实付金额	易宝状态	扣账状态	银行状态	平账状态-->
                <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="序号" width="80">
                        <template scope="scope">
                            <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单编号" width="150">
                        <template scope="scope">
                            <span>{{scope.row.orderNum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商户订单号" width="180">
                        <template scope="scope">
                            {{scope.row.requestNo}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支付订单时间" width="180">
                        <template scope="scope">
                            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="借款人姓名" width="100">
                        <template scope="scope">
                            <span>{{scope.row.userName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="还款方式" width="100">
                        <template scope="scope">
                            <span v-show="item.id == scope.row.repayType" v-for="(item,index) in storage.ReimbursementChannels" v-text="item.label" :key="index"></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="支付银行" width="100">
                        <template scope="scope">
                            <span>{{scope.row.bankName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="银行卡号">
                        <template scope="scope">
                            <span>{{scope.row.bankCardNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单金额" width="80">
                        <template scope="scope">
                            <span>{{scope.row.amount | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="订单状态">
                        <template scope="scope">
                            <span>{{scope.row.status}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="流水号（备注）">
                        <template scope="scope">
                            <span>{{scope.row.ybOrderid}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" fixed="right" label="操作" width="70">
                        <template scope="scope">
                            <el-button type="text" size="small" @click="edit(scope.row)">操作</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--弹框编辑-->
        <el-dialog title="编辑" :visible.sync="editAlert" width="30%" class="autoAlert">
            <!--编辑-->
            <p>该笔订单延时{{timeshi}}</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="Modify(0)" :loading="loading">修改为失败</el-button>
                <el-button type="primary" @click="Modify(1)" :loading="loading1">修改为成功</el-button>
                <el-button @click="editAlert= false">取 消</el-button>
            </span>
        </el-dialog>
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
export default {
    data() {
        return {
            loading: false, //防止二次操作
            loading1: false,
            listLoading: true, //列表加载状态
            params: {
                pageSize: 10,
                pageIndex: 1,
                userName: '',
                requestNo: '',//商户订单号
                bankCardNo: '',//银行卡号
                shopId: ''//门店
            },
            total: 0,
            dataList: [],
            editAlert: false, //弹框出现
            shop: [],//店铺信息
            xiuid: '',
            timeshi: '',
            storage: storage //数据存储
        }

    },
    computed: {},
    created() {
        this.getApplyList();
        this.getShop_area(); //获取门店和区域
    },
    mounted() {
    },
    methods: {
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
        //获取列表
        getApplyList(isSeach) {
            if (isSeach) {
                this.params.pageIndex = 1;
            }
            this.listLoading = true;
            ajax({
                url: 'financeDelayPay/listDelayPay',
                optionParams: this.params
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        console.log(res)
                        this.dataList = res.data ?  res.data : [];
                        this.total = res.total
                    } else {
                        this.$message.warning(res.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                })

        },
        edit(row) {
            this.editAlert = true;
            this.times(row)
            console.log(row)
            this.xiuid = row.id;
            this.loading = false; //二次操作
            this.loading1 = false;
        },
        //弹框提交
        Modify(num) {
            if (num == 0) {
                this.loading = true; //二次操作
            } else {
                this.loading1 = true; //二次操作
            }
            ajax({
                url: 'financeDelayPay/delayOperation',
                optionParams: {
                    type: num,
                    id: this.xiuid
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response)
                        this.editAlert = false;
                        this.$message.success(response.message)
                    } else {
                        this.$message.warning(response.message);
                        this.loading = false; //二次操作
                        this.loading1 = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.loading = false; //二次操作
                    this.loading1 = false;
                })
        },
        //时间相减
        times(rowd) {
            let myDate = new Date(); //获取今天日期
            let str = myDate.getTime(); //转换成时间戳
            let runTime1 = parseInt((str - rowd.createTime) / 1000);
            let day = parseInt(runTime1 / (24 * 60 * 60));//计算整数天数
            let afterDay = runTime1 - day * 24 * 60 * 60;//取得算出天数后剩余的秒数
            let hour = parseInt(afterDay / (60 * 60));//计算整数小时数
            let afterHour = runTime1 - day * 24 * 60 * 60 - hour * 60 * 60;//取得算出小时数后剩余的秒数
            let min = parseInt(afterHour / 60);//计算整数分
            let afterMin = runTime1 - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60;//取得算出分后剩余的秒数          
            let timedd = day + '天' + hour + '时' + min + '分'
            this.timeshi = timedd
            console.log(timedd);
        },
        // 改变每一页的条数
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.params.pageIndex = 1;
            this.getApplyList();
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.params.pageIndex = val;
            this.getApplyList();
        },
        //重置
        reset(formName) {
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        }
    },
    filters: {}
}
</script>
<style lang="less" scoped>

</style>





