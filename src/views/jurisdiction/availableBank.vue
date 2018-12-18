<template>
    <div class="app-container calendar-list-container ggg_user">
        <!-- 搜索条件 -->
        <div class="filter-container">
            <!--<div class="tableheader">还款统计</div>-->
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
<el-table-column align="center" label="银行">
    <template scope="scope">
        {{scope.row.bankname}}
    </template>
</el-table-column>
<el-table-column align="center" label="卡类型">
    <template scope="scope">
        储蓄卡
    </template>
</el-table-column>
<el-table-column align="center" label="是否有效">
    <template scope="scope">
        有效
    </template>
</el-table-column>
<el-table-column align="center" label="状态">
    <template scope="scope">
        <span v-if='scope.row.status == 1'>启用</span>
        <span v-if='scope.row.status == 0'>禁用</span>
    </template>
</el-table-column>
<el-table-column align="center" label="操作">
    <template scope="scope">
        <el-button type="text" @click="open2(scope.row.status,scope.row.bankcode)" v-if="scope.row.status == 1">禁用</el-button>
        <el-button type="text" @click="open2(scope.row.status,scope.row.bankcode)" v-else>启用</el-button>
    </template>
</el-table-column>
</el-table>
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
                dataList: [],
                zhuang: '',
                res: ''
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
            getTable(isseach) {
                this.listLoading = true;
                ajax({
                    url: 'bankMaintain/getlist',
                    optionParams: {}
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
            open2(data, date) {
                if (data == 1) {
                    this.zhuang = '禁用'
                    this.res = 0
                } else if (data == 0) {
                    this.zhuang = '启用'
                    this.res = 1
                }
                console.log(this.res)
                console.log(date)
                this.$confirm('是否（' + this.zhuang + '）?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    ajax({
                        url: 'bankMaintain/update',
                        optionParams: {
                            status: this.res,
                            bankcode: date
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.getTable();
                                this.$message.warning(response.message)
                            } else {
                                this.listLoading = false;
                                this.$message.warning(response.message)
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }).catch(() => {
                });
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