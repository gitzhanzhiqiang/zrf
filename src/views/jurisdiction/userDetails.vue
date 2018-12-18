<template>
    <div class="app-container calendar-list-container ggg_user">
        <div class="filter-container">
                <el-form ref="alertFrom" label-position="center"  label-width="0px" :model="editData" class="noborder">
                        <table style="" class="table" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>用户组名称</td>
                                <td>
                                    <el-form-item>
                                        <span  class="el-input" v-text="editData.name"></span>
                                    </el-form-item>
                                </td>
                                <td>备注</td>
                                <td>
                                    <el-form-item>
                                        <el-input v-model="editData.remark" readonly></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>职位</td>
                                <td>
                                    <el-form-item>
                                        <span class="el-input" v-text="data.roleName"></span>
                                    </el-form-item>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                
                </el-form>
                <el-row :gutter="10" style="padding:10px 0px;">
                    <el-col :span="10">
                        <div class="grid-content">
                            <div style="padding:10px 0;">所属门店</div>
                            <el-tree :data="treeData2" show-checkbox node-key="id" default-expand-all ref="shopTree"></el-tree>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <div class="grid-content">
                            <div style="padding:10px 0;">可用时间</div>
                            <el-tree :data="data3" show-checkbox node-key="id"  ref="timeTree"></el-tree>
                        </div>
                    </el-col>
               </el-row>
               <div style="text-align:center;padding:30px 0;">
                   <el-button  @click="$router.go(-1)">取消</el-button>
               </div>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
export default {
    data() {
        return {
            data: {}, //列表传的数据
            positionData: [], //职位
            editData: {},//弹框表格数据
            treeData2: [],//树形主结构(弹框分店用)
            data3: [//弹框树形数据
                {
                    id: 2,
                    label: '星期一',
                    disabled: true
                },
                {
                    id:3,
                    label: '星期二',
                    disabled: true
                },
                {
                    id: 4,
                    label: '星期三',
                    disabled: true
                },
                {
                    id: 5,
                    label: '星期四',
                    disabled: true
                },
                {
                    id: 6,
                    label: '星期期五',
                    disabled: true
                },
                {
                    id: 7,
                    label: '星期期六',
                    disabled: true
                },
                {
                    id: 1,
                    label: '星期日',
                    disabled: true
                }
            ]
        }
    },
    computed: {
    },
    created() {
        this.data = this.$route.query.data ? JSON.parse(this.$route.query.data) : '';
    },
    mounted() {
        this.getCityList(); //获取城市列表
        this.getPosition(); //获取职位
        this.getDetail();
    },
    methods: {
         //获取城市列表
        getCityList() {
            ajax({
                url: '/province/listProvinceShop',
                optionParams: {}
            }).post()
            .then(response => {
                if (response.code === 200) {
                    this.treeData2 = response.data ? response.data : [];
                    this.treeData2 = this.treeData2.slice(1, this.treeData2.length);
                    this.treeData2.map((value) => {
                        console.log(value)
                        value.disabled = true;
                        value.id = 'a' + value.id;
                        if (value.children && value.children.length > 0) {
                            value.children.map((item) => {
                                item.disabled = true;
                            })
                        }
                    })
                } else {
                    this.$message.warning(response.message)
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        // 获取职位
        getPosition () {
            ajax({
                url: 'choicesData/queryByKey',
                optionParams: {
                    key: 'position'
                }
            }).post()
            .then(response => {
                console.log(response)
                if (response.code === 200) {
                   this.positionData = response.data ? response.data : [];
                } else {
                    this.$message.warning(response.message)
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        getDetail () {
             //获取详情
             console.log(this.data)
            let id = '';
            if (this.data.isUser) {
                id = this.data.groupId;
            } else {
                id = this.data.id;
            }
            ajax({
                url: 'sysGroup/getInfoById/' + id,
                optionParams: {}
            }).post()
            .then(response => {
                if (response.code === 200) {
                    this.editData = response.data;
                    let array = this.editData.timecontroller  ? this.editData.timecontroller.split(',') : [];
                    this.$refs.shopTree.setCheckedKeys(this.editData.shopIds);
                    this.$refs.timeTree.setCheckedKeys(array);
                } else {
                    this.$message.warning(response.message)
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
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
    padding:20px 0!important;
}
</style>


