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
            <el-form-item label="逾期时间">
                <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="tTimeChange"></el-date-picker>
            </el-form-item>

            <div v-show="false">
                <el-form-item label="开始时间" prop="dateFrom">
                    <el-input v-model="params.dateFrom" placeholder="开始"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="dateTo">
                    <el-input v-model="params.dateTo" placeholder="结束"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="借款人" prop="userName">
                <el-input v-model="params.userName" placeholder="请输入借款人"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
                <el-input v-model="params.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>

            <el-form-item label="所属门店" prop="shopId">
                <el-select v-model="params.shopId" placeholder="请选择" @change="shopChange">
                    <el-option v-for="item in shop" :key="item.shopId" :label="item.shopName" :value="item.shopId + ''"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="业务员" prop="adminId">
                <el-select v-model="params.adminId" placeholder="请选择" :disabled="!params.shopId">
                    <el-option v-for="item in admin" :key="item.adminId" :label="item.adminName" :value="item.adminId + ''"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="区域" prop="areaId">
                <el-select v-model="params.areaId" placeholder="请选择区域">
                    <el-option v-for="item in area" :key="item.id" :label="item.name" :value="item.id + ''">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="催收结果" prop="collResultId">
                <el-select v-model="params.collResultId" placeholder="请选择催收结果">
                    <el-option v-for="item in storage.collectResults" :key="item.id" :label="item.label" :value="item.id + ''">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('isseach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <!--<div class="filter-container" style="overflow:hidden;">
            <el-button style="float:right;" type="primary" class="iconfont icon-xiazai1" @click="download()"> 下载</el-button>
        </div>-->
        <div class="filter-container">
            <!--<div class="tableheader">逾期列表</div>-->

            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="序号" width="100">
                    <template scope="scope">
                        <span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单编号" width="180">
                    <template scope="scope">
                        {{scope.row.orderNum}}
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="逾期状态" width="180">
                    <template scope="scope">
                        <span v-if ='8<=scope.row.overdueDays && scope.row.overdueDays<=40'>门店法催</span> 
                         <span v-if ='scope.row.overdueDays>40'>综合催收</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="借款人" width="80">
                    <template scope="scope">
                         <img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua">
                        {{scope.row.name}}
                        <img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号码" width="110">
                    <template scope="scope">
                        {{scope.row.phone}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="合同金额" width="90">
                    <template scope="scope">
                        {{scope.row.agreementAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="实际放款金额" width="110">
                    <template scope="scope">
                        {{scope.row.realPayAmout | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="借款期数" width="90">
                    <template scope="scope">
                        {{scope.row.loanTerm }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="已还期数" width="90">
                    <template scope="scope">
                        {{scope.row.repayNum }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="每期还款金额" width="110">
                    <template scope="scope">
                        {{scope.row.eachmoney | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="逾期本金金额" width="110">
                    <template scope="scope">
                        {{scope.row.overPrincipalMoney | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属门店" width="110">
                    <template scope="scope">
                        {{scope.row.shopName }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="客户经理" width="100">
                    <template scope="scope">
                        {{scope.row.adminName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="逾期金额" width="90">
                    <template scope="scope">
                        {{scope.row.overDueAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="逾期天数" width="90">
                    <template scope="scope">
                        {{scope.row.overdueDays}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="罚息" width="90">
                    <template scope="scope">
                        {{scope.row.lateFee | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="催收结果" width="90">
                    <template scope="scope">
                        <span v-for="item in storage.collectResults" v-text="item.label" v-show="item.id == scope.row.collResult"></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="催收员（总部）" width="130">
                    <template scope="scope">
                        {{scope.row.zbClName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="催收员（门店）" width="130">
                    <template scope="scope">
                        {{scope.row.shopClName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="80">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="isOpen(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分配（总部）" fixed="right" width="100"  v-if='fenxian == 1'>
                    <template scope="scope">
                        <el-button v-show='fenxian' type="text" size="small" @click="isAlert(scope.row)">分配</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="催收员（门店）" fixed="right" width="100"  v-if='fenxian == 1'>
                    <template scope="scope">
                        <el-button v-show='fenxian' type="text" size="small" @click="isAlert(scope.row, true)">分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div v-if="total" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" class="autoAlert2">
            <el-form :rules="rules" :inline="true" :model="alertForm" ref="alertForm" class="demo-form-inline" label-position="center" label-width="0px">
                <el-form-item label="" prop="shopId">
                    <el-select v-model="alertForm.shopId" placeholder="请选择" @change="alertShopChange">
                        <el-option v-for="item in alertShop" :key="item.id" :label="item.label" :value="item.id + ''"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="adminId">
                    <el-select v-model="alertForm.adminId" placeholder="请选择">
                        <el-option v-for="item in alertAdmin" :key="item.id" :label="item.code" :value="item.id + ''"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="quxiao">取 消</el-button>
                <el-button type="primary" @click="submitAlert()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { formatTime } from '@src/filters';
import { downloadExecl } from '@common/downloadExecl';
import { storage } from '@constants/dataStorage';
export default {
    data() {
        return {
             fenxian:'',
            storage: storage, //存储的数据
            listLoading: true, //列表加载状态
            shop: [], //门店
            admin: [], //业务员
            params: { //搜索条件
                pageSize: 10,
                pageIndex: 1,
                collResultId:'',//催收结果
                userName: '', //用户名字
                shopId: '', //所属门店
                adminId: '', //业务员
                areaId: '', //区域
                phone: '',//手机号码
                dateFrom: '', //开始
                dateTo: '', //结束时间
            },
            time: null,
            total: 0, //总页数
            dataList: [],
            title: '', //弹框头
            rows: {}, //储存行的数据
            dialogVisible: false, //弹框显示
            imgxu: require('@res/img/aa.png'),//续贷图片
            imgxua: require('@res/img/aaa.png'),//续贷图片
            alertShop: [], //弹窗门店
            alertAdmin: [], //弹窗务员
            area: [], //区域
            alertForm: {
                shopId: '',
                adminId: ''
            },
            rules: {
                shopId: [{ required: true, message: '请选择', trigger: 'blur' }],
                adminId: [{ required: true, message: '请选择', trigger: 'change' }]
            }
        }
    },
    computed: {
    },
    created() {
        this.getTable();
        this.getShop_area(); //获取门店和区域
    },
    mounted() {
    },
    methods: {
        download() {
            downloadExecl({ url: 'export/exportOverDueListDc', input: this.params, method: 'get' })
        },
        getTable(isseach) {
            this.listLoading = true;
            if (isseach) {
                this.params.pageIndex = 1;
            }
            ajax({
                url: 'overDue/listOverDueFc',
                optionParams: this.params
            }).post()
                .then(response => {
                    console.log(response)
                    if (response.code === 200) {
                        this.dataList = response.data.list ? response.data.list : [];
                        this.total = response.total;
                        this.fenxian = response.data.status
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //获取门店和区域
        getShop_area() {
            ajax({
                url: 'PlatformData/UserPower',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        let data = response.data;
                        this.shop = data.shops ? data.shops : [];
                        this.area = data.areas ? data.areas : [];
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //门店所属业务员
        shopChange(value) {
            this.params.adminId = '';
            this.admin = [];
            this.shop.map((item) => {
                if (value == item.shopId) {
                    this.admin = item.children;
                }
            })
        },
         isOpen (row) {
            window.open('#/Overduelist/overduelists_kan?data=' + JSON.stringify(row))
        },
        //弹框出现
        isAlert(row, isShop) {
            this.alertAdmin = [];
            let url = '';
            let obj = {};
            if (isShop) {
                url = 'overDue/queryShopColPersonList';
                obj = {
                    shopId: row.shopId
                }
                this.title = '分配(门店)'
            } else {
                url = 'overDue/queryHeadColPersonList';
                this.title = '总部（分配）'
            }

            this.dialogVisible = true;
            this.rows = row;
            this.$nextTick(() => {
                this.$refs['alertForm'].resetFields(); //恢复表单及数据初始化状态
            })
            ajax({
                url: url,
                optionParams: obj
            }).post()
                .then(response => {
                    console.log(1)
                    if (response.code === 200) {
                        this.alertShop = response.data ? response.data : [];
                        console.log(response)
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })

        },
        //弹框门店变化
        alertShopChange(value) {
            this.alertShop.map((item) => {
                if (value == item.id) {
                    this.alertAdmin = item.children;
                }
            })
            this.alertForm.adminId = '';
        },
        //总部确定分配
        submitAlert() {
            this.$refs['alertForm'].validate((valid) => {
                if (valid) {
                    ajax({
                        url: 'overDue/colAllotPerson',
                        optionParams: {
                            adminId: this.alertForm.adminId,
                            orderNum: this.rows.orderNum,
                            colltype: this.title == '分配(门店)' ? 2 : 1
                        }
                    }).post()
                        .then(response => {
                            console.log(response)
                            if (response.code === 200) {
                                this.$message.success(response.message)
                                this.dialogVisible = false;
                                this.getTable();
                            } else {
                                this.$message.warning(response.message)
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                } else {
                    console.log('error submit!!');
                }
            })
        },
        tTimeChange(value) {
            formatTime(value, this, 'params', 'dateFrom', 'dateTo');
        },
        quxiao() {
            this.dialogVisible = false
             this.alertAdmin = [];
            this.$refs['alertForm'].resetFields();
        },
        //重置
        reset(formName) {
            this.time = '';
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
.isRote {
    transform: rotate(90deg);
}

.tablelayer {
    // padding:20px 0!important;
}
</style>