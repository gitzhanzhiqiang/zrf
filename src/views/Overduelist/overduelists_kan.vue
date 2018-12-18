<template>
	<div class="app-container calendar-list-container ggg_user" v-loading="listLoading">
		<el-tabs type="border-card" @tab-click="handleClick">
			<el-tab-pane label="核心数据">
				<el-form ref="alertFrom" label-position="center" label-width="0px" :model="form" class="table_css kernel noborder">
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
								<td></td>
								<td></td>
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
									<el-form-item>
										<el-input readonly :value="item.name" v-show="item.value == form.prodId" v-for="item in product" :key="item.value"></el-input>
									</el-form-item>
								</td>
								<td>希望借款金额</td>
								<td>
									<el-form-item>
										<el-input v-model="form.applyAmount" readonly></el-input>
									</el-form-item>
								</td>
							</tr>
							<tr>
								<td>每期还款金额</td>
								<td>终审输入</td>
								<td>借款期数</td>
								<td>
									<el-form-item>
										<el-input readonly v-model="form.loanTerm"></el-input>
									</el-form-item>
								</td>
							</tr>
							<tr>
								<td>借款用途</td>
								<td>
									<el-form-item>
										<el-input readonly :value="item.name" v-show="item.value == form.consumeType" v-for="item in tcConsume" :key="item.value"></el-input>
									</el-form-item>
								</td>
								<td>合同放款金额</td>
								<td>终审输入</td>
							</tr>
							<tr>
								<td>实际放款金额</td>
								<td>终审输入</td>
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
					<div class="filter-container">
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
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="催收工作台">
				<el-button type="primary" style='margin-bottom: 20px;' @click='gzt'>新增</el-button>
				<table class="table table_cssd">
					<tr>
						<td>催收时间</td>
						<td>催收员</td>
						<td>催收动作</td>
						<td>催收结果</td>
						<td>电话号码</td>
						<td>关系</td>
						<td>号码是否有效</td>
						<td>承诺金额</td>
						<td>承诺日期</td>
						<td>信息真实性</td>
						<td>备注</td>
					</tr>

					<tr v-for="item in collection">
						<td>{{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
						<td>{{item.adminName}}</td>
						<td>
							<span v-show="item.collType  == 1">电催</span>
							<span v-show="item.collType  == 2">法催（门店）</span>
						</td>
						<td>
							<span v-show="item.collResult  == 1">已还 </span>
							<span v-show="item.collResult  == 2">承诺全额还款</span>
							<span v-show="item.collResult  == 3">承诺部分还款</span>
							<span v-show="item.collResult  == 4">联系不上</span>
							<span v-show="item.collResult  == 5">态度强硬</span>
							<span v-show="item.collResult  == 5">没钱还</span>
						</td>
						<td>{{item.phone}}</td>
						<td>{{item.relationship}}</td>
						<td>
							<span v-show="item.commuValidType == 1">无应答</span>
							<span v-show="item.commuValidType == 2">拒接</span>
							<span v-show="item.commuValidType == 3">空号</span>
							<span v-show="item.commuValidType == 4">已接</span>
							<span v-show="item.commuValidType == 5">关机</span>
						</td>
						<td>
							{{item.agreeMoney }}
						</td>
						<td>{{item.agreeRepayDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</td>
						<td>
							<span v-show="item.reliabilityPercent  == 1">假的 0%</span>
							<span v-show="item.reliabilityPercent  == 2">怀疑30%</span>
							<span v-show="item.reliabilityPercent  == 3">一般 50%</span>
							<span v-show="item.reliabilityPercent  == 4">大概80%</span>
							<span v-show="item.reliabilityPercent  == 5">确定100%</span>
						</td>
						<td>{{item.remark }}</td>
					</tr>

				</table>
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
			<!-- 运营商报告-->
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
			<el-tab-pane label="通讯录" >
				<table class="table" style="width:300px;">
					<tr>
						<td>姓名</td>
						<td>手机号码</td>
					</tr>
					<tr v-for="item in phonedata">
						<td>{{item.linkName}}</td>
						<td>{{item.phone}}</td>
					</tr>
				</table>
			</el-tab-pane>
		</el-tabs>
		<magnifyImg :imgAlertArray='isAlertmagnify.imgAlertArray' :isShow="isAlertmagnify.isShow" :index="isAlertmagnify.index" v-on:alertClost="alertClost"></magnifyImg>
		<el-dialog title="查看" :visible.sync="dialogVisible" width="30%">
			<div style="width:700px;margin:0 auto;">
				<el-form :rules="rules" :model="alertForm" ref="alertForm" label-width="0px">

					<table class="table">

						<tr>
							<td>催收动作</td>
							<td>
								<el-form-item label="" prop="collType">
									<el-select v-model="alertForm.collType" placeholder="请选择催收动作">
										<el-option label="电催" value="1"></el-option>
										<el-option label="法催（上门）" value="2"></el-option>
									</el-select>
								</el-form-item>
							</td>
							<td>催收结果</td>
							<td>
								<el-form-item label="" prop="collResult">
									<el-select v-model="alertForm.collResult" placeholder="请选择催收结果">
										<el-option v-for="item in storage.collectResults" :key="item.id" :label="item.label" :value="item.id + ''"></el-option>
									</el-select>
								</el-form-item>

							</td>
						</tr>
						<tr>
							<td>承诺金额</td>
							<td>
								<el-form-item label="" prop="agreeMoney">
									<el-input v-model="alertForm.agreeMoney" placeholder="请输入承诺金额"></el-input>
								</el-form-item>

							</td>
							<td>承诺日期</td>
							<td>
								<el-form-item label="" prop="agreeRepayDate">
									<el-date-picker v-model="alertForm.agreeRepayDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
								</el-form-item>

							</td>
						</tr>
						<tr>
							<td>电话号码</td>
							<td>
								<el-form-item label="" prop="phone">
									<el-input v-model="alertForm.phone" placeholder="请输入电话号码"></el-input>
								</el-form-item>

							</td>
							<td>关系</td>
							<td>
								<el-form-item label="" prop="relationship">
									<el-input v-model="alertForm.relationship" placeholder="请输入关系"></el-input>
								</el-form-item>

							</td>
						</tr>
						<tr>
							<td>电话是否有效</td>
							<td>
								<el-form-item label="" prop="commuValidType">
									<el-select v-model="alertForm.commuValidType" placeholder="请选择电话是否有效">
										<el-option label="无应答" value="1"></el-option>
										<el-option label="拒接" value="2"></el-option>
										<el-option label="空号" value="3"></el-option>
										<el-option label="已接" value="4"></el-option>
										<el-option label="关机" value="5"></el-option>
									</el-select>
								</el-form-item>

							</td>
							<td>信息真实性</td>
							<td>
								<el-form-item label="" prop="reliabilityPercent">
									<el-select v-model="alertForm.reliabilityPercent" placeholder="请选择信息真实性">
										<el-option label="确定100%" value="5"></el-option>
										<el-option label="大概80%" value="4"></el-option>
										<el-option label="一般50%" value="3"></el-option>
										<el-option label="怀疑30%" value="2"></el-option>
										<el-option label="假0%" value="1"></el-option>
									</el-select>
								</el-form-item>

							</td>
						</tr>
						<tr>
							<td>备注</td>
							<td colspan="3">
								<el-form-item label="" prop="remark">
									<el-input type="textarea" v-model="alertForm.remark"></el-input>
								</el-form-item>
							</td>

						</tr>
					</table>

				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="resetForm('alertForm')">取 消</el-button>
				<el-button type="primary" @click="submitAlert('alertForm')" :loading="loading">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>
<script>
import ajax from '@utils/config';
import { parseTime, formatMoney } from '@src/filters';
import { validate } from '@src/utils/validation';
import magnifyImg from '@src/components/magnifyImg'; //放大图片
import { storage } from '@constants/dataStorage';
import { Common } from '@common/common';
export default {
	components: {
		magnifyImg: magnifyImg
	},
	data() {
		return {
			storage: storage, //存储的数据
			loading: false,
			bttn: false,
			//放大图片参数
			isAlertmagnify: {
				isShow: false, //放大图片组件显示
				imgAlertArray: [], //图片
				index: 0 //第几张图片
			},
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
			AuditData: '', //审核
			imgtype: '', //保留影像资料type
			imgSrcBase: 'https://img.zhaogu168.com/',
			imgData: [], //图片
			detailplanData: '', //还款计划数据      
			phonedata: '',//通讯录数据
			collection: '',//催收工作台
			dialogVisible: false,
			alertForm: {
				orderNum: '',
				collType: '',
				collResult: '',
				agreeMoney: "",
				agreeRepayDate: '',
				phone: '',
				relationship: '',
				commuValidType: '',
				reliabilityPercent: '',
				remark: '',
			},
			rules: {
				collResult: [{ required: true, message: '请选择', trigger: 'change' }],
				phone: [{ required: true, message: '请输入', trigger: 'blur' }],

			}, // 
			addressList: false, //通讯录显示
			//运营商
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

				}

			},



		}
	},
	computed: {
	},
	created() {
		let data = this.$route.query.data ? JSON.parse(this.$route.query.data) : '';
		this.rowData = data;
		this.addressList = this.$route.query.addresslist;
		console.log(this.addressList)
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
		getDetail(isseach) {
			console.log(this.rowData)
			this.alertForm.orderNum = this.rowData.orderNum
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
		//催收工作台显示
		cuishou() {
			ajax({
				url: 'colRecord/selectRecordList',
				optionParams: {
					orderNum: this.rowData.orderNum
				}
			}).post()
				.then(response => {
					if (response.code === 200) {
						console.log(response)
						let data = response.data ? response.data : []
						this.collection = data
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
		//催收工作台
		gzt() {
			this.dialogVisible = true;
			this.loading = false;
			this.$nextTick(() => {
				this.$refs['alertForm'].resetFields();
			})
		},
		//催收工作台弹框提交
		submitAlert(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.loading = true;
					ajax({
						url: 'colRecord/addColRecord',
						optionParams: this.alertForm
					}).post()
						.then(response => {
							if (response.code === 200) {
								this.dialogVisible = false;
								this.cuishou();
							} else {
								this.$message.warning(response.message)
								this.loading = false;
							}
						})
						.catch(error => {
							console.log(error)
							this.loading = false;
						})


				} else {
					console.log('error submit!!');
					return false;
				}
			});                            // this.loading = true; //二次提交按钮设置
		},
		resetForm(formName) {
			this.dialogVisible = false;
			this.$refs[formName].resetFields();
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
						data1 = JSON.parse(data1);
						console.log(data1.JSON_INFO)
							console.log(data1)
							if( data1.JSON_INFO == null){
									this.operatorreporta =  data1
							}else{
								this.operatorreporta =  data1.JSON_INFO
							}
						if (this.operatorreporta.contact_list && this.operatorreporta.contact_list.length > 0) {
							this.operatorreporta.contact_list.sort(Common.compare('call_cnt'))
							// this.unknown(this.operatorreporta.contact_list)
						}
						console.log(this.operatorreporta)
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
						let data = response.data.data ? response.data.data : [];
						data = JSON.parse(data);
						this.operatorreportf = data.data;
						console.log(this.operatorreportf)
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
		//点击tab
		handleClick(tab, event) {
			this.listLoading = true;
			if (tab.index == 0) {
				this.listLoading = false;
			}
			if (tab.index == 1) {
				this.cuishou(); //催收工作台
			}
			if (tab.index == 2) {
				this.getVideodetail(); //影像资料
			}
			if (tab.index == 3) {
				this.getDetailplan() //获取还款计划

			}
			if (tab.index == 4) {
				this.operatorreport() //获取运营商
			}
			if (tab.index == 5) {
				this.phonequ() //通讯录
			}
		},
		//点击tab
		operatorreportfu(tab, event) {
			this.listLoading = true;
			if (tab.index == 0) {
				this.listLoading = false;
			}
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
		//获取通讯录
		phonequ() {
			console.log(this.rowData)
			ajax({
				url: 'underlineProcess/getOrderUserTelBook',
				optionParams: {
					orderUserId: this.rowData.orderUserId
				}
			}).post()
				.then(response => {
					if (response.code === 200) {
						console.log(response)
						this.phonedata = response.data;
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
	margin: 0 auto;
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
	.table {
		width: 1000px;
	}
}

.table_cssd {
	width: 100%;
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
</style>

