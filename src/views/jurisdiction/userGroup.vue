<template>
    <div class="app-container calendar-list-container ggg_user" v-loading="contentLoading" element-loading-text="加载中" element-loading-spinner="loading">
        <el-button type="primary" @click="isShowAlert('alertFrom')">新增</el-button>
        <div class="filter-container">
            <!--<el-tree :data="data1" :props="defaultProps" @node-click="handleNodeClick"></el-tree>-->
            <div class="el-tree">
                <div class="el-tree-node" v-for="(item, index) in treeData" :key="item.id">
                    <div class="el-tree-node__content" @click="isTreeShow(item)">
                        <span class="el-tree-node__expand-icon" :class="{'isRote': item.isShow}"></span>
                        <span class="el-tree-node__label" v-text="item.label">一级</span>
                    </div>
                    <div class="el-tree-node__children">
                        <div class="el-tree-node" v-if="item.children.length == 0">
                            <!--二级-->
                            <div class="el-tree-node__children" style="padding-left:16px;" v-show="item.isShow">
                                <div class="tablelayer">
                                    <el-table :data="TableList" v-loading="listLoading" border fit highlight-current-row style="width: 100%" stripe>
                                        <el-table-column align="center" label="用户组名称" width="150">
                                            <template scope="scope">
                                                {{scope.row.name}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="职位" width="130">
                                            <template scope="scope">
                                                {{scope.row.roleName}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="备注" width="100">
                                            <template scope="scope">
                                                {{scope.row.remark}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="所属门店">
                                            <template scope="scope">
                                                <span style="padding:5px 5px" v-for="item in scope.row.shopName" v-text="item"></span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="创建时间" width="170">
                                            <template scope="scope">
                                                {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作" width="200">
                                            <template scope="scope">
                                                <el-button type="text" size="small" @click="isShowAlert(scope.row, 'isEdit')">
                                                    修改
                                                </el-button>
                                                <el-button type="text" size="small" @click="deleteData(scope.row)">
                                                    删除
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="详细权限" width="100">
                                            <template scope="scope">
                                                <el-button type="text" size="small" @click="go_details(scope.row)">
                                                    查看
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                        <div class="el-tree-node" v-else>
                            <!--三级-->
                            <template v-for="itm in item.children">
                                <div class="el-tree-node__content" style="padding-left: 16px;" v-show="item.isShow" @click="isTreeShow(item, itm)">
                                    <span class="el-tree-node__expand-icon" :class="{'isRote': itm.isShow}"></span>
                                    <div class="el-tree-node__label" v-text="itm.label"></div>
                                </div>
                                <div class="el-tree-node__children">
                                    <div class="el-tree-node">
                                        <div class="el-tree-node__children" style="padding-left:32px;" v-show="itm.isShow">
                                            <div class="tablelayer">
                                                <el-table :data="TableList" v-loading="listLoading" border fit highlight-current-row style="width: 100%" stripe>
                                                    <el-table-column align="center" label="用户组名称" width="150">
                                                        <template scope="scope">
                                                            {{scope.row.name}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="职位" width="130">
                                                        <template scope="scope">
                                                            {{scope.row.roleName}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="备注" width="100">
                                                        <template scope="scope">
                                                            {{scope.row.remark}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="所属门店">
                                                        <template scope="scope">
                                                            <span style="padding:5px 5px" v-for="item in scope.row.shopName" v-text="item"></span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="创建时间" width="170">
                                                        <template scope="scope">
                                                            {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="操作" width="200">
                                                        <template scope="scope">
                                                            <el-button type="text" size="small" @click="isShowAlert(scope.row, 'isEdit')">
                                                                修改
                                                            </el-button>
                                                            <el-button type="text" size="small" @click="deleteData(scope.row)">
                                                                删除
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="详细权限" width="100">
                                                        <template scope="scope">
                                                            <el-button type="text" size="small" @click="go_details(scope.row)">
                                                                查看
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <!--node-->
            </div>
        </div>
        <!--弹框-->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @keyup.enter.native="submitAlert('alertFrom')">
            <!--<span v-text="text">这是一段信息</span>-->
            <div>
                <el-form :rules="rules" ref="alertFrom" label-position="center" label-width="0px" :model="AlertData">
                    <table style="margin:0 auto;" class="table" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>用户组名称</td>
                            <td>
                                <el-form-item prop="name">
                                    <el-input v-model="AlertData.name" placeholder="请输入用户组名称"></el-input>
                                </el-form-item>
                            </td>
                            <td>备注</td>
                            <td>
                                <el-form-item prop="remark">
                                    <el-input v-model="AlertData.remark" placeholder="请输入备注"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>职位</td>
                            <td>
                                <el-form-item prop="roleId">
                                    <el-select v-model="AlertData.roleId" placeholder="请选择职位">
                                        <el-option :label="item.name" :value="item.value + ''" v-for="item in positionData" :key="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>

                </el-form>
            </div>
            <el-row :gutter="100" style="margin: 0 auto; padding:10px 30px;">
                <el-col :span="10">
                    <div class="grid-content">
                        <div style="padding:10px 0;">所属门店</div>
                        <el-tree :data="treeData2" show-checkbox node-key="id" default-expand-all ref="shopTree"></el-tree>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="grid-content">
                        <div style="padding:10px 0;">可用时间</div>
                        <el-tree :data="data3" show-checkbox node-key="id" ref="timeTree"></el-tree>
                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAlert('alertFrom')" :loading="loading">确 定</el-button>
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
            contentLoading: true, //主体内容loading
            listLoading: false, //列表加载状态
            treeData: [],//树形主结构
            treeData2: [],//树形主结构(弹框分店用)
            TableList: [], // 表格数据格式
            groupId: '', //保留用户组id 删除和编辑时用，更新列表
            dialogVisible: false, //修改弹窗出现
            title: '', // 弹框title
            AlertData: { //弹框表格数据
                id: '',
                name: '',
                remark: '',
                roleId: '',
                shopIds: [],
                timecontroller: ''
            },
            data3: [//弹框树形数据
                {
                    id: 2,
                    label: '星期一',
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
            rules: { //编辑列表验证
                name: [
                    { required: true, message: '请输入用户组名称', trigger: 'blur' }
                ],
                roleId: [
                    { required: true, message: '请选择职位', trigger: 'change' }
                ]
            },
            positionData: [] //职位
        }
    },
    computed: {
    },
    created() {
    },
    mounted() {
        this.getCityList(); //获取城市列表
        this.getPosition(); // 获取职位
    },
    methods: {
        //获取城市列表
        getCityList() {
            this.contentLoading = true;
            ajax({
                url: '/province/listProvinceShop',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.treeData = response.data ? response.data : [];
                        this.treeData2 = JSON.parse(JSON.stringify(this.treeData)).slice(1, this.treeData.length);
                        this.formmatAlertTreeData(this.treeData2); //弹框树形
                        this.formmatTreeData(); //处理树形数据
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.contentLoading = false;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        // 处理树形数据
        formmatTreeData() {
            this.treeData.map((value, index) => {
                this.$set(value, 'isShow', false);
                if (value.children.length > 0) {
                    value.children.map((item) => {
                        this.$set(item, 'isShow', false);
                    })
                }
            })
        },
        formmatAlertTreeData(array) {
            if (array) {
                array.map((item) => {
                    item.id = 'A' + item.id;
                })
            }
        },
        // 折叠tree
        isTreeShow(value, value1) {
            this.TableList = [];
            if (value1) {
                //三级展示
                let bag = value1.isShow;
                value.children.map((item) => {
                    item.isShow = false;
                })
                value1.isShow = !bag;
                if (value1.isShow) {
                    this.getTable(value1.id); //获取表格数据
                    this.groupId = value1.id;
                }
            } else {
                //二级展示
                let bag = value.isShow;
                this.treeData.map((value) => {
                    value.isShow = false;
                    if (value.children.length > 0) {
                        value.children.map((item) => {
                            item.isShow = false
                        })
                    }
                })
                value.isShow = !bag;
                if (value.isShow && value.id == '') {
                    this.getTable(value.id); //获取表格数据
                    this.groupId = value.id;
                }
            }
            // if (value.id && value1) {
            //      this.getTable(value1.id); //获取表格数据
            //      this.groupId = value1.id;
            // }
            // if (value.id == '') {
            //      this.getTable(value.id); //获取表格数据
            //      this.groupId = value.id;
            // }
        },
        //获取表格数据
        getTable(id) {
            this.listLoading = true;
            ajax({
                url: 'sysGroup/listQueryByShop',
                optionParams: {
                    shopId: id
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.TableList = response.data ? response.data : [];
                        this.TableList.map((value) => {
                            if (value.shopName) {
                                value.shopName = value.shopName.split(',');
                            }
                        })
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.listLoading = false;
                })
        },
        // 点击修改
        isShowAlert(item, isEdit) {
            this.dialogVisible = true; //弹窗出现
            this.loading = false; //二次提交按钮设置
            this.$nextTick(() => {
                this.$refs['alertFrom'].resetFields();//恢复表单及数据初始化状态
            })
            if (!isEdit) {
                this.title = '新增';
                this.$nextTick(() => {
                    this.$refs.shopTree.setCheckedKeys([]);
                    this.$refs.timeTree.setCheckedKeys([1, 2, 3, 4, 5, 6, 7]);
                })
                return false;
            }
            this.title = "编辑"
            //获取详情
            ajax({
                url: 'sysGroup/getInfoById/' + item.id,
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.AlertData = response.data;
                        this.AlertData.roleId = this.AlertData.roleId + '';
                        let array = this.AlertData.timecontroller ? this.AlertData.timecontroller.split(',') : [];
                        this.$refs.shopTree.setCheckedKeys(this.AlertData.shopIds);
                        this.$refs.timeTree.setCheckedKeys(array);
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
            let array = this.$refs.shopTree.getCheckedKeys();
            let array2 = [];
            array.map((item) => {
                if (typeof item != 'string') {
                    array2.push(item)
                }
            })
            this.$refs[formName].validate((valid) => {
                console.log(this.editData)
                if (valid) {
                    if (this.$refs.shopTree.getCheckedKeys().length === 0) {
                        this.$message.warning('请选择门店');
                        return false;
                    }
                    let url = '';
                    if (this.title === '编辑') {
                        url = 'sysGroup/update/';
                    } else {
                        url = 'sysGroup/add';
                    }
                    this.loading = true; //二次提交按钮设置
                    ajax({
                        url: url,
                        optionParams: {
                            id: this.AlertData.id,
                            name: this.AlertData.name,
                            remark: this.AlertData.remark,
                            roleId: this.AlertData.roleId,
                            shopIds: array2,
                            timecontroller: this.$refs.timeTree.getCheckedKeys().join(',')
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message)
                                this.dialogVisible = false; //弹窗消失
                                this.getTable(this.groupId); //更新列表
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
        // 删除
        deleteData(row) {
            console.log(row)
            this.$confirm('确定要删除数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认按钮
                ajax({
                    url: 'sysGroup/delete/' + row.id,
                    optionParams: {}
                }).post()
                    .then(response => {
                        if (response.code === 200) {
                            this.$message.warning(response.message)
                            this.getTable(this.groupId); //更新列表
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }).catch(() => {
                //取消
                //  this.$message.warning('取消')
            });
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
                        this.positionData = response.data ? response.data : [];
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        // 跳转详情
        go_details(item) {
            let list = JSON.stringify(item)
            this.$router.push({ path: "userDetails", query: { data: list } });
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
    padding: 20px 0!important;
}
</style>


