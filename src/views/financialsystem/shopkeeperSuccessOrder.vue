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
                <el-input type="text" v-model="params.userName" placeholder="请输入借款人"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input type="text" v-model="params.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" type="primary" icon="search" @click="getApplyList(true)" style="margin-left: 20px;">查询
                </el-button>
                <el-button class="filter-item" @click="reset('params')" type="primary" icon="setting" style="margin-left: 20px;">重置
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">已还款订单</div>-->
            <div class="tablelayer">
                <!--订单编号	放款时间	借款人	申请产品	合同借款金额	实际放款金额	借款期数	已还期数	每期还款金额	业务员	门店	订单来源	订单状态	当期状态	操作-->
                <div class="tablelayer">
                    <el-table :data="dataList" v-loading="listLoading" @current-change="handleCurrentChange" border fit highlight-current-row style="width: 100%">

                        <el-table-column align="center" label="序号" width="100">
                            <template scope="scope">
                                <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单编号" width="200">
                            <template scope="scope">
                                <span>{{scope.row.orderNum}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="借款人">
                            <template scope="scope">
                                 <img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua">
                                {{scope.row.name}}
                                 <img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
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
                                {{scope.row.loanTerm }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单来源">
                            <template scope="scope">
                                {{scope.row.source|sourceFilter}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="还款方式">
                            <template scope="scope">
                                <span v-show="item.id == scope.row.repayType" v-for="(item,index) in storage.ReimbursementChannels" v-text="item.label" :key="index"></span>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="门店">
                            <template scope="scope">
                                {{scope.row.shopName }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="提交时间" width="180">
                            <template scope="scope">
                                {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="操作"  width="100">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="isAlert(scope.row)">查看</el-button>
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
        <!--借款人：name, 开户人：idCardName  ， bankName：银行， 卡号：bankCardNo   ；罚息：dueLateFeeAmount  ： 
                        建议还款金额：suggestRepayAmount  ： 实际还款金额：realPayAmount， 开始期：startPeriod  ， 还款期数：periodNum-->
        <el-dialog title="查看" :visible.sync="dialogVisible" width="30%">
            <div style="width:700px;margin:0 auto;">
                <el-form ref="alertForm" label-width="80px" :inline="true" class="demo-form-inline">
                    <el-form-item label="选择还款">
                        <el-radio-group v-model="rowData.repayType" style="line-height:36px;">
                            <el-radio disabled :label="item.id" v-for="item in selectData" :key="item.id">{{item.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <table class="table">
                        <tr>
                            <td colspan="2">还款方式：
                                <span v-for="item in selectData" v-show="item.id == rowData.repayType" v-text="item.label"></span>
                            </td>
                        </tr>
                        <tr>
                            <td>借款人</td>
                            <td v-text="rowData.name"></td>

                        </tr>
                        <tr>
                            <td>还款账号</td>
                            <td>
                                <el-row :gutter="0">
                                    <el-col :span="5">
                                        <el-form-item label="开户人" label-width="55px">
                                            <span style="width:80px;">{{rowData.idCardName}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-form-item label="" label-width="0">
                                            <span>{{rowData.bankCardNo}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-form-item label="开户行" label-width="55px">
                                            <span class="el-input" style="width:110px;">{{rowData.bankName}}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </td>
                        </tr>
                        <tr>
                            <td>还款期数</td>
                            <td>
                                <el-form-item label-width="0">
                                    <span v-text="rowData.periodNum"></span>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>还款期数设置</td>
                            <td>
                                <el-form-item label-width="0">
                                    <span>{{rowData.startEndPeriod}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="rowData.repayType == 30 || rowData.repayType ==40">
                            <td>建议还款金额</td>
                            <td>
                                <el-form-item label-width="0">
                                    <span>{{rowData.suggestRepayAmount | formatMoney}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="rowData.repayType != 30 && rowData.repayType !=40">
                            <td>建议还款本金</td>
                            <td>
                                <el-form-item label-width="0">
                                    <span>{{rowData.suggestRepayAmount | formatMoney}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="rowData.repayType != 30 && rowData.repayType !=40">
                            <td>罚息</td>
                            <td>
                                <el-form-item label-width="0">
                                    <span>{{rowData.dueLateFeeAmount | formatMoney}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="rowData.repayType == 32 || rowData.repayType == 41 || rowData.repayType == 42">
                            <td>实际还款金额</td>
                            <td>
                                <el-form-item label="" label-width="0">
                                    <span>{{rowData.realPayAmount | formatMoney}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr v-if="rowData.repayType == 31">
                            <td>实际还款金额</td>
                            <td class="noborder">
                                <el-form-item label-width="0">
                                    <span>{{rowData.realPayAmount | formatMoney}}</span>
                                </el-form-item>
                            </td>
                        </tr>
                    </table>

                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAlert(1)" :loading="loading">确定扣款</el-button>
                <el-button type="warning" @click="submitAlert(4)" :loading="loading2">驳回</el-button>
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
        var validatP = (rule, value, callback) => {
            if (!validatPhone(value))
                callback(new Error('手机格式错误!'))
            callback();
        };
        return {
            loading: false, //防止二次操作
            loading2: false,
            listLoading: true, //列表加载状态
            params: {
                pageSize: 10,
                pageIndex: 1,
                type: 1,//店长还款成功待审核
                phone: null,
                userName: null,
            },
            total: '',
            time: null,
            dataList: [],
            storage: storage, //数据存储
            dialogVisible: false, // t弹框
             imgxua :require('@res/img/aaa.png'),//续贷图片
            imgxu :require('@res/img/aa.png'),//续贷图片
            selectData: [
                { label: '正常还款', id: 30 },
                { label: '一般金额减免', id: 31 },
                { label: '特殊金额减免', id: 32 },
                { label: '提前结清', id: 40 },
                { label: '非正常结清', id: 41 },
                // { label: '本金结清', id: 42 },
            ],
            rowData: {} //行数据
        }
    },
    computed: {},
    created() {
        this.getApplyList();

    },
    mounted() {
    },
    methods: {
        //获取列表
        getApplyList(isSeach) {
            if (isSeach) {
                this.params.pageIndex = 1;
            }
            console.log(this.params.type)
            ajax({
                url: 'financeShopOwnerRepay/financeShopOwnerRepayList',
                optionParams: this.params
            }).post()
                .then(res => {
                    console.log(res)
                    if (res.code === 200) {
                        this.dataList = res.data;
                        this.total = res.total;
                    } else {
                        this.$message.warning(res.message);
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        isAlert(row) {
            this.rowData = row;
            this.dialogVisible = true;
            this.loading = false;
            this.loading2 = false;
        },
        //弹框提交
        submitAlert(type) {
            if (type == 1) {
                this.loading = true; //二次提交按钮设置
            } else {
                this.loading1 = true; //二次提交按钮设置
            }
            ajax({
                url: 'financeShopOwnerRepay/financeShopOwnerRepayAudit',
                optionParams: {
                    type: type,
                    skeeid: this.rowData.skeeid
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.$message.success(response.message)
                        this.dialogVisible = false;
                        this.getApplyList();
                    } else {
                        this.$message.warning(response.message);
                        if (type == 1) {
                            this.loading = false; //二次提交按钮设置
                        } else {
                            this.loading1 = false; //二次提交按钮设置
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                    if (type == 1) {
                        this.loading = false; //二次提交按钮设置
                    } else {
                        this.loading1 = false; //二次提交按钮设置
                    }
                })
        },
        //鼠标悬浮当前行
        handleCurrentChange(val) {
            this.currentRow = val;
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
        }
    },
    filters: {
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





