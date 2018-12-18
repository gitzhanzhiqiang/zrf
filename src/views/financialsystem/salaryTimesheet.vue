<template>
    <div class="app-container calendar-list-container">

        <!-- 搜索条件 -->
        <div class="filter-container" @keyup.enter.native="getApplyList">
            <span>月份:</span>
            <!--<el-date-picker v-model="listQuery.optionParams.month" type="month" placeholder="选择月">-->
            <el-date-picker v-model="listQuery.optionParams.month" type="month" placeholder="选择月">
            </el-date-picker>
            <!--</el-date-picker>-->
            <span>门店:</span>
            <el-select v-model="listQuery.optionParams.shopid" placeholder="请选择所属门店" @change="shopChange">
                <el-option v-for="item in shopdataList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
            </el-select>
            <span>业务员:</span>
            <el-select v-model="listQuery.optionParams.adminId" placeholder="请选择业务员" :disabled="!listQuery.optionParams.shopId">
                <el-option v-for="item in adminsData" :key="item.adminId" :label="item.adminName" :value="item.adminId"></el-option>
            </el-select>
            <el-button class="filter-item" type="primary" icon="search" @click="getApplyList" style="margin-left: 20px;">查询</el-button>
            <el-button class="filter-item" @click="reset" type="primary" icon="setting" style="margin-left: 20px;">重置</el-button>
        </div>
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
                    <el-table-column align="center" label="职位">
                        <template scope="scope">
                            {{scope.row.positionName}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="入职时间">
                        <template scope="scope">
                            <!-- {{scope.row.entryTime}} -->
                            {{scope.row.creatTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="出勤天数">
                        <template scope="scope">
                            {{scope.row.attendanceDays}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="考勤天数">
                        <template scope="scope">
                            {{scope.row.workDays}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="出勤率">
                        <template scope="scope">
                            {{scope.row.attendRate}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="月份">
                        <template scope="scope">
                            {{scope.row.month}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template scope="scope">
                            <el-button class="filter-item" @click="Detail(scope.row);" type="text">修改</el-button>
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
                    <el-select v-model="ruleForm.shopId" placeholder="请选择所属门店">
                        <el-option v-for="item in shopdataList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位:" prop="postionId">
                    <el-select v-model="ruleForm.postionId" placeholder="请选择职位" @change="getRole(ruleForm.postionId)">
                        <el-option label="业务员" value="1"></el-option>
                        <el-option label="营业部经理" value="4"></el-option>
                        <el-option label="门店信审" value="6"></el-option>
                        <el-option label="门店行政" value="8"></el-option>
                        <el-option label="门店法催" value="10"></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="名字:" prop="adminId">
                    <el-select v-model="ruleForm.adminId" placeholder="请选择名字">
                        <el-option v-for="item in adminList" :key="item.id" :label="item.adminName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="月份:" prop="month">
                    <el-date-picker v-model="ruleForm.month" type="month" placeholder="选择月" @change="monthChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="出勤天数:" prop="attendanceDays">
                    <el-input v-model.number="ruleForm.attendanceDays" style="width:200px;" placeholder="请输入出勤天数"></el-input>
                </el-form-item>
                <el-form-item label="考勤天数:" prop="workDays">
                    <el-input v-model.number="ruleForm.workDays" style="width:200px;" placeholder="请输入考勤天数"></el-input>
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
                    <el-select v-model="ruleForm1.shopId" placeholder="请选择所属门店">
                        <el-option v-for="item in shopdataList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位:" prop="postionId">
                    <el-select v-model="ruleForm1.postionId" placeholder="请选择职位" @change="getRole1(ruleForm1.postionId)">
                        <el-option v-for="item in storage.ReimbursementChannelsSeachzhi" :key="ruleForm1.postionId" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名字:" prop="adminId">
                    <el-select v-model="ruleForm1.adminId" placeholder="请选择名字">
                        <el-option v-for="item in adminList1" :key="item.id" :label="item.adminName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="月份:" prop="month">
                    <el-date-picker v-model="ruleForm1.month" type="month" placeholder="选择月" @change="monthChange1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="出勤天数:" prop="attendanceDays">
                    <el-input v-model.number="ruleForm1.attendanceDays" style="width:200px;" placeholder="请输入出勤天数"></el-input>
                </el-form-item>
                <el-form-item label="考勤天数:" prop="workDays">
                    <el-input v-model.number="ruleForm1.workDays" style="width:200px;" placeholder="请输入考勤天数"></el-input>
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
export default {
    data() {
        var validatP = (rule, value, callback) => {
            if (!validatPhone(value))
                callback(new Error('手机格式错误!'))
            callback();
        };
        return {
            loading: false,
            listLoading: true, //列表加载状态
            listQuery: { url: 'cwkq/listShopAssAttend', optionParams: { pageSize: 10, pageIndex: 1, shopid: '', month: '', adminId: '' } },
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
                attendanceDays: '',
                month: '',
                postionId: '',
                shopId: '',
                workDays: ''
            },
            ruleForm1: {
                adminn:'',
                postionIdd:'',
                adminId: '',
                attendanceDays: '',
                month: '',
                id: '',
                postionId: '',
                shopId: '',
                workDays: ''
            },
            tag: false, //姓名清空开关
            rules: {
                adminId: [
                    { required: true, message: '业务员id不能为空' },
                  
                ],
                attendanceDays: [
                    { required: true, message: '出勤天数不能为空' },
                    { type: 'number', message: '出勤天数必须为数字值' }
                ],
                id: [
                    { required: true, message: 'id不能为空' },
                    { type: 'number', message: 'id必须为数字值' }
                ],
                month: [
                    { required: true, message: '月份不能为空' },
                ],
                postionId: [
                    { required: true, message: '职位id不能为空' }

                ],
                shopId: [
                    { required: true, message: '门店id不能为空' },
                    { type: 'number', message: '门店id必须为数字值' }
                ],
                workDays: [
                    { required: true, message: '考勤天数不能为空' },
                    { type: 'number', message: '考勤天数必须为数字值' }
                ],
            },
        }
    },
    computed: {

    },
    created() {
        this.getApplyList();
        this.getShop_area(); //获取门店和区域
        this.getPosition()
    },
    mounted() {
    },
    methods: {
        //获取列表
        getApplyList() {
             this.listLoading = true;
            if (!this.listQuery.optionParams.month) {
                let date = new Date;
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                month = (month < 10 ? "0" + month : month);
                this.listQuery.optionParams.month = year + '-' + month;
            } else {
                this.listQuery.optionParams.month = parseTime(this.listQuery.optionParams.month, '{y}-{m}');
            }
            ajax({
                url: this.listQuery.url,
                optionParams: this.listQuery.optionParams
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        this.dataList = res.data;
                        this.total = res.total;
                        this.listLoading = false;
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        // 获取职位
        getPosition() {
            ajax({
                url: 'choicesData/queryByKey',
                optionParams: {
                    key: 'position'
                }
            }).post()
                .then(response => {
                    console.log(response)
                    if (response.code === 200) {
                        this.postiondataList = response.data ? response.data : [];
                    } else {
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
            this.adminList = [];
            this.$nextTick(() => {
                this.$refs['ruleForm'].resetFields();
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
            this.listQuery.optionParams.adminId = '';
            this.adminsData = [];
            this.shopdataList.map((item) => {
                if (value == item.shopId) {
                    this.adminsData = item.children;
                }
            })
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
            this.dialogVisible1 = true;
            this.adminsData1 = [];
            this.loading = false;
            this.tag = true; //清空名字开关
            ajax({
                url: 'cwkq/shopAssattendDetail',
                optionParams: {
                    adminId: val.adminId,
                    attendanceDays: val.attendanceDays,
                    id: val.id,
                    month: val.month,
                    postionId: val.postionId,
                    shopId: val.shopId,
                    workDays: val.workDays
                },
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        console.log(res)
                        this.ruleForm1 = {
                            adminn:res.data.adminName,
                            adminId: res.data.adminId,
                            attendanceDays: res.data.attendanceDays,
                            id: res.data.id,
                            month: res.data.month,
                            postionId: res.data.roleId,
                            postionIdd: res.data.positionName,
                            shopId: res.data.shopId,
                            workDays: res.data.workDays
                        }
                        // this.getRole1(res.data.roleId)
                    }
                })
                .catch(error => {
                    console.log(error)
                })

        },
        //获取角色新增
        getRole(val) {
            console.log(val)
            this.ruleForm.adminId = '';
            this.adminList = [];
            ajax({
                url: 'cwkq/getAdminNameByRoleId',
                optionParams: {
                    roleId: val,
                },
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        console.log(res)
                        this.adminList = res.data ? res.data : [];
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //获取角色id编辑机
        getRole1(val) {
            console.log('aaaa' + val)
            ajax({
                url: 'cwkq/getAdminNameByRoleId',
                optionParams: {
                    roleId: val,
                },
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        console.log(res)
                        this.adminList1 = res.data;
                        if (!this.tag) {
                            this.ruleForm1.adminId = '';
                        } else {
                            this.tag = false;
                        }
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //重置shopId: '',month:'',adminId:''
        reset() {
            this.listQuery.optionParams.shopId = '';
            this.listQuery.optionParams.month = '';
            this.listQuery.optionParams.adminId = '';
        },
        // 提交表单  新增时
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let optionParams;
                    if (formName === 'ruleForm') {
                        optionParams = this.ruleForm;
                    } else if (formName === 'ruleForm1') {
                        optionParams = this.ruleForm1;
                    } else {

                    }
                    this.loading = true;
                    ajax({
                        url: "cwkq/addShopAssAttend",
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





