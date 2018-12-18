<template>
    <div class="app-container calendar-list-container ggg_user" v-loading="listLoading">
        <el-tabs type="border-card" @tab-click="handleClick">
            <el-tab-pane label="核心数据">
                <el-form :rules="rules" ref="alertFrom" label-position="center" label-width="0px" :model="form" class="table_css kernel">
                    <!--身份证-->
                    <div class="filter-container idCardMax" v-if="form.back_image || form.front_image">
                        <img :src="imgSrcBase + form.front_image" alt="" v-show="form.front_image">
                        <img :src="imgSrcBase + form.back_image" alt="" v-show="form.back_image">
                    </div>
                    <!--核心-->
                    <div class="filter-container">
                        <div class="tableheader">核心数据</div>
                        <!--<div class="filter-container" style="overflow:hidden;">-->
                        <!--<div style="float:right;">-->
                        <!--<el-button type="info" @click="" plain> 借款承诺书打印</el-button>-->
                        <!--<el-button type="success" @click=""> 手写申请表打印</el-button>-->
                        <!--</div>-->
                        <!--</div>-->
                        <table style="margin-top:20px;" class="table" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>姓名</td>
                                <td v-text="form.name"></td>
                                <td>身份证号</td>
                                <td v-text="form.idCard"></td>
                            </tr>
                            <tr>
                                <td>手机号</td>
                                <td v-text="form.phone"></td>
                                <td>性别</td>
                                <td>
                                    <span class="el-input " v-show="form.sex == 1">男</span>
                                    <span class="el-input " v-show="form.sex == 2">女</span>
                                </td>
                            </tr>
                            <tr>
                                <td>收款银行卡</td>
                                <td v-text="form.bankCardNo"></td>
                                <td>所属银行</td>
                                <td v-text="form.bankName"></td>
                            </tr>
                            <tr>
                                <td>详细支行</td>
                                <td v-text="form.branchName"></td>
                                <td>年龄</td>
                                <td>{{form.idCard | getAge}}</td>
                            </tr>
                        </table>
                    </div>
                    <!--借款需求-->
                    <div class="filter-container">
                        <div class="tableheader">借款需求</div>
                        <table style="" class="table" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>申请产品</td>
                                <td>
                                    {{rowData.productName}}
                                </td>
                                <td>希望借款金额</td>
                                <td>
                                    {{rowData.applyAmount|formatMoney}}
                                </td>
                            </tr>
                            <tr>
                                <td>每期还款金额</td>
                                <td>{{rowData.eachmoney|formatMoney}}</td>
                                <td>借款期数</td>
                                <td>
                                    {{rowData.loanTerm }}
                                </td>
                            </tr>
                            <tr>
                                <td>借款用途</td>
                                <td>
                                    {{form.consumeType|consumeTypeFilter}}
                                </td>
                                <td>合同放款金额</td>
                                <td>{{form.agreementAmount|formatMoney }}</td>
                            </tr>
                            <tr>
                                <td>实际放款金额</td>
                                <td>{{form.realPayAmout|formatMoney}}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                    </div>

                    <!--建议x循环-->
                    <div class="filter-container noborder" v-show="AuditData.spStatus != 1 || AuditData.spStatus == 7" v-for="item in AuditData.spHistory">
                        <table style="" class="table">
                            <tr>
                                <td v-if="item.statusName == '合同'">{{item.statusName}}意见</td>
                                <td v-else>{{item.statusName}}状态</td>
                                <td>
                                    <p style="width:200px;display:inline-block;">
                                        <el-form-item>
                                            <span v-text="item.status "></span>
                                        </el-form-item>
                                    </p>
                                    <p style="width:250px;display:inline-block;">
                                        <el-form-item>
                                            <span v-text="item.reasonsRejection"></span>
                                        </el-form-item>
                                    </p>
                                </td>
                                <td>操作人</td>
                                <td>{{item.name}} </td>
                                <td>时间</td>
                                <td>{{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
                            </tr>
                            <tr v-if="item.statusName != '合同'">
                                <td>{{item.statusName}}意见</td>
                                <td colspan="5" class="noborder">
                                    <el-form-item>
                                         <el-input type="textarea" :rows="6" readonly v-model="item.msg" v-if="item.status == '信审同意'"></el-input>
										<el-input type="textarea" :rows="1" readonly v-model="item.msg" v-else></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                        </table>
                    </div>

                </el-form>
            </el-tab-pane>
            <el-tab-pane label="影像资料">
                <div>
                    <h2 style="display:inline-block;">借款人：</h2>{{form.name}}</div>
                <div class="filter-container">
                    <el-tabs type="card" @tab-click="videotab">
                        <el-tab-pane label="身份证和验磁截屏"></el-tab-pane>
                        <el-tab-pane label="银行卡"></el-tab-pane>
                        <el-tab-pane label="借款承诺书"></el-tab-pane>
                        <el-tab-pane label="手写申请表"></el-tab-pane>
                         <el-tab-pane label="还款告知书"></el-tab-pane>
                    </el-tabs>
                    <div class="filter-container">
                        <div class="upLoadingAlert1">
                            <ul class="el-upload-list el-upload-list--picture">
                                <li class="el-upload-list__item is-success" v-for="(item,index) in imgData">
                                    <img class="el-upload-list__item-thumbnail" :src="imgSrcBase + item.consumeImg + '?x-oss-process=style/zrf'" alt="" @click="magnifyImg(imgData, index)">
                                    <a class="el-upload-list__item-name">
                                        <i class="el-icon-document"></i>
                                    </a>
                                    <label class="el-upload-list__item-status-label">
                                        <i class="el-icon-upload-success el-icon-check"></i>
                                    </label>
                                    <!--<i class="el-icon-close" @click="deleteImg(item)"></i>-->
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="还款计划表" class="table_css">
                <div class="filter-container">
                    <table class="table">
                        <tr>
                            <td>借款人姓名</td>
                            <td v-text="detailplanData.name"></td>
                            <td>门店</td>
                            <td v-text="detailplanData.shopName"></td>
                            <td>所属业务员</td>
                            <td v-text="detailplanData.adminName"></td>
                        </tr>
                        <tr>
                            <td>合同金额</td>
                            <td>{{detailplanData.agreementAmount | formatMoney}}</td>
                            <td>申请产品</td>
                            <td v-text="detailplanData.productName">hioh </td>
                            <td>借款期限</td>
                            <td v-text="detailplanData.loanTerm"></td>
                        </tr>
                    </table>
                </div>
                <div class="filter-container">
                    <table class="table">
                        <tr>
                            <td>期数</td>
                            <td>还款日期</td>
                            <td>每期还款金额</td>
                            <td>状态 </td>
                            <td>还款方式 </td>
                        </tr>
                        <tr v-for="item in detailplanData.orderRepayPlanVo">
                            <td v-text="item.period "></td>
                            <td>{{item.planRepayTime | parseTime('{y}-{m}-{d}')}}</td>
                            <td>{{item.dueInterestAmount + item.duePrincipalAmount | formatMoney}}</td>
                            <td>
                               <span v-if='item.overDueStatus==1 && item.repaymentStatus==2'>已还(逾期{{item.day1}}天)</span>
								<span v-if='item.overDueStatus==1 && item.repaymentStatus!=2'>逾期{{item.day}}天</span>
								<span v-if='item.overDueStatus==0' v-for="itm in storage.repaymentStatus" v-show="itm.id == item.repaymentStatus" v-text="itm.label"></span>
                            </td>
                            <td>
                                <span v-for="itm in storage.ReimbursementChannels" v-show="itm.id == item.repayType" v-text="itm.label"></span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="filter-container" style="text-align:center;">
                    <el-button type="primary" class="iconfont icon-xiazai1"> 下载</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
        <magnifyImg :imgAlertArray='isAlertmagnify.imgAlertArray' :isShow="isAlertmagnify.isShow" :index="isAlertmagnify.index" v-on:alertClost="alertClost"></magnifyImg>
        <!--<el-dialog title="上传图片" :visible.sync="dialogVisible" width="30%" class="upLoadingAlert">-->
        <!--<div>-->
        <!--<upLoadimg :dialogVisible="dialogVisible" :userId="rowData.orderUserId" v-on:successLoad="successLoad" v-on:handleRemove="handleRemove"></upLoadimg>-->
        <!--</div>-->
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="submitAlert()">确 定</el-button>-->
        <!--</span>-->
        <!--</el-dialog>-->
    </div>
</template>
<script>
import ajax from '@utils/config';
import { validate } from '@src/utils/validation';
import upLoadimg from '@src/components/upLoadimg';
import magnifyImg from '@src/components/magnifyImg'; //放大图片
import { storage } from '@constants/dataStorage';
import Cookies from 'js-cookie';
export default {
    components: {
        upLoadimg: upLoadimg,
        magnifyImg: magnifyImg
    },
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
        var reasonsRejection = (rule, value, callback) => {
            if (this.AuditForm.reasonsRejection == '') {
                callback(new Error('请选择'));
                return false;
            }
            callback();
        }
        var msg = (rule, value, callback) => {
            console.log(this.AuditForm)
            if (this.AuditForm.msg == '' || !this.AuditForm.msg) {
                callback(new Error('请输入'));
                return false;
            }
            callback();
        }
        return {
            storage: storage, //存储的数据
            listLoading: false,
            //放大图片参数
            isAlertmagnify: {
                isShow: false, //放大图片组件显示
                imgAlertArray: [], //图片
                index: 0 //第几张图片
            },
            flag: false, //开关
            activeName2: 'second',
            placeholder: '请输入',
            OrderNum: '', //订单号 新增用
            rowData: '', //列表传过来的数据
            relationshipBetween: [], //关系
            industry: [], //行业1
            industry2: [], //行业2
            product: [], //产品
            tcConsume: [], //消费选项
            eduBg: [], //学历
            marriageStatus: [], //婚姻
            houseStatus: [], //房产
            enterprise_type: [], //企业类型
            AuditForm: {
                status: '1', //审核下拉框
                reasonsRejection: '', //决绝拒绝原因
            },
            form: {},
            rules: {},
            userName: Cookies.get('user'), //操作人
            dateTime: new Date(), //时间
            reasonsRejectionData: {}, //拒绝原因
            AuditData: '', //审核
            imgSrcBase: 'https://img.zhaogu168.com/',
            imgData: [], //图片
            baseImgSrc: 'https://img.zhaogu168.com/2.jpg',
            dialogVisible: false, //弹框显示
            imgtype: 1, //控制图像上传按钮显示和保存影像资料type
            imgLoadData: [], //提交的图片列表
            detailplanData: '', //还款计划数据
        }
    },
    computed: {
    },
    created() {
        let data = this.$route.query.data ? JSON.parse(this.$route.query.data) : '';
        this.rowData = data;
        this.getDetail();
        let selectName = ['relationshipBetween', 'product', 'tcConsume', 'eduBg', 'marriageStatus', 'houseStatus', 'enterprise_type', 'reasonsRejectionData']; //下拉框的名字
        //接口key 关系， 产品， 用途， 学历 ,婚姻, 房产, 企业类型, 拒绝原因
        let selectKey = ['tc_contact_relationship', 'product', 'tc_consume_type', 'tc_edu_bg', 'tc_marriage_status', 'tc_house_status', 'tc_enterprise_type', 'tc_reasons_rejection'];
        selectKey.map((item, index) => {
            this.getRelationshipbetween(item, selectName[index]); //获取联系人关系list和产品
        })
    },
    mounted() {
    },
    methods: {
        // 强制正整数
        inputChange(value) {
            let number = value.replace(/[^\d]/g, '');
            return number;
        },
        getDetail(isseach) {
            this.listLoading = true;
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
                        this.$set(this.form, 'industry2', '');
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                    this.getIndustry(); //获取行业
                })
                .catch(error => {
                    console.log(error);
                    this.listLoading = false;
                })
            this.getAudit(); //获取审核
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
                        console.log('审核 getAudit')
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
        //提交审核和编辑
        submitForm(formName) {
            //  console.log(this.form)
            console.log(this.AuditForm)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    ajax({
                        url: 'underlineProcess/firstApproval',
                        optionParams: {
                            dto: this.form,
                            msg: this.AuditForm.msg,
                            orderNum: this.form.orderNum,
                            orderUserId: this.rowData.orderUserId,
                            reasonsRejection: this.AuditForm.reasonsRejection,
                            status: this.AuditForm.status
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message)
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
                        this[selectName] = response.data ? response.data : [];
                        console.log('this.tcConsume')
                        console.log(this.tcConsume);
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //获取行业
        getIndustry() {
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
                                    this.industry2 = value.children;
                                    this.form.industry2 = value.id;
                                    // console.log(value.id)
                                }
                            })
                        })
                        this.$nextTick(() => {
                            this.flag = true;
                        })
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //行业变换
        industryChange(value) {
            console.log('a industryChange')
            this.industry.map((item) => {
                if (value == item.id) {
                    this.industry2 = item.children;
                }
            })
            if (this.flag) {
                this.form.industry = '';
            }
        },
        //点击tab
        handleClick(tab, event) {
            this.listLoading = true;
            if (tab.index == 0) {
                this.listLoading = false;
            }
            if (tab.index == 1) {
                this.getVideodetail(); //影像资料
            }
            if (tab.index == 2) {
                this.getDetailplan() //获取还款计划
            }
        },
        //影像资料tab
        videotab(tab, event) {
            this.listLoading = true;
              console.log(tab.index)
            if(tab.index == 4){
                this.imgtype = 9    
            }else{
                this.imgtype = tab.index * 1 + 1;
            }
            console.log('this.imgtype')
            this.getVideodetail();
        },
        //影像资料
        getVideodetail(imgtype) {
            let type = this.imgtype ? this.imgtype : 1;
            // if (this.)
            // console.log(this.form.)
            ajax({
                url: 'detailsdata/detailsimage',
                optionParams: {
                    imgtype: type,
                    orderNum: this.form.orderNum,
                    orderUserId: this.rowData.orderUserId
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response)
                        this.imgData = response.data ? response.data : [];
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.listLoading = false;
                })
        },
        //上传成功
        // successLoad(name) {
        //     this.imgLoadData.push(name);
        //     // console.log(this.imgLoadData)
        // },
        //清空图片
        isAlert() {
            this.dialogVisible = true;
            this.imgLoadData = []; //清空图片list;
        },
        //上传删除
        // handleRemove(name) {
        //     this.imgLoadData.map((item, index) => {
        //         if (item == name) {
        //             // console.log(index)
        //             this.imgLoadData.splice(index, 1)
        //         }
        //     })
        //     // console.log(this.imgLoadData)
        // },
        //图片提交
        submitAlert() {
            if (this.imgLoadData.length === 0) {
                this.$message.warning('请选择图片');
                return false;
            }
            ajax({
                url: 'underlineProcess/orderUserImgUpload',
                optionParams: {
                    imgs: this.imgLoadData,
                    imgtype: this.imgtype,
                    orderNum: this.form.orderNum,
                    orderUserId: this.rowData.orderUserId
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response)
                        this.$message.success(response.message);
                        this.dialogVisible = false;
                        this.getVideodetail(this.imgtype);
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //删除图片
        deleteImg(item) {
            console.log(item)
            this.$confirm('是否要删除图片?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                ajax({
                    url: 'underlineProcess/delImg',
                    optionParams: {
                        id: item.id
                    }
                }).post()
                    .then(response => {
                        if (response.code === 200) {
                            this.$message.success('删除成功');
                            this.getVideodetail(this.imgtype);
                        } else {
                            this.$message.warning(response.message)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }).catch(() => {

            });
        },
        // 放大图片
        magnifyImg(data, index) {
            this.isAlertmagnify.isShow = true;
            this.isAlertmagnify.index = index;
            this.isAlertmagnify.imgAlertArray = data;
        },
        //关闭
        alertClost() {
            this.isAlertmagnify.isShow = false;
            this.isAlertmagnify.imgAlertArray = [];
        },
        //获取还款计划表
        getDetailplan() {
            ajax({
                url: 'detailsdata/detailplan',
                optionParams: {
                    orderNum: this.form.orderNum,
                    orderUserId: this.rowData.orderUserId
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response)
                        this.detailplanData = response.data;
                        response.data.orderRepayPlanVo.map((item) => {
							if(item.realRepayTime==null){
									let myDate = new Date(); //获取今天日期
									let str = myDate.getTime(); //转换成时间戳
									let str1 =  new Date(item.planRepayTime); //转换成时间戳
									let time = str1.getTime();
									let runTime1 = parseInt((str - time) / 1000);
									let day = parseInt(runTime1 / (24*60*60));//计算整数天数
									this.$set(item, 'day', day);
							}
							})
							
							response.data.orderRepayPlanVo.map((item) => {
							if(item.realRepayTime!=null){
								//console.log(item.planRepayTime)
									let str =  new Date(item.planRepayTime); //转换成时间戳
									let time = str.getTime();
									let str1 =  new Date(item.realRepayTime); //转换成时间戳
									let time1 = str1.getTime();
									// console.log(time)
									let runTime1 = parseInt((time1 - time) / 1000);
									let day1 = parseInt(runTime1 / (24*60*60));//计算整数天数   
									this.$set(item,'day1', day1);	
							}
							})
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.listLoading = false;
                })
        },
    },
    filters: {
    }
}
</script>
<style lang="less" scoped>
.green {
    color: #5cb85c;
    ;
}

.green1 {
    color: #fff;
    display: inline-block;
    background: #5cb85c;
    padding-left: 4px;
}

.table_css {
    width: 1000px;
    margin: 0 auto; // 核心
    &.kernel {
        width: 1200px;
        margin-left: 0;
        h1 {
            text-align: left;
        }
        .tableheader {
            text-align: left;
        }
        .table {
            width: 1200px;
        }
    }
    h1,
    h2 {
        text-align: center;
    }
    .table {
        width: 1000px;
    } // 运营商协助表格
    &.table_block {
        width: 1080px;
        .table_text {
            width: 100%;
            overflow: hidden;
            >.fl {
                position: relative;
                overflow: hidden;
            }
            .left {
                width: 180;
                height: auto;
                text-align: center;
                h2 {
                    color: #fff;
                    padding-top: 15px;
                }
                img {
                    position: absolute;
                    bottom: 0;
                }
            }
            .right {
                background: #fff;
                padding-left: 20px;
                .table {
                    width: 880px;
                }
            }
        }
    }
}
</style>


