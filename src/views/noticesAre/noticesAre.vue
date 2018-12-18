<template>
    <div class="app-container calendar-list-container ggg_user">
        <el-button type="primary" @click="isShowAlert('新增')">新增</el-button>
        <div class="filter-container">
            <!--<div class="tableheader">通知栏目</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="通知文字">
                    <template scope="scope">
                        {{scope.row.notice }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="通知时间">
                    <template scope="scope">
                        {{scope.row.startTime | parseTime('{y}-{m}-{d}')}}-{{scope.row.endTime | parseTime('{y}-{m}-{d}')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="执行时间">
                    <template scope="scope">
                        {{scope.row.executeTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="字体颜色">
                    <template scope="scope">
                        <input type="color" v-model="scope.row.fontColor" placeholder="请选择" disabled style="width:100px;" />
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="isShowAlert('查看', scope.row)">查看</el-button>
                        <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" class="autoAlert">
            <el-form label-position="right" :rules="rules" :model="alertForm" ref="params" label-width="80px" :inline="true" class="demo-form-inline" @keyup.enter.native="submitForm('params')">
                <el-form-item label="通知文字" prop="notice">
                    <el-input v-model="alertForm.notice" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="通知时间" prop="startTime">
                    <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="tTimeChange"></el-date-picker>
                </el-form-item>
                <div v-show="false">
                    <el-form-item label="开始时间" prop="startTime">
                        <el-input v-model="alertForm.startTime" placeholder="开始"></el-input>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        <el-input v-model="alertForm.endTime" placeholder="结束"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="文字颜色" prop="fontColor">
                    <input type="color" v-model="alertForm.fontColor " placeholder="请选择" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('params')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { formatTime, parseTime } from '@src/filters';
export default {
    data() {
        return {
            loading: false, //防止二次操作
            listLoading: true, //列表加载状态
            dataList: [],
            dialogVisible: false,
            title: '',
            alertForm: {
                notice: '',
                startTime: '',
                endTime: '',
                fontColor: '#c0c0c0'
            },
            time: '',
            rules: {
                notice: [{ required: true, message: '请输入', trigger: 'blur' }],
                startTime: [{ required: true, message: '请选择', trigger: 'change' }]
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
        getTable() {
            this.listLoading = true;
            ajax({
                url: 'sysNotice/listQuery',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.dataList = response.data ? response.data : [];
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //选择时间
        tTimeChange(value) {
            formatTime(value, this, 'alertForm', 'startTime', 'endTime');
        },
        isShowAlert(title, row) {
            this.title = title;
            this.dialogVisible = true;
            this.loading = false; //二次提交按钮设置
            this.time = [];
            this.$nextTick(() => {
                this.$refs['params'].resetFields(); //恢复表单及数据初始化状态
                if (row) {
                    this.alertForm = JSON.parse(JSON.stringify(row));
                    this.alertForm.startTime = parseTime(this.alertForm.startTime, '{y}-{m}-{d}')
                    this.alertForm.endTime = parseTime(this.alertForm.endTime, '{y}-{m}-{d}')
                    this.time = [this.alertForm.startTime, this.alertForm.endTime];
                    this.$set(this.alertForm, 'fontColor', row.fontColor)
                }
            })
        },
        //删除
        remove(row) {
            ajax({
                url: 'sysNotice/del/' + row.id,
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.$message.success(response.message)
                        this.getTable();
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //提交
        submitForm(formName) {
            let url = '';
            if (this.title == '新增') {
                url = 'sysNotice/add';
            } else {
                url = 'sysNotice/update'
            }
            console.log(this.alertForm)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true; //二次提交按钮设置
                    ajax({
                        url: url,
                        optionParams: this.alertForm
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
                }
            })
        }
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


