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
			<el-form-item label="姓名" prop="userName">
				<el-input type="text" v-model="params.userName" placeholder="请输入姓名"></el-input>
			</el-form-item>
			<el-form-item label="银行卡号" prop="cardNum">
				<el-input v-model="params.cardNum" placeholder="请输入银行卡号"></el-input>
			</el-form-item>
			<el-form-item label="所属门店" prop="shopId">
				<el-select v-model="params.shopId " placeholder="请选择所属门店">
					<el-option v-for="item in shop" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="时间">
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
			<el-form-item label="商户订单号（易宝）" prop="orderId">
				<el-input type="text" v-model="params.orderId " placeholder="请输入商户订单号"></el-input>
			</el-form-item>
			<el-form-item label="订单状态" prop="status">
				<el-select v-model="params.status" placeholder="请选择订单状态">
					<el-option v-for="item in orderstatus" :key="item.id" :label="item.label" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="还款方式" prop="repayType">
				<el-select v-model="params.repayType" placeholder="请选择">
					<el-option v-for="item in storage.fangsi" :key="item.id" :label="item.label" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-button class="filter-item" type="primary" icon="search" @click="getApplyList" style="margin-left: 20px;">查询
			</el-button>
			<el-button class="filter-item" @click="reset('params')" type="primary" icon="setting" style="margin-left: 20px;">重置
			</el-button>
		</el-form>
		<div class="filter-container" style="overflow:hidden;">
            <div style="float:right;">
                <el-button type="success" class="iconfont icon-xiazai1" @click="mingdao">扣款记录下载</el-button>
            </div>
        </div>
		<!-- 列表 -->
		<div class="filter-container">
			<!--<div class="tableheader">扣款记录</div>-->
			<div class="tablelayer">
				<!--序号号	订单编号	支付订单时间	借款人姓名	商户订单号（易宝）	还款方式	支付银行	银行卡号	订单金额	订单状态	错误信息	流水号（备注）-->
				<div class="tablelayer">
					<el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
						<el-table-column align="center" label="序号" width="60">
							<template scope="scope">
								<span>{{(params.pageIndex-1)*params.pageSize+parseInt(scope.$index) + 1}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="订单编号" width="200">
							<template scope="scope">
								<span>{{scope.row.orderNum}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="支付订单时间" width="180">
							<template scope="scope">
								<span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="借款人姓名" width="100">
							<template scope="scope">
								<img style="position: absolute;top: 0;left: 0;" v-show='scope.row.num>1' :src="imgxua"> {{scope.row.name}}
								<img style="position: absolute;top: 0;right: 0;" v-show='scope.row.borrowedNum>0' :src="imgxu">
							</template>
						</el-table-column>
						<el-table-column align="center" label="订单状态" width="100">
							<template scope="scope">
								{{scope.row.status | status}}
							</template>
						</el-table-column>
						<el-table-column align="center" label="商户订单号（易宝）" width="200">
							<template scope="scope">
								{{scope.row.requestNo}}
							</template>
						</el-table-column>
						<el-table-column align="center" label="还款方式" width="150">
							<template scope="scope">
								<span v-show="item.id == scope.row.repayType" v-for="(item,index) in storage.ReimbursementChannels" v-text="item.label" :key="index"></span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="支付银行" width="150">
							<template scope="scope">
								{{scope.row.bankName}}
							</template>
						</el-table-column>
						<el-table-column align="center" label="银行卡号" width="200">
							<template scope="scope">
								{{scope.row.bankCardNumber}}
							</template>
						</el-table-column>
						<el-table-column align="center" label="订单金额" width="100">
							<template scope="scope">
								{{scope.row.amount | formatMoney}}
							</template>
						</el-table-column>
						<el-table-column align="center" label="错误信息" width="200">
							<template scope="scope">
								{{scope.row.ybErrorMsg}}
							</template>
						</el-table-column>
						<el-table-column align="center" label="流水号（备注）" width="200">
							<template scope="scope">
								{{scope.row.ybOrderid}}
							</template>
						</el-table-column>
						<el-table-column align="center" fixed="right" label="退款" width="100">
							<template scope="scope">
								<el-button type="text" @click='certification(scope.row)' v-if='scope.row.status ==13'>操作</el-button>
								<span v-else>操作</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<!-- 分页 -->
		<div v-if="total" class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentPageChange" :current-page.sync="params.pageIndex" :page-sizes="[10,20,30, 50]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<!--弹框编辑-->
		<el-dialog title="编辑" :visible.sync="editAlert" width="30%" class="autoAlerta">
			<!--编辑-->
			<el-form  ref="alertFrom1" label-position="center" :model="form2" label-width="120px" style="width:450px;margin:0 auto;" @keyup.enter.native="submitEdit('alertFrom1')">
				<el-form-item label="订单号" prop="orderNum">
					<el-input v-model="form2.orderNum" readonly placeholder="请输入订单号" style="width:218"></el-input>
				</el-form-item>
				<el-form-item label="借款人" prop="name">
					<el-input v-model="form2.name" readonly placeholder="请输入借款人" style="width:218"></el-input>
				</el-form-item>
				<el-form-item label="银行卡号" prop="bankCardNo">
					<el-input v-model="form2.bankCardNo" readonly placeholder="请输入银行卡号" style="width:218"></el-input>
				</el-form-item>
				<el-form-item label="退款金额" prop="money">
					<el-input v-model="form2.money" placeholder="请输入退款金额" style="width:218"></el-input>
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
	import { storage } from '@constants/dataStorage';
	import { downloadExecl } from '@common/downloadExecl';
	import { formatTime, orderStatusnewFilter } from '@filters/index';
	import baseURL from '$lib/utils/baseURL';
	export default {
		data() {
			return {
				
				listLoading: false, //列表加载状态
				loading:false,
				editAlert:false,
				storage: storage,
				params: {
					pageSize: 10,
					pageIndex: 1,
					userName: '',
					shopId: '',
					cardNum: '',
					orderId: '',
					status: '', //订单号
					dateFrom: '',
					dateTo: '',
					repayType: '' //还款方式

				},
				form2:{
					orderNum:'',
					bankCardNo:'',
					payType:'',
					money:'',
					name:'',
					money:'',
					repayRequestNo:'',
				},
				total: '',
				time: null,
				datevalue: [], //搜索时间
				platList: [],
				dataList: [],
				shop: [], //店铺信息
				imgxu: require('@res/img/aa.png'), //续贷图片
				imgxua: require('@res/img/aaa.png'), //续贷图片
				orderstatus: [{
						label: '请求中',
						id: '10'
					},
					{
						label: '代扣中',
						id: '11'
					},
					{
						label: '代扣失败',
						id: '12'
					},
					{
						label: '代扣成功',
						id: '13'
					},{
						label: '退款成功',
						id: '14'
					},
				]
			}
		},
		computed: {},
		created() {
			this.getApplyList();
			this.getShop_area(); //获取门店和区域
		},
		mounted() {},
		methods: {
			 // 明天代还导出
			mingdao() {
				window.open(baseURL() + 'export/downListThirdOrderRepayLog?pageSize=' + this.params.pageSize +'&pageIndex='+ this.params.pageIndex +'&userName='+this.params.userName+'&shopId='+this.params.shopId +'&cardNum='+this.params.cardNum+'&orderId=' +this.params.orderId+'&status='+this.params.status+'&dateFrom='+this.params.dateFrom+'&dateTo='+this.params.dateTo+'&repayType='+this.params.repayType )
							//?pageSize=10&pageIndex=1&userName=&shopId=&cardNum=&orderId=&status=&dateFrom=&dateTo=&repayType=
			//	downloadExecl({ url: 'export/downListThirdOrderRepayLog', input: this.params, method: 'get' })
				
			},
			//获取门店和区域
			getShop_area() {
				ajax({
						url: 'PlatformData/UserPower',
						optionParams: {}
					}).post()
					.then(response => {
						if(response.code === 200) {
							let data = response.data;
							this.shop = data.shops ? data.shops : [];
						} else {
							this.$message.warning(response.message)
						}
					})
					.catch(error => {
						console.log(error)
					})
			},
			//获取列表
			getApplyList(isSeach) {
				if(isSeach) {
					this.params.pageIndex = 1;
				}
				this.listLoading = true;

				ajax({
						url: 'financeBalanceAccount/listThirdOrderRepayLog',
						optionParams: this.params
					}).post()
					.then(res => {
						if(res.code === 200) {
							this.dataList = res.data;
							this.total = res.total;
						} else {
							this.$message.warning(res.message)
						}
						this.listLoading = false;
					})
					.catch(error => {
						console.log(error)
					})
			},
			certification(row){
				this.editAlert =true
				console.log(row)
				this.form2.name = row.name
				this.form2.orderNum = row.orderNum
				this.form2.bankCardNo = row.bankCardNumber
				this.form2.money = row.money
				this.form2.payType = row.repayType
				this.form2.repayRequestNo = row.requestNo
				this.form2.money = ''
			},
			submitEdit(){
				if(this.form2.money == ''){
					this.$message.warning('请输入退款金额')
					return false
				}
				console.log(this.form2)
				ajax({
						url: 'financeBalanceAccount/refundLogAdd',
						optionParams: this.form2
					}).post()
					.then(res => {
						if(res.code === 200) {
							this.editAlert =false
							this.$message.warning(res.message)
							this.getApplyList();
						} else {
							this.$message.warning(res.message)
						}
						this.listLoading = false;
					})
					.catch(error => {
						console.log(error)
					})
			},
			//选择时间
			tTimeChange(value) {
				formatTime(value, this, 'params', 'dateFrom', 'dateTo');
			},
			// 改变每一页的条数
			handleSizeChange(val) {
				this.params.pageSize = val;
				this.params.pageIndex = 1;
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
			status(value) { //10:扣款中  11、扣款中  12、扣款失败 13、扣款成功',
				if(value) {
					if(value == 10 || value == 11) {
						return '扣款中'
					} else if(value == 12) {
						return '扣款失败'
					} else if(value == 13) {
						return '扣款成功'
					}else if(value == 14) {
						return '退款成功'
					}
				} else {
					return ''
				}
			}
		}
	}
</script>
<style lang="less" scoped>

</style>