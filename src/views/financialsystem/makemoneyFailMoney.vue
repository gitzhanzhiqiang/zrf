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
            <el-form-item label="借款人" prop="userName">
                <el-input type="text" v-model="params.userName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="申请产品" prop="prodId">
                <el-select v-model="params.prodId" placeholder="请选择申请产品">
                    <el-option v-for="item in  proddataList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单来源" prop="source">
                <el-select v-model="params.source" placeholder="请选择订单来源">
                    <el-option v-for="item in storage.source" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属门店" prop="shopId">
                <el-select v-model="params.shopId" placeholder="请选择所属门店" @change="shopChange">
                    <el-option v-for="item in shopdataList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务员" prop="adminId">
                <el-select v-model="params.adminId" placeholder="请选择业务员" :disabled="!params.shopId">
                    <el-option v-for="item in adminsData" :key="item.adminId" :label="item.adminName" :value="item.adminId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="放款失败时间">
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
            <el-form-item>
                <el-button type="primary" icon="search" @click="getApplyList(true)">查询
                </el-button>
                <el-button @click="reset('params')" icon="setting">重置
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">放款失败订单</div>-->
            <div class="tablelayer">
                <!--订单编号	放款时间	借款人	申请产品	合同借款金额	实际放款金额	借款期数	已还期数	每期还款金额	业务员	门店	订单来源	订单状态	当期状态	操作-->
                <div class="tablelayer">
                    <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">

                        <el-table-column align="center" label="序号" width="100">
                            <template scope="scope">
                                <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单编号" width="180">
                            <template scope="scope">
                                <span>{{scope.row.orderNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="放款失败时间" width="160">
                            <template scope="scope">
                                <span>{{scope.row.loanReleaseTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="借款人">
                            <template scope="scope">
                                 <img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua">
                                {{scope.row.name}}
                                <img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单状态" width="90">
                            <template scope="scope">
                                {{scope.row.loan_status|loan_statusFilter}}
                            </template>
                        </el-table-column>
                        <!--<el-table-column align="center" label="申请产品">
                                <template scope="scope">
                                    {{scope.row.productName}}
                                </template>
                            </el-table-column>-->
                        <el-table-column align="center" label="合同借款金额" width="120">
                            <template scope="scope">
                                {{scope.row.agreementAmount | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="实际放款金额" width="120">
                            <template scope="scope">
                                {{scope.row.realPayAmout | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="每期还款金额" width="120">
                            <template scope="scope">
                                {{scope.row.eachmoney | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="借款期数" width="90">
                            <template scope="scope">
                                {{scope.row.loanTerm}}
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
                                {{scope.row.source|sourceFilter}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" fixed="right" width="180">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="$router.push({path:'makemoneyfailmoneydetail', query:{data: JSON.stringify(scope.row)}})">查看</el-button>
                                <el-button type="text" size="small" @click="Lending_again(scope.row)">重新放款</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="" fixed="right" width="120">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="Lending_again1(scope.row)">置成财务拒绝</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" class="autoAlert" @keyup.enter.native="submitAlert('alertForm')">
            <div style="">
                <el-form :rules="rules" :model="alertForm" ref="alertForm" label-width="60px">
                    <el-form-item label="借款人" class="noborder">
                        <el-input v-model="alertForm.name" readonly></el-input>
                    </el-form-item>
                    <p style="margin-bottom:10px;">是否技术部已知晓并同意重新放款，若已通知，请在下方输入
                        <span style="color:red;">确认放款</span>
                    </p>
                    <el-form-item label="请输入" prop="text">
                        <el-input v-model="alertForm.text" placeholder="请输入确认放款四字"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAlert('alertForm')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogVisible1" width="30%" class="autoAlert" @keyup.enter.native="submitAlert1('alertForm')">
            <div style="">
               <el-form :rules="rules1" :model="alertForm1" ref="alertForm1" label-width="60px">
                    <el-form-item label="借款人" class="noborder">
                        <el-input v-model="alertForm1.name" readonly></el-input>
                    </el-form-item>
                    <p style="margin-bottom:10px;">是否技术部已知晓并同意置成财务拒绝，若已通知，请在下方输入
                        <span style="color:red;">是</span>
                    </p>
                    <el-form-item label="请输入" prop="text1">
                        <el-input v-model="alertForm1.text1" placeholder="请输入是"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="submitAlert1('alertForm1')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { parseTime, formatTime } from '@src/filters';
import { validatPhone } from '@src/utils/validate';
import { storage } from '@constants/dataStorage';
export default {
    data() {
        var text = (rule, value, callback) => {
            if (value != '确认放款')
                callback(new Error('请输入确认放款!'))
            callback();
        };
         var text1 = (rule, value, callback) => {
            if (value != '是')
                callback(new Error('是!'))
            callback();
        };
        return {
            listLoading: true, //列表加载状态
            params: {
                pageSize: 10,
                pageIndex: 1,
                name: null,
                source: null,
                shopId: null,
                prodId: null,
                adminId: null,//业务员id
                dateFrom: '',
                dateTo: ''
            },
            total: 0,
            time: '',
            dataList: [],
            shopdataList: [],//店铺信息
            imgxu: require('@res/img/aa.png'),//续贷图片
             imgxua: require('@res/img/aaa.png'),//续贷图片
            adminsData: [], //显示的业务员
            proddataList: [],//店铺信息
            storage: storage, //数据存储
            dialogVisible: false,
             dialogVisible1: false,
            title: '',
            rules: {
                text: [{ validator: text, trigger: 'blur' }],
            },
             rules1: {
                text1: [{ validator: text1, trigger: 'blur' }],
            },
            alertForm: {
                text: '',
                orderNum: '',
                name: '',
                orderUserId: '',
            },
             alertForm1: {
                text1: '',
                orderNum: '',
                name: '',
                orderUserId: '',
            },
            loading: false //弹框确定
        }
    },
    computed: {},
    created() {
        this.getApplyList();
        this.getShop_area(); //获取门店和区域
        this.getprodList();
    },
    mounted() {
    },
    methods: {
        aa(e) {
            console.log('a')
        },
        // 获取产品信息
        getprodList() {
            ajax({
                url: 'choicesData/queryByKey',
                optionParams: { key: "product" },
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        this.proddataList = res.data;
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
            this.params.adminId = '';
            this.adminsData = [];
            this.shopdataList.map((item) => {
                if (value == item.shopId) {
                    this.adminsData = item.children;
                }
            })
        },
        //获取列表
        getApplyList(isSeach) {
            if (isSeach) {
                this.params.pageIndex = 1;
            }
            this.listLoading = true;
            ajax({
                url: 'financeLoan/listLoanFail',
                optionParams: this.params
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        this.dataList = res.data;
                        this.total = res.total;
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                })

        },
        //重新放款
        Lending_again(row) {
            this.alertForm.name = row.name;
            this.alertForm.orderNum = row.orderNum;
             this.alertForm.orderUserId = row.orderUserId;
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs['alertForm'].resetFields(); //恢复表单及数据初始化状态
            })
            this.loading = false;
        },
         //重新放款
        Lending_again1(row) {
            
            this.alertForm1.name = row.name;
            this.alertForm1.orderUserId = row.orderUserId;
            this.alertForm1.orderNum = row.orderNum;
            this.dialogVisible1 = true;
            console.log( this.alertForm1.orderUserId)
            this.$nextTick(() => {
                this.$refs['alertForm1'].resetFields(); //恢复表单及数据初始化状态
            })
            this.loading = false;
        },
        //重新放款请求
        submitAlert(formName) {
            this.loading = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    ajax({
                        url: 'underlineProcess/financeApprovalAgain',
                        optionParams: {
                            orderNum: this.alertForm.orderNum,
                            orderUserId:this.alertForm.orderUserId
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message);
                                this.dialogVisible = false;
                                this.getApplyList();
                            } else {
                                this.$message.warning(response.message);
                                this.dialogVisible = false;
                                this.loading = false;
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false;
                        })
                } else {
                    console.log('error submit!!');
                    this.loading = false;
                }
            });
        },
         //置成财务拒绝
        submitAlert1(formName) {
            this.loading = true;
            console.log(formName)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    ajax({
                        url: 'underlineProcess/financefkrefuse',
                        optionParams: {
                            orderNum: this.alertForm1.orderNum,
                            orderUserId:this.alertForm1.orderUserId
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message);
                                this.dialogVisible1 = false;
                                this.getApplyList();
                            } else {
                                this.$message.warning(response.message);
                                this.dialogVisible1 = false;
                                this.loading = false;
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false;
                        })
                } else {
                    console.log('error submit!!');
                    this.loading = false;
                }
            });
        },
        // 改变每一页的条数
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getApplyList();
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.params.pageIndex = val;
            this.getApplyList();
        },
        //重置表单
        reset(formName) {
            this.time = '';
            this.$refs[formName].resetFields();
        },
        //选择时间
        tTimeChange(value) {
            formatTime(value, this, 'params', 'dateFrom', 'dateTo');
        },
    },
    filters: {
        noworderstatusFilter(code) {//当期订单状态
            if (code == '0') {
                return "无"
            } else if (code == '10') {
                return "未还款（正常）"
            } else if (code == '11') {
                return "逾期"
            } else if (code == '20') {
                return "已还款"
            }
        },
        // 10:请求中 11 放款执行中(锁住入队列) 12、放款中(待确认是否成功) 13、放款失败 14、放款成功', ,
        loan_statusFilter(code) {//订单状态
            if (code == '10') {
                return "请求中"
            } else if (code == '11') {
                return "放款执行中"
            } else if (code == '12') {
                return "放款中(待确认是否成功)"
            } else if (code == '13') {
                return "放款失败"
            } else if (code == '14') {
                return "放款成功"
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>





