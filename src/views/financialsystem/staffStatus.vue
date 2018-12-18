<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getTable(true)">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="params.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="roleId">
                <el-select v-model="params.roleId" placeholder="请选择">
                    <el-option v-for="item in position" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户" prop="userName">
                <el-input v-model="params.userName"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="params.status" placeholder="请选择">
                    <el-option key="1" label="在职" value="1"></el-option>
                    <el-option key="-1" label="离职" value="-1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable(true)">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <!--<div class="tableheader">在离职</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="100">
                    <template scope="scope">
                        <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="名字">
                    <template scope="scope">
                        {{scope.row.loginCode}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="职位">
                    <template scope="scope">
                        {{scope.row.roleName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="邀请码">
                    <template scope="scope">
                        {{scope.row.inviteCode}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="入职时间">
                    <template scope="scope">
                        {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="离职时间">
                    <template scope="scope">
                        {{scope.row.leaveTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template scope="scope">
                        <el-button v-if="scope.row.status == '在职'" type="text" size="small" @click="isAlert(scope.row)">在职</el-button>
                        <span v-else>离职</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div v-if="total" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" class="autoAlert" :close-on-click-modal="false">
            <el-form :model="alertForm" ref="alertForm" style="padding-left:30px;">
                <el-form-item label="" style="text-align:center;">
                    <span>是否确认{{rowData.roleName + '-' +rowData.loginCode}}已离职?</span>
                </el-form-item>
                <el-form-item label="离职时间:" prop="leaveTime" label-width="100" :rules="[{ required: true, message: '请选择离职日期', trigger: 'change' },]">
                    <el-date-picker v-model="alertForm.leaveTime" type="date" placeholder="请选择离职日期" @change="timeChange" :picker-options="{disabledDate(time) {return time.getTime() > Date.now()}}">
                    </el-date-picker>
                </el-form-item>
            </el-form>
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
import { Common } from '@common/common';
export default {
    data() {
        return {
            listLoading: true, //列表加载状态
            params: { //搜索条件
                pageIndex: 1,
                pageSize: 10,
                roleId: '',
                userName: '',
                status: '' //状态
            },
            total: 0,
            position: [], //门店
            dataList: [],
            dialogVisible: false, //弹窗
            loading: false, //二次点击
            rowData: '', //行数据
            alertForm: {
                leaveTime: ''
            }
        }
    },
    computed: {
    },
    created() {
        this.getPosition(); //获取门店和区域
    },
    mounted() {
        this.getTable();
    },
    methods: {
        getTable(isSeach) {
            this.listLoading = true;
            if (isSeach) {
                this.params.pageIndex = 1;
            }
            ajax({
                url: 'sysAdmin/getSalesmanLeave',
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
        //获取门店和区域
        getPosition() {
            ajax({
                url: 'choicesData/queryByKey',
                optionParams: {
                    key: 'position'
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.position = response.data ? response.data : [];
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //确认离职
        isAlert(row) {
            this.loading = false; //二次点击
            this.dialogVisible = true;
            this.rowData = row;
            this.$nextTick(() => {
                this.$refs['alertForm'].resetFields(); //恢复表单及数据初始化状态
            })
        },
        timeChange(value) {
            this.alertForm.leaveTime = value;
        },
        //弹框确认
        submitAlert(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true; //二次点击
                    ajax({
                        url: 'sysAdmin/updateToLeave',
                        optionParams: {
                            id: this.rowData.id,
                            leaveTime: this.alertForm.leaveTime
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message);
                                this.dialogVisible = false;
                                this.getTable();
                            } else {
                                this.$message.warning(response.message);
                                this.loading = false; //二次点击
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false; //二次点击
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
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
        //重置
        reset(formName) {
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
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


