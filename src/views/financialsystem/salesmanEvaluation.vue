<template>
    <div class="app-container calendar-list-container">
        <!-- 新增 -->
        <div class="filter-container">
            <el-button class="filter-item" @click="resetDate();" type="primary" icon="plus" style="margin-left: 20px;">新增</el-button>
        </div>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">考勤</div>-->
            <div class="tablelayer">
                <el-table :data="dataList" v-loading="listLoading" @current-change="handleCurrentChange" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="门店" width="100">
                        <template scope="scope">
                            <span>{{scope.row.shopName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="姓名">
                        <template scope="scope">
                            <span>{{scope.row.adminName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="月份">
                        <template scope="scope">
                            {{scope.row.month}}
                        </template>
                    </el-table-column>
                     <el-table-column align="center" label="终审评价">
                        <template scope="scope">
                            {{scope.row.lastAppCom}}%
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="财务评价">
                        <template scope="scope">
                            {{scope.row.financeAppCom}}%
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template scope="scope">
                            <el-button class="filter-item" @click="Detail(scope.row);" type="text">修改</el-button>
                            <el-button class="filter-item" @click="open2(scope.row)" type="text">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="listQuery.optionParams.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="listQuery.optionParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!-- dialog新增 -->
        <el-dialog title="新增" :visible.sync="dialogVisible" width="450">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="250px" class="demo-ruleForm" @keyup.enter.native="submitForm('ruleForm')">
                <el-form-item label="门店:" prop="shopId">
                    <el-select v-model="ruleForm.shopId" placeholder="请选择所属门店" @change="shopChange">
                        <el-option v-for="item in shopdataList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名字:" prop="adminId">
                    <el-select v-model="ruleForm.adminId" placeholder="请选择名字">
                        <el-option v-for="item in adminsData" :key="item.adminId" :label="item.adminName" :value="item.adminId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="月份:" prop="month">
                    <el-date-picker v-model="ruleForm.month" type="month" placeholder="选择月" @change="monthChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="终审评价(%):" prop="lastAppCom">
                    <el-input v-model.number="ruleForm.lastAppCom" style="width:200px;" placeholder="终审评价" @keyup.native="inputChageMoney($event,'lastAppCom')"></el-input>
                </el-form-item>
                <el-form-item label="财务评价(%):" prop="financeAppCom">
                    <el-input v-model.number="ruleForm.financeAppCom" style="width:200px;" placeholder="财务评价" @keyup.native="inputChageMoneya($event,'financeAppCom')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">确定</el-button>
                    <el-button @click="resetForm('ruleForm');dialogVisible = false;">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- dialog修改 -->
        <el-dialog title="修改" :visible.sync="dialogVisible1" width="450">
            <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" label-width="250px" class="demo-ruleForm" @keyup.enter.native="submitForm('ruleForm1')">
                <el-form-item label="门店:" prop="shopId">
                    <el-select v-model="ruleForm1.shopId" placeholder="请选择所属门店" @change="shopChange">
                        <el-option v-for="item in shopdataList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名字:" prop="adminId">
                    <el-select v-model="ruleForm1.adminId" placeholder="请选择名字">
                        <el-option v-for="item in adminsData" :key="item.adminId" :label="item.adminName" :value="item.adminId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="月份:" prop="month">
                    <el-date-picker v-model="ruleForm1.month" type="month" placeholder="选择月" @change="monthChange1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="终审评价(%):" prop="lastAppCom">
                    <el-input v-model.number="ruleForm1.lastAppCom" style="width:200px;" placeholder="终审评价" @keyup.native="inputChageMoney($event,'lastAppCom')" ></el-input>
                </el-form-item>
                <el-form-item label="财务评价(%):" prop="financeAppCom">
                    <el-input v-model.number="ruleForm1.financeAppCom" style="width:200px;" placeholder="财务评价" @keyup.native="inputChageMoneya($event,'financeAppCom')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm1')" :loading="loading">确定</el-button>
                    <el-button @click="resetForm('ruleForm1');dialogVisible1 = false;">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { praseMoney, parseTime, loanStatusFilter } from '@src/filters';
import { validatPhone } from '@src/utils/validate';
import { storage } from '@constants/dataStorage';
import { Common } from '@common/common';
export default {
    data() {
        return {
            loading: false,
            listLoading: true, //列表加载状态
            listQuery: {
             url: 'comment/selectCommentList', 
            },
            total: '',
            dataList: [],
            shopdataList: [],//店铺信息
            adminsData: [], //显示的业务员
            adminList: '',//名字
            adminList1: '',
            postiondataList: [],//职位信息
            storage: storage, //数据存储
            dialogVisible: false,
            dialogVisible1: false,
            ruleForm: {
                adminId: '',
                financeAppCom: '',
                month: '',
                shopId: '',
                lastAppCom: ''
            },
            ruleForm1: {
                adminId: '',
                financeAppCom: '',
                month: '',
                id: '',
                shopId: '',
                lastAppCom: ''
            },
            tag: false, //姓名清空开关
            rules: {
                adminId: [
                    { required: true, message: '业务员id不能为空' },
                    { type: 'number', message: '业务员id必须为数字值' }
                ],
                financeAppCom: [
                    { required: true, message: '终审评价不能为空' },
                ],
                id: [
                    { required: true, message: 'id不能为空' },
                    { type: 'number', message: 'id必须为数字值' }
                ],
                month: [
                    { required: true, message: '月份不能为空' },
                ],
                shopId: [
                    { required: true, message: '门店id不能为空' },
                    { type: 'number', message: '门店id必须为数字值' }
                ],
                lastAppCom: [
                    { required: true, message: '财务评价不能为空' },
                ],
            },
        }
    },
    computed: {

    },
    created() {
        this.getApplyList();
        this.getShop_area(); //获取门店和区域
    },
    mounted() {
    },
    methods: {
        //获取列表
        getApplyList() {
            ajax({
                url: this.listQuery.url,
                optionParams: {}
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        this.dataList = res.data;
                        this.total = res.total;
                        this.listLoading = false;
                    }else{
                        this.listLoading = false;
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //重置数据
        resetDate() {
            this.dialogVisible = true;
            this.loading = false;
            this.$nextTick(() => {
                this.$refs['ruleForm'].resetFields();
            })
            this.$nextTick(() => {
                this.$refs['ruleForm1'].resetFields();
            })
        },
        //月份处理
        monthChange() {
            if (this.ruleForm.month) {
                console.log()
                this.ruleForm.month = parseTime(this.ruleForm.month, '{y}-{m}');
            }
        },
        //月份处理
        monthChange1(value) {
            console.log(value)
            if (this.ruleForm1.month) {
                console.log('aa')
                this.ruleForm1.month = parseTime(this.ruleForm1.month, '{y}-{m}');
            }
        },
        //获取门店和区域
        getShop_area() {
            ajax({
                url: 'PlatformData/XcChoose',
                optionParams: {
                    roleId: 6
                }
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
            this.ruleForm.adminId = '';
            this.adminsData = [];
            console.log(this.adminsData)
            this.shopdataList.map((item) => {
                if (value == item.shopId) {
                    this.adminsData = item.children;
                }
            })
            console.log(this.adminsData)
        },
        open2(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            ajax({
                url: 'comment/deleteComment',
                optionParams: {
                  id:row.id
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.$message({
                                type: 'success',
                                message: response.message
                            });
                            this.getApplyList();
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
   
        //鼠标悬浮当前行
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        // 改变每一页的条数
        handleSizeChange(val) {
            this.listQuery.optionParams.pageSize = val;
            this.getApplyList();
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.listQuery.optionParams.pageIndex = val;
            this.getApplyList();
        },
        //详情
        Detail(val) {
            console.log(val)
            this.dialogVisible1 = true;
            this.adminsData1 = [];
            this.loading = false;
            this.tag = true; //清空名字开关
            this.ruleForm1.adminId = val.adminId
            this.ruleForm1.financeAppCom =val.financeAppCom
            this.ruleForm1.id = val.id
            this.ruleForm1.month = val.month
            this.ruleForm1.shopId = val.shopId
            this.ruleForm1.lastAppCom = val.lastAppCom
             this.shopChange(val.shopId)
        },
        //格式化金钱
        inputChageMoney(e) {
            let obj = {
                input: e,
                maxMoney: 10,
                that: this
            }
            this.ruleForm.lastAppCom = Common.positiveIntegerMoney(obj); //表单赋值
        },
         inputChageMoneya(e) {
            let obj = {
                input: e,
                maxMoney: 10,
                that: this
            }
            this.ruleForm.financeAppCom = Common.positiveIntegerMoney(obj); //表单赋值
        },
        // 提交表单  新增时
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let optionParams;
                    let urls;
                    if (formName === 'ruleForm') {
                        optionParams = this.ruleForm;
                        urls = 'comment/addComment'
                    } else if (formName === 'ruleForm1') {
                        optionParams = this.ruleForm1;
                         urls = 'comment/updateComment'
                    } else {

                    }
                    console.log(urls)
                    this.loading = true;
                    ajax({
                        url: urls,
                        optionParams: optionParams

                    }).post().then(response => {
                        if (response.code === 200) {
                            this.$message({
                                type: 'success',
                                message: response.message
                            });
                            this.dialogVisible1 = false;
                            this.dialogVisible = false;
                            this.getApplyList();
                        } else {
                            this.$message({
                                message: response.message,
                                type: "warning"
                            });
                            this.loading = false;
                        }
                    })
                } else {
                    console.log('error submit!!');
                    this.loading = false;
                    return false;
                }
            });
        },
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogVisible = false;
            this.dialogVisible1 = false;
        },
    },
    filters: {
    }
}
</script>
<style lang="less" scoped>

</style>





