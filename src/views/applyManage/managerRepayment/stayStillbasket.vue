<template>
    <div class="app-container calendar-list-container ggg_user">
        <div class="filter-container">
            <!--<div class="tableheader">放款统计</div>-->
            <el-button  @click="$router.go(-1)" style="margin-bottom: 20px">返回</el-button>
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%" tooltip-effect="dark" @selection-change="handleSelectionChange">

<el-table-column type="selection" width="60">

</el-table-column>

<el-table-column align="center" label="全选">
    <template scope="scope">
        <el-row>
            <el-col :span="24"><span class="spana">借款人：</span><span class="spanb">{{scope.row.loanname}}</span></el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <span  class="spana">还款方式：</span>
                <span class="spanb" v-if='scope.row.type==30'>正常还款</span>
                <span class="spanb" v-if='scope.row.type==31'>一般金额减免</span>
                <span class="spanb" v-if='scope.row.type==32'>特殊金额减免</span>
                <span class="spanb" v-if='scope.row.type==40'>提前结清</span>
                <span class="spanb" v-if='scope.row.type==42'>非正常结清</span>
            </el-col>
        </el-row>
    </template>
</el-table-column>

<el-table-column align="center" label="">
    <template scope="scope">
        <el-row :gutter="24">
            <el-col :span="24">
                <span class="spana">还款方式：</span>
                <span class="spanb" v-if='scope.row.repaysource==1'>店长银行卡</span>
                <span class="spanb" v-if='scope.row.repaysource==2'>用户银行卡</span></el-col>

        </el-row>
        <el-row :gutter="24">
            <el-col :span="24">
                 <span class="spana">还款期数：</span><span class="spanb">{{scope.row.periodnum}}</span></el-col>

        </el-row>
    </template>
</el-table-column>

<el-table-column align="center" label="">
    <template scope="scope">
        <el-row :gutter="24">
            <el-col :span="24">选择卡：{{scope.row.bankcardno}}</el-col>

        </el-row>
        <el-row :gutter="24">
            <el-col :span="24">还款期数位置：{{scope.row.repaystartperiod}}-{{scope.row.repayendperiod}}</el-col>

        </el-row>
    </template>
</el-table-column>

<el-table-column align="center" label="">
    <template scope="scope">
        <el-row :gutter="24">
            <el-col :span="24"> 
                 <span class="spana">开户人：</span><span class="spanb">{{scope.row.bankusername}}</span>
               </el-col>

        </el-row>
        <el-row :gutter="24">
            <el-col :span="24" v-if='scope.row.type!=30'>
                 <span class="spana">建议还款金额：</span><span class="spanb">{{scope.row.suggestrepayamount/100}}</span>
                </el-col>

        </el-row>
    </template>
</el-table-column>
<el-table-column align="center" label="">
    <template scope="scope">
        <el-row :gutter="24">
            <el-col :span="24">
                <span class="spana">所属银行：</span><span class="spanb">{{scope.row.bankname}}</span>
               </el-col>

        </el-row>
        <el-row :gutter="24">
            <el-col :span="24" v-if='scope.row.type!=30'>
                 <span class="spana">罚息：</span><span class="spanb">{{scope.row.duelatefeeamount/100}}</span>
            </el-col>

        </el-row>
    </template>
</el-table-column>
<el-table-column align="center" label="">
    <template scope="scope">
        <el-row :gutter="24">
            <el-col :span="24"></el-col>

        </el-row>
        <el-row :gutter="24">
            <el-col :span="24" v-if='scope.row.type!=40'>实际还款金额：{{scope.row.suggestrepayamount/100}}</el-col>
             <el-col :span="24" v-else>实际还款金额：{{scope.row.suggestrepayamount/100}}</el-col>
        </el-row>
    </template>
</el-table-column>
<el-table-column align="center" label="操作">
    <template scope="scope">
        <el-button type="text" size="small" @click="deletes(scope.row)">删除</el-button>
    </template>
</el-table-column>
</el-table>


</div>
  <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <div style="margin-top: 20px;float: right;">
            <el-button @click="">扣款金额 ：{{mumbeer}}元</el-button>
            <el-button @click="deductions" class="el-button el-button--primary" :loading="loading">确定扣款</el-button>
        </div>
</div>

</template>
<script>
    import ajax from '@utils/config';
    import { formatTime } from '@src/filters';
    import { Common } from '@common/common';
    export default {
        data() {
            return {
                listLoading: true, //列表加载状态
                 loading: false, //防止二次操作
                params: { //搜索条件
                    pageSize: 10,
                    pageIndex: 1,
                },
                multipleSelection: [],
                  sum:[],           
                total: 0, //总页数
                dataList:[],
                mumbeer:0,
            }
        },
        computed: {
        },
        created() {
        },
        mounted() {
            this.getTable();
        },
        methods: {
            getTable() {
                this.listLoading = true;
                ajax({
                    url: 'shopOwnerRepay/shopownercar',
                    optionParams: this.params
                }).post()
                    .then(response => {
                        if (response.code === 200) {
                            this.dataList = response.data ? response.data : [];
                             this.total = response.total;
                        } else {
                            this.$message.warning(response.message)
                        }
                        this.listLoading = false;
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            handleSelectionChange(val) {
                let sum = []
                let num = []
                val.map((item) => {
                  sum.push(item.id)
                  console.log(item)
                  
                    num.push(item.suggestrepayamount/100)
                  
                console.log(num)
                })
                this.sum = sum
                this.number(num)
                this.multipleSelection = val;
            },
            //相加
            number(arr){
                console.log(arr)
                 var sum = 0;
                    for(var i=0;i<arr.length;i++){
                        sum += arr[i];
                    }
                  console.log(sum)
                  this.mumbeer = sum.toFixed(2)
                  // this.mumbeer = sum
            },
            //扣款
            deductions(){
            console.log(this.sum)
             this.loading = true
                this.$confirm('确定扣款, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                      ajax({
                            url: 'shopOwnerRepay/subcarbyid',
                            optionParams:{
                                ids:this.sum
                            }
                        }).post()
                            .then(response => {
                                if (response.code === 200) {
                                     this.$message.success(response.message)
                                      this.loading = false
                                      this.getTable();
                                } else {
                                    this.$message.warning(response.message)
                                     this.loading = false
                                }
                                this.listLoading = false;
                            })
                            .catch(error => {
                                console.log(error)
                                 this.loading = false
                            })
                    }).catch(() => {
                        this.loading = false
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                    });
            },
            deletes(row){
                console.log(row.id)
                this.$confirm('确定删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                         this.listLoading = true;
                             ajax({
                                url: 'shopOwnerRepay/delcarbyid',
                                optionParams:{
                                    id:row.id
                                }
                            }).post()
                                .then(response => {
                                    console.log(response)
                                    if (response.code === 200) {                           
                                    this.getTable();
                                    } else {                              
                                        this.$message.warning(response.message)
                                    }
                                    this.listLoading = false;
                                })
                                .catch(error => {
                                    console.log(error)
                                })

                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                    });
               
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
            isNumber(value) {
                if (value) {
                    return value;
                } else {
                    return 0;
                }

            }
        }
    }
</script>
<style lang="less" scoped>
.ggg_user{
    .spana{
        line-height: 50px;
        display: inline-block;
        text-align: right;
        float: left;
    }
    .spanb{
         line-height: 50px;
        display: inline-block;
        text-align: left;
        float: left;
    }
}
</style>