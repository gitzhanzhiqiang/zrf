<template>
    <div class="app-container calendar-list-container ggg_user">
        <el-button type="primary" @click="add()">新增</el-button>
        <el-button style="float:right; " type="primary" @click="addb()">清理缓存</el-button>
<div class="filter-container">
    <!--<div class="tableheader">门店管理</div>-->
    <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
<el-table-column align="center" label="序号" width="100">
    <template scope="scope">
        <span>{{scope.$index + 1}}</span>
    </template>
</el-table-column>
<el-table-column align="center" label="店名">
    <template scope="scope">
        {{scope.row.name}}
    </template>
</el-table-column>
<el-table-column align="center" label="创建时间">
    <template scope="scope">
        {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
    </template>
</el-table-column>
<el-table-column align="center" label="省份">
    <template scope="scope">
        {{scope.row.proName}}
    </template>
</el-table-column>
<el-table-column align="center" label="产品信息">
    <template scope="scope">
        <span style="padding: 10px;" v-for="item in scope.row.prodFee" v-text="item"></span>
</template>
</el-table-column>
<el-table-column align="center" label="区域">
    <template scope="scope">
        {{scope.row.areaName}}
    </template>
</el-table-column>
<el-table-column align="center" label="区域信审">
    <template scope="scope">
        {{scope.row.loginCode}}
    </template>
</el-table-column>
<el-table-column align="center" label="操作">
    <template scope="scope">
        <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
    </template>
</el-table-column>
</el-table>
</div>

<!--弹框添加-->
<el-dialog title="新增" :visible.sync="addAlert" width="30%" class="autoAlert">
    <!--<span v-text="text">这是一段信息</span>-->
    <!--新增-->
    <el-form :rules="rules" ref="alertFrom" label-position="center" :model="form" label-width="100px" style="width:450px;margin:0 auto;" @keyup.enter.native="submitAdd('alertFrom')">
<el-form-item label="店名" prop="name">
    <el-input v-model="form.name" placeholder="请输入店名" style="width:218"></el-input>
</el-form-item>
<el-form-item label="" label-width="0px" v-for="(item, index) in form.shopProdList" :key="index" v-if="false">
    <el-row :gutter="4">
        <el-col :span="9">
            <el-form-item label="产品" label-width="50px" :prop="'shopProdList[' + index + '].prodId'" :rules="[{required: true, message: '请选择产品', trigger: 'blur'}]">
                <el-select v-model="form.shopProdList[index].prodId" placeholder="请选择产品" @change="Changeselecte">
                    <el-option v-for="item in product" :key="item.id" :label="item.name" :value="item.id + ''"></el-option>
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="7">
            <el-form-item label="" label-width="0" :prop="'shopProdList[' + index + '].feeRate'" :rules="[{required: true, message: '请选择费率', trigger: 'blur'}]">
                <el-select v-model="form.shopProdList[index].feeRate" placeholder="请选择费率" @change="Changeselecte">
                    <el-option v-for="itm in item.freeArr" :key="itm" :label="itm" :value="itm"></el-option>
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <div>
                <el-button style="margin-left:10px;" type="primary" size="mini" class="el-icon-plus" @click="addProduct()" v-if="form.shopProdList.length != product.length"></el-button>
<el-button size="mini" class="el-icon-minus" type="primary" v-if="form.shopProdList.length > 1" @click="deleteProduct(index)"></el-button>
</div>
</el-col>
</el-row>
</el-form-item>
<el-form-item :label="item.name" label-width="100px" v-for="(item, index) in form.shopProdList" :key="index" :prop="'shopProdList[' + index + '].feeRate'"
    :rules="[{required: true, message: '请选择费率', trigger: 'change'}]">
    <el-select v-model="form.shopProdList[index].feeRate" placeholder="请选择费率" @change="Changeselecte">
        <el-option v-for="itm in item.freeArr" :key="itm" :label="itm" :value="itm"></el-option>
    </el-select>
</el-form-item>
<el-form-item label="省份" prop="provinceId">
    <el-select v-model="form.provinceId" placeholder="请选择省份">
        <el-option v-for="item in province" :key="item.value" :label="item.name" :value="item.value + ''">
        </el-option>
    </el-select>
</el-form-item>
<el-form-item label="区域" prop="areaId">
    <el-select v-model="form.areaId" placeholder="请选择区域">
        <el-option v-for="item in area" :key="item.value" :label="item.name" :value="item.value + ''">
        </el-option>
    </el-select>
</el-form-item>
<el-form-item label="区域信审" prop="credit_adminId">
    <el-select v-model="form.credit_adminId" placeholder="请选择区域">
          <el-option v-for="item in areacreditlist" :key="item.id" :label="item.login_code" :value="item.id + ''">
        </el-option>
    </el-select>
</el-form-item>
</el-form>
<span slot="footer" class="dialog-footer">
                <el-button @click="addAlert = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd('alertFrom')" :loading="loading">确 定</el-button>
            </span>
</el-dialog>

<!--弹框编辑-->
<el-dialog title="编辑" :visible.sync="editAlert" width="30%" class="autoAlert">
    <!--编辑-->
    <el-form :rules="rules" ref="alertFrom1" label-position="center" :model="form2" label-width="120px" style="width:450px;margin:0 auto;" @keyup.enter.native="submitEdit('alertFrom1')">
<el-form-item label="店名" prop="name">
    <el-input v-model="form2.name" placeholder="请输入店名" style="width:218"></el-input>
</el-form-item>
<el-form-item v-for="(item, index) in form2.shopProdList" :key="item.prodId" :label="item.name" :prop="'shopProdList[' + index + '].feeRate'"
    :rules="[{required: true, message: '请选择费率', trigger: 'change'}]">
    <el-select v-model="form2.shopProdList[index].feeRate" placeholder="请选择费率">
        <el-option v-for="itm in item.freeArr" :key="itm" :label="itm" :value="itm + ''"></el-option>
    </el-select>
</el-form-item>
<el-form-item label="省份" prop="provinceId">
    <el-select v-model="form2.provinceId" placeholder="请选择省份">
        <el-option v-for="item in province" :key="item.value" :label="item.name" :value="item.value + ''">
        </el-option>
    </el-select>
</el-form-item>
<el-form-item label="区域" prop="areaId">
    <el-select v-model="form2.areaId" placeholder="请选择区域">
        <el-option v-for="item in area" :key="item.value" :label="item.name" :value="item.value + ''">
        </el-option>
    </el-select>
</el-form-item>
<el-form-item label="区域信审" prop="credit_adminId">
    <el-select v-model="form2.credit_adminId" placeholder="请选择区域">
        <el-option v-for="item in areacreditlist" :key="item.id" :label="item.login_code" :value="item.id + ''">
        </el-option>
    </el-select>
</el-form-item>
</el-form>
<span slot="footer" class="dialog-footer">
                <el-button @click="editAlert= false">取 消</el-button>
                <el-button type="primary" @click="submitEdit('alertFrom1')" :loading="loading">确 定</el-button>
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
                addAlert: false, //弹框出现
                editAlert: false,//编辑弹框出现
                form: {//新增数据
                    name: '',
                    shopProdList: [
                        { prodId: '', feeRate: '', freeArr: [] }
                    ],
                    // shopProdList: [],
                    provinceId: '',
                    areaId: ''
                },
                form2: {//编辑数据
                    id: '',
                    name: '',
                    shopProdList: [], //{prodId: 3, feeRate: 0.004, name: '', freeArr: ''},{prodId: 2, feeRate: 0.004},{prodId: 1, feeRate: 0.004}
                    provinceId: '',
                    areaId: '',
                    credit_adminId:''
                },
                product: [], //产品
                province: [], //省份
                area: [], //区域
                areacreditlist:[],//区域信审
                rules: {
                    name: [
                        { required: true, message: '请输入店名', trigger: 'blur' }
                    ],
                    provinceId: [
                        { required: true, message: '请选择省份', trigger: 'change' }
                    ],
                    areaId: [
                        { required: true, message: '请选择区域', trigger: 'change' }
                    ]
                },

            }
        },
        computed: {
        },
        created() {
            this.getTable();
            this.getProduct();
            this.getAddress('province'); //获取省份和区域
        },
        mounted() {
        },
        methods: {
            // 获取表格
            getTable() {
                this.listLoading = true;
                ajax({
                    url: 'shop/listQuery',
                    optionParams: {}
                }).post()
                    .then(response => {
                        if (response.code === 200) {
                            this.dataList = response.data.poList ? response.data.poList : [];
                            this.areacreditlist = response.data.areacreditlist ? response.data.areacreditlist : [];
                            this.dataList.map((value) => {
                                value.prodFee = value.prodFee ? value.prodFee.split(',') : [];
                            })
                            console.log(this.areacreditlist)
                        } else {
                            this.$message.warning(response.message)
                        }
                        this.listLoading = false;
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            //获取产品
            getProduct() {
                ajax({
                    url: 'product/listQueryConFee',
                    optionParams: {}
                }).post()
                    .then(response => {
                        if (response.code === 200) {
                            let data = response.data ? response.data : [];
                            this.product = data;
                            let array = [];
                            data.map((value) => {
                                let obj = {
                                    prodId: value.id,
                                    feeRate: '',
                                    freeArr: value.freeArr,
                                    name: value.name
                                }
                                array.push(obj)
                            })
                            this.form.shopProdList = array;
                        } else {
                            this.$message.warning(response.message)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            //获取省份和区域
            getAddress(value) {
                ajax({
                    url: 'choicesData/queryByKey',
                    optionParams: {
                        key: value
                    }
                }).post()
                    .then(response => {
                        if (response.code === 200) {
                            console.log(response)
                            this[value] = response.data ? response.data : [];
                            if (value === 'province') {
                                this.getAddress('area');
                            }
                        } else {
                            this.$message.warning(response.message)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            //
            add() {
                this.addAlert = true;
                this.loading = false; //二次提交按钮设置
                this.$nextTick(() => {
                    this.$refs['alertFrom'].resetFields(); //恢复表单及数据初始化状态
                })
            },
            //请缓存
            addb() {
                this.$confirm('是否清除缓存', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajax({
                        url: 'choicesData/queryByKey',
                        optionParams: {
                            key: 'cleanCache'
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                console.log(response)
                                this.$message.success(response.message)
                                this.getAddress('province');
                                this.getTable();
                                this.getProduct();
                            } else {
                                this.$message.warning(response.message)
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消清除'
                    });
                });
            },
            // 产品数据变化
            Changeselecte(value) {
                let freeArr = [];
                this.product.map((item) => {
                    if (value == item.id) {
                        freeArr = item.freeArr;
                    }
                })
                this.form.shopProdList.map((item) => {
                    if (value == item.prodId) {
                        item.freeArr = freeArr
                    }
                })
            },
            //点击添加产品按钮
            addProduct() {
                this.form.shopProdList.push(
                    { prodId: '', feeRate: '', freeArr: [] }
                )
            },
            //点击删除按钮
            deleteProduct(index) {
                this.form.shopProdList.splice(index, 1);
            },
            // 新增提交
            submitAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let array = [];
                        this.form.shopProdList.map((value) => {
                            if (array.indexOf(value.prodId) == -1) {
                                array.push(value.prodId);
                            }
                        })
                        if (array.length != this.form.shopProdList.length) {
                            this.$message.warning('产品不能重复')
                            return false;
                        }
                        this.loading = true; //二次提交按钮设置
                        ajax({
                            url: 'shop/add',
                            optionParams: this.form
                        }).post()
                            .then(response => {
                                if (response.code === 200) {
                                    this.$message.success(response.message)
                                    this.addAlert = false;
                                    this.getTable(); //更新表格；
                                } else {
                                    this.$message.warning(response.message);
                                    this.loading = false; //二次提交按钮设置
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                this.loading = false; //二次提交按钮设置
                            })
                    } else {
                        console.log('error submit!!');
                    }

                })
            },
            edit(row) {
                this.editAlert = true;
                this.loading = false; //二次提交按钮设置
                this.$nextTick(() => {
                    this.$refs['alertFrom1'].resetFields(); //恢复表单及数据初始化状态
                })
                //获取详情
                ajax({
                    url: 'shop/getInfoById/' + row.id,
                    optionParams: {}
                }).post()
                    .then(response => {
                        if (response.code === 200) {
                            console.log(response)
                            console.log(this.form2.credit_adminId)
                            this.form2 = response.data;
                            this.form2.provinceId = this.form2.provinceId + '';
                            this.form2.areaId = this.form2.areaId + '';
                             this.form2.credit_adminId = this.form2.credit_adminId + '';
                            let shopProdList = response.data.shopProdList ? response.data.shopProdList : [];
                            this.product.map((item) => {
                                shopProdList.map((itm) => {
                                    itm.feeRate = itm.feeRate + '';
                                    if (itm.prodId == item.id) {
                                        itm.name = item.name;
                                        itm.freeArr = item.freeArr;
                                    }
                                })
                            })
                            this.form2.shopProdList = shopProdList;
                            console.log(shopProdList)
                        } else {
                            this.$message.warning(response.message);
                            return false;
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
                this.dialogVisible = true;
            },
            // 编辑提交
            submitEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true; //二次提交按钮设置
                        ajax({
                            url: 'shop/update',
                            optionParams: this.form2
                        }).post()
                            .then(response => {
                                if (response.code === 200) {
                                    this.$message.success(response.message)
                                    this.editAlert = false;
                                    this.getTable(); //更新表格；
                                } else {
                                    this.$message.warning(response.message);
                                    this.loading = false; //二次提交按钮设置
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                this.loading = false; //二次提交按钮设置
                            })
                    } else {
                        console.log('error submit!!');
                    }

                })
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
    padding: 20px 0!important;
}
</style>