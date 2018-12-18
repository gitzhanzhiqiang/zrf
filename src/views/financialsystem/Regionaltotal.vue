<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <el-form :inline="true" :model="params" ref="params" class="demo-form-inline">
            <el-form-item label="当前页:" prop="pageIndex" v-show="false">
                <el-input v-model="params.pageIndex"></el-input>
            </el-form-item>
            <el-form-item label="行数:" prop="pageSize" v-show="false">
                <el-input v-model="params.pageSize"></el-input>
            </el-form-item>
            <el-form-item label="区域" prop="areaId">
                <el-select v-model="params.areaId" placeholder="请选择区域">
                    <el-option v-for="item in area" :key="item.id" :label="item.name" :value="item.id + ''">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期">
                <el-date-picker v-model="params.month" type="month" placeholder="选择月" ></el-date-picker>
            </el-form-item>
             <el-form-item label="状态" prop="status">
                <el-select v-model="params.status" placeholder="请选择">
                    <el-option key="1" label="在职" value="1"></el-option>
                    <el-option key="-1" label="离职" value="-1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="getTable('isSeach')">查询</el-button>
                <el-button icon="setting" @click="reset('params')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="filter-container">
            <!--<div class="tableheader">放款统计</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column align="center" label="区域">
                    <template scope="scope">
                        {{scope.row.areaName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名">
                    <template scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="基本工资">
                    <template scope="scope">
                        {{scope.row.money | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户id">
                    <template scope="scope">
                        {{scope.row.id}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="人均达标津">
                    <template scope="scope">
                        {{scope.row.avgAllowance | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="业绩提成比例">
                    <template scope="scope">
                        {{scope.row.percentRate | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="滚动7+逾期系数">
                    <template scope="scope">
                        {{scope.row.sevenOverAlRate | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="区域业绩提成">
                    <template scope="scope">
                        {{scope.row.areaAllowance | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总工资">
                    <template scope="scope">
                        {{scope.row.totalSalary | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="营业部总业绩">
                    <template scope="scope">
                        {{scope.row.agreementAmount | isNumber}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template scope="scope">
                        {{scope.row.workStatus}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { formatTime, parseTime} from '@src/filters';
import { Common } from '@common/common';
export default {
    data() {
        return {
            listLoading: true, //列表加载状态
            params: { //搜索条件
                areaId: '', //区域
                status:'',
                month: new Date(),
            },
            area: [], //区域
            dataList: []
        }
    },
    computed: {
    },
    created() {
        // this.yue()
        this.getShop_area(); //获取门店和区域
    },
    mounted() {
        this.getTable();
    },
    methods: {
        getTable(isSeach) {
            this.listLoading = true;
            this.params.month = parseTime(this.params.month, '{y}-{m}');
            ajax({
                url: 'financeSalarySystem/areaManagerSalary',
                optionParams: this.params
            }).post()
                .then(response => {
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
        //获取门店和区域
        getShop_area() {
            ajax({
                url: 'PlatformData/UserPower',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response.data)
                        let data = response.data;
                        this.area = data.areas ? data.areas : [];
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        yue() {
            let date = new Date;
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            month = (month < 10 ? "0" + month : month);
            this.params.month = year + '-' + month;
        },
        //重置
        reset(formName) {
            this.yue()
            this.$refs[formName].resetFields(); //恢复表单及数据初始化状态
        }
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

</style>


