<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params"  ref="params"  class="demo-form-inline" @keyup.enter.native="submitTable()">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input  v-model="params.pageIndex"></el-input>
            </el-form-item>
                <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input  v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="名字" prop="name">
                <el-input  v-model="params.name"  placeholder="名字"></el-input>
            </el-form-item>
             <el-form-item label="id" prop="userId">
                <el-input  v-model="params.userId" placeholder="id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
                <el-button type="primary" icon="search" @click="submitTable()">查询</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="open2()">确认删除功能</el-button>
        <el-button type="primary" @click="dialogVisible = true">对话框</el-button>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">渠道管理</div>-->
            <div class="tablelayer">
                <el-table :data="dataList" v-loading="listLoading" @current-change="handleCurrentChange" border fit highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="序号" width="100">
                        <template scope="scope">
                            <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="已添加平台">
                        <template scope="scope">
                            {{scope.row.name}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="添加时间" width="200">
                        <template scope="scope">
                            {{scope.row.create_date | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="引流用户（人）">
                        <template scope="scope">
                            <span>{{scope.row.iuser}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="普通用户（人）">
                        <template scope="scope">
                            <span>{{scope.row.puser}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="发放佣金">
                        <template scope="scope">
                            <span>{{scope.row.asum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="备注">
                        <template scope="scope">    
                            <span>{{scope.row.remarks}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" fixed="right" width="200">
                        <template scope="scope">
                            <el-button type="text" size="small">
                                备注
                            </el-button>
                            <el-button type="text" size="small">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </div>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" top="30%"  class="autoAlert">
            <span v-text="text">这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="">确 定</el-button>
            </span>
        </el-dialog>
        <el-form label-position="center" label-width="100px" class="noborder">
            <el-form-item label="操作员账号">
                <span class="el-input" v-text="form.nickname"></span>
            </el-form-item>
            <el-form-item label="姓名">
                    <span class="el-input" v-text="form.userName"></span>
            </el-form-item>
            <el-form-item label="手机">
                <span class="el-input" v-text="form.phone"></span>
            </el-form-item>
            <el-form-item label="邮箱">
                <span class="el-input" v-text="form.email"></span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"@click="submitData()">完成</el-button>
                <el-button  @click="isEdit = true">返回修改</el-button>
            </el-form-item>
        </el-form>
        <el-form :rules="rules"  ref="editForm" label-position="center" :model="form2" label-width="100px" style="width:400px;">
                <el-form-item label="操作员账号" prop="nickname">
                    <el-input  v-model="form2.nickname"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="userName">
                     <el-input  v-model="form2.userName"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input  v-model="form2.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input  v-model="form2.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="next_step('editForm')">下一步</el-button>
                    <el-button  @click="$router.go(-1)">取消</el-button>
                </el-form-item>
        </el-form>
    </div>
</template>
<script>
import ajax from '@utils/config';
export default {
    data() {
        var letter = (rule, value, callback)=> {  
            if (!validate.validatAlphabets(value)) {
                callback(new Error('请输入字母'));
                return false;
            }
            callback();
        }
        //汉字和字母
        var userName = (rule, value, callback)=> {  
            if (!validate.validaChineseletter(value)) {
                callback(new Error('请输入汉字或字母'));
                return false;
            }
            callback();
        }
        var phone = (rule, value, callback)=> {
            if (!validate.validatPhone(value)) {
                callback(new Error('手机号码格式错误'));
                return false;
            }
            callback();
        }
        var isEmail = (rule, value, callback) => {
            if (!validate.validaEmail(value)) {
                callback(new Error('邮箱格式错误'));
                return false;
            }
            callback();
        }
        var roleId = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请选择角色'));
                return false;
            }
            callback();
        }
        return {
            listLoading: true, //列表加载状态
            params: { //搜索条件
                pageSize: 10, 
                pageIndex: 1, 
                name: '', //用户名字
                userId: ''
            },
            total: '',
            dataList: [],
            dialogVisible: false, //弹框
            text: 'dsa',
            form: {
                nickname: 'e43',
                userName: 'e43',
                phone: 'e43',
                email: 'e43'
            },
            form2: {
                nickname: 'e43',
                userName: 'e43',
                phone: 'e43',
                email: 'e43'
            },
            roleData: '',
            rules: {
                nickname: [
                    {required: true, message: '请输入账号', trigger: 'blur' },
                    {validator: letter, trigger: 'blur' },
                    { min:1, max: 20, message: '长度在1到20', trigger: 'blur' }
                ],
                userName: [
                    {required: true, message: '请输入姓名', trigger: 'blur' },
                    {validator: userName, trigger: 'blur' },
                    { min:1, max: 20, message: '长度在1到20', trigger: 'blur' }
                ],
                phone: [
                    {required: true, message: '请输入手机号', trigger: 'blur' },
                    {validator: phone, trigger: 'blur' },
                ],
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator: isEmail, trigger: 'blur' },
                ],
                roleId: [
                    {validator: roleId, trigger: 'blur' },
                ]
            }
        }
    },
    computed: {
    },
    created() {
        this.getApplyList();
    },
    mounted() {
    },
    methods: {
        //获取列表
        getApplyList() {
            ajax({
                url: 'uacUser/selChannel',
                optionParams: this.params
            }).post()
                .then(res => {
                    if (res.code === 200) {
                        this.dataList = res.data;
                        this.total = res.total;
                        this.listLoading = false;
                    } else {
                         this.message('warning', response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //搜索提交
        submitTable () {
            this.params.pageSize = 10;
            this.params.pageIndex = 1;
            this.getApplyList(); // 搜索
        },
         //重置
        reset(formName) {
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        },
          //下一步
        next_step (formName) {
            console.log(this.form2)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.form = this.form2;
                    // this.isEdit = false;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //确认弹框
        open2() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //确认按钮
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                //取消
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
            this.params.pageSize = val;
            this.getApplyList(); //更新列表
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.params.pageIndex = val;
            this.getApplyList(); //更新列表
        },
        //删除
        Cancel(val,val1) {
           
        }
    },
    filters: {
    }
}
</script>
<style lang="less" scoped>
</style>


