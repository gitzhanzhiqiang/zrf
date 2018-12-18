<template>
    <div class="app-container calendar-list-container ggg_user">
        <el-button type="primary" @click="isShowAlert()">新增</el-button>
        <div class="filter-container">
            <!--<div class="tableheader">客户信息录入</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="100">
                    <template scope="scope">
                        <span>{{(scope.$index) + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="职务">
                    <template scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="isShowAlert(scope.row, true)">修改</el-button>
                        <el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
                        <el-button type="text" size="small" @click="isAlertTime(scope.row)">添加营业时间</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" class="autoAlert">
            <el-form :rules="rules" ref="form" label-position="center" label-width="80px" :model="form"  @keyup.enter.native="submitAlert ('form')">
                <el-form-item prop="name" label="职务名称">
                    <el-input v-model="form.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item prop="id" label="id" v-show="false">
                    <el-input v-model="form.id" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <div class="grid-content">
                <div style="padding:10px 0;">菜单</div>
                <el-tree :data="treeData" show-checkbox node-key="id" default-expand-all ref="menuTree"></el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAlert ('form')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加营业时间" :visible.sync="dialogVisible1" width="30%" class="autoAlert">
            <div style="padding:10px 0;">可用时间</div>
            <el-tree :data="data" show-checkbox node-key="id" ref="timeTree"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="addTime" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
export default {
    data() {
        return {
            loading: false, //防止二次操作
            listLoading: true, //列表加载状态
            dataList: [],
            title: '',
            dialogVisible: false,
            dialogVisible1: false, //时间
            form: {
                name: '',
                id: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ]
            },
            treeData: [],//菜单,
            data: [//弹框树形数据
                {
                    id: 2,
                    label: '星期一'
                },
                {
                    id: 3,
                    label: '星期二',
                },
                {
                    id: 4,
                    label: '星期三',
                },
                {
                    id: 5,
                    label: '星期四',
                },
                {
                    id: 6,
                    label: '星期五',
                },
                {
                    id: 7,
                    label: '星期六',
                },
                {
                    id: 1,
                    label: '星期日',
                }
            ],
            row: {}
        }
    },
    computed: {
    },
    created() {
        this.getTable();
        this.getMenuList();
    },
    mounted() {
    },
    methods: {
        getTable() {
            this.listLoading = true;
            ajax({
                url: 'sysRole/listQuery',
                optionParams: {
                    status: 1
                }
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
        //获取菜单
        getMenuList() {
            ajax({
                url: 'sysMenu/listMenu',
            }).post()
                .then(res => {
                    this.treeData = res.data;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        // 点击新增和修改
        isShowAlert(item, isEdit) {
            this.dialogVisible = true; //弹窗出现
            this.loading = false;
            this.$nextTick(() => {
                this.$refs['form'].resetFields();//恢复表单及数据初始化状态
            })
            if (!isEdit) {
                this.title = '新增';
                this.$nextTick(() => {
                    this.$refs.menuTree.setCheckedKeys([]);
                })
                return false;
            }
            this.title = "编辑";
            //获取详情
            ajax({
                url: 'sysRole/getInfoById/' + item.id,
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response.data)
                        let data = response.data;
                        this.form = data;
                        let menu = data.menuIds ? data.menuIds : [];
                        console.log(menu)
                        this.$refs.menuTree.setCheckedKeys(menu);
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        // 提交弹框
        submitAlert(formName) {
            this.loading = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.$refs.menuTree.getCheckedKeys().length === 0) {
                        this.$message.warning('请选择门店');
                        return false;
                    }
                    let url = '';
                    if (this.title === '编辑') {
                        url = 'sysRole/update';
                    } else {
                        url = 'sysRole/add';
                    }
                    ajax({
                        url: url,
                        optionParams: {
                            id: this.form.id,
                            name: this.form.name,
                            menuIds: this.$refs.menuTree.getCheckedKeys()
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message)
                                this.dialogVisible = false; //弹窗消失
                                this.getTable(); //更新列表
                            } else {
                                this.$message.warning(response.message);
                                this.loading = true;
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            this.loading = true;
                        })
                } else {
                    console.log('error submit!!');
                    this.loading = false;
                    return false;
                }
            });
        },
        // 删除
        deleteData(row) {
            this.loading = false;
            console.log(row)
            this.$confirm('确定要删除数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认按钮
                this.loading = true;
                ajax({
                    url: 'sysRole/delete/' + row.id,
                    optionParams: {}
                }).post()
                    .then(response => {
                        if (response.code === 200) {
                            this.$message.success(response.message)
                            this.getTable(); //更新列表
                        } else {
                            this.$message.warning(response.message)
                            this.loading = false;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.loading = false;
                    })
            }).catch((error) => {
                console.log(error)
            });
        },
        // 点击添加时间
        isAlertTime(row) {
            this.dialogVisible1 = true;
            this.$nextTick(() => {
                this.$refs.timeTree.setCheckedKeys([]);
            })
            this.row = row;
            this.loading = false;
        },
        // 新增时间
        addTime() {
            if (this.$refs.timeTree.getCheckedKeys().length === 0) {
                this.$message.warning('请选择时间');
                return false;
            }
            this.loading = true;
            //确认按钮
            ajax({
                url: 'sysRole/changeGroupTimeControlByRoleId',
                optionParams: {
                    roleId: this.row.id,
                    timecontroller: this.$refs.timeTree.getCheckedKeys().join(',')
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.$message.warning(response.message);
                        this.dialogVisible1 = false;
                    } else {
                        this.$message.warning(response.message);
                        this.loading = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.loading = false;
                })
        },
        //重置
        reset(formName) {
            this.time = '';
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
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


