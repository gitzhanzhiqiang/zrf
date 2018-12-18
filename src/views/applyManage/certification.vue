<template>


    <div class="app-container calendar-list-container ggg_user">
         <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getTable('isseach')">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="params.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="params.pageSize"></el-input>
            </el-form-item>
            
           
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <!--<div class="tableheader">门店管理</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="100">
                    <template scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名">
                    <template scope="scope">
                        <img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua">
                        {{scope.row.name}}
                         <img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="手机号">
                    <template scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="注册时间">
                    <template scope="scope">
                        {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                    </template>
                </el-table-column>               
                <el-table-column align="center" label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="edit(scope.row)" v-if='scope.row.inviteRegType != 1'>未认证</el-button>
                        <span  v-else>认证成功</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

       <!--弹框编辑-->
        <el-dialog title="编辑" :visible.sync="editAlert" width="30%" class="autoAlert">
            <!--编辑-->
           <p>是否把【IOS】的认证状态，由【未认证】修改为【已认证】的状态</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEdit()" :loading="loading">确 定</el-button>
                <el-button @click="editAlert= false">取 消</el-button>
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
            dataList: [], //表格数据
            imgxu :require('@res/img/aa.png'),//续贷图片
            imgxua :require('@res/img/aaa.png'),//续贷图片
            addAlert: false, //弹框出现
            editAlert: false,//编辑弹框出现
            disabled:true,
             params: { //搜索条件
                pageSize: 10,
                pageIndex: 1,
                phone: '', //用户名字
               
            },
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
        // 获取表格
        getTable(isSeach) {
            if (isSeach) {
                this.params.pageIndex = 1;
            }
            this.listLoading = true;
            ajax({
                url: 'authen/selectUnAuthen',
                optionParams: this.params
            }).post()
                .then(response => {
                    console.log(response)
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
        //认证
        submitEdit(){
            console.log(this.dataList[0].phone)
             ajax({
                url: 'authen/updateAuthenStatus',
                optionParams: {
                     id:this.dataList[0].id,
                     phone:this.dataList[0].phone
                }
            }).post()
                .then(response => {
                    console.log(response)
                    if (response.code === 200) {
                        this.$message.success(response.message)                       
                        this.editAlert = false;
                        this.disabled=true  
                         this.getTable();                                         
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                })
        },
     edit(row) {
            this.editAlert = true;
            this.loading = false; //二次提交按钮设置           
     },

        
      //重置
        reset(formName) {
            this.time = '';
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
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


