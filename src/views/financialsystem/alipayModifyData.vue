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
            <el-form-item label="姓名" prop="userName">
                <el-input v-model="params.userName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <!--<div class="tableheader">支付宝修改数据</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="100">
                    <template scope="scope">
                        <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单编号">
                    <template scope="scope">
                        {{scope.row.orderNum}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="借款人">
                    <template scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号">
                    <template scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="合同额度">
                    <template scope="scope">
                        {{scope.row.agreementAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="借款期数">
                    <template scope="scope">
                        {{scope.row.loanTerm}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="已还期数">
                    <template scope="scope">
                        {{scope.row.alreadyPayTerm}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="当期状态">
                    <template scope="scope">
                        <span v-for="item in storage.repaymentStatus1" :key="item.id" v-text="item.label" v-show="item.id == scope.row.repaymentStatus"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单来源">
                    <template scope="scope">
                        <span v-for="item in storage.source" v-text="item.label" v-show="item.id == scope.row.source"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="look(scope.row, 'alertForm')">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="查看" :visible.sync="dialogVisible" width="30%">
            <div style="width:700px;margin:0 auto;">
                <el-form :rules="rules" :model="alertForm" ref="alertForm" label-width="80px" :inline="true" class="demo-form-inline">
                    <el-form-item label="选择还款">
                        <el-radio-group v-model="alertForm.type" style="line-height:36px;" @change="alertSelectChange">
                            <el-radio :label="item.id" v-for="item in selectData" :key="item.id">{{item.label}}</el-radio>

                        </el-radio-group>
                    </el-form-item>
                    <table class="table">
                        <tr>
                            <td colspan="2">还款方式：
                                <span v-for="item in selectData" v-show="item.id == alertForm.type" v-text="item.label"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>借款人</td>
                            <td v-text="rowData.name"></td>

                        </tr>
                        <tr v-if="false">
                            <td>还款账号</td>
                            <td>
                                <el-row :gutter="0">
                                    <el-col :span="6">
                                        <el-form-item label="开户人:" label-width="58px">
                                            <span style="width:80px;">{{bankUserInfo.idCardName}}</span>
                                            <!--<el-input :value="bankUserInfo.idCardName" readonly style="width:80px;"></el-input>-->
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-form-item label="" prop="bankCardNo" label-width="0">
                                            <el-select v-model="alertForm.bankCardNo" placeholder="请选择" @change="bankChange">
                                                <el-option v-for="(item, index) in bankData.cardList" :key="index" :label="item.bankCardNo" :value="item.bankCardNo">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="开户行:" label-width="58px">
                                            <span style="width:110px;">{{bankUserInfo.bankName}}</span>
                                            <!--<el-input :value="bankUserInfo.bankName" readonly style="width:110px;"></el-input>-->
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </td>
                        </tr>
                        <tr>
                            <td>还款期数</td>
                            <td>
                                <el-form-item label-width="0" prop="periodNum">
                                    <el-select v-model="alertForm.periodNum" placeholder="请选择" @change="alertFormChangeSelect" v-if="alertForm.type != 40 && alertForm.type != 41 && alertForm.type != 32">
                                        <el-option v-for="(item, index) in bankData.repayPeriodNum" :key="index" :label="index+1" :value="(index+1) + ''">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="alertForm.periodNum" placeholder="" @change="alertFormChangeSelect" v-else-if="alertForm.type == 32" disabled>
                                        <el-option key="1" label="1" value="1"></el-option>
                                    </el-select>
                                    <!--<span v-else>{{alertForm.periodNum}}</span>-->
                                    <el-select v-model="alertForm.periodNum" placeholder="" @change="alertFormChangeSelect" v-else disabled>
                                        <el-option :label="bankData.repayPeriodNum" :value="bankData.repayPeriodNum + ''"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>还款期数位置</td>
                            <td>
                                <el-form-item label-width="0">
                                    <span v-if="moneyData.repayStartPeriod && moneyData.repayEndPeriod">{{moneyData.repayStartPeriod}}-{{moneyData.repayEndPeriod}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="alertForm.type == 30 || alertForm.type ==40">
                            <td>建议还款金额</td>
                            <td>
                                <el-form-item label-width="0">
                                    <span v-if="alertForm.type == 30">{{moneyData.suggestRepayAmount | formatMoney}}</span>
                                    <span v-else>{{moneyData.realRepayAmount | formatMoney}}~{{moneyData.suggestRepayAmount | formatMoney}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="alertForm.type != 30 && alertForm.type !=40">
                            <td>建议还款本金</td>
                            <td>
                                <el-form-item label-width="0">
                                    <span>{{moneyData.suggestRepayAmount | formatMoney}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="alertForm.type != 30">
                            <td>罚息</td>
                            <td>
                                <el-form-item label-width="0">
                                    <span>{{moneyData.lateFeeAmount | formatMoney}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="alertForm.type == 32 || alertForm.type == 41 ||  ahead_schedule_status">
                            <td>实际还款金额</td>
                            <td>
                                <el-form-item label="" label-width="0px;">
                                    <el-input v-model="alertForm.realRepayAmount" placeholder="请输入" @keyup.native="fommort($event, 'alertForm','realRepayAmount')"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="alertForm.type == 31">
                            <td>实际还款金额</td>
                            <td class="noborder">
                                <el-form-item label-width="0">
                                    <span>{{moneyData.suggestRepayAmount | formatMoney}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                    </table>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAlert('alertForm')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
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
            loading: false, //防止二次操作
            listLoading: true, //列表加载状态
            params: { //搜索条件
                pageSize: 10,
                pageIndex: 1,
                userName: null, //用户名字
                phone: '' //手机号
            },
            storage: storage, //数据存储
            total: 1, //总页数
            dataList: [],
            rowData: {}, //行数据
            dialogVisible: false, // t弹框
            selectData: [
                { label: '正常还款', id: 30 },
                { label: '一般金额减免', id: 31 },
                { label: '特殊金额减免', id: 32 },
                { label: '提前结清', id: 40 },
                { label: '非正常结清', id: 41 },
            ],
            alertForm: {
                type: 30,
                bankCardNo: '', //银行卡号
                periodNum: '', //还款期数
                realRepayAmount: '', //实际还款金额
                // bankCode: '', //银行编码
                // bankName: '',//银行名称
                // phone: '', //手机号
                // repayStartPeriod: '', //还款开始日期
                // repayEndPeriod: '', //还款结束日期
                // suggestRepayAmount: '', // 建议还款金额 ,
            },
            bankData: {
                cardList: [],
                repayPeriodNum: 0, //还款
            },
            bankUserInfo: {}, //开卡人资料
            moneyData: '', //钱
            ahead_schedule_status: false,
            rules: { //弹框验证
                periodNum: [{ required: true, message: '请选择', trigger: 'change' }],
                realRepayAmount: [{ required: true, message: '请输入', trigger: 'change' }],
                bankCardNo: [{ required: true, message: '请选择', trigger: 'change' }],
            }
        }
    },
    computed: {
    },
    created() {
        this.getTable();
    },
    mounted() {
    },
    methods: {
        // 强制正整数
        // inputChange(e) {
        //     let obj = {
        //         input: e,
        //         that: this
        //     }
        //     this.alertForm.realRepayAmount = Common.positiveIntegerMoney(obj); //表单赋值
        // },
         //只能输入两位小数和数字
            fommort(e, firstName, twoName) {
                // e: event, 第一层名字， 第二层名字
                let data = {
                    e: e,
                    firstName: firstName,
                    twoName: twoName,
                    that: this
                }
                Common.twoDecimalPlaces(data);

            },
        getTable(isseach) {
            console.log(this.params)
            this.listLoading = true;
            if (isseach) {
                this.params.pageIndex = 1;
            }
            ajax({
                url: 'shopOwnerRepay/listOrder',
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
        //查看
        look(item, formName) {
            this.dialogVisible = true;
            this.loading = false; //二次提交按钮设置
            this.rowData = item;
            this.bankUserInfo = {}; //银行卡资料清空
            this.moneyData = ''; //钱清空
            this.alertForm.type = 30;
            this.alertForm.realRepayAmount = '';//输入的实际金额
            this.$nextTick(() => {
                this.$refs['alertForm'].resetFields(); //恢复表单及数据初始化状态
                this.alertSelectChange(30, true);
            })
        },
        //点击银行卡
        bankChange(idCard) {
            this.bankData.cardList.map((item) => {
                if (item.bankCardNo == idCard) {
                    this.bankUserInfo = item;
                }
            })
        },
        //获取银行卡 点击单选
        alertSelectChange(value, isFirst) {
            this.ahead_schedule_status = false;//提前结清的输入框
            if (!isFirst) {
                this.bankUserInfo = {}; //银行卡资料清空
                this.moneyData = ''; //钱清空
                this.alertForm.realRepayAmount = ''; //输入的实际金额
                this.$refs['alertForm'].resetFields(); //恢复表单及数据初始化状态
            }
            ajax({
                url: 'shopOwnerRepay/getRepayOrderMsg',
                optionParams: {
                    type: value,
                    orderNum: this.rowData.orderNum,
                    // orderNum: 'gz2018052816342610005',
                    shopId: this.rowData.shopId
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        let data = response.data;
                        if (!data) {
                            return false;
                        }
                        this.bankData.cardList = data.cardList;
                        if (data.repayPeriodNum < 0) {
                            this.$set(this.bankData, 'repayPeriodNum', 0)
                        } else {
                            console.log(data.repayPeriodNum)
                            this.$set(this.bankData, 'repayPeriodNum', data.repayPeriodNum)
                        }
                        //提前结清和非正常结清 期数下拉框不可点击
                        if (value == 40 || value == 41) {
                            this.alertForm.periodNum = this.bankData.repayPeriodNum + '';
                            this.alertFormChangeSelect(this.bankData.repayPeriodNum) + '';
                        }
                        //特殊金额减免 期数下拉框不可点击
                        if (value == 32) {
                            this.alertForm.periodNum = '1';
                            this.alertFormChangeSelect('1');
                        }
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },

        //弹框期数下拉框
        alertFormChangeSelect(value) {
            if (!value) {
                return false;
            }
            ajax({
                url: 'shopOwnerRepay/getRepayOrderDetailMsg',
                optionParams: {
                    type: this.alertForm.type,
                    orderNum: this.rowData.orderNum,
                    // orderNum: 'gz2018052816342610005',
                    periodNum: value
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response)
                        console.log(this.alertForm.type)
                        let data = response.data;
                        if (!data) {
                            return false;
                        }
                        this.moneyData = data;
                        if (this.alertForm.type == 40) {
                            this.ahead_schedule_status = true; //提前结清输入框出现
                            this.alertForm.realRepayAmount = data.suggestRepayAmount / 100;
                        }
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //弹框提交
        submitAlert(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.alertForm.type == 32 || this.alertForm.type == 41 || this.alertForm.type == 40) {
                        if (!this.alertForm.realRepayAmount) {
                            this.$message.warning('请输入实际金额！！');
                            return false;
                        }
                    }
                    if (this.alertForm.type == 40) {
                        if (this.alertForm.realRepayAmount < this.moneyData.realRepayAmount / 100) {
                            this.$message.warning('实际还款金额不能' + this.moneyData.realRepayAmount / 100);
                            return false;
                        }
                    }
                    let bankData = {};
                    this.bankData.cardList.map((item) => {
                        if (this.alertForm.bankCardNo == item.bankCardNo) {
                            bankData = item;
                        }
                    })
                    this.loading = true; //二次提交按钮设置
                     let realRepayAmount = '';
                     if (this.alertForm.type == 32 || this.alertForm.type == 41 || this.alertForm.type == 40) {
                            realRepayAmount = this.alertForm.realRepayAmount*100;
                        } else {
                            realRepayAmount = this.moneyData.suggestRepayAmount
                        }                  
                    let suggestRepayAmount = this.moneyData.suggestRepayAmount; //建议还款金额
                    let dueLateFeeAmount = this.moneyData.lateFeeAmount;//罚息
                    ajax({
                        url: 'alipay/subOrder',
                        optionParams: {
                            type: this.alertForm.type,
                            bankCardNo: bankData.bankCardNo,
                            bankCode: bankData.bankCode,
                            bankName: bankData.bankName,
                            bankCardID: bankData.bankCardID,
                            orderNum: this.rowData.orderNum,
                            // orderNum: 'gz2018052816342610005',
                            periodNum: this.alertForm.periodNum, //期数
                            phone: bankData.phone,
                            realRepayAmount: realRepayAmount, // 实际还款金额 ,
                            repayStartPeriod: this.moneyData.repayStartPeriod, //还款开始期数
                            repayEndPeriod: this.moneyData.repayEndPeriod, //还款结束期数
                            suggestRepayAmount: suggestRepayAmount, //建议还款金额
                            dueLateFeeAmount: dueLateFeeAmount //罚息
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message)
                                this.dialogVisible = false;
                                this.getTable();
                            } else {
                                this.$message.warning(response.message);
                                this.loading = false; //二次提交按钮设置
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false; //二次提交按钮设置
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //重置
        reset(formName) {
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
.table {
    width: 700px;
    tr {
        td:first-child {
            text-align: center;
        }
        td:last-child {
            // padding-left: 200px!important;
            text-align: center;
        }
    }
    tr:first-child {
        td {
            text-align: left;
            padding-left: 10px!important;
        }
    }
}
</style>


