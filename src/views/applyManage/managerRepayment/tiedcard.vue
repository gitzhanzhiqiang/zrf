<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 列表 -->
        <el-button type="primary" @click="$router.push('tiedcardtail')">新增</el-button>
        <div class="filter-container">
            <!--<div class="tableheader">店长银行卡</div>-->
            <div class="tablelayer">
                <div class="tablelayer"><!--v-loading="listLoading"--> 
                    <el-table :data="dataList"  border fit highlight-current-row style="width: 100%">

                        <el-table-column align="center" label="序号" width="100">
                            <template scope="scope">
                                <span>{{parseInt(scope.$index) + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="开户人姓名">
                            <template scope="scope">
                                <img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua">
                                {{scope.row.id_card_name}}
                                 <img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="卡号">
                            <template scope="scope">
                                {{scope.row.bank_card}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="所属银行">
                            <template scope="scope">
                                {{scope.row.bank_name }}
                            </template>
                        </el-table-column>
                       
                        <el-table-column align="center" label="门店">
                            <template scope="scope">
                                {{scope.row.shopname }}
                            </template>
                        </el-table-column>
                       
                      <el-table-column align="center" fixed="right" label="操作" width="70">
                        <template scope="scope">
                            <el-button type="text" size="small" @click="edit(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <!--弹框-->
        <el-dialog :visible.sync="editAlert" width="30%" class="autoAlert">
            <p style="font-size: 20px;font-weight: 800;">是否删除该银行卡</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="Modify" :loading="loading">是</el-button>
                <el-button @click="editAlert= false">否</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import ajax from '@utils/config';
    import { formatTime } from '@src/filters';
import { storage } from '@constants/dataStorage';
    export default {
        data() {
            return {
                 loading: false, //防止二次操作
                editAlert: false, //弹框出现
                listLoading: true, //列表加载状态
                dataList: [],
                imgxu :require('@res/img/aa.png'),//续贷图片
                imgxua :require('@res/img/aaa.png'),//续贷图片
                xiuid:'',
            }
        },
        computed: {},
        created() {
            this.getApplyList();
        },
        mounted() {
        },
        methods: {
           
            //获取列表
            getApplyList() {
                ajax({
                    url: 'shopownercard/list',
                    optionParams: {}
                }).post()
                    .then(res => {
                    	console.log(res)
                        if (res.code === 200) {
                            this.dataList = res.data;
                            //this.total = res.total;
                            this.listLoading = false;
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            //弹框
            edit(row) {
                console.log(row)
            this.editAlert = true;
             this.xiuid = row.id;
            this.loading = false; //二次操作
             },
              //弹框提交
        Modify() {
            ajax({
                url: 'shopownercard/delbank',
                optionParams: {
                    id: this.xiuid
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response)
                        this.editAlert = false;
                        this.getApplyList();
                        this.$message.success(response.message)
                    } else {
                        this.$message.warning(response.message);
                        this.editAlert = false;
                        this.loading = false; //二次操作
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.loading = false; //二次操作
                })
        },
           
        },
     
    }
</script>
<style lang="less" scoped>
.ggg_user{
    .autoAlert{
        .el-dialog.el-dialog--small{
            width: 20%;
        }

    }
}  


</style>





