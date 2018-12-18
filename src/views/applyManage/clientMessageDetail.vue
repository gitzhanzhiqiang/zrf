<template>
    <div class="app-container calendar-list-container ggg_user">
        <el-form :rules="rules" ref="alertFrom" label-position="center" label-width="0px" :model="form" :class="{'noborder': !isEdit}">
            <!--核心-->
            <div class="filter-container">
                <div class="tableheader">核心数据</div>
                <div class="filter-container" style="overflow:hidden;" v-if="!isEdit">
                    <div style="float:right;">
                        <!--<el-button type="info" class="iconfont icon-xiazai1" @click="downloadjk" :disabled='AuditData.spStatus == 1 || AuditData.spStatus == 2 || AuditData.spStatus == 3 || AuditData.spStatus == 4'> 借款承诺书打印</el-button>-->
                        <el-button type="success" class="iconfont icon-xiazai1" @click="download"> 手写申请表打印</el-button>
                    </div>
                </div>
                <table style="margin-top:20px;" class="table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>姓名</td>
                        <td>
                            <el-form-item prop="name">
                                <el-input v-model="form.name" :placeholder="placeholder" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                        <td>身份证号</td>
                        <td>
                            <el-form-item prop="idCard">
                                <el-input v-model="form.idCard" :placeholder="placeholder" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                        <td>请输入副卡手机号</td>
                        <td>
                            <el-form-item prop="vicePhone">
                                <el-input :maxlength="11" v-model="form.vicePhone" :placeholder="placeholder" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>手机号</td>
                        <td>
                            <el-form-item prop="phone">
                                <el-input :maxlength="11" v-model="form.phone" :placeholder="placeholder" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                        <td>性别</td>
                        <td>
                            <el-form-item prop="sex">
                                <el-select v-model="form.sex" placeholder="请选择" v-if="isEdit">
                                    <el-option label="男" value="1"></el-option>
                                    <el-option label="女" value="2"></el-option>
                                </el-select>
                                <div v-else>
                                    <span class="el-input " v-show="form.sex == 1">男</span>
                                    <span class="el-input " v-show="form.sex == 2">女</span>
                                </div>
                            </el-form-item>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>所属银行</td>
                        <td>
                            <el-form-item prop="bankName">
                                <el-input v-model="form.bankName" :placeholder="placeholder" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                        <td>收款银行卡</td>
                        <td>
                            <el-form-item prop="bankCardNo">
                                <el-input v-model="form.bankCardNo" :placeholder="placeholder" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                        <td>详细支行</td>
                        <td>
                            <el-form-item prop="branchName">
                                <el-input v-model="form.branchName" :placeholder="placeholder" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
                <el-form-item v-if="false">
                    <el-input v-model="code" placeholder="验证码" :readonly="!isEdit" style="width:200px;"></el-input>
                    <el-button type="primary" @click="submitForm('alertFrom')">获取验证码</el-button>
                    <el-button type="primary" @click="submitForm('alertFrom')">{{code}}s</el-button>
                </el-form-item>
                <table style="margin-top:20px;" class="table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>直系亲属地址</td>
                        <td colspan="5">
                            <el-form-item prop="immediateFamAddr">
                                <el-input v-model="form.immediateFamAddr" :placeholder="placeholder" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr v-for="(item, index) in form.orderUserContacts">
                        <td>姓名</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="item.name" :placeholder="placeholder" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                        <td>关系</td>
                        <td>
                            <el-form-item>
                                <el-select v-model="item.relationshipType" placeholder="请选择" v-if="isEdit">
                                    <el-option :label="itm.name" :value="itm.value" v-for="itm in relationshipBetween" :key="itm.value"></el-option>
                                </el-select>
                                <div v-else>
                                    <span class="el-input" v-text="itm.name" v-show="itm.value == item.relationshipType" v-for="itm in relationshipBetween"></span>
                                </div>
                            </el-form-item>
                        </td>
                        <td>紧急联系人电话</td>
                        <td>
                            <el-form-item>
                                <el-input :maxlength="11" v-model="item.phone" :placeholder="placeholder" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
            </div>
            <!--借款-->
            <div class="filter-container">
                <div class="tableheader">借款需求</div>
                <table style="" class="table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>申请产品</td>
                        <td>
                            <el-form-item prop="prodId">
                                <el-select v-model="form.prodId" placeholder="请选择" v-if="isEdit" @change="productChange">
                                    <el-option :label="item.name" :value="item.id" v-for="item in product" :key="item.id"></el-option>
                                </el-select>
                                <span class="el-input" v-text="item.name" v-for="item in product" v-show="item.id == form.prodId" v-else></span>
                            </el-form-item>
                        </td>
                        <td>希望借款金额</td>
                        <td>
                            <el-form-item prop="applyAmount">
                                <el-input v-model="form.applyAmount" :placeholder="placeholder" :readonly="!isEdit" v-if="isEdit" @keyup.native="inputChange($event, false, 'applyAmount')"></el-input>
                                <span class="el-input" v-else>{{form.applyAmount | formatMoney}}</span>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>每期还款金额</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.eachmoney" placeholder="终审输入" readonly v-if="isEdit"></el-input>
                                <span v-else>{{form.eachmoney | formatMoney}}</span>
                            </el-form-item>
                        </td>
                        <td>借款期数</td>
                        <td>
                            <el-form-item prop="loanTerm">
                                <el-input type="number" v-model="form.loanTerm" readonly></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>借款用途</td>
                        <td>
                            <el-form-item prop="consumeType">
                                <el-select v-model="form.consumeType" placeholder="请选择" v-if="isEdit">
                                    <el-option :label="item.name" :value="item.value +''" v-for="item in tcConsume" :key="item.value"></el-option>
                                </el-select>
                                <span class="el-input" v-for="item in tcConsume" v-text="item.name" v-show="item.value == form.consumeType" v-else></span>
                            </el-form-item>
                        </td>
                        <td>合同放款金额</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.agreementAmount" placeholder="终审输入" readonly v-if="isEdit"></el-input>
                                <span class="el-input" v-else>{{form.agreementAmount | formatMoney}}</span>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>实际放款金额</td>
                        <td>
                            <el-form-item>
                                <el-input v-model="form.realPayAmout" placeholder="终审输入" readonly v-if="isEdit"></el-input>
                                <span class="el-input" v-else>{{form.realPayAmout | formatMoney}}</span>
                            </el-form-item>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <!--个人信息-->
            <div class="filter-container">
                <div class="tableheader">个人信息</div>
                <table style="" class="table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>学历</td>
                        <td>
                            <el-form-item prop="eduBg">
                                <el-select v-model="form.eduBg" placeholder="请选择" v-if="isEdit">
                                    <el-option :label="item.name" :value="item.value + ''" v-for="item in eduBg" :key="item.value"></el-option>
                                </el-select>
                                <span class="el-input" v-text="item.name" v-for="item in eduBg" v-show="item.value == form.eduBg" v-else></span>
                            </el-form-item>
                        </td>
                        <td>婚姻状况</td>
                        <td>
                            <el-form-item prop="marriageStatus">
                                <el-select v-model="form.marriageStatus" placeholder="请选择" v-if="isEdit">
                                    <el-option :label="item.name" :value="item.value + ''" v-for="item in marriageStatus" :key="item.value"></el-option>
                                </el-select>
                                <span class="el-input" v-text="item.name" v-for="item in marriageStatus" :key="item.value" v-show="item.value == form.marriageStatus" v-else></span>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>房产状况</td>
                        <td>
                            <el-form-item prop="houseStatus">
                                <el-select v-model="form.houseStatus" placeholder="请选择" v-if="isEdit">
                                    <el-option :label="item.name" :value="item.value + ''" v-for="item in houseStatus" :key="item.value"></el-option>
                                </el-select>
                                <span class="el-input" v-for="item in houseStatus" :key="item.value" v-text="item.name" v-show="item.value == form.houseStatus" v-else></span>
                            </el-form-item>
                        </td>
                        <td>子女数目</td>
                        <td>
                            <el-form-item prop="childNumber">
                                <el-select v-model="form.childNumber" placeholder="请选择" v-if="isEdit">
                                    <el-option :label="index" :value="index + ''" v-for="(item, index) in 5" :key="item"></el-option>
                                </el-select>
                                <span class="el-input" v-text="form.childNumber" v-else></span>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>户籍地址</td>
                        <td>
                            <el-form-item prop="residenceAddr">
                                <el-input type="textarea" :rows="3" :placeholder="placeholder" :readonly="!isEdit" v-model="form.residenceAddr"></el-input>
                            </el-form-item>
                        </td>
                        <td>现在住址</td>
                        <td>
                            <el-form-item prop="presentAddr">
                                <el-input type="textarea" :rows="3" :placeholder="placeholder" :readonly="!isEdit" v-model="form.presentAddr"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
            </div>
            <!--工作信息-->
            <div class="filter-container">
                <div class="tableheader">工作信息</div>
                <table style="" class="table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>单位全称</td>
                        <td>
                            <el-form-item prop="companyName">
                                <el-input :placeholder="placeholder" v-model="form.companyName" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                        <td>单位性质</td>
                        <td>
                            <el-form-item prop="enterpriseType">
                                <el-select v-model="form.enterpriseType" placeholder="请选择" v-if="isEdit">
                                    <el-option :label="item.name" :value="item.value + ''" v-for="item in  enterprise_type" :key="item.value"></el-option>
                                </el-select>
                                <span class="el-input" v-text="item.name" v-for="item in  enterprise_type" :key="item.value" v-show="form.enterpriseType == item.value" v-else></span>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>单位行业</td>
                        <td>
                            <el-form-item prop="industry2">
                                <el-select v-model="form.industry2" placeholder="请选择" v-if="isEdit" @change="industryChange">
                                    <el-option :label="item.label" :value="item.id" v-for="item in industry" :key="item.id"></el-option>
                                </el-select>
                                <span class="el-input" v-text="industry_text" v-else></span>
                            </el-form-item>
                        </td>
                        <td>单位行业</td>
                        <td>
                            <el-form-item prop="industry">
                                <el-select v-model="form.industry" placeholder="请选择" v-if="isEdit">
                                    <el-option :label="item.label" :value="item.id" v-for="item in industry2" :key="item.id"></el-option>
                                </el-select>
                                <div v-else>
                                    <span class="el-input" v-text="industry_text2"></span>
                                </div>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>单位固话</td>
                        <td>
                            <el-form-item prop="companyTel">
                                <el-input :placeholder="placeholder" v-model="form.companyTel" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                        <td>职务</td>
                        <td>
                            <el-form-item prop="position">
                                <el-input :placeholder="placeholder" v-model="form.position" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>发薪日</td>
                        <td>
                            <el-form-item prop="payDay">
                                <el-select v-model="form.payDay" placeholder="请选择" v-if="isEdit">
                                    <el-option :label="index+ 1" :value="(index + 1) + ''" v-for="(item, index) in 31" :key="index"></el-option>
                                </el-select>
                                <span class="el-input" v-text="form.payDay" v-else></span>
                            </el-form-item>
                        </td>
                        <td>月收入</td>
                        <td>
                            <el-form-item prop="monthIncome">
                                <el-input :placeholder="placeholder" :readonly="!isEdit" v-model="form.monthIncome" v-if="isEdit" @keyup.native="inputChange($event, true, 'monthIncome')"></el-input>
                                <span class="el-input" v-else>{{form.monthIncome}}</span>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td>单位地址</td>
                        <td>
                            <el-form-item prop="companyAddr">
                                <el-input type="textarea" :rows="3" :placeholder="placeholder" v-model="form.companyAddr" :readonly="!isEdit"></el-input>
                            </el-form-item>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <!--业务信息-->
            <div class="filter-container">
                <div class="tableheader">业务信息</div>
                <table style="" class="table" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>门店</td>
                        <td>
                            <el-form-item prop="shopId">
                                <el-select v-model="form.shopId" placeholder="请选择" v-if="isEdit" @change="shopChange">
                                    <el-option :label="item.name" :value="item.id + ''" v-for="item in shop" :key="item.id"></el-option>
                                </el-select>
                                <span class="el-input" v-text="form.shopName" v-else></span>
                            </el-form-item>
                        </td>
                        <td>业务人员</td>
                        <td>
                            <el-form-item prop="adminId">
                                <el-select v-model="form.adminId" placeholder="请选择" v-if="isEdit" :disabled="!form.shopId">
                                    <el-option :label="item.adminName" :value="item.id + ''" v-for="item in admins" :key="item.id"></el-option>
                                </el-select>
                                <span class="el-input" v-text="form.adminName" v-else></span>
                            </el-form-item>
                        </td>
                    </tr>
                </table>
            </div>
            <div style="padding:20px;text-align:center;">
                <el-button v-if="isEdit" type="primary" @click="submitForm('alertFrom')" :loading="loading">提交</el-button>
                <el-button v-else @click="$router.go(-1)">返回</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { validate } from '@src/utils/validation';
import { Common } from '@common/common';
import { downloadExecl } from '@common/downloadExecl';
import baseURL from '$lib/utils/baseURL';
export default {
    data() {
        var phone = (rule, value, callback) => {
            if (!validate.validatPhone(value)) {
                callback(new Error('手机号号码格式不正确'));
                return false;
            }
            callback();
        };
        var validIdcard = (rule, value, callback) => {
            if (!validate.idCard(value)) {
                callback(new Error('身份证号格式有误'));
                return false;
            }
            callback();
        }
        return {
            loading: false, //防止二次操作
            disabled:true,
            code: '', //验证码
            isEdit: false,
            placeholder: '',
            OrderNum: '', //订单号 新增用
            rowData: '', //列表传过来的数据
            relationshipBetween: [], //关系
            industry: [], //行业
            industry2: [], //行业2
            industry_text: '',
            industry_text2: '',
            product: [], //产品
            tcConsume: [], //消费选项
            eduBg: [], //学历
            marriageStatus: [], //婚姻
            houseStatus: [], //房产
            enterprise_type: [], //企业类型
            shop: [], //门店
            admins: [], //业务员
            shopData: '',
            AuditData:'',
            form: { //弹框表格数据
                orderNum: '', //订单号
                sex: '',//性别
                orderUserContacts: [ //关系
                    { relationshipType: '', phone: '', name: '', type: 0 },
                    { relationshipType: '', phone: '', name: '', type: 0 },
                    { relationshipType: '', phone: '', name: '', type: 0 },
                    { relationshipType: '', phone: '', name: '', type: 0 }
                ],
                loanTerm: '', //借款期数
                consumeType: '', //借款用途
                eduBg: '', //学历
                marriageStatus: '', //婚姻
                houseStatus: '', //财产
                childNumber: '', //子女数目
                enterpriseType: '', //单位性质
                industry: '', //单位行业
                industry2: '', //单位行业1
                payDay: '', //发薪日
                shopId: '', //门店id,
                adminId: '', //业务员ID
                prodId: '' //产品
            },
            rules: {
                name: [{ required: true, message: '请输入', trigger: 'blur' }],
                idCard: [
                    { required: true, message: '请输入', trigger: 'blur' },
                    { validator: validIdcard, trigger: 'blur' }
                ],
                vicePhone: [
                    // { required: true, message: '请输入', trigger: 'blur' },
                    // { validator: phone, trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入', trigger: 'blur' },
                    { validator: phone, trigger: 'blur' },
                ],
                sex: [{ required: true, message: '请选择', trigger: 'change' }],
                bankName: [{ required: true, message: '请输入', trigger: 'blur' }],
                bankCardNo: [{ required: true, message: '请输入', trigger: 'blur' }],
                branchName: [{ required: true, message: '请输入', trigger: 'blur' }],
                immediateFamAddr: [{ required: true, message: '请输入', trigger: 'blur' }],
                prodId: [{ type: 'number', required: true, message: '请选择', trigger: 'change' }],
                applyAmount: [{ required: true, message: '请输入', trigger: 'blur' }],
                eachmoney: [{ required: true, message: '请输入', trigger: 'blur' }],
                // loanTerm: [{ required: true, message: '请输入', trigger: 'blur' }], //借款期数
                consumeType: [{ required: true, message: '请选择', trigger: 'change' }],
                agreementAmount: [{ required: true, message: '请输入', trigger: 'blur' }],
                realPayAmout: [{ required: true, message: '请输入', trigger: 'blur' }],
                eduBg: [{ required: true, message: '请选择', trigger: 'change' }],
                marriageStatus: [{ required: true, message: '请选择', trigger: 'change' }],
                houseStatus: [{ required: true, message: '请选择', trigger: 'change' }],
                childNumber: [{ required: true, message: '请选择', trigger: 'change' }],
                residenceAddr: [{ required: true, message: '请输入', trigger: 'blur' }],
                presentAddr: [{ required: true, message: '请输入', trigger: 'blur' }],
                companyName: [{ required: true, message: '请输入', trigger: 'blur' }],
                enterpriseType: [{ required: true, message: '请选择', trigger: 'change' }],
                industry2: [{ required: true, message: '请选择', trigger: 'change' }],
                industry: [{ required: true, message: '请选择', trigger: 'change' }],
                // companyTel: [{ required: true, message: '请输入', trigger: 'blur' }], //单位固话
                position: [{ required: true, message: '请输入', trigger: 'blur' }],
                payDay: [{ required: true, message: '请选择', trigger: 'change' }],
                monthIncome: [{ required: true, message: '请输入', trigger: 'blur' }],
                companyAddr: [{ required: true, message: '请输入', trigger: 'blur' }],
                shopId: [{ required: true, message: '请选择', trigger: 'change' }],
                adminId: [{ required: true, message: '请选择', trigger: 'change' }]
            } //验证
        }
    },
    computed: {
    },
    created() {
        let data = this.$route.query.data ? JSON.parse(this.$route.query.data) : '';
        if (data) { //查看
            this.isEdit = false;
            this.placeholder = '';
            this.rowData = data;
            this.getDetail();
        } else { //新增
            this.isEdit = true;
            this.placeholder = '请输入';
            this.getOrderNum(); //获取订单号
            this.getShop(); // 获取门店
            this.getIndustry(); //获取行业
        }
        let selectName = ['relationshipBetween', 'tcConsume', 'eduBg', 'marriageStatus', 'houseStatus', 'enterprise_type']; //下拉框的名字
        let selectKey = ['tc_contact_relationship', 'tc_consume_type', 'tc_edu_bg', 'tc_marriage_status', 'tc_house_status', 'tc_enterprise_type']; //接口key 关系， 产品， 用途， 学历 ,婚姻, 房产, 企业类型
        selectKey.map((item, index) => {
            this.getRelationshipbetween(item, selectName[index]); //获取联系人关系list和产品
        })
        this.getProduct(); //获取产品

    },
    mounted() {
        this.getAudit()
    },
    methods: {
        //下载借款承诺书打印
         downloadjk() {               
				window.open(baseURL() +'export/downHt?orderNum=' + this.rowData.orderNum) 				
            },
		  //下载手写申请表打印
         download() {
			 window.open(baseURL() +'export/downSxsqb?orderNum=' + this.rowData.orderNum)              
            },
        // 强制正整数
        inputChange(e, noMoney, name) {
            let obj = {
                input: e,
                maxMoney: noMoney ? '' : 200000,
                that: this
            }
            this.form[name] = Common.positiveIntegerMoney(obj); //表单赋值
        },
        getDetail(isseach) {
            ajax({
                url: 'detailsdata/detailsuser',
                optionParams: {
                    orderNum: this.rowData.orderNum,
                    orderUserId: this.rowData.orderUserId
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response)
                        this.form = response.data ? response.data : {};
                        this.getIndustry(); //获取行业
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //获取联系人关系
        getRelationshipbetween(keyName, selectName) {
            ajax({
                url: 'choicesData/queryByKey',
                optionParams: {
                    key: keyName
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        // console.log(response)
                        this[selectName] = response.data ? response.data : [];
                        console.log(this.relationshipBetween)
                    } else {
                        this.$message.warning(response.message)
                    }
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
                        this.product = response.data ? response.data : [];
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //产品变化
        productChange(value) {
            this.product.map((item) => {
                if (item.id == value) {
                    this.form.loanTerm = item.term;
                }
            })
        },
        //获取门店
        getShop() {
            ajax({
                url: 'config/shoplist',
                optionParams: {}
            }).fetch()
                .then(response => {
                    if (response.code === 200) {
                        this.shopData = response.data;
                        this.shop = response.data.shops;
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //门店数据变化赋值业务员
        shopChange(id) {
            let array = [];
            this.shopData.admins.map((value) => {
                if (value.shopId == id) {
                    array.push(value)
                }
            })
            this.form.adminId = '';
            console.log(array)
            this.admins = array;
        },
        getIndustry() { //获取行业
            ajax({
                url: 'config/chooseList',
                optionParams: {
                    group: "industry",
                    childGroup: "childindustry"
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.industry = response.data;
                        this.industry.map((value) => {
                            //反找行业
                            value.children.map((item) => {
                                if (this.form.industry == item.id) {
                                    this.industry_text = value.label;
                                    this.industry_text2 = item.label;
                                }
                            })
                        })
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        industryChange(value) { //行业变换
            this.industry.map((item) => {
                if (value == item.id) {
                    this.industry2 = item.children;
                }
            })
            this.form.industry = '';
        },
        //审核
		getAudit() {
			ajax({
				url: 'detailsdata/detailsp',
				optionParams: {
					orderNum: this.rowData.orderNum,
					orderUserId: this.rowData.orderUserId
				}
			}).post()
				.then(response => {
					if (response.code === 200) {
						console.log(response)
						this.AuditData = response.data;
					} else {
						this.$message.warning(response.message)
					}
				})
				.catch(error => {
					console.log(error)
				})
		},
        //获取订单号
        getOrderNum() {
            ajax({
                url: 'underlineProcess/getOrderNumber',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        this.form.orderNum = response.data;
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //提交新增
        submitForm(formName) {
            //  console.log(this.form)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let array = [];
                    this.form.orderUserContacts.map((value) => {
                        if (value.relationshipType != '' & value.phone != '' & value.name != '') {
                            array.push(value);
                        }
                    })

                    if (array.length < 2) {
                        this.$message.warning('核心数据联系人至少要填写两个完整的');
                        return false;
                    } else {
                        this.form.orderUserContacts.map((value) => {
                            if (value.phone != '' && !validate.validatPhone(value.phone)) {
                                this.$message.warning('核心数据联系人手机号格式错误');
                                return false;
                            }
                        })
                    }
                    console.log(this.form)
                    this.loading = true; //二次提交按钮设置
                    ajax({
                        url: 'underlineProcess/customerInfoAdd',
                        optionParams: this.form
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message)
                                this.$router.go(-1)
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
.table {
    width: 1200px;
    margin-bottom: 20px;
}
.ggg_user{
    .yanse{
         font-weight: 800;
    }
}
.filter-container {
    width: 1200px;
    margin: 0 auto;
}
</style>


