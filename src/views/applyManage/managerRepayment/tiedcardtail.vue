<template>
    <div class="app-container calendar-list-container ggg_user">
        <div class="filter-container">
            <el-form :rules="rules" ref="alertFrom" label-width="80px" :model="form" style="width:400px;">
                <el-form-item prop="shop_id" label="门店" v-if="isEdit">
                    <el-select v-model="form.shop_id" placeholder="请选择">
                        <el-option :label="item.name" :value="item.id + ''" v-for="item in shop" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <div :class="{'noborder': !isEdit}">
                    <el-form-item label="门店" v-if="!isEdit">
                        <span v-for="item in shop" v-text="item.name" v-show="form.shop_id == item.id"></span>
                    </el-form-item>
                    <el-form-item prop="username" label="姓名">
                        <el-input v-model="form.username" placeholder="请输入" :readonly="!isEdit"></el-input>
                    </el-form-item>
                    <el-form-item prop="idcardno" label="身份证">
                        <el-input v-model="form.idcardno" placeholder="请输入" :readonly="!isEdit"></el-input>
                    </el-form-item>
                    <el-form-item prop="cardno" label="银行卡号">
                        <el-input v-model="form.cardno" placeholder="请输入" :readonly="!isEdit"></el-input>
                    </el-form-item>
                    <el-form-item label-width="10px">
                        <span>支持{{bankmsg}}—(有效储蓄卡)</span>
                    </el-form-item>
                    <el-form-item prop="phone" label="手机号">
                        <el-input v-model="form.phone" :maxlength="11" placeholder="请输入" :readonly="!isEdit"></el-input>
                    </el-form-item>
                </div>
                <el-form-item prop="validatecode" label="验证码">
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-input v-model="form.validatecode" placeholder="请输入"></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" @click.native.prevent="submitForm( 'alertFrom', true)" v-if="isEdit" :loading="loading">获取验证码</el-button>
                            <el-button type="primary" v-else>{{number}}s</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label-width="0px" style="margin-left:100px;">
                    <el-button type="primary" @click="submitForm('alertFrom')" :loading="loading">提交</el-button>
                    <el-button @click="$router.go(-1)">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { validate } from '@src/utils/validation';
import { Common } from '@common/common';
export default {
    data() {
        var phone = (rule, value, callback) => {
            if (!validate.validatPhone(value)) {
                callback(new Error('手机号号码格式不正确'));
                return false;
            }
            callback();
        };
        var validIdcard = (rule, value, callback) => {
            if (!validate.idCard(value)) {
                callback(new Error('身份证号格式有误'));
                return false;
            }
            callback();
        }
        return {
            shop: [], //门店
            bankmsg: '',
            form: { //弹框表格数据
                shop_id: '',//门店id,
                username: '',
                idcardno: '',
                cardno: '',
                phone: '',
                validatecode: '',
                requestno: ''

            },
            number: 300,
            isEdit: true,
            timeName: '',
            loading: false, //验证码
            rules: {
                shop_id: [{ required: true, message: '请选择', trigger: 'change' }],
                username: [{ required: true, message: '请输入', trigger: 'change' }],
                idcardno: [{ required: true, message: '请输入', trigger: 'change' }],
                cardno: [{ required: true, message: '请输入', trigger: 'change' }],
                phone: [{ required: true, message: '请输入', trigger: 'change' },
                { validator: phone, trigger: 'change' }],
            } //验证
        }
    },
    computed: {
    },
    created() {
        this.getShop(); // 获取门店
    },
    mounted() {
    },
    methods: {
        //获取门店
        getShop() {
            ajax({
                url: 'shopownercard/getshoplist',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.shop = response.data.shoplist ? response.data.shoplist : [];
                        this.bankmsg = response.data.bankmsg;
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        submitForm(formName, isgetCode) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!isgetCode && this.isEdit) {
                        this.$message.warning('请获取验证码');
                        return false;
                    }
                    if (!isgetCode && this.form.validatecode == '') {
                        this.$message.warning('验证码不能为空');
                        return false;
                    }
                    this.loading = true;
                    ajax({
                        url: isgetCode ? 'shopownercard/getcode' : 'shopownercard/ybconfirm',
                        optionParams: this.form
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                if (isgetCode) {
                                    this.form = response.data ? response.data : [];
                                    this.isEdit = false;
                                    this.timeName = setInterval(() => {
                                        if (this.number == 1) {
                                            clearInterval(this.timeName);
                                            this.isEdit = true;
                                        }
                                        this.number--
                                    }, 1000)
                                } else {
                                    this.$message.warning(response.message);
                                    this.$router.go(-1);
                                }
                            } else {
                                this.$message.warning(response.message)
                            }
                            this.loading = false;
                        })
                        .catch(error => {
                            console.log(error)
                            this.loading = false;
                        })
                } else {
                    console.log('error submit!!');
                    this.loading = false;
                    return false;
                }
            });
        }
    },
    filters: {
    }
}
</script>
<style lang="less" scoped>
.filter-container {
    margin-left: 30px;
}
</style>


