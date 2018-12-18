<template>
    <div class="app-container calendar-list-container ggg_user">
         <!-- 搜索条件 -->
        <el-form :inline="true" :model="params"  ref="params"  class="demo-form-inline" @keyup.enter.native="getTable('isseach')">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input  v-model="params.pageIndex"></el-input>
            </el-form-item>
                <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input  v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="用户" prop="name">
                <el-input  v-model="params.name"  placeholder="用户"></el-input>
            </el-form-item>
             <el-form-item label="手机号" prop="phone">
                <el-input  v-model="params.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
                 <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                 <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
         <div class="filter-container">
            <!--<div class="tableheader">跳过认证状态</div>-->
            <el-table :data="dataList" v-loading="listLoading"  border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="100">
                    <template scope="scope">
                        <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名">
                    <template scope="scope">
                        {{scope.row.name}}
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
                <el-table-column align="center" label="IOS">
                    <template scope="scope">
                        <el-button  type="text" v-if='scope.row.inviteRegType==0' @click = 'certification(scope.row,"inviteRegType")'>未认证</el-button>
                        <span v-if='scope.row.inviteRegType==1'>已认证</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机运营商">
                    <template scope="scope">
                        <el-button  type="text" v-if='scope.row.carrierAuthStatus==0' @click = 'certification(scope.row,"carrierAuthStatus")'>未认证</el-button>
                        <span v-if='scope.row.carrierAuthStatus==1'>已认证</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="人脸识别">
                    <template scope="scope">
                        <el-button  type="text" v-if='scope.row.faceRegAuthStatus==0' @click = 'certification(scope.row,"faceRegAuthStatus")'>未认证</el-button>
                        <span v-if='scope.row.faceRegAuthStatus==1'>已认证</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="存管" >
                    <template scope="scope">
                        <el-button  type="text" v-if='scope.row.wyStatus==0' @click = 'certification(scope.row,"wyStatus")'>未认证</el-button>
                        <span v-if='scope.row.wyStatus==1'>已认证</span>
                        <span v-if='scope.row.wyStatus==2'>跳过存管</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!--弹框编辑-->
        <el-dialog title="认证" :visible.sync="editAlert" width="30%" class="autoAlert">
            <!--编辑-->
            <p>是否把【{{titi}}】的认证状态，由【未认证】修改为【已认证】的状态</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="xiugai()" :loading="loading">修改</el-button>
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
            params: { //搜索条件
                pageSize: 10, 
                pageIndex: 1, 
                name: '', //用户名字
                phone: ''//手机号码
            },
            row:'',//认证状态数据
            titi:'',//认证的东西
            total: 0, //总页数
           editAlert: false, //弹框出现
            dataList: [
                {name: 1}
            ],
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
        getTable (isseach) {
            this.listLoading = true;
            if (isseach) {
                this.params.pageIndex = 1;
            }
            ajax({
                url: 'authen/jumpAuthStatus',
                optionParams: this.params
            }).post()
            .then(response => {
                if (response.code === 200) {
                    this.dataList = response.data ? response.data : [];
                    this.total = response.total
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
        certification(row,str){
            this.titi = ''
            this.editAlert = true
            this.row = row
            if(str == 'inviteRegType'){
               this.titi = 'IOS'
            }
            if(str == 'carrierAuthStatus'){
               this.titi = '手机运营商'
            }
            if(str == 'faceRegAuthStatus'){
               this.titi = '人脸识别'
            }
            if(str == 'wyStatus'){
               this.titi = '存管'
            }
        },
        xiugai(){
            console.log(this.titi)
            this.loading = true
            let type = ''
             if(this.titi == 'IOS'){
               type = 'invite_reg_type'
            }
            if(this.titi == '手机运营商'){
                 type = 'carrier_auth_status'
            }
            if(this.titi == '人脸识别'){
                 type = 'face_reg_auth_status'
            }
            if(this.titi == '存管'){
                 type = 'wy_status'
            }
            ajax({
                url: 'authen/updAuthStatus',
                optionParams: {
                    orderUserId:this.row.orderUserId,
                    userid:this.row.id,
                    type:type,
                }
            }).post()
            .then(response => {
                if (response.code === 200) {
                   console.log(response)
                    this.loading = false; //二次操作
                   this.getTable();
                    this.editAlert = false
                     this.$message.success(response.message)
                } else {
                    this.loading = false; //二次操作
                     this.editAlert = false
                    this.$message.warning(response.message)
                }
                this.listLoading = false;
            })
            .catch(error => {
                 this.loading = false; //二次操作
                console.log(error)
            })
        },
         //重置
        reset(formName) {
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        },
        // 改变每一页的条数
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.params.pageIndex = 1;
            this.getTable(); //更新列表
        },
        // 切换页码
        handleCurrentPageChange(val) {
            this.params.pageIndex = val;
            this.getTable(); //更新列表
        },
    },
    filters: {
    }
}
</script>
<style lang="less" scoped>
.isRote{
    transform: rotate(90deg);
}
.tablelayer{
    // padding:20px 0!important;
}
</style>


