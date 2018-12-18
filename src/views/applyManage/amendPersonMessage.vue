<template>
    <div class="app-container calendar-list-container ggg_user">
        <el-form label-position="right" :rules="rules" :model="form" ref="params" label-width="80px" style="width:400px;margin-left:20px;" @keyup.enter.native="submitForm('params')">
            <el-form-item label="登录名" prop="loginCode">
                <el-input v-model="form.loginCode" placeholder="请输入" readonly></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入" :readonly="isEdit"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input :maxlength="11" v-model="form.phone" placeholder="请输入" :readonly="isEdit"></el-input>
            </el-form-item>
            <el-form-item label="身证号码" prop="idcard">
                <el-input v-model="form.idcard" placeholder="请输入" :readonly="isEdit"></el-input>
            </el-form-item>
            <el-form-item label="修改密码" prop="password1">
                <el-input type="password" @focus="isEdit = true" @blur="isEdit = false" v-model="form.password1" placeholder="请输入" auto-complete="off"></el-input>
            </el-form-item>
            <div>
                <el-form-item label="确认密码" prop="password">
                    <el-input type="password" @focus="isEdit = true" @blur="isEdit = false" v-model="form.password" placeholder="请输入" auto-complete="off"></el-input>
                </el-form-item>
            </div>
            <div style="text-align:center;">
                <el-button type="primary" @click="submitForm('params')" :loading="loading">确 定</el-button>
                <el-button @click="go_login">返回登录页面</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
import ajax from '@utils/config';
import loginout from '@src/utils/loginout';
export default {
    data() {
        var equally = (rule, value, callback) => {
            if (value != this.form.password1) {
                callback(new Error('密码不一致'));
                return false;
            }
            callback();
        };
        return {
            loading: false, //防止二次操作
            isEdit: true,
            form: {
                loginCode: '', //登录名
                name: '', //真实姓名
                idcard: '', //身份证
                phone: '', //手机号
                password1: '',
                password: '', //密码
            },
            rules: {
                name: [{ required: true, message: '请输入', trigger: 'blur' }],
                idcard: [{ required: true, message: '请输入', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入', trigger: 'blur' }],
                password1: [{ required: true, message: '请输入', trigger: 'blur' }],
                password: [
                    { required: true, message: '请输入', trigger: 'blur' },
                    { validator: equally, trigger: 'blur' }
                ],
            }
        }
    },
    computed: {
    },
    created() {
        this.getUserInfo();
    },
    mounted() {
        this.$nextTick(() => {
            this.isEdit = false;
        })
    },
    methods: {
        //获取信息
        getUserInfo() {
            ajax({
                url: 'sysAdmin/getSysinfo',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        // console.log(response)
                        let data = response.data;
                        this.form.loginCode = data.loginCode;
                        this.form.name = data.name;
                        this.form.phone = data.phone;
                        this.form.idcard = data.idcard;
                    } else {
                        this.$message.warning(response.message);
                        this.loading = false; //二次提交按钮设置
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.loading = false; //二次提交按钮设置
                })
        },
        //提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true; //二次提交按钮设置
                    ajax({
                        url: 'sysAdmin/updateinfo',
                        optionParams: this.form
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message)
                                this.go_login();
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
        },
        go_login() {
            console.log('a')
            loginout();
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


