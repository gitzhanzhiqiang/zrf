<template>
    <div class="app-container calendar-list-container">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline" @keyup.enter.native="getApplyList">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="params.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="借款人" prop="userName">
                <el-input type="text" v-model="params.userName" placeholder="请输入借款人"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input type="text" v-model="params.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" type="primary" icon="search" @click="getApplyList"
                           style="margin-left: 20px;">查询
                </el-button>
                <el-button class="filter-item" @click="reset('params')" type="primary" icon="setting"
                           style="margin-left: 20px;">重置
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="filter-container">
            <!--<div class="tableheader">已还款订单</div>-->
            <div class="tablelayer">
                <!--订单编号	放款时间	借款人	申请产品	合同借款金额	实际放款金额	借款期数	已还期数	每期还款金额	业务员	门店	订单来源	订单状态	当期状态	操作-->
                <div class="tablelayer">
                    <el-table :data="dataList" v-loading="listLoading" @current-change="handleCurrentChange" border fit
                              highlight-current-row style="width: 100%">

                        <el-table-column align="center" label="序号" width="100">
                            <template scope="scope">
                                <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="订单编号" width="200">
                            <template scope="scope">
                                <span>{{scope.row.orderNum}}</span>
                            </template>
                        </el-table-column>
                       
                        <el-table-column align="center" label="借款人">
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
                        <el-table-column align="center" label="合同额度">
                            <template scope="scope">
                                {{scope.row.agreementAmount | formatMoney}}
                            </template>
                        </el-table-column>
                       
                        <el-table-column align="center" label="借款期数">
                            <template scope="scope">
                                {{scope.row.loanTerm }}
                            </template>
                        </el-table-column>
                       <el-table-column align="center" label="订单来源">
                            <template scope="scope">
                                {{scope.row.source|sourceFilter}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="还款方式">
                            <template scope="scope">
                                 <span v-show="item.id == scope.row.repayType" v-for="(item,index) in storage.ReimbursementChannels" v-text="item.label" :key="index"></span>
                            </template>
                        </el-table-column>
                       
                        <el-table-column align="center" label="门店">
                            <template scope="scope">
                                {{scope.row.shopName }}
                            </template>
                        </el-table-column>
                        
                        <el-table-column align="center" label="提交时间" width="180">
                            <template scope="scope">
                                {{scope.row.createTime |  parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                            </template>
                        </el-table-column>
                       
                       
                    </el-table>
                </div>
            </div>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange"
                           :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]"
                           :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import ajax from '@utils/config';
    import {parseTime,formatTime} from '@src/filters';
    import {validatPhone} from '@src/utils/validate';
    import {storage} from '@constants/dataStorage';
    export default {
        data() {
            var validatP = (rule, value, callback) => {
                if (!validatPhone(value))
                    callback(new Error('手机格式错误!'))
                callback();
            };
            return {
                listLoading: true, //列表加载状态
                params: {
                    pageSize: 10,
                    pageIndex: 1,
                    type: 2,//店长还款待审核
                    phone: null,
                    orderNum: null
                   
                },
                total: '',
                time: null,
               dataList:[],
                storage: storage, //数据存储
                imgxu :require('@res/img/aa.png'),//续贷图片
                 imgxua :require('@res/img/aaa.png'),//续贷图片
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
                    url: 'financeShopOwnerRepay/financeShopOwnerRepayList',
                    optionParams: this.params
                }).post()
                    .then(res => {
                    	console.log(res)
                      if (res.code === 200) {
                            this.dataList = res.data;
                           this.total = res.total
                            this.listLoading = false;
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            //鼠标悬浮当前行
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            // 改变每一页的条数
            handleSizeChange(val) {
                this.params.pageSize = val;
                this.getApplyList();
            },
            // 切换页码
            handleCurrentPageChange(val) {
                this.params.pageIndex = val;
                this.getApplyList();
            },
            //重置表单
            reset(formName) {
                this.time = '';
                this.$refs[formName].resetFields();
            }
        },
        filters: {
            // 10:请求中 11 放款执行中(锁住入队列) 12、放款中(待确认是否成功) 13、放款失败 14、放款成功', ,
            loan_statusFilter(code){//订单状态
                if(code == '10'){
                    return "请求中"
                }else if(code == '11'){
                    return "放款执行中"
                }else if(code == '12'){
                    return "放款中(待确认是否成功)"
                }else if(code == '13'){
                    return "放款失败"
                }else if(code == '14'){
                    return "放款成功"
                }
            }
        }
    }
</script>
<style lang="less" scoped>
</style>





