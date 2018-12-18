<template>
    <div class="app-container calendar-list-container ggg_user" v-loading="contentLoading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
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
                                        <el-table-column align="center" label="用户">
                                            <template scope="scope">
                                                {{scope.row.loginCode}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="用户组名称">
                                            <template scope="scope">
                                                {{scope.row.groupName}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="手机号">
                                            <template scope="scope">
                                                {{scope.row.phone}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作">
                                            <template scope="scope">
                                                <el-button type="text" size="small" @click="isShowAlert(scope.row, true)">
                                                    修改
                                                </el-button>
                                                <el-button type="text" size="small" @click="deleteData(scope.row)">
                                                    删除
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="详细权限">
                                            <template scope="scope">
                                                <el-button type="text" size="small" @click="go_details(scope.row)">
                                                    查看
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="用户属性">
                                            <template scope="scope">
                                                {{scope.row.roleName}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="邀请码">
                                            <template scope="scope">
                                                {{scope.row.inviteCode}}
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
                                                    <el-table-column align="center" label="用户">
                                                        <template scope="scope">
                                                            {{scope.row.loginCode}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="用户组名称">
                                                        <template scope="scope">
                                                            {{scope.row.groupName}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="手机号">
                                                        <template scope="scope">
                                                            {{scope.row.phone}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="操作">
                                                        <template scope="scope">
                                                            <el-button type="text" size="small" @click="isShowAlert(scope.row, true)">
                                                                修改
                                                            </el-button>
                                                            <el-button type="text" size="small" @click="deleteData(scope.row)">
                                                                删除
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="详细权限">
                                                        <template scope="scope">
                                                            <el-button type="text" size="small" @click="go_details(scope.row)">
                                                                查看
                                                            </el-button>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="用户属性">
                                                        <template scope="scope">
                                                            {{scope.row.roleName}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column align="center" label="邀请码">
                                                        <template scope="scope">
                                                            {{scope.row.inviteCode}}
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

        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
            <!--<span v-text="text">这是一段信息</span>-->
            <div>
                <el-form :rules="rules" ref="alertFrom" label-position="center" label-width="0px" :model="AlertData" @keyup.enter.native="submitAlert('alertFrom')">
                    <div v-show="false">
                        <el-form-item prop="inviteCode">
                            <el-input v-model="AlertData.inviteCode"></el-input>
                        </el-form-item>
                        <el-form-item prop="loginCode">
                            <el-input v-model="AlertData.loginCode"></el-input>
                        </el-form-item>
                        <el-form-item prop="status">
                            <el-input v-model="AlertData.status"></el-input>
                        </el-form-item>
                        <el-form-item prop="id">
                            <el-input v-model="AlertData.id"></el-input>
                        </el-form-item>
                    </div>
                    <table style="margin:0 auto;" class="table" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>用户</td>
                            <td>
                                <el-form-item prop="loginCode">
                                    <el-input v-model="AlertData.loginCode" placeholder="请输入用户"></el-input>
                                </el-form-item>
                            </td>
                            <td>管理组</td>
                            <td>
                                <el-form-item prop="groupId">
                                      <el-autocomplete popper-class="my-autocomplete" v-model="state3" :fetch-suggestions="querySearch" custom-item="my-item-zh" placeholder="请输入内容"icon="edit" @select="handleSelect" ></el-autocomplete>
                                     <!--<el-input placeholder="请输入内容" v-model="AlertData.input5" class="input-with-select">
                                        <el-select v-model="AlertData.groupId" slot="prepend" style="width: 155px;" placeholder="请选择">
                                         <el-option :label="item.name" :value="item.value*1" v-for="item in positionData" :key="item.value"></el-option>
                                        </el-select>
                                        <el-button slot="append" @click='sou'>搜索</el-button>
                                    </el-input>-->
                                    <!--<el-select  v-model="AlertData.groupId" placeholder="请选择管理组">
                                        <el-option :label="item.name" :value="item.value*1" v-for="item in positionData2" :key="item.value"></el-option>
                                    </el-select>-->
                                </el-form-item>
                            </td>
                        </tr>
                        <tr>
                            <td>密码</td>
                            <td>
                                <el-form-item prop="password">
                                    <el-input v-model="AlertData.password" placeholder="请输入密码"></el-input>
                                </el-form-item>
                            </td>
                            <td>手机号</td>
                            <td>
                                <el-form-item prop="phone">
                                    <el-input :maxlength="11" v-model="AlertData.phone" placeholder="请输入手机号"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                    </table>

                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAlert('alertFrom')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { validate } from '@src/utils/validation';
import Vue from 'vue';
  Vue.component('my-item-zh', {
    functional: true,
    render: function (h, ctx) {
      var item = ctx.props.item;
      return h('li', ctx.data, [
        h('div', { attrs: { class: 'name' } }, [item.value]),
        // h('span', { attrs: { class: 'addr' } }, [item.value])
      ]);
    },
    props: {
      item: { type: Object, required: true }
    }
  });
export default {
    data() {
        var phone = (rule, value, callback) => {
            if (!validate.validatPhone(value)) {
                callback(new Error('手机号码格式错误'));
                return false;
            }
            callback();
        }
        return {
             state3: '',
            loading: false, //防止二次操作
            contentLoading: true, //主体内容loading
            listLoading: false, //列表加载状态
            treeData: [],//树形主结构
            TableList: [], // 表格数据格式
            groupId: '', //保留用户组id 删除和编辑时用，更新列表
            dialogVisible: false, //弹窗出现
            title: '', //弹框title
            positionData: [], //管理组
            positionData2:[],
            AlertData: {//弹框表格数据
                groupId: '',
                id: '',
                inviteCode: '',
                loginCode: '',
                name: '',
                password: '',
                phone: '',
                status: ''
            },
            rules: { //编辑列表验证
                loginCode: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' }
                ],
                groupId: [
                    // {required: true, message: '请选择管理组', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: phone, trigger: 'blur' },
                ]
            }
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
        sou(){
            alert(1)
        },
        querySearch(queryString, cb) {
            var restaurants = this.positionData;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // // 调用 callback 返回建议列表的数据
            cb(results)
        },
        createFilter(queryString) {
            return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
        console.log(item.name);
        this.AlertData.groupId = item.name
      },
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
                url: 'sysAdmin/listQueryByShop',
                optionParams: {
                    shopId: id
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.TableList = response.data ? response.data : [];
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.listLoading = true;
                })
        },
        //出现弹框
        isShowAlert(item, isEdit) {
            this.state3 = ''
            this.dialogVisible = true; //弹窗出现
            this.loading = false; //二次提交按钮设置
            this.$nextTick(() => {
                this.$refs['alertFrom'].resetFields();//恢复表单及数据初始化状态
            })
            if (!isEdit) {
                this.title = '新增';
                return false;
            } else
                this.title = '编辑';
            //获取详情
            ajax({
                url: 'sysAdmin/getInfoById/' + item.id,
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.AlertData = response.data;
                         this.positionData.map((item)=> {
                            if(response.data.groupId == item.name){
                                console.log(item)
                                this.state3 = item.value
                            }
                        })
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        // 提交
        submitAlert(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let url = '';
                    if (this.title === '编辑') {
                        url = 'sysAdmin/update';
                    } else {

                        url = 'sysAdmin/add';
                    }
                    this.loading = true; //二次提交按钮设置
                    ajax({
                        url: url,
                        optionParams: this.AlertData
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message)
                                this.dialogVisible = false; //弹窗出现
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
        // 添加
        submitAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    ajax({
                        url: 'sysGroup/add',
                        optionParams: {
                            name: this.addtData.name,
                            remark: this.addtData.remark,
                            roleId: this.addtData.roleId
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.addAlert = false;
                                this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
                                this.$message.success(response.message)
                            } else {
                                this.$message.warning(response.message)
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                } else {
                    console.log(this.addtData)
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
                    url: 'sysAdmin/delete/' + row.id,
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
        // 获取管理组
        getPosition() {
            ajax({
                url: 'choicesData/queryByKey',
                optionParams: {
                    key: 'group'
                }
            }).post()
                .then(response => {
                    console.log(response)
                    if (response.code === 200) {
                        console.log(response)
                        this.positionData = response.data ? response.data : [];
                         this.positionData2 = response.data ? response.data : [];
                        let array = [];
                        this.positionData.map((item)=> {
                            let obj = {
                                value: item.name,
                                name: item.value
                            }
                            array.push(obj)
                        })
                        this.positionData = array;
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
            item.isUser = true;
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

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>


