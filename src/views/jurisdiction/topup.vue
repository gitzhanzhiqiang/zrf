<template>
    <div class="app-container calendar-list-container ggg_user" v-loading="listLoading">
        <el-form label-position="right" :rules="rules" :model="form" ref="params" label-width="100px" style="width:400px;margin-left:20px;" @keyup.enter.native="submitForm('params')">
            <el-form-item label="账户余额" prop="loginCode">
                <el-input v-model="form.balance_Amount" placeholder="" readonly></el-input>
            </el-form-item>
            <el-form-item label="可打款金额" prop="name">
                <el-input v-model="form.valid_Amount" placeholder="" readonly></el-input>
            </el-form-item>
            <el-form-item label="充值金额" prop="p3_Amt">
                <el-input v-model="form.p3_Amt" placeholder="请输入充值金额"></el-input>
            </el-form-item>
            <div style="text-align:center;">
                <el-button type="primary" @click="submitForm('params')" :loading="loading">确 定</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
import ajax from '@utils/config';
import loginout from '@src/utils/loginout';
export default {
    data() {
       
        return {
            listLoading:true,
            loading: false, //防止二次操作
            form: {
                 balance_Amount:'',// 账户金额
                 p2_Order:'',//订单号
                 valid_Amount:'', //可打款金额
                p3_Amt: '', //
            },
           
            rules: {
                p3_Amt: [{ required: true, message: '请输入充值金额', trigger: 'blur' }],
            }
        }
    },
    computed: {
    },
    created() {
        this.getUserInfo();
    },
    mounted() {
    },
    methods: {
        //获取信息
        getUserInfo() {
            ajax({
                url: 'netSilver/select',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                         console.log(response)
                         this.listLoading = false
                        this.form.balance_Amount =  response.data.balance_Amount
                        this.form.valid_Amount =  response.data.valid_Amount
                    } else {
                        this.$message.warning(response.message);
                        this.loading = false; //二次提交按钮设置
                         this.listLoading = false
                    }
                     this.listLoading = false
                })
                .catch(error => {
                    console.log(error);
                    this.loading = false; //二次提交按钮设置
                     this.listLoading = false
                })
        },
        //提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true; //二次提交按钮设置
                    ajax({
                        url: 'netSilver/pay',
                        optionParams: this.form
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                console.log(response)                        
                                window.open("http://www.zhongrenfu.cn/ybNetSilver/index.html?urls="+response.data)
                             //  window.open(""+response.data+"")
                               this.loading = false;
                               this.form.p3_Amt = ''
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


