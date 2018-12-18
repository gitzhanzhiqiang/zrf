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
                        <table style="margin-top:20px;" class="table" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>姓名</td>
                                <td v-text="form.name"></td>
                                <td>身份证号</td>
                                <td v-text="form.idCard"></td>
                                <td>请输入副卡手机号</td>
                                <td v-text="form.vicePhone"></td>
                            </tr>
                            <tr>
                                <td>手机号</td>
                                <td v-text="form.phone"></td>
                                <td>性别</td>
                                <td>
                                    <span class="el-input " v-show="form.sex == 1">男</span>
                                    <span class="el-input " v-show="form.sex == 2">女</span>
                                </td>
                                <td>年龄</td>
                                <td>{{form.idCard | getAge}}</td>
                            </tr>
                            <tr>
                                <td>所属银行</td>
                                <td v-text="form.bankName"></td>
                                <td>收款银行卡</td>
                                <td v-text="form.bankCardNo"></td>
                                <td>详细支行</td>
                                <td v-text="form.branchName"></td>
                            </tr>
                            <tr>
                                <td>直系亲属地址</td>
                                <td colspan="5" v-text="form.immediateFamAddr"></td>
                            </tr>
                            <tr v-for="(item, index) in form.orderUserContacts">
                                <td>姓名</td>
                                <td v-text="item.name"></td>
                                <td>关系</td>
                                <td>
                                    <span v-text="itm.name" v-show="itm.value == item.relationshipType" v-for="itm in relationshipBetween"></span>
                                </td>
                                <td>紧急联系人电话</td>
                                <td v-text="item.phone"></td>
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
                                <td class="noborder">
                                    <el-form-item>
                                        <span calss="el-input">{{form.applyAmount | formatMoney}}</span>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr class="noborder">
                                <td>每期还款金额</td>
                                <td>{{form.eachmoney | formatMoney}}</td>
                                <td>借款期数</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly v-model="form.loanTerm"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>借款用途</td>
                                <td class="noborder">
                                    <el-form-item>
                                        <el-input readonly :value="item.name" v-show="item.value == form.consumeType" v-for="item in tcConsume" :key="item.value"></el-input>
                                    </el-form-item>
                                </td>
                                <td>合同放款金额</td>
                                <td :class="{noborder: !isEdit}">
                                    <el-form-item prop="agreementAmount">
                                        <span v-if="!isEdit" calss="el-input">{{form.agreementAmount | formatMoney}}</span>
                                        <el-input v-else :maxlength="6" ref="agreementAmount" placeholder="请输入" @keyup.native="inputChageMoney($event, 'agreementAmount')" @blur="inputBlue"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>实际放款金额</td>
                                <td>{{form.realPayAmout | formatMoney}}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                    <!--个人信息-->
                    <div class="filter-container noborder">
                        <div class="tableheader">个人信息</div>
                        <table style="" class="table" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>学历</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly :value="item.name" v-show="item.value == form.eduBg" v-for="item in eduBg" :key="item.value"></el-input>
                                    </el-form-item>
                                </td>
                                <td>婚姻状况</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly :value="item.name" v-show="item.value == form.marriageStatus" v-for="item in marriageStatus" :key="item.value"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>房产状况</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly :value="item.name" v-show="item.value == form.houseStatus" v-for="item in houseStatus" :key="item.value"></el-input>
                                    </el-form-item>
                                </td>
                                <td>子女数目</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly :value="form.childNumber"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>户籍地址</td>
                                <td>
                                    <el-form-item>
                                        <el-input type="textarea" readonly :rows="3" v-model="form.residenceAddr"></el-input>
                                    </el-form-item>
                                </td>
                                <td>现在住址</td>
                                <td>
                                    <el-form-item>
                                        <el-input type="textarea" readonly :rows="3" v-model="form.presentAddr"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <!--工作信息-->
                    <div class="filter-container noborder">
                        <div class="tableheader">工作信息</div>
                        <table style="" class="table" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>单位全称</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly v-model="form.companyName"></el-input>
                                    </el-form-item>
                                </td>
                                <td>单位性质</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly :value="item.name" v-show="item.value == form.enterpriseType" v-for="item in enterprise_type" :key="item.value"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>单位行业</td>
                                <td>
                                    <el-form-item prop="industry2">
                                        <el-input readonly :value="item.label" v-show="item.id == form.industry2" v-for="item in industry" :key="item.value"></el-input>
                                    </el-form-item>
                                </td>
                                <td>单位行业</td>
                                <td>
                                    <el-form-item prop="industry">
                                        <el-input readonly :value="item.label" v-show="item.id == form.industry" v-for="item in industry2" :key="item.value"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>单位固话</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly v-model="form.companyTel"></el-input>
                                    </el-form-item>
                                </td>
                                <td>职务</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly v-model="form.position"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>发薪日</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly v-model="form.payDay"></el-input>
                                    </el-form-item>
                                </td>
                                <td>月收入</td>
                                <td>
                                    <el-form-item>
                                        <el-input readonly v-model="form.monthIncome"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>单位地址</td>
                                <td>
                                    <el-form-item>
                                        <el-input type="textarea" :rows="3" readonly v-model="form.companyAddr"></el-input>
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
                                <td v-text="form.shopName"></td>
                                <td>业务人员</td>
                                <td v-text="form.adminName"></td>
                            </tr>
                        </table>
                    </div>
                    <!--面谈作业区-->
                    <div class="filter-container" v-show="false">
                        <div class="tableheader">面谈作业区</div>
                        <table class="table">
                            <tr>
                                <td>人法/工商网</td>
                                <td></td>
                                <td>其他</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>面谈意见</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                    <!--建议x循环-->
                    <div class="filter-container noborder" v-for="item in AuditData.spHistory">
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
                    <!--建议-->
                    <div class="filter-container" v-show="AuditData.spStatus ==3 ">
                        <table style="" class="table">
                            <tr>
                                <td>终审意见</td>
                                <td>
                                    <p style="width:200px;display:inline-block;">
                                        <el-form-item>
                                            <el-select v-model="AuditForm.status" placeholder="请选择">
                                                <el-option label="终审通过" value="1"></el-option>
                                                <el-option label="终审拒绝" value="2"></el-option>
                                                <el-option label="驳回初审" value="3"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </p>
                                    <p style="width:200px;display:inline-block;" v-if="false">
                                        <el-form-item prop="reasonsRejection" v-if="AuditForm.status == 2">
                                            <el-select v-model="AuditForm.reasonsRejection " placeholder="请选择">
                                                <el-option :label="item.name" :value="item.value" v-for="item in reasonsRejectionData" :key="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </p>
                                </td>
                                <td>操作人</td>
                                <!--<td>{{userName}} </td>-->
                                <td></td>
                                <td>时间</td>
                                <!--<td>{{dateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>-->
                                <td></td>
                            </tr>
                            <tr>
                                <td>终审审意见</td>
                                <td colspan="5">
                                    <el-form-item prop="msg">
                                        <el-input type="textarea" :rows="3" placeholder="请输入" v-model="AuditForm.msg"></el-input>
                                    </el-form-item>
                                </td>
                            </tr>
                        </table>
                        <div style="padding:20px;text-align:center;">
                            <el-button type="primary" @click="submitForm('alertFrom')" :loading="loading">提交</el-button>
                            <el-button @click="$router.go(-1)">返回</el-button>
                        </div>
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
                        <el-tab-pane label="签约照片"></el-tab-pane>
                        <el-tab-pane label="网查资料（工商、失信、执行、百度、手机号、身份证）等"></el-tab-pane>
                        <el-tab-pane label="社保、公积金、微粒贷、借呗、芝麻信用"></el-tab-pane>
                        <el-tab-pane label="消费凭证"></el-tab-pane>
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
            <el-tab-pane name="" label="运营商报告">
                <el-tabs type="card" @tab-click="operatorreportfu">
                    <el-tab-pane label="运营商报告">
                        <div class="filter-container table_css">
                            <h1>运营商报告</h1>
                            <p class="filter-container">
                                <span>编号：{{operatorreporta.report.rpt_id}}</span>
                                <span class="fr">报告时间：{{operatorreporta.report.update_time}}</span>
                            </p>
                            <!--用户申请表检测-->
                            <div class="block_text">
                                <h2 class="filter-container tableheader">用户申请表检测</h2>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td>
                                                <h4>姓名</h4>
                                            </td>
                                            <td colspan="2" v-text="operatorreporta.application_check[0].check_points.key_value">无</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>身份证</h4>
                                            </td>
                                            <td>
                                                {{operatorreporta.application_check[1].check_points.key_value}}
                                                <span class="green1" v-if="operatorreporta.application_check[1].check_points.court_blacklist.arised==false">不在法院黑名单</span>
                                                <span class="green2" v-if="operatorreporta.application_check[1].check_points.court_blacklist.arised==true">在法院黑名单</span>
                                                <span class="green1" v-if="operatorreporta.application_check[1].check_points.financial_blacklist.arised==false">不在金融机构黑名单</span>
                                                <span class="green2" v-if="operatorreporta.application_check[1].check_points.financial_blacklist.arised==true">在金融机构黑名单</span>
                                            </td>
                                            <td>
                                                <span v-text="operatorreporta.application_check[1].check_points.gender">1</span>|
                                                <span v-text="operatorreporta.application_check[1].check_points.age">1</span>|
                                                <span>
                                                    <span v-text="operatorreporta.application_check[1].check_points.province"></span>
                                                    <span v-text="operatorreporta.application_check[1].check_points.city"></span>
                                                    <span v-text="operatorreporta.application_check[1].check_points.region"></span>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>手机号</h4>
                                            </td>
                                            <td>
                                                {{operatorreporta.application_check[2].check_points.website}}
                                                <span class="green1" v-text="operatorreporta.application_check[2].check_points.reliability">无</span>
                                                <span class="green">注册时间：</span>
                                                <span class="green" v-text="operatorreporta.application_check[2].check_points.reg_time">无</span>
                                            </td>
                                            <td>
                                                {{operatorreporta.application_check[2].check_points.key_value}}
                                                <span class="green1" v-if="operatorreporta.application_check[2].check_points.financial_blacklist.arised==false">不在金融机构黑名单</span>
                                                <span class="green2" v-if="operatorreporta.application_check[2].check_points.financial_blacklist.arised==true">在金融机构黑名单</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td colspan="2">
                                                <p style="color: #3c763d;" v-text="operatorreporta.application_check[2].check_points.check_name">无</p>
                                                <p style="color: #3c763d;" v-text="operatorreporta.application_check[2].check_points.check_idcard">无</p>
                                                <p style="color: #8a6d3b;" v-text="operatorreporta.application_check[2].check_points.check_ebusiness">无</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>居住地址</h4>
                                            </td>
                                            <td>{{operatorreporta.application_check[3].check_points.check_addr}}</td>
                                            <td>{{operatorreporta.application_check[3].check_points.check_ebusiness}}</td>
                                        </tr>
                                        <tr v-for="item in operatorreporta.application_check" v-if="item.check_points.contact_name!=null">
                                            <td>
                                                <h4>联系人</h4>
                                            </td>
                                            <td colspan="2">
                                                <p>{{item.check_points.relationship}} | {{item.check_points.contact_name}} | {{item.check_points.key_value}} | {{item.check_points.check_xiaohao}}</p>
                                                <P>{{item.check_points.check_mobile}}</P>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <!--用户信息检测-->
                            <div class="block_text">
                                <h2 class="filter-container tableheader">用户信息检测</h2>
                                <p class="filter-container">联系人数据</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td rowspan="10" style="border-bottom:1px solid #e2e2e2;">
                                                <h4>用户查询信息</h4>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>查询过该用户的相关企业数量</h4>
                                            </td>
                                            <td v-text="operatorreporta.user_info_check.check_search_info.searched_org_cnt">无</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>查询过该用户的相关企业类型</h4>
                                            </td>
                                            <td>
                                                <span style='color: #a94442;' v-for="itm in operatorreporta.user_info_check.check_search_info.searched_org_type">{{itm}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>身份证组合过的其他姓名</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.idcard_with_other_names.length>0">有</span>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.idcard_with_other_names.length==0">无</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>身份证组合过其他电话</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.idcard_with_other_phones.length>0">有</span>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.idcard_with_other_phones.length==0">无</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>电话号码组合过其他姓名</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.phone_with_other_names.length>0">有</span>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.phone_with_other_names.length==0">无</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>电话号码组合过其他身份证</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.phone_with_other_idcards.length>0">有</span>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.phone_with_other_idcards.length==0">无</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>电话号码注册过的相关企业数量</h4>
                                            </td>
                                            <td v-text="operatorreporta.user_info_check.check_search_info.register_org_cnt">

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>电话号码注册过的相关企业类型</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.register_org_type.length>0">有</span>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.register_org_type.length==0">无</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>电话号码出现过的公开网站</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.arised_open_web.length>0">有</span>
                                                <span v-show="operatorreporta.user_info_check.check_search_info.arised_open_web.length==0">无</span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <p class="filter-container">黑名单</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td rowspan="7" style="border-bottom:1px solid #e2e2e2;">
                                                <h4>黑名单信息</h4>
                                            </td>
                                        </tr>
                                        <tr style="background: #f2dede;">
                                            <td>
                                                <h4>黑中介分数</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.phone_gray_score==null">无</span>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.phone_gray_score!=null">
                                                    {{operatorreporta.user_info_check.check_black_info.phone_gray_score}} &nbsp;&nbsp;（分数范围0-100，参考分为10，分数越低关系越紧密）
                                                </span>
                                            </td>
                                        </tr>
                                        <tr style="background: #dff0d8;">
                                            <td>
                                                <h4>直接联系人中黑名单人数</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.contacts_class1_blacklist_cnt==null">无</span>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.contacts_class1_blacklist_cnt!=null">
                                                    {{operatorreporta.user_info_check.check_black_info.contacts_class1_blacklist_cnt}} &nbsp;&nbsp; (直接联系人：和被查询号码有通话记录)
                                                </span>
                                            </td>
                                        </tr>
                                        <tr style="background: #fcf8e3;">
                                            <td>
                                                <h4>间接联系人中黑名单人数</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.contacts_class2_blacklist_cnt==null">无</span>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.contacts_class2_blacklist_cnt!=null">
                                                    {{operatorreporta.user_info_check.check_black_info.contacts_class2_blacklist_cnt}} &nbsp;&nbsp;(间接联系人：和被查询号码的直接联系人有通话记录)
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>直接联系人人数</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.contacts_class1_cnt==null">无</span>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.contacts_class1_cnt!=null">
                                                    {{operatorreporta.user_info_check.check_black_info.contacts_class1_cnt}} &nbsp;&nbsp;(直接联系人：和被查询号码有通话记录)
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>引起黑名单的直接联系人数量</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.contacts_router_cnt==null">无</span>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.contacts_router_cnt!=null">
                                                    {{operatorreporta.user_info_check.check_black_info.contacts_router_cnt}} &nbsp;&nbsp;(直接联系人有和黑名单用户的通讯记录的号码数量)
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h4>直接联系人中引起间接黑名单占比</h4>
                                            </td>
                                            <td>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.contacts_router_ratio==null">无</span>
                                                <span v-show="operatorreporta.user_info_check.check_black_info.contacts_router_ratio!=null">
                                                    {{operatorreporta.user_info_check.check_black_info.contacts_router_ratio}}% &nbsp;&nbsp;(直接联系人有和黑名单用户的通讯记录的号码数量在直接联系人数量中的百分比)
                                                </span>

                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <!--用户行为检测-->
                            <div class="block_text">
                                <h2 class="filter-container tableheader">用户行为检测</h2>
                                <p class="filter-container">用户行为检测</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td>
                                                <h4>检查项</h4>
                                            </td>
                                            <td>
                                                <h4>结果</h4>
                                            </td>
                                            <td>
                                                <h4>依据</h4>
                                            </td>
                                        </tr>
                                        <tr v-for="item in operatorreporta.behavior_check">
                                            <td>{{item.check_point_cn}}</td>
                                            <td>{{item.result}}</td>
                                            <td>{{item.evidence}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <!--运营商消费数据-->
                            <div class="block_text">
                                <h2 class="filter-container tableheader">运营商消费数据</h2>
                                <p class="filter-container">运营商消费数据</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td>
                                                <h4>运营商</h4>
                                            </td>
                                            <td>
                                                <h4>号码</h4>
                                            </td>
                                            <td>
                                                <h4>归属地</h4>
                                            </td>
                                            <td>
                                                <h4>月份</h4>
                                            </td>
                                            <td>
                                                <h4>呼叫次数</h4>
                                            </td>
                                            <td>
                                                <h4>主叫次数</h4>
                                            </td>
                                            <td>
                                                <h4>主叫时间（分钟）</h4>
                                            </td>
                                            <td>
                                                <h4>被叫次数</h4>
                                            </td>
                                            <td>
                                                <h4>被叫时间（分钟）</h4>
                                            </td>
                                            <td>
                                                <h4>短信数量</h4>
                                            </td>
                                            <td>
                                                <h4>话费消费</h4>
                                            </td>
                                        </tr>
                                        <template v-for="item in operatorreporta.cell_behavior">
                                            <tr v-for="itm1 in item.behavior">
                                                <td>{{itm1.cell_operator_zh}}</td>
                                                <td>{{itm1.cell_phone_num}}</td>
                                                <td>{{itm1.cell_loc}}</td>
                                                <td>{{itm1.cell_mth}}</td>
                                                <td>{{itm1.call_cnt}}</td>
                                                <td>{{itm1.call_out_cnt}}</td>
                                                <td>{{itm1.call_out_time}}</td>
                                                <td>{{itm1.call_in_cnt}}</td>
                                                <td>{{itm1.call_in_time}}</td>
                                                <td>{{itm1.sms_cnt}}</td>
                                                <td>{{itm1.total_amount}}</td>
                                            </tr>
                                        </template>
                                    </table>
                                </div>
                            </div>
                            <!--联系人区域汇总-->
                            <div class="block_text">
                                <h2 class="filter-container tableheader">联系人区域汇总</h2>
                                <p class="filter-container">联系人区域汇总</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td>
                                                <h4>地区</h4>
                                            </td>
                                            <td>
                                                <h4>号码次数</h4>
                                            </td>
                                            <td>
                                                <h4>呼入次数</h4>
                                            </td>
                                            <td>
                                                <h4>呼出次数</h4>
                                            </td>
                                            <td>
                                                <h4>呼入时间（分钟）</h4>
                                            </td>
                                            <td>
                                                <h4>呼出时间（分钟）</h4>
                                            </td>
                                            <td>
                                                <h4>呼入次数百分比</h4>
                                            </td>
                                            <td>
                                                <h4>呼出次数百分比</h4>
                                            </td>
                                            <td>
                                                <h4>呼入时间百分比</h4>
                                            </td>
                                            <td>
                                                <h4>呼出时间百分比</h4>
                                            </td>
                                        </tr>
                                        <tr v-for="item in operatorreporta.contact_region">
                                            <td>{{item.region_loc}}</td>
                                            <td>{{item.region_uniq_num_cnt}}</td>
                                            <td>{{item.region_call_in_cnt}}</td>
                                            <td>{{item.region_call_out_cnt}}</td>
                                            <td>{{item.region_call_in_time | forma1}}</td>
                                            <td>{{item.region_call_out_time | forma1}}</td>
                                            <td>{{item.region_call_in_cnt_pct | forma}}%</td>
                                            <td>{{item.region_call_out_cnt_pct | forma}}%</td>
                                            <td>{{item.region_call_in_time_pct | forma}}%</td>
                                            <td>{{item.region_call_out_time_pct | forma}}%</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <!--运营商数据分析-->
                            <div class="block_text">
                                <h2 class="filter-container tableheader">运营商数据分析</h2>
                                <p class="filter-container">通话数据分析</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td>
                                                <h4>号码</h4>
                                            </td>
                                            <td>
                                                <h4>互联网标识</h4>
                                            </td>
                                            <td>
                                                <h4>需求类型</h4>
                                            </td>
                                            <td>
                                                <h4>归属地</h4>
                                            </td>
                                            <td>
                                                <h4>联系人次数</h4>
                                            </td>
                                            <td>
                                                <h4>联系人时间（分）</h4>
                                            </td>
                                            <td>
                                                <h4>主叫次数</h4>
                                            </td>
                                            <td>
                                                <h4>被叫次数</h4>
                                            </td>
                                        </tr>
                                        <template v-for="(item,index) in operatorreporta.contact_list">
                                            <tr>
                                                <td>{{item.phone_num}}</td>
                                                <td>{{item.contact_name}}</td>
                                                <td>{{item.needs_type}}</td>
                                                <td>{{item.phone_num_loc}}</td>
                                                <td>{{item.call_cnt}}</td>
                                                <td>{{item.call_len | forma1}}</td>
                                                <td>{{item.call_out_cnt}}</td>
                                                <td>{{item.call_in_cnt}}</td>
                                            </tr>
                                        </template>
                                    </table>
                                </div>
                            </div>
                            <!--联系人信息和地址信息-->
                            <div class="block_text">
                                <h2 class="filter-container tableheader">联系人信息和地址信息</h2>
                                <p class="filter-container">联系人数据（来源于紧急联系人和电商收货人）</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td>
                                                <h4>联系人</h4>
                                            </td>
                                            <td>
                                                <h4>最早联系时间</h4>
                                            </td>
                                            <td>
                                                <h4>最晚联系时间</h4>
                                            </td>
                                            <td>
                                                <h4>联系电话</h4>
                                            </td>
                                            <td>
                                                <h4>近半年通话</h4>
                                            </td>
                                        </tr>
                                        <tr v-for="item in operatorreporta.collection_contact">
                                            <td>{{item.contact_name}}</td>
                                            <td>{{item.begin_date}}</td>
                                            <td>{{item.end_date}}</td>
                                            <td>
                                                <span v-for="item in item.contact_details">
                                                    {{item.phone_num}}&nbsp;{{item.phone_num_loc}}
                                                </span>
                                            </td>
                                            <td>
                                                <span v-for="item in item.contact_details">
                                                    {{item.call_len | forma}}
                                                </span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <p class="filter-container">地址信息</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td>
                                                <h4>地址</h4>
                                            </td>
                                            <td>
                                                <h4>总消费金额</h4>
                                            </td>
                                            <td>
                                                <h4>收货人姓名</h4>
                                            </td>
                                            <td>
                                                <h4>收货人手机</h4>
                                            </td>
                                        </tr>
                                        <tr v-for="item in operatorreporta.deliver_address">
                                            <td>{{item.address}}</td>
                                            <td>{{item.total_amount}}</td>
                                            <td>{{item.name}}</td>
                                            <td>{{item.phone_num_list}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <!--常用服务-->
                            <div class="block_text">
                                <h2 class="filter-container tableheader">常用服务</h2>
                                <p class="filter-container">常用服务</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td>
                                                <h4>服务企业类型</h4>
                                            </td>
                                            <td>
                                                <h4>企业名称</h4>
                                            </td>
                                            <td>
                                                <h4>总互动次数</h4>
                                            </td>
                                            <td>
                                                <h4>月互动次数</h4>
                                            </td>
                                        </tr>
                                        <tr v-for="item in operatorreporta.main_service">
                                            <td>{{item.company_type}}</td>
                                            <td>{{item.company_name}}</td>
                                            <td>{{item.total_service_cnt}}</td>
                                            <td>
                                                <span style='background: #d9edf7;margin-right: 5px;' v-for="item in item.service_details">{{item.interact_mth}}&nbsp;{{item.interact_cnt}}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <!--电商数据分析-->
                            <div class="block_text">
                                <h2 class="filter-container tableheader">电商数据分析</h2>
                                <p class="filter-container">电商消费记录</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td>
                                                <h4>月份</h4>
                                            </td>
                                            <td>
                                                <h4>全部消费笔数</h4>
                                            </td>
                                            <td>
                                                <h4>全部消费金额</h4>
                                            </td>
                                            <td>
                                                <h4>品类分析</h4>
                                            </td>
                                        </tr>
                                        <tr v-for="item in operatorreporta.business_expense">
                                            <td>{{item.trans_mth}}</td>
                                            <td>{{item.all_count}}</td>
                                            <td>{{item.all_amount}}</td>
                                            <td>{{item.all_category}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <!--出行数据分析-->
                            <div class="block_text">
                                <h2 class="filter-container tableheader">出行数据分析</h2>
                                <p class="filter-container">出行数据</p>
                                <div class="filter-container">
                                    <table class="table table_iphone">
                                        <tr>
                                            <td>
                                                <h4>时间段</h4>
                                            </td>
                                            <td>
                                                <h4>出发时间</h4>
                                            </td>
                                            <td>
                                                <h4>回程时间</h4>
                                            </td>
                                            <td>
                                                <h4>出发地</h4>
                                            </td>
                                            <td>
                                                <h4>目的地</h4>
                                            </td>
                                        </tr>
                                        <tr v-for="item in operatorreporta.trip_info">
                                            <td>{{item.trip_type}}</td>
                                            <td>{{item.trip_start_time}}</td>
                                            <td>{{item.trip_end_time}}</td>
                                            <td>{{item.trip_leave}}</td>
                                            <td>{{item.trip_dest}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="运营辅助报告">
                        <div class="filter-container">
                            <div class="filter-container table_css table_block">
                                <h1>运营商辅助报告</h1>
                                <!--基本信息-->
                                <div class="filter-container">
                                    <div class="table_text">
                                        <div class="fl" style="background: #5ed3b6;">
                                            <div class="left fl">
                                                <h2>基本信息</h2>
                                                <img style="width:150px;left:20px;" :src="OperatorImg.pic_s5" alt="">
                                            </div>
                                            <div class="right fr" style="">
                                                <table class="table">
                                                    <tr>
                                                        <td>姓名</td>
                                                        <td v-text="operatorreportf.user_basic.user_name">无</td>
                                                        <td>身份证号码</td>
                                                        <td v-text="operatorreportf.user_basic.user_idcard">无</td>
                                                    </tr>
                                                    <tr>
                                                        <td>年龄</td>
                                                        <td v-text="operatorreportf.user_basic.user_age">无</td>
                                                        <td>身份证所在地</td>
                                                        <td>
                                                            {{operatorreportf.user_basic.user_province}} {{operatorreportf.user_basic.user_city}} {{operatorreportf.user_basic.user_region}}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>性别</td>
                                                        <td v-text="operatorreportf.user_basic.user_gender">无</td>
                                                        <td>身份所属运营商</td>
                                                        <td v-text="operatorreportf.user_basic.user_phone_operator">无</td>
                                                    </tr>
                                                    <tr>
                                                        <td>手机号码</td>
                                                        <td v-text="operatorreportf.user_basic.user_phone">无</td>
                                                        <td>符合身份证号码编码规范</td>
                                                        <td>
                                                            <span v-if="operatorreportf.user_basic.user_idcard_valid==true">是</span>
                                                            <span v-if="operatorreportf.user_basic.user_idcard_valid==false">否</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--社交特征模块-->
                                <div class="filter-container">
                                    <div class="table_text">
                                        <div class="fl" style="background: #50bfea;">
                                            <div class="left fl">
                                                <h2>社交特征模块</h2>
                                                <img style="left:0px;" :src="OperatorImg.pic_s3" alt="">
                                            </div>
                                            <div class="right fr" style="">
                                                <!--基本社交特征-->
                                                <table class="table">
                                                    <tr>
                                                        <td colspan="2">
                                                            <h3>基本社交特征</h3>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>灰度分</td>
                                                        <td>{{operatorreportf.user_gray.phone_gray_score}}&nbsp;&nbsp;&nbsp;&nbsp;(分数区间为0~100,10分以下为高危人群)</td>
                                                    </tr>
                                                    <tr>
                                                        <td>社交活跃度</td>
                                                        <td>{{operatorreportf.user_gray.social_liveness}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>社交影响力</td>
                                                        <td>{{operatorreportf.user_gray.social_influence}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>是否种子号</td>
                                                        <td>
                                                            <span v-if='operatorreportf.user_gray.has_report==true'>是&nbsp;&nbsp;&nbsp;&nbsp;(是否成功产生过蜜蜂报告)</span>
                                                            <span v-if='operatorreportf.user_gray.has_report==false'>否&nbsp;&nbsp;&nbsp;&nbsp;(是否成功产生过蜜蜂报告)</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>最近活跃时间</td>
                                                        <td>{{operatorreportf.user_gray.recent_active_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}&nbsp;&nbsp;&nbsp;&nbsp;(以下联系人信息的统计窗口在最近活跃时间的前半年内)</td>
                                                    </tr>
                                                    <tr>
                                                        <td>被标记的黑名单分类</td>
                                                        <td>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_category.length == 0">无</span>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_category.length != 0">有</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>姓名和手机是否在黑名单</td>
                                                        <td>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_name_with_phone == false">否</span>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_name_with_phone == true">是</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>姓名和手机黑名单信息更新时间</td>
                                                        <td>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_update_time_name_idcard== ''">无数据</span>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_update_time_name_idcard!= ''">{{operatorreportf.user_blacklist.blacklist_update_time_name_idcard}}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>身份证和姓名是否在黑名单</td>
                                                        <td>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_name_with_idcard == false">否</span>

                                                            <span v-show="operatorreportf.user_blacklist.blacklist_name_with_idcard == true">是</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>身份证和姓名和名单信息更新时间</td>
                                                        <td>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_update_time_name_phone == ''">无数据</span>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_update_time_name_phone != ''">{{operatorreportf.user_blacklist.blacklist_update_time_name_phone}}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>黑名单详细信息</td>
                                                        <td>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_details == 0">无数据</span>
                                                            <span v-show="operatorreportf.user_blacklist.blacklist_details != 0">{{operatorreportf.user_blacklist.blacklist_details}}</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--联系人数相关字段-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>联系人数相关字段</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>主动联系人</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_to_all}}</td>
                                                            <td>主动联系人数在群体中的百分比</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_to_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>主动联系的黑号数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_to_black}}</td>
                                                            <td>主动联系的黑号数在群体中的百分比</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_to_black | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>主动联系人中曾为申请人的人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_to_applied}}</td>
                                                            <td>主动联系人中曾为申请人的人数在群体中的百分比</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_to_applied | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>被动联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_be_all}}</td>
                                                            <td>被动联系人数在群体中的百分比</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_be_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>被动联系的黑号数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_be_black}}</td>
                                                            <td>被动联系的黑号数在群体中的百分比</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_be_black | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>被动联系人中曾为申请人的人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_be_applied}}</td>
                                                            <td>被动联系人中曾为申请人的人数在群体中的百分比</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_to_applied | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>一阶联系人总数(主动、被动联系人数合并去重)</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_all}}</td>
                                                            <td>一阶联系人数在群体中的百分位</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>一阶联系(直接联系)黑号总数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_black}}</td>
                                                            <td>一阶联系黑号数在群体中的百分位</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_black | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>二阶联系(间接联系)黑号总数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_black2}}</td>
                                                            <td>二阶联系黑号总数在群体中的百分位</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_black2 | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>联系人曾为申请人的人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_applied}}</td>
                                                            <td>联系人曾为申请人的人数在群体中的百分位</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_applied | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>一阶联系人黑号数占比</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.black_ratio | forma}}%</td>
                                                            <td>一阶联系人黑号数占比在群体中的百分位</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_black_ratio | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>引起黑名单的一阶联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.cnt_router}}</td>
                                                            <td>引起黑名单的一阶联系人数在群体中的百分位</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_cnt_router | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>引起黑名单的一阶联系人数占比</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.router_ratio | forma}}%</td>
                                                            <td>引起黑名单的一阶联系人数占比在群体中百分位</td>
                                                            <td>{{operatorreportf.user_gray.contacts_number_statistic.pct_router_ratio | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--联系权重R、F、M相关字段-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>联系权重R、F、M相关字段</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>与所有联系人的最近主动通话时间</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.recent_time_to_all | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
                                                            <td>与所有联系人的最近被动通话时间</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.recent_time_be_all | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与黑号的最近主动通话时间</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.recent_time_to_black | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
                                                            <td>与黑号的最近被动通话时间</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.recent_time_be_black | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与申请人的最近主动通话时间</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.recent_time_to_applied | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
                                                            <td>与申请人的最近被动通话时间</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.recent_time_be_applied | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与所有联系人的主动总通话次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.call_cnt_to_all}}</td>
                                                            <td>与所有联系人的被动总通话次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.call_cnt_be_all}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与黑号的主动总通话次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.call_cnt_to_black}}</td>
                                                            <td>与黑号的被动总通话次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.call_cnt_be_black}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与申请人的主动通话次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.call_cnt_to_applied}}</td>
                                                            <td>与申请人的被动通话次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.call_cnt_be_applied}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与所有联系人的主动总通话时长(秒)</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.time_spent_to_all}}</td>
                                                            <td>与所有联系人的被动总通话时长(秒)</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.time_spent_be_all}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与黑号的主动通话时长(秒)</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.time_spent_to_black}}</td>
                                                            <td>与黑号的被动通话时长(秒)</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.time_spent_be_black}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与申请人的主动通话时长(秒)</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.time_spent_to_applied}}</td>
                                                            <td>与申请人的被动通话时长(秒)</td>
                                                            <td>{{operatorreportf.user_gray.contacts_rfm.time_spent_be_applied}}</td>
                                                        </tr>
                                                    </table>
                                                </div>

                                                <!--与联系人的最大亲密度-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>与联系人的最大亲密度</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>与所有联系人的最大主动联系亲密度</td>
                                                            <td>{{operatorreportf.user_gray.contacts_closest.weight_to_all}}</td>
                                                            <td>与所有联系人的最大被动联系亲密度</td>
                                                            <td>{{operatorreportf.user_gray.contacts_closest.weight_be_all}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与所有联系人的最大互动联系亲密度</td>
                                                            <td>{{operatorreportf.user_gray.contacts_closest.weight_all}}</td>
                                                            <td>与黑号的最大主动联系亲密度</td>
                                                            <td>{{operatorreportf.user_gray.contacts_closest.weight_to_black}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与黑号的最大被动联系亲密度</td>
                                                            <td>{{operatorreportf.user_gray.contacts_closest.weight_be_black}}</td>
                                                            <td>与黑号的最大互动联系亲密度</td>
                                                            <td>{{operatorreportf.user_gray.contacts_closest.weight_black}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与申请人的最大主动联系亲密度</td>
                                                            <td>{{operatorreportf.user_gray.contacts_closest.weight_to_applied}}</td>
                                                            <td>与申请人的最大被动联系亲密度</td>
                                                            <td>{{operatorreportf.user_gray.contacts_closest.weight_be_applied}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>与申请人的最大互动联系亲密度</td>
                                                            <td>{{operatorreportf.user_gray.contacts_closest.weight_applied}}</td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr>

                                                    </table>
                                                </div>

                                                <!--联系人灰度分信息-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>联系人灰度分信息</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>主动联系最亲密联系人的灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.most_familiar_to_all}}</td>
                                                            <td>被动联系最亲密联系人的灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.most_familiar_be_all}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>互动联系最亲密联系人的灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.most_familiar_all}}</td>
                                                            <td>主动联系最亲密申请人的灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.most_familiar_to_applied}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>被动联系最亲密申请人的灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.most_familiar_be_applied}}</td>
                                                            <td>被动联系最亲密申请人的灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.most_familiar_applied}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>主动联系的联系人的最高灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.to_max}}</td>
                                                            <td>主动联系的联系人的平均灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.to_mean}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>主动联系的联系人的最低灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.to_min}}</td>
                                                            <td>被动联系的联系人的最高灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.be_max}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>被动联系的联系人的平均灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.be_mean}}</td>
                                                            <td>被动联系的联系人的平均灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.be_min}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>联系人的最高灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.max}}</td>
                                                            <td>联系人的最高灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.mean}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>联系人的最低灰度分</td>
                                                            <td>{{operatorreportf.user_gray.contacts_gray_score.min}}</td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--联系人的分布-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>联系人的分布</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>主动联系的亲密联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_relation_distribution.to_is_familiar}}</td>
                                                            <td>主动联系的中等亲密联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_relation_distribution.to_median_familiar}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>主动联系的非亲密联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_relation_distribution.to_not_familiar}}</td>
                                                            <td>被动联系的亲密联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_relation_distribution.be_is_familiar}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>被动联系的中等亲密联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_relation_distribution.be_median_familiar}}</td>
                                                            <td>被动联系的非亲密联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_relation_distribution.be_not_familiar}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>互动联系的亲密联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_relation_distribution.is_familiar}}</td>
                                                            <td>互动联系的中等亲密联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_relation_distribution.median_familiar}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>互动联系的非亲密联系人数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_relation_distribution.not_familiar}}</td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--联系人的查询历史-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>联系人的查询历史</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>主动联系的人的最近一次查询时间</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_recent_query_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
                                                            <td>被动联系的人的最近一次查询时间</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_recent_query_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前半月内主动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_query_cnt_05}}</td>
                                                            <td>前半月内被动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_org_cnt_05}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前半月内被动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_query_cnt_05}}</td>
                                                            <td>前半月内联系人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_org_cnt_05}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前半月内联系人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.query_cnt_05}}</td>
                                                            <td>前半月内联系人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.org_cnt_05}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前1月内主动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_query_cnt_1}}</td>
                                                            <td>前1月内主动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_org_cnt_1}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前1月内被动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_query_cnt_1}}</td>
                                                            <td>前1月内被动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_org_cnt_1}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前1月内联系人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.query_cnt_1}}</td>
                                                            <td>前1月内联系人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.org_cnt_1}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前2月内主动联系的人的查询次数 </td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_query_cnt_2}}</td>
                                                            <td>前2月内主动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_org_cnt_2}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前2月内被动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_query_cnt_2}}</td>
                                                            <td>前2月内被动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_org_cnt_2}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前2月内联系人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.query_cnt_2}}</td>
                                                            <td>前2月内联系人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.org_cnt_2}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前3月内主动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_query_cnt_3}}</td>
                                                            <td>前3月内主动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_org_cnt_3}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前3月内被动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_query_cnt_3}}</td>
                                                            <td>前3月内被动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_org_cnt_3}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前3月内联系人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.query_cnt_3}}</td>
                                                            <td>前3月内联系人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.org_cnt_3}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前6月内主动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_query_cnt_6}}</td>
                                                            <td>前6月内主动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_org_cnt_6}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前6月内被动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_query_cnt_6}}</td>
                                                            <td>前6月内被动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_org_cnt_6}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前6月内联系人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.query_cnt_6}}</td>
                                                            <td>前6月内联系人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.org_cnt_6}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前9月内主动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_query_cnt_9}}</td>
                                                            <td>前9月内主动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_org_cnt_9}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前9月内被动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_query_cnt_9}}</td>
                                                            <td>前9月内被动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_org_cnt_9}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前9月内联系人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.query_cnt_9}}</td>
                                                            <td>前9月内联系人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.org_cnt_9}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前12月内主动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_query_cnt_12}}</td>
                                                            <td>前12月内主动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.to_org_cnt_12}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前12月内被动联系的人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_query_cnt_12}}</td>
                                                            <td>前12月内被动联系的人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.be_org_cnt_12}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>前12月内联系人的查询次数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.query_cnt_12}}</td>
                                                            <td>前12月内联系人的查询机构数</td>
                                                            <td>{{operatorreportf.user_gray.contacts_query.org_cnt_12}}</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--手机存疑-->
                                <div class="filter-container">
                                    <div class="table_text">
                                        <div class="fl" style="background: #f37e53;">
                                            <div class="left fl">
                                                <h2>手机存疑</h2>
                                                <img style="left:15px;" :src="OperatorImg.pic_s6" alt="">
                                            </div>
                                            <div class="right fr">
                                                <table class="table">
                                                    <!---->
                                                    <thead>
                                                        <tr>
                                                            <td>使用过此手机的其他姓名</td>
                                                            <td>最后使用时间</td>
                                                        </tr>
                                                    </thead>
                                                    <tr>
                                                        <td colspan='2' v-show="operatorreportf.user_phone_suspicion.phone_with_other_names.length == 0">无</td>
                                                        <td colspan='2' v-show="operatorreportf.user_phone_suspicion.phone_with_other_names.length != 0">有</td>
                                                    </tr>
                                                    <!---->
                                                    <thead>
                                                        <tr>
                                                            <td>使用过此手机的其他身份证</td>
                                                            <td>最后使用时间</td>
                                                        </tr>
                                                    </thead>
                                                    <tr>
                                                        <td colspan='2' v-show="operatorreportf.user_phone_suspicion.phone_with_other_idcards.length == 0">无</td>
                                                        <td colspan='2' v-show="operatorreportf.user_phone_suspicion.phone_with_other_idcards.length != 0">有</td>
                                                    </tr>
                                                    <!---->
                                                    <thead>
                                                        <tr>
                                                            <td>提供数据的机构类型</td>
                                                            <td>最后使用时间</td>
                                                        </tr>
                                                    </thead>
                                                    <tr v-for="item in operatorreportf.user_phone_suspicion.phone_applied_in_orgs">
                                                        <td>{{item.susp_org_type}}</td>
                                                        <td>{{item.susp_updt}}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--身份证存疑-->
                                <div class="filter-container">
                                    <div class="table_text">
                                        <div class="fl" style="background: #a3cda5;">
                                            <div class="left fl">
                                                <h2>身份证存疑</h2>
                                                <img style="left:15px;" :src="OperatorImg.pic_s6" alt="">
                                            </div>
                                            <div class="right fr">
                                                <table class="table">
                                                    <!---->
                                                    <thead>
                                                        <tr>
                                                            <td colspan="2">使用过此身份证的其他姓名</td>
                                                            <td colspan="2">最后使用时间</td>
                                                        </tr>
                                                    </thead>
                                                    <tr>
                                                        <td colspan='4' v-show="operatorreportf.user_idcard_suspicion.idcard_with_other_names.length == 0">无</td>
                                                        <td colspan='4' v-show="operatorreportf.user_idcard_suspicion.idcard_with_other_names.length != 0">有</td>
                                                    </tr>
                                                    <!---->
                                                    <thead>
                                                        <tr>
                                                            <td>使用过此手机的其他身份证</td>
                                                            <td>最后使用时间</td>
                                                            <td>运营商名称</td>
                                                            <td>归属地</td>
                                                        </tr>
                                                    </thead>
                                                    <tr>
                                                        <td colspan='4' v-show="operatorreportf.user_idcard_suspicion.idcard_with_other_phones.length == 0">无</td>
                                                        <td colspan='4' v-show="operatorreportf.user_idcard_suspicion.idcard_with_other_phones.length != 0">有</td>
                                                    </tr>
                                                    <!---->
                                                    <thead>
                                                        <tr>
                                                            <td colspan="2">提供数据的机构类型</td>
                                                            <td colspan="2">最后使用时间</td>
                                                        </tr>
                                                    </thead>
                                                    <tr v-for="item in operatorreportf.user_idcard_suspicion.idcard_applied_in_orgs">
                                                        <td colspan="2">{{item.susp_org_type}}</td>
                                                        <td colspan="2">{{item.susp_updt}}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--机构历史查询-->
                                <div class="filter-container">
                                    <div class="table_text">
                                        <div class="fl" style="background: #fdbe51;">
                                            <div class="left fl">
                                                <h2>机构历史查询</h2>
                                                <img style="left:10px;" :src="OperatorImg.pic_s4" alt="">
                                            </div>
                                            <div class="right fr">
                                                <table class="table">
                                                    <!---->
                                                    <thead>
                                                        <tr>
                                                            <td>查询机构数</td>
                                                            <td colspan="2">13 (历史查询机构统计-已去重)</td>
                                                        </tr>
                                                    </thead>
                                                    <tr>
                                                        <td>查询日期</td>
                                                        <td>机构类型</td>
                                                        <td>是否是本机构查询</td>
                                                    </tr>
                                                    <tr v-for="item in operatorreportf.user_searched_history_by_orgs">
                                                        <td>{{item.searched_date}}</td>
                                                        <td>{{item.searched_org}}</td>
                                                        <td v-show="item.org_self==true">是</td>
                                                        <td v-show="item.org_self==false">否</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--历史查询记录-->
                                <div class="filter-container">
                                    <div class="table_text">
                                        <div class="fl" style="background: #52c7d3;">
                                            <div class="left fl">
                                                <h2>历史查询记录</h2>
                                                <img style="left:10px;" :src="OperatorImg.query_history" alt="">
                                            </div>
                                            <div class="right fr">
                                                <table class="table">
                                                    <!---->
                                                    <tr>
                                                        <td colspan="4">
                                                            <h3>7天内历史查询</h3>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>查询次数</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.cnt}}</td>
                                                        <td>查询机构数</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.cnt_org}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>现金贷查询次数</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.cnt_cash}}</td>
                                                        <td>现金贷查询机构数</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.cnt_org_cash}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>消费分期查询次数</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.cnt_cf}}</td>
                                                        <td>消费分期查询机构数</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.cnt_org_cf}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>信用卡代还查询次数</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.cnt_cc}}</td>
                                                        <td>信用卡代还查询机构数</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.cnt_org_cc}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>查询次数在总体查询分布中的百分位</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.pct_cnt_all | forma}}%</td>
                                                        <td>查询机构数在总体查询分布中的百分位</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.pct_cnt_org_all | forma}}%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>查询次数在现金贷查询分布中的百分位</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.pct_cnt_cash | forma}}%</td>
                                                        <td>查询机构数在现金贷查询分布中的百分位</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.pct_cnt_org_cash | forma}}%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>查询次数在消费分期查询分布中的百分位</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.pct_cnt_cf | forma}}%</td>
                                                        <td>查询机构数在消费分期查询分布中的百分位</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.pct_cnt_org_cf | forma}}%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.pct_cnt_cc | forma}}%</td>
                                                        <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                        <td>{{operatorreportf.user_searched_history_by_day.d_7.pct_cnt_org_cc | forma}}%</td>
                                                    </tr>
                                                </table>
                                                <!--15-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>15天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_15.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--30-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>30天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_30.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--60-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>60天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_60.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--90-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>90天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.d_90.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--120-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>120天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_4.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--150-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>150天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_5.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--180-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>180天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_6.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--270-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>270天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_9.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--360-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>360天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_12.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--540-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>540天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_18.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!--720-->
                                                <div class="filter-container">
                                                    <table class="table">
                                                        <tr>
                                                            <td colspan="4">
                                                                <h3>720天内历史查询</h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.cnt}}</td>
                                                            <td>查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.cnt_org}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>现金贷查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.cnt_cash}}</td>
                                                            <td>现金贷查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.cnt_org_cash}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>消费分期查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.cnt_cf}}</td>
                                                            <td>消费分期查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.cnt_org_cf}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>信用卡代还查询次数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.cnt_cc}}</td>
                                                            <td>信用卡代还查询机构数</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.cnt_org_cc}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.pct_cnt_all | forma}}%</td>
                                                            <td>查询机构数在总体查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.pct_cnt_org_all | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.pct_cnt_cash | forma}}%</td>
                                                            <td>查询机构数在现金贷查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.pct_cnt_org_cash | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.pct_cnt_cf | forma}}%</td>
                                                            <td>查询机构数在消费分期查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.pct_cnt_org_cf | forma}}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>查询次数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.pct_cnt_cc | forma}}%</td>
                                                            <td>查询机构数在信用卡代还查询分布中的百分位</td>
                                                            <td>{{operatorreportf.user_searched_history_by_day.m_24.pct_cnt_org_cc | forma}}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--注册信息-->
                                <div class="filter-container">
                                    <div class="table_text">
                                        <div class="fl" style="background: #e0b482;">
                                            <div class="left fl">
                                                <h2>注册信息</h2>
                                                <img style="width:150px;left:20px;" :src="OperatorImg.pic_s5" alt="">
                                            </div>
                                            <div class="right fr" style="">
                                                <table class="table">
                                                    <tr>
                                                        <td colspan="3">
                                                            <h3>基本社交特征</h3>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td rowspan="2" style="border-bottom: 1px solid #e2e2e2;">注册APP统计</td>
                                                        <td>APP类型</td>
                                                        <td>
                                                            <span v-show="operatorreportf.user_register_orgs.register_orgs_statistics.length!=0">有</span>
                                                            <span v-show="operatorreportf.user_register_orgs.register_orgs_statistics.length==0">无</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>注册数量</td>
                                                        <td>
                                                            <span v-show="operatorreportf.user_register_orgs.register_orgs_statistics.length!=0">有</span>
                                                            <span v-show="operatorreportf.user_register_orgs.register_orgs_statistics.length==0">无</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--消费标签信息-->
                                <div class="filter-container">
                                    <div class="table_text">
                                        <div class="fl" style="background: #5CCBD7;">
                                            <div class="left fl">
                                                <h2>消费标签信息</h2>
                                                <img style="width:150px;left:0px;" :src="OperatorImg.labelling" alt="">
                                            </div>
                                            <div class="right fr" style="">
                                                <table class="table">
                                                    <tr>
                                                        <td>是否有信用卡</td>
                                                        <td>
                                                            <span v-show="operatorreportf.consumer_label.if_own_cc==1">有</span>
                                                            <span v-show="operatorreportf.consumer_label.if_own_cc!=1">无</span>
                                                        </td>
                                                        <td>是否有白金卡</td>
                                                        <td>
                                                            <span v-show="operatorreportf.consumer_label.if_own_wg_cc==1">有</span>
                                                            <span v-show="operatorreportf.consumer_label.if_own_wg_cc!=1">无</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>是否有车</td>
                                                        <td>
                                                            <span v-show="operatorreportf.consumer_label.if_own_car==1">有</span>
                                                            <span v-show="operatorreportf.consumer_label.if_own_car!=1">无</span>
                                                        </td>
                                                        <td>是否购买保险产品</td>
                                                        <td>
                                                            <span v-show="operatorreportf.consumer_label.if_pay_ins==1">有</span>
                                                            <span v-show="operatorreportf.consumer_label.if_pay_ins!=1">无</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>是否购买理财产品</td>
                                                        <td>
                                                            <span v-show="operatorreportf.consumer_label.if_fin_buy_pre6==1">有</span>
                                                            <span v-show="operatorreportf.consumer_label.if_fin_buy_pre6!=1">无</span>
                                                        </td>
                                                        <td>消费能力指数</td>
                                                        <td>{{operatorreportf.consumer_label.cst_score_finally}}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="黑名单报告" name="second">
                <div class="filter-container">
                    <el-tabs type="card" @tab-click="blacklistTab">
                        <el-tab-pane label="黑名单">
                            <table class="table">
                                <tr>
                                    <td>触碰规则id</td>
                                    <td>触碰规则名称</td>
                                </tr>
                                <tr v-for=" item in writeList">
                                    <td v-text="item.ruleId"></td>
                                    <td v-text="item.ruleName"></td>
                                </tr>
                            </table>
                        </el-tab-pane>
                        <el-tab-pane label="本地黑名单库">
                            <table class="table">
                                <tr>
                                    <td>是否命中</td>
                                    <td>业务员</td>
                                    <td>初审</td>
                                    <td>门店经理</td>
                                    <td>渠道</td>
                                </tr>
                                <tr v-show="blankList.bussinessName">
                                    <td>是</td>
                                    <td v-text="blankList.bussinessName"></td>
                                    <td v-text="blankList.trustName"></td>
                                    <td v-text="blankList.storeManagerName"></td>
                                    <td></td>
                                </tr>
                            </table>
                        </el-tab-pane>
                        <el-tab-pane label="关联关系">
                            <table class="table">
                                <tr>
                                    <td>姓名</td>
                                    <td>手机号</td>
                                    <td>通话次数</td>
                                    <td>主叫</td>
                                    <td>被叫</td>
                                    <td>订单状态</td>
                                    <td>业务员</td>
                                    <td>逾期天数</td>
                                    <td>订单时间</td>
                                </tr>
                                <tr v-for="item in blankList3">
                                    <td v-text="item.name"></td>
                                    <td v-text="item.phone"></td>
                                    <td v-text="item.callCnt"></td>
                                    <td v-text="item.callOutCnt"></td>
                                    <td v-text="item.callInCnt"></td>
                                    <td>
                                        <span v-show="item.status == 31">提前一般结清</span>
                                        <span v-show="item.status == 32">提前特殊结清</span>
                                        <span v-show="item.status == 40">逾期正常结清</span>
                                        <span v-show="item.status == 41">逾期一般结清</span>
                                        <span v-show="item.status == 42">逾期特殊结清</span>
                                        <span v-show="item.status == 999">逾期中</span>
                                    </td>
                                   	<td v-text="item.adminName"></td>
									<td v-text="item.overDays"></td>
									<td>{{item.create_time}}</td>
                                </tr>
                            </table>
                        </el-tab-pane>
                         <el-tab-pane label="黑名单二">
                            <div class="blacklist_layer">
								
								<table class="table table-striped" style="border-top:0">
									<tr v-for = 'itm in blankList2.content.信用报告头'>
                                        <td colspan="2" class="tabheader">
											<span class="reportid">报告时间:</span>
											<span class="reportidtext" id="reportTimes">{{itm.报告时间}}</span>
										</td>
									</tr>
								</table>
								<!--个人基本信息-->
								<div class="personinfo">
									<ul class="top_title  top_linelist">
										<li class="top_line"></li>
										<li class="top_centertext">个人基本信息</li>
										<li class="top_line"></li>
									</ul>
									<table class="table table-striped" style="border-top:0;table-layout: fixed;">
										<tr>
											<td colspan="2">
												<span class="itemtitle">姓名:</span>
                                                <span id="baseinfoName" v-text='blankList2.content.个人身份信息.姓名'></span>
											</td>
											<td colspan="2">
												<span class="itemtitle">证件号码:</span>
												<span id="baseinfoId" v-text='blankList2.content.个人身份信息.证件号码'>无</span>
											</td>
										</tr>
										<tr>
											<td colspan="2">
												<span class="itemtitle">性别:</span>
												<span id="baseinfoSex" v-text='blankList2.content.个人身份信息.性别'>无</span>
											</td>
											<td colspan="2">
												<span class="itemtitle">出生日期:</span>
												<span id="baseinfoBirth" v-text='blankList2.content.个人身份信息.出生日期'>无</span>
											</td>
										</tr>
										<tr>
											<td colspan="4" align="right">
												<span class="itemtitle">信息获取日期</span>
											</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.婚姻状况'>
											<td colspan="2">
												<span class="itemtitle">婚姻状况</span>
												<span id="maritalStatus">{{itm.婚姻明细}}</span>
											</td>
											<td colspan="2" align="right" id="baseinfoTime">{{itm.信息获取日期}}</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.最高学历'>
											<td colspan="2">
												<span class="itemtitle">最高学历</span>
												<span id="highestEducation">{{itm.学历明细}}</span>
											</td>
											<td colspan="2" align="right" id="highestEducationTime">{{itm.信息获取日期}}</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.职称'>
											<td colspan="2">
												<span class="itemtitle">职称</span>
												<span id="titleName">{{itm.职称明细}}</span>
											</td>
											<td colspan="2" align="right" id="titleNameDate">{{itm.信息获取日期}}</td>
										</tr>

										<tr v-for = 'itm in blankList2.content.个人身份信息.住宅电话'>
											<td colspan="2">
												<span class="itemtitle">住宅电话</span>
                                                <span id="homephone">{{itm.住宅电话明细}}</span>
											</td>
											<td colspan="2" align="right" id="homephoneTime">{{itm.信息获取日期}}</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.手机号码'>
											<td colspan="2">
												<span class="itemtitle">手机号码</span>
												<span id="phonenumber">{{itm.手机号码明细}}</span>
											</td>
											<td colspan="2" align="right" id="phonenumberDate">{{itm.信息获取日期}}</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.电子邮箱'>
											<td colspan="2">
												<span class="itemtitle">电子邮箱</span>
												<span id="maildata">{{itm.电子邮箱明细}}</span>
											</td>
											<td colspan="2" align="right" id="maildataDate">{{itm.信息获取日期}}</td>
										</tr>
										<!--信息获取日期-->
										<tr>
											<td colspan="2">
												<span class="itemtitle">住址</span>
											</td>
											<td colspan="2" align="right">
												<span class="itemtitle">信息获取日期</span>
											</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.地址'>
											<td colspan="2">
												<span id="addressdataid">{{itm.地址序号}}</span>
												<span id="addressdata">{{itm.地址明细}}</span>
											</td>
											<td colspan="2" align="right" id="addressdataDate">{{itm.信息获取日期}}</td>
										</tr>
										<!--职业信息-->
										<tr>
											<td colspan="4" align="right">
												<span class="itemtitle">职业信息</span>
											</td>
										</tr>
										<tr>
											<td colspan="2">
												<span class="itemtitle">工作单位</span>
											</td>
											<td>
												<span class="itemtitle">职业</span>
											</td>
											<td align="right">
												<span class="itemtitle">信息获取日期</span>
											</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.工作单位'>
											<td colspan="2">
                                                <span id="companyinfodataid">{{itm.工作序号}}</span>
												<span id="companyinfodata">{{itm.工作明细}}</span>
											</td>
											<td id="companyinfodatatitle">{{itm.职业}}</td>
											<td align="right" id="companyinfodataDate">{{itm.信息获取日期}}</td>
										</tr>
										<!--配偶信息-->
										<tr>
											<td colspan="4" align="left">
												<span class="itemtitle">配偶信息</span>
											</td>
										</tr>
										<tr>
											<td colspan="2">
												<span class="itemtitle">配偶姓名</span>
												<span id="spouseName" v-text='blankList2.content.个人身份信息.配偶姓名'>无</span>
											</td>
											<td colspan="2" align="left">
												<span class="itemtitle">证件号码</span>
												<span id="spouseNamenumber" v-text='blankList2.content.个人身份信息.配偶证件号码'>无</span>
											</td>
										</tr>
										<tr>
											<td colspan="2">
												<span class="itemtitle">配偶性别</span>
												<span id="spouseSex" v-text='blankList2.content.个人身份信息.配偶性别'>无</span>
											</td>
											<td colspan="2" align="left">
												<span class="itemtitle">配偶出生日期</span>
												<span id="spouseBirth" v-text='blankList2.content.个人身份信息.配偶出生日期'>无</span>
											</td>
										</tr>
										<!--配偶信息 二   -->
										<tr>
											<td colspan="4" align="left">
												<span class="itemtitle">配偶工作信息</span>
											</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.配偶工作单位'>
											<td colspan="2">
												<span class="itemtitle">配偶工作单位</span>
												<span id="spouseCompany">{{itm.配偶工作单位明细}}</span>
											</td>
											<td colspan="2" align="right">
												<span id="spouseCompanyDate">{{itm.信息获取日期}}</span>
											</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.配偶联系电话'>
											<td colspan="2">
												<span class="itemtitle">配偶联系电话</span>
												<span id="spouseHomephone">{{itm.配偶联系电话明细}}</span>
											</td>
											<td colspan="2" align="right">
												<span id="spouseHomephonedate">{{itm.信息获取日期}}</span>
											</td>
										</tr>
										<!--第一联系人 第二联系人-->
										<tr>
											<td colspan="">
												<span class="itemtitle">联系人姓名</span>
											</td>
											<td colspan="1" align="">
												<span class="itemtitle">联系人关系 </span>
											</td>
											<td colspan="1" align="">
												<span class="itemtitle">联系电话 </span>
											</td>
											<td colspan="">
												<span class="itemtitle">信息获取日期</span>
											</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.第一联系人信息'>
											<td colspan="">
                                                <span id="firstContactName">{{itm.联系人姓名}}</span>
											</td>
											<td colspan="1" align="">
												<span class="firstContactRelationship">{{itm.联系人关系}}</span>
											</td>
											<td colspan="">
												<span id="firstContactphone">{{itm.联系电话}}</span>
											</td>
											<td colspan="1" align="">
												<span id="firstContactDate">{{itm.信息获取日期}}</span>
											</td>
										</tr>
										<tr>
											<td colspan="">
												<span class="itemtitle">联系人姓名</span>
											</td>
											<td colspan="1" align="">
												<span class="itemtitle">联系人关系 </span>
											</td>
											<td colspan="">
												<span class="itemtitle">联系电话 </span>
											</td>
											<td colspan="1" align="">
												<span class="itemtitle">信息获取日期</span>
											</td>
										</tr>
										<tr v-for = 'itm in blankList2.content.个人身份信息.第二联系人信息'>
											<td colspan="">
                                                <span id="secondContactName">{{itm.联系人姓名}}</span>
											</td>
											<td colspan="1" align="">
												<span id="secondContactRelationship">{{itm.联系人关系}}</span>
											</td>
											<td colspan="">
												<span id="secondContactphone">{{itm.联系电话}}</span>
											</td>
											<td colspan="1" align="">
												<span id="secondContactDate">{{itm.信息获取日期}}</span>
											</td>
										</tr>

									</table>
								</div>
								<!--借款申请信息-->
								<div>
									<ul class="top_title top_linelist">
										<li class="top_line"></li>
										<li class="top_centertext">借款申请信息</li>
										<li class="top_line"></li>
									</ul>
									<table class="table table-striped" style="border-top:0;table-layout: fixed;">
										<tr>
											<td class="tabheader">申请机构</td>
											<td class="tabheader">申请时间</td>
											<td class="tabheader">申请金额</td>
											<td class="tabheader">申请月数</td>
											<td class="tabheader">申请类型</td>
											<td class="tabheader">申请状态</td>
											<td class="tabheader">信息获取日期</td>
										</tr>
										<tr v-for='itm in blankList2.content.贷款申请信息.贷款申请信息记录'>
                                            <td id="loanapplicationName">{{itm.申请机构}}</td>
											<td id="loanapplicationdate">{{itm.申请时间}}</td>
											<td id="loanapplicationmoney">{{itm.申请金额}}</td>
											<td id="loanapplicationonth">{{itm.申请月数}}</td>
											<td id="loanapplicationtype">{{itm.申请类型}}</td>
											<td id="loanapplicationstate">{{itm.申请状态}}</td>
											<td id="loanapplicationtime">{{itm.信息获取日期}}</td>
										</tr>
									</table>
								</div>
								<!--借款交易信息-->
								<div class="">
									<ul class="top_title top_linelist">
										<li class="top_line"></li>
										<li class="top_centertext">借款交易信息</li>
										<li class="top_line"></li>
									</ul>
									<table class="table table-striped" style="border-top:0;table-layout: fixed;">
                                        <template v-for="itm in blankList2.content.贷款交易信息.信息概要">
										<tr>
											<td class="tabheader" colspan="2">未结清借款笔数:</td>
											<td class="tabheader">首贷日:</td>
											<td class="tabheader">最大授信额度:</td>
											<td class="tabheader">借款总额:</td>
											<td class="tabheader">借款余额:</td>
											<td class="tabheader">协定月还款:</td>
										</tr>
                                       
										<tr>
                                            <td colspan="2" id="loantransactioncount">{{itm.贷款笔数}}</td>
											<td id="loantransactiontime">{{itm.首贷日}}</td>
											<td id="loantransactionquotamax">{{itm.最大授信额度}}</td>
											<td id="loantransactiontotal">{{itm.贷款总额}}</td>
											<td id="loantransactionbalance">{{itm.贷款余额}}</td>
											<td id="loantransaction_monthlyrepayment">{{itm.协定月还款}}</td>
										</tr>
										<tr>
											<td class="tabheader">当前逾期总额:</td>
											<td class="tabheader">最高逾期金额:</td>
											<td class="tabheader">最高逾期期数:</td>
											<td></td>
											<!--占位节点 -->
											<td></td>
											<td></td>
											<td></td>
										</tr>
                                        
										<tr>
											<td id="currentoverdue">{{itm.当前逾期总额}}</td>
											<td id="maxoverdue">{{itm.最高逾期金额}}</td>
											<td id="numberoverdue">{{itm.最高逾期期数}}</td>
                                            <!--占位节点 -->
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
                                        </template>

                                        <template v-for="itm in blankList2.content.贷款交易信息.贷款">
										<tr>
											<td class="tabheader">借款项目</td>
											<td class="tabheader">机构名称</td>
											<td class="tabheader">授信额度</td>
											<td class="tabheader">担保方式</td>
											<td class="tabheader">开户日期</td>
											<td class="tabheader">币种</td>
											<td class="tabheader">发生地</td>
										</tr>
										<tr>
											<td id="loanprojectname">{{itm.贷款项目}}</td>
											<td id="loanprojectcompany">{{itm.机构名称}}</td>
											<td id="loanprojectcreditline">{{itm.授信额度}}</td>
											<td id="loanprojecttype">{{itm.担保方式}}</td>
											<td id="loanprojectdate">{{itm.开户日期}}</td>
											<td id="loanprojectcurrency">{{itm.币种}}</td>
											<td id="loanprojectnow">{{itm.发生地}}</td>
										</tr>
										<tr>
											<td class="tabheader">共享授信额度</td>
											<td class="tabheader">最大负债额</td>
											<td class="tabheader">还款频率</td>
											<td class="tabheader">期末借款余额</td>
											<td class="tabheader">剩余还款月数</td>
											<td class="tabheader">本月应还款日期</td>
											<td class="tabheader">本月应还款金额</td>
										</tr>
										<tr>
											<td id="sharedcreditline">{{itm.共享授信额度}}</td>
											<td id="sharemaximumliabilities">{{itm.最大负债额}}</td>
											<td id="sharemonth">{{itm.还款频率}}</td>
											<td id="sharefinalbalance">{{itm.期末贷款余额}}</td>
											<td id="shareremainingmonths">{{itm.剩余还款月数}}</td>
											<td id="sharerepaymentdate">{{itm.本月应还款日期}}</td>
											<td id="shareamountofrepayment">{{itm.本月应还款金额}}</td>
										</tr>
										<tr>
											<td class="tabheader">帐户状态</td>
											<td class="tabheader">实际还款日期</td>
											<td class="tabheader">实际还款金额</td>
											<td class="tabheader">当前逾期总额</td>
											<td class="tabheader">当前逾期期数</td>
											<td class="tabheader">累计逾期期数</td>
											<td class="tabheader">最高逾期期数</td>
										</tr>
										<tr>
											<td id="accountstate">{{itm.帐户状态}}</td>
											<td id="accountrepaymentdate">{{itm.实际还款日期}}</td>
											<td id="accountrepaymentmoney">{{itm.实际还款金额}}</td>
											<td id="accountrepaymenttotal">{{itm.当前逾期总额}}</td>
											<td id="accountrepayment">{{itm.当前逾期期数}}</td>
											<td id="accountrepaymentcount">{{itm.累计逾期期数}}</td>
											<td id="accountrepaymentmax">{{itm.最高逾期期数}}</td>
										</tr>
										<tr>
											<td class="tabheader" colspan="2">24月内各月还款状况</td>
											<td class="tabheader">逾期31-60天未归还借款本金</td>
											<td class="tabheader">逾期61-90天未归还借款本金</td>
											<td class="tabheader">逾期91-180天未归还借款本金</td>
											<td class="tabheader">逾期180天以上未归还借款本金</td>
											<td class="tabheader">信息获取日期</td>
										</tr>
										<tr>
											<td colspan="2" id="repayment24month">{{itm.二十四月内各月还款状况}}</td>
											<td id="repayment31-60day">{{itm.san}}</td>
											<td id="repayment61-90day">{{itm.san1}}</td>
											<td id="repayment91-180day">{{itm.san2}}</td>
											<td id="repayment1max80day">{{itm.逾期180天以上未归还贷款本金}}</td>
											<td id="repaymentdate">{{itm.信息获取日期}}</td>
										</tr>
                                        </template>
									</table>
								</div>
								<!--为他人担保信息-->
								<div class="others_guaranteelist">
									<ul class="top_title top_linelist">
										<li class="top_line"></li>
										<li class="top_centertext">为他人担保信息</li>
										<li class="top_line"></li>
									</ul>
									<table class="table table-striped" style="border-top:0;table-layout: fixed;">
										<tr>
											<td class="tabheader">担保项目</td>
											<td class="tabheader">担保日期</td>
											<td class="tabheader">担保金额</td>
											<td class="tabheader">担保关系</td>
											<td class="tabheader">信息获取日</td>
										</tr>
										<tr id="noothersguarantee">
											<td colspan="5">无为他人担保信息</td>
										</tr>
									</table>
								</div>
								<!--特殊交易信息 -->
								<div class="special_transaction_list">
									<ul class="top_title top_linelist">
										<li class="top_line"></li>
										<li class="top_centertext">特殊交易信息</li>
										<li class="top_line"></li>
									</ul>
									<table class="table table-striped" id="specialtransactioninfor" style="border-top:0;table-layout: fixed;">
										<tr>
											<td class="tabheader">记录来源</td>
											<td class="tabheader">记录类型</td>
											<td class="tabheader">发生日期</td>
											<td class="tabheader">变更月数</td>
											<td class="tabheader">发生金额</td>
											<td class="tabheader">明细信息</td>
											<td class="tabheader">信息获取日期</td>
										</tr>

										<tr v-for='itm in blankList2.content.特殊交易信息.详细记录'>
                                            <td id="specialtransactionname">{{itm.记录来源}}</td>
											<td id="specialtransactiontype">{{itm.记录类型}}</td>
											<td id="specialtransactiondate">{{itm.发生日期}}</td>
											<td id="specialtransactionmonths">{{itm.变更月数}}</td>
											<td id="specialtransactionmoney">{{itm.发生金额}}</td>
											<td id="specialtransactiontext">{{itm.明细信息}}</td>
											<td id="specialtransactiontime">{{itm.信息获取日期}}</td>
										</tr>
									</table>
								</div>
								<!--查 询 记 录  -->
								<div class="special_transaction_list">
									<ul class="top_title top_linelist">
										<li class="top_line"></li>
										<li class="top_centertext">查询记录</li>
										<li class="top_line"></li>
									</ul>
									<table class="table table-striped" id="queryrecord" style="border-top:0;table-layout: fixed;">
										<tr>
											<td class="tabheader">查询者类型</td>
											<td class="tabheader" colspan="2">查询原因</td>
											<td class="tabheader">查询日期</td>
										</tr>
										<tr v-for="itm in blankList2.content.查询信息.查询记录"> 
                                            <td>{{itm.查询者类型}}</td>
											<td colspan="2">{{itm.查询原因}}</td>
											<td>{{itm.查询日期}}</td>
										</tr>
									</table>
								</div>
								<!--个 人 声 明  -->
								<div class="special_transaction_list">
									<ul class="top_title top_linelist">
										<li class="top_line"></li>
										<li class="top_centertext">个 人 声 明</li>
										<li class="top_line"></li>
									</ul>
									<table class="table table-striped" id="personalstatement" style="border-top:0;table-layout: fixed;">
										<tr>
											<td class="tabheader">序号</td>
											<td class="tabheader" colspan="2">个 人 声 明 内 容</td>
											<td class="tabheader">声明日期</td>
										</tr>
									</table>
								</div>
								<!--资 信 提 示 -->
								<div class="special_transaction_list">
									<ul class="top_title top_linelist">
										<li class="top_line"></li>
										<li class="top_centertext">资 信 提 示</li>
										<li class="top_line"></li>
									</ul>
									<table class="table table-striped" id="creditworthiness" style="border-top:0;table-layout: fixed;">
										<tr>
											<td colspan="2">项目</td>
											<td>提示内容</td>
											<td>提示时间</td>
										</tr>
                                        <tr v-for="itm in blankList2.content.资信提示信息.资信提示">
                                            <td colspan="2">{{itm.项目}}</td>
											<td>{{itm.提示内容}}</td>
											<td>{{itm.提示时间}}</td>
										</tr>
									</table>
								</div>
               			 	</div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-tab-pane>
        </el-tabs>
        <magnifyImg :imgAlertArray='isAlertmagnify.imgAlertArray' :isShow="isAlertmagnify.isShow" :index="isAlertmagnify.index" v-on:alertClost="alertClost"></magnifyImg>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { validate } from '@src/utils/validation';
import magnifyImg from '@src/components/magnifyImg'; //放大图片
import { storage } from '@constants/dataStorage';
import Cookies from 'js-cookie';
import { Common } from '@common/common';
export default {
    components: {
        magnifyImg: magnifyImg
    },
    data() {
        var reasonsRejection = (rule, value, callback) => {
            if (this.AuditForm.reasonsRejection == '') {
                callback(new Error('请选择'));
                return false;
            }
            callback();
        }
        var msg = (rule, value, callback) => {
            if (this.AuditForm.msg == '' || !this.AuditForm.msg) {
                callback(new Error('请输入'));
                return false;
            }
            callback();
        }
        return {
            loading: false, //防止二次操作
            //放大图片参数
            isAlertmagnify: {
                isShow: false, //放大图片组件显示
                imgAlertArray: [], //图片
                index: 0 //第几张图片
            },
            storage: storage, //存储的数据
            listLoading: false,
            activeName2: 'second',
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
            form: { //弹框表格数据
            },
            isEdit: true, //编辑状态
            AuditForm: {
                status: '1', //审核下拉框
                reasonsRejection: '', //决绝拒绝原因
            },
            rules: { //验证
                agreementAmount: [{ required: true, message: '请输入', trigger: 'blur' }],
                status: [{ type: 'number', required: true, message: '请选择', trigger: 'change' }],
                reasonsRejection: [{ validator: reasonsRejection, trigger: 'change' }],
                // msg: [{ validator: msg, trigger: 'blur' }],
            },
            userName: Cookies.get('user'), //操作人
            dateTime: new Date(), //时间
            reasonsRejectionData: {}, //拒绝原因
            AuditData: '', //审核
            imgtype: '', //保留影像资料type
            imgSrcBase: 'https://img.zhaogu168.com/',
            imgData: [], //图片
            detailplanData: '', //还款计划数据
            operatorreporta: { //运营商报告
                application_check: [ //用户申请表检测
                    {
                        check_points: {
                        }
                    },
                    {
                        check_points: {
                            court_blacklist: {},
                            financial_blacklist: {}

                        }
                    },
                    {
                        check_points: {
                            financial_blacklist: {}
                        }
                    },
                    {
                        check_points: {

                        }
                    },

                ],
                //用户信息检测
                user_info_check: {
                    check_black_info: {},

                    check_search_info: {
                        idcard_with_other_names: [],
                        idcard_with_other_phones: [],
                        phone_with_other_names: [],
                        phone_with_other_idcards: [],
                        register_org_type: [],
                        arised_open_web: []
                    }

                },
                //编号
                report: {},
                //用户行为检测
                behavior_check: [],
                //运营商消费数据
                cell_behavior: [],
                //联系人区域汇总
                contact_region: [],
                //运营商数据分析
                contact_list: [],
                //联系人信息和地址信息
                collection_contact: [],
                deliver_address: [],
                //常用服务
                main_service: [],
                //电商数据分析
                ebusiness_expense: [],
                //出行数据分析
                trip_info: [],

            },
            OperatorImg: {
                pic_s5: require('@res/img/pic-s5.png'),
                pic_s3: require('@res/img/pic-s3.png'),
                pic_s6: require('@res/img/pic-s6.png'),
                pic_s4: require('@res/img/pic-s4.png'),
                query_history: require('@res/img/query-history.png'),
                labelling: require('@res/img/labelling.png'),
            },
            operatorreportf: { //运营商辅助报告
                //基本信息
                user_basic: {},
                //社交特征模块
                user_gray: {
                    //联系人数相关字段
                    contacts_number_statistic: {},
                    //联系权重R、F、M相关字段
                    contacts_rfm: {},
                    //与联系人的最大亲密度
                    contacts_closest: {},
                    //联系人灰度分信息
                    contacts_gray_score: {},
                    //联系人的分布
                    contacts_relation_distribution: {},
                    //联系人的查询历史
                    contacts_query: {},
                },
                //基本社交特征
                user_blacklist: {
                    blacklist_category: [],
                    blacklist_details: [],
                    blacklist_name_with_idcard: [],
                    blacklist_name_with_phone: [],
                    blacklist_update_time_name_idcard: [],
                    blacklist_update_time_name_phone: [],
                },
                //手机存疑
                user_phone_suspicion: {
                    phone_with_other_names: [],
                    phone_with_other_idcards: [],
                    phone_applied_in_orgs: []
                },
                //身份证存疑
                user_idcard_suspicion: {
                    idcard_with_other_names: [],
                    idcard_with_other_phones: [],
                    idcard_applied_in_orgs: [],
                },
                //机构历史查询
                user_searched_history_by_orgs: [],
                //历史查询记录
                user_searched_history_by_day: {
                    d_7: {},
                    d_15: {},
                    d_30: {},
                    d_60: {},
                    d_90: {},
                    m_4: {},
                    m_5: {},
                    m_6: {},
                    d_15: {},
                    m_9: {},
                    m_12: {},
                    m_18: {},
                    m_24: {},
                },

                user_register_orgs: {
                    register_orgs_statistics: []
                },

                consumer_label: {

                },

            },
            //资信
			blankList2:{
				content:{
                    个人声明信息:{},
                    个人身份信息:{
                        住宅电话:[],
                        出生日期:'',
                        地址:[],
                        姓名:'',
                        婚姻状况:[],
                        工作单位:[],
                        性别:'',    
                        手机号码:[],
                        最高学历:[],
                        电子邮箱:[],
                        第一联系人信息:[],
                        第二联系人信息:[],
                        职称:[],    
                        证件号码:'',
                        证件类型:'',
                        配偶出生日期:'',
                        配偶姓名:'',
                        配偶工作单位:[],
                        配偶性别:'',
                        配偶联系电话:[],
                        配偶证件号码:'',
                        配偶证件类型:'',
                    },
                    为他人担保信息:{},
                    保证人代偿信息:{},
                    信用报告头:[],
                    查询信息:{
                        查询记录:[],
                    },
                    特殊交易信息:{
                        详细记录:[],
                    },
                    贷款交易信息:{
                        信息概要:[],
                        贷款:[],
                    },
                    贷款申请信息:{
                        贷款申请信息记录:[],
                    }, 
                    资信提示信息:{
                        资信提示:[],
                    },
				},
			},
            writeList: [],// 白名单列表
            blankList: {}, //黑名单2
            blankList3: {}, //黑名单3

        }
    },
    computed: {
    },
    created() {
        let data = this.$route.query.data ? JSON.parse(this.$route.query.data) : '';
        this.rowData = data;
        this.getProduct(); //获取产品
        let selectName = ['relationshipBetween', 'tcConsume', 'eduBg', 'marriageStatus', 'houseStatus', 'enterprise_type', 'reasonsRejectionData']; //下拉框的名字
        //接口key 关系，用途， 学历 ,婚姻, 房产, 企业类型, 拒绝原因
        let selectKey = ['tc_contact_relationship', 'tc_consume_type', 'tc_edu_bg', 'tc_marriage_status', 'tc_house_status', 'tc_enterprise_type', 'tc_reasons_rejection'];
        selectKey.map((item, index) => {
            this.getRelationshipbetween(item, selectName[index]); //获取联系人关系list和产品
        })
    },
    mounted() {
        this.getDetail();
    },
    methods: {
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
                    console.log(error)
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
                        console.log(response)
                        this.AuditData = response.data;
                        if (this.AuditData.spStatus == 3) {
                            this.isEdit = true;
                            this.form.agreementAmount = '';
                        } else {
                            this.isEdit = false;
                        }
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
            if (this.form.agreementAmount == '') {
                this.$message.warning('请输入合同放款金额！！');
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true; //二次提交按钮设置
                    ajax({
                        url: 'underlineProcess/lastApproval',
                        optionParams: {
                            agreementAmount: this.form.agreementAmount,
                            msg: this.AuditForm.msg,
                            orderNum: this.form.orderNum,
                            orderUserId: this.rowData.orderUserId,
                            reasonsRejection: this.AuditForm.reasonsRejection,
                            status: this.AuditForm.status,
                            prodId: this.form.prodId,
                            term: this.form.loanTerm
                        }
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.$message.success(response.message)
                                window.location.reload();
                            } else {
                                this.$message.warning(response.message ? response.message : '');
                                this.loading = false; //二次提交按钮设置
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false; //二次提交按钮设置
                        })
                } else {
                    if (this.form.agreementAmount == '') {
                        this.$message.warning('请填写合同金额')
                    }
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
                    } else {
                        this.$message.warning(response.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //点击tab
        handleClick(tab, event) {
            if (tab.index != 0) {
                this.listLoading = true;
            }
            if (tab.index == 1) {
                this.getVideodetail(); //影像资料
            }
            if (tab.index == 2) {
                this.getDetailplan() //获取还款计划
            }
            if (tab.index == 3) {
                this.operatorreport() //获取运营商
            }
            if (tab.index == 4) { //黑名单
                this.getWriteList(1); //获取白名单
            }

        },
        //点击tab //运营商tab
        operatorreportfu(tab, event) {
            console.log(tab.index)
            if (tab.index == 1) {
                this.operatorreportzhu() //获取运营商辅助报告
            }
        },
        //啊影像资料tab
        videotab(tab, event) {
            this.listLoading = true;
            this.imgtype = tab.index * 1 + 1;
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
                    console.log(error)
                    this.listLoading = false;
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
            console.log(index)
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
                    console.log(error)
                    this.listLoading = false;
                })
        },
        //格式化金钱
        inputChageMoney(e) {
            let obj = {
                input: e,
                maxMoney: 200000,
                that: this
            }
            this.form.agreementAmount = Common.positiveIntegerMoney(obj); //表单赋值
        },
        //失去焦点
        inputBlue() {
            if (this.form.agreementAmount) {
                ajax({
                    url: 'underlineProcess/CalEachMoney',
                    optionParams: {
                        prodId: this.form.prodId,
                        orderNum: this.form.orderNum,
                        term: this.form.loanTerm,
                        agreementAmount: this.form.agreementAmount
                    }
                }).post()
                    .then(response => {
                        if (response.code === 200) {
                            let data = response.data;
                            this.form.realPayAmout = data.realPayMoney;
                            this.form.eachmoney = data.eachMoney;
                        } else {
                            this.$message.warning(response.message)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        },
        //获取运营商报告
        operatorreport() {
            console.log(this.form.carrierAuthPhone)
            ajax({
                url: 'detailsdata/detailsource',
                optionParams: {
                    sourceType: 1,
                    caphone: this.form.carrierAuthPhone ? this.form.carrierAuthPhone : ''
                }
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response)
                        let data = response.data ? response.data : {}
                        let data1 = data.data ? data.data : '';
                        if (data1) {
                           data1 = JSON.parse(data1);
							console.log(data1.JSON_INFO)
							console.log(data1)
							if( data1.JSON_INFO == null){
									this.operatorreporta =  data1
							}else{
								this.operatorreporta =  data1.JSON_INFO
							}
							//this.operatorreporta = data1.JSON_INFO;

							console.log(this.operatorreporta)
							if (this.operatorreporta.contact_list && this.operatorreporta.contact_list.length > 0) {
								this.operatorreporta.contact_list.sort(Common.compare('call_cnt'))
								// this.unknown(this.operatorreporta.contact_list)
							}
                        }
                        console.log(this.operatorreporta)
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                    this.listLoading = false;
                })
        },
        //获取运营商报告	  互联网标识
		// unknown(data) {
		// 	let arr = [];
		//     if (data.length < 20) {
		// 		data.map((item) => {
		// 			arr.push(item.phone_num)
		// 		})
		// 	} else {
		// 		for (let i = 0; i < 20; i++) {
		// 			arr.push(data[i].phone_num)
		// 		}
		// 	}
		// 	console.log(arr);
		// 	ajax({
		// 		url: 'detailsdata/getBzName',
		// 		optionParams: {
		// 			phone: arr,
		// 			orderUserId: this.rowData.orderUserId
		// 		}
		// 	}).post()
		// 		.then(response => {
		// 			if (response.code === 200) {
		// 				console.log(response)
		// 				let data = response.data ? response.data : [];
		// 				data.map((item, index)=> {
		// 					this.operatorreporta.contact_list[index].contact_name = item;
		// 				})
		// 			} else {
		// 				this.$message.warning(response.message)
		// 			}
		// 			this.listLoading = false;
		// 		})
		// 		.catch(error => {
		// 			console.log(error)
		// 			this.listLoading = false;
		// 		})
		// },
        //获取运营商辅助报告
        operatorreportzhu() {
            console.log(this.form.carrierAuthPhone)
            ajax({
                url: 'detailsdata/detailsource',
                optionParams: {
                    sourceType: 2,
                    caphone: this.form.carrierAuthPhone ? this.form.carrierAuthPhone : ''
                }
            }).post()
                .then(response => {
                    console.log(response)
                    if (response.code === 200) {
                        let data = response.data ? response.data : {};
                        let data1 = data.data ? data.data : '';
                        if (data1) {
                            data1 = JSON.parse(data1);
                            this.operatorreportf = data1.data;
                        }
                        console.log(this.operatorreportf)
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error)
                    this.listLoading = false;
                })
        },
        //黑名单tab
        blacklistTab(tab, event) {
            if (tab.index != 0) { //黑名单
                this.listLoading = true;
            }
            if (tab.index == 1) {
                this.getWriteList(2); //获取黑名单
            }
            if (tab.index == 2) {
                this.getWriteList(3); //获取黑名单三
            }
            if (tab.index == 3) {
                this.getWriteList2(); //黑名单er
            }
        },
        //获取白名单
        getWriteList(value) {
            let obj = {};
            if (value == 1) {
                obj = {
                    orderUserId: this.rowData.orderUserId,
                    sourceType: value
                }
            } else if (value == 2) {
                obj = {
                    orderNum: this.rowData.orderNum,
                    sourceType: value
                }
            } else if (value == 3) {
                obj = {
                    phone: this.rowData.phone,
                    sourceType: value
                }
            }
            ajax({
                url: 'detailsdata/blackBg',
                optionParams: obj
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response);
                        if (value == 1) {
                            this.writeList = response.data ? response.data : [];
                        } else if (value == 2) {
                            this.blankList = response.data ? response.data : {};
                        } else if (value == 3) {
                            this.blankList3 = response.data ? response.data : {};
                        }
                    } else {
                        this.$message.warning(response.message);
                    }
                    this.listLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.listLoading = false;
                })
        },
         	//资信
		getWriteList2() {
			console.log(this.form.idCard)
			console.log(this.rowData.name)
			ajax({
                url: 'blacklist/getUserBlackList',
                optionParams: {
					cardNum:this.form.idCard,
					cardType:'02',
					name:this.rowData.name
				}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response);
						let data = response.data ? response.data : {};
						let data1 = JSON.parse(data);
						 //this.blankList2 =data1
                         console.log(data1.content)   
                         //信息                   
                         this.blankList2.content.个人身份信息.住宅电话 =data1.content['个人身份信息'][0]['住宅电话']
                         this.blankList2.content.个人身份信息.出生日期 =data1.content['个人身份信息'][0]['出生日期']
                         this.blankList2.content.个人身份信息.地址 =data1.content['个人身份信息'][0]['地址']
                          this.blankList2.content.个人身份信息.姓名 =data1.content['个人身份信息'][0]['姓名']
                         this.blankList2.content.个人身份信息.婚姻状况 =data1.content['个人身份信息'][0]['婚姻状况']
                         this.blankList2.content.个人身份信息.工作单位 =data1.content['个人身份信息'][0]['工作单位']
                         this.blankList2.content.个人身份信息.性别 =data1.content['个人身份信息'][0]['性别']
                         this.blankList2.content.个人身份信息.手机号码 =data1.content['个人身份信息'][0]['手机号码']
                         this.blankList2.content.个人身份信息.最高学历 =data1.content['个人身份信息'][0]['最高学历']
                         this.blankList2.content.个人身份信息.电子邮箱 =data1.content['个人身份信息'][0]['电子邮箱']
                         this.blankList2.content.个人身份信息.第一联系人信息 =data1.content['个人身份信息'][0]['第一联系人信息']
                         this.blankList2.content.个人身份信息.第二联系人信息 =data1.content['个人身份信息'][0]['第二联系人信息']
                         this.blankList2.content.个人身份信息.职称 =data1.content['个人身份信息'][0]['职称']
                         this.blankList2.content.个人身份信息.证件号码 =data1.content['个人身份信息'][0]['证件号码']
                         this.blankList2.content.个人身份信息.证件类型 =data1.content['个人身份信息'][0]['证件类型']
                         this.blankList2.content.个人身份信息.配偶出生日期 =data1.content['个人身份信息'][0]['配偶出生日期']
                         this.blankList2.content.个人身份信息.配偶姓名 =data1.content['个人身份信息'][0]['配偶姓名']
                         this.blankList2.content.个人身份信息.配偶工作单位 =data1.content['个人身份信息'][0]['配偶工作单位']
                          this.blankList2.content.个人身份信息.配偶性别 =data1.content['个人身份信息'][0]['配偶性别']
                         this.blankList2.content.个人身份信息.配偶联系电话 =data1.content['个人身份信息'][0]['配偶联系电话']
                         this.blankList2.content.个人身份信息.配偶证件号码 =data1.content['个人身份信息'][0]['配偶证件号码']
                         this.blankList2.content.个人身份信息.配偶证件类型 =data1.content['个人身份信息'][0]['配偶证件类型']
                         // 借款交易信息
                         this.blankList2.content.贷款交易信息.信息概要 =data1.content['贷款交易信息'][0]['信息概要']
                         console.log(this.blankList2.content.贷款交易信息.信息概要)
                         this.blankList2.content.贷款交易信息.贷款 =data1.content['贷款交易信息'][0]['贷款']
                         this.blankList2.content.贷款交易信息.贷款.map((item) => {
                             let san = item['逾期31-60天未归还贷款本金']
                             let san1 = item['逾期61-90天未归还贷款本金']
                             let san2 = item['逾期91-180天未归还贷款本金']
                             this.$set(item, 'san', san);
                             this.$set(item, 'san1', san1);
                             this.$set(item, 'san2', san2);
                         })                        
                         //资 信 提 示 
                        this.blankList2.content.资信提示信息.资信提示 =data1.content['资信提示信息'][0]['资信提示']
                        //查询记录
                        this.blankList2.content.查询信息.查询记录 =data1.content['查询信息'][0]['查询记录']
                        //信用报告头
                        this.blankList2.content.信用报告头 =data1.content['信用报告头']
                        //特殊交易信息 
                        this.blankList2.content.特殊交易信息.详细记录 =data1.content['特殊交易信息'][0]['详细记录']
                         //借款申请信息  
                        this.blankList2.content.贷款申请信息.贷款申请信息记录 =data1.content['贷款申请信息'][0]['贷款申请信息记录']
                    } else {
                        this.$message.warning(response.message);
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

.green2 {
    color: #fff;
    display: inline-block;
    background: red;
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
                    z-index: 1;
                    position: relative;
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



.blacklist_layer {
    width: 80%;
    margin: 20px auto;
    position: relative;
    .blacklist_header {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin: 40px 0;
    }
    .blacklist_layer .companylogoimg {
        position: absolute;
        left: 30px;
        width: 60px;
    }
    .table>tbody>tr:last-child {
        border-bottom: 1px solid #e7eaec;
        /* border: 1px solid #e7e7e7; */
    }
    .table-striped>tbody>tr:nth-of-type(odd) {
        background-color: #f9f9f9;
    }
    .table tr td.tabheader {
        background-color: #EFEFEF;
        height: auto!important;
        padding: 8px 2px;
        border-right: 1px solid white!important;
        color: black;
    }
    .top_linelist.top_title {
        text-align: center;
        width: 96%;
        /* margin-top: 20px; */
        margin: 60px auto 40px;
    }
    .top_linelist.top_title .top_line {
        height: 2px;
        background-color: #c1bebe;
        width: 45%;
    }
    .top_title .top_centertext {
        background-color: white;
        text-align: center;
        vertical-align: middle;
        color: black;
    }
    .top_linelist.top_title {
        text-align: center;
        width: 96%;
        /* margin-top: 20px; */
        margin: 60px auto 40px;
    }
    .table {
        border-top: 4px solid #e06843;
        width: 94%;
        margin-top: 20px;
        margin: 20px auto 0;
    }
    .top_linelist.top_title li {
        display: inline-block;
        vertical-align: middle;
    }
    .bottomnote_text_top .bottomnote_text_top_text {
        text-align: center;
        font-weight: bold;
        font-size: 20px;
        border-bottom: 1px solid #0C0C0C;
        margin: 30px 0 10px;
        color: black;
    }
    .bottomnote_text_top {
        width: 140px;
        margin: 0 auto;
    }
    .bottomnote_text li {
        color: black;
        line-height: 20px;
    }
    ul.bottomnote_text {
        max-width: 340px;
        margin: 0 auto;
    }
    .bottomnote_text li {
        color: black;
        line-height: 20px;
    }
    .bottomnote_text_company {
        text-align: center;
        color: black;
        margin: 25px 0;
        line-height: 25px;
        padding-bottom: 20px;
    }
}
</style>


