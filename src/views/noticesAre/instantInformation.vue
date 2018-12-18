<template>
    <div class="app-container calendar-list-container ggg_user">
        <el-form :rules="rules" :model="params" ref="params" @keyup.enter.native="submit('params')" label-width="80px" style="width:400px">
            <el-form-item label="在线人数" class="noborder">
                <el-row :gutter="10">
                    <el-col :span="13">
                        <el-input readonly :value="data.loginCount"></el-input>
                    </el-col>
                    <el-col :span="10">
                       <el-button @click="getData(true)" type="primary" :loading="loading1">刷新</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="在线人" v-if="data.polist">
                <el-checkbox-group v-model="params.adminId">
                    <el-checkbox :disabled="params.type == 1" :label="item.adminId" v-for="item in data.polist" :key='item.adminId'>{{item.loginCode}}-{{item.name}}({{item.count}})</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="通知类型">
                <el-select v-model="params.type" placeholder="请选择" @change="typeChange">
                    <el-option label="全部" value="1"></el-option>
                    <el-option label="部分" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通讯内容" prop="msg">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="params.msg">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('params')" :loading="loading">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import ajax from '@utils/config';
export default {
    data() {
        return {
            loading: false, //防止二次操作
            loading1: false,
            data: '',
            params: {
                adminId: [],
                type: '1',
                msg: ''
            },
            rules: {
                msg: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
            }
        }
    },
    computed: {
    },
    created() {
        this.getData();
    },
    mounted() {
    },
    methods: {
        getData(isClick) {
            if (isClick) {
                this.loading1 = true;
            }
            ajax({
                url: 'socketmsg/getinfo',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response)
                        this.data = response.data ? response.data : '';
                    } else {
                        this.$message.warning(response.message)
                    }
                     this.loading1 = false;
                })
                .catch(error => {
                    console.log(error);
                    this.loading1 = false;
                })
        },
        typeChange (value) {
            if (value == 1) {
                this.params.adminId = [];
            }
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    ajax({
                        url: 'socketmsg/notice',
                        optionParams: this.params
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                // this.$message.success(response.message)
                                // window.location.reload();
                                this.params.msg = '';
                            } else {
                                this.$message.warning(response.message)
                            }
                            this.loading = false;
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false;
                        })
                } else {
                    console.log('error submit!!');
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
.isRote {
    transform: rotate(90deg);
}

.tablelayer {
    // padding:20px 0!important;
}
</style>


