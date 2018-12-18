var storage = {};
//订单状态
storage.orderStatus = [
    { label: '申请成功', id: '1' },
    { label: '自动拒件（初审）', id: '2' },
    { label: '信审通过', id: '3' },
    { label: '信审拒绝', id: '4' },
    { label: '终审通过(待合同上传) ', id: '5' },
    { label: '终审拒绝', id: '6' },
    { label: '终审驳回', id: '7' },
    { label: '合同上传成功(待放款)', id: '8' },
    { label: '财务通过', id: '9' },
    { label: '财务拒绝 ', id: '10' },
    { label: '财务驳回 ', id: '11' },
    { label: '自动拒件（合同）', id: '12' },
    { label: '放款中', id: '30' },
    { label: '放款失败', id: '31' },
    { label: '放款成功', id: '32' },
    { label: '完成', id: '40' }
]
// 当期状态
storage.repaymentStatus1 = [
    { label: '无', id: 0 },
    { label: '未还款', id: '10' },
    { label: '逾期', id: '11' },
    { label: '已还款', id: '20' }
]
//订单来源
storage.source = [
    { label: '线下', id: 0 },
    { label: 'IOS', id: 1 },
    { label: 'Android', id: 2 }
]
//银行状态
storage.bankStatus = [
    { label: '成功', id: 'SUCCESS' },
    { label: '失败', id: 'FAIL' },
    { label: '银行处理中', id: 'DOING' },
    { label: '等待发送银行', id: 'WAITINGTOBANK' }
]
//平账状态
storage.isBalancedStatus = [
    { label: '否', id: 0 },
    { label: '是', id: '1' },
]
//还款渠道 payType (integer, optional): 这个页面写死 还款渠道 10(易宝主动支付) 11(易宝被动支付) 20:店长还款 50:管理员操作 ,
//搜索用
storage.ReimbursementChannelsSeach = [
    {label: '易宝主动支付', id: 10},
    {label: '易宝被动支付', id: 11},
    {label: '店长还款', id: 20},
    {label: '管理员操作', id: 50}
]
//职位
storage.ReimbursementChannelsSeachzhi = [
    {label: '业务员', id: 1},
    {label: '营业部经理', id: 4},
    {label: '门店信审', id: 6},
    {label: '门店行政', id: 8},
    {label: '门店法催', id: 10}
]
//表格用
//还款渠道 payType (integer, optional): 这个页面写死 还款渠道 10(易宝主动支付) 11(易宝被动支付) 20:店长还款 50:管理员操作 ,
storage.ReimbursementChannels = [
     { label: '微网页支付', id: 70 },
    { label: '主动支付', id: 10 },
     { label: '本金结清', id: 42 },
    { label: '被动支付', id: 11 },
    { label: '线下正常还款', id: 30 },
    { label: '线下一般还款', id: 31 },
    { label: '线下特殊还款', id: 32 },
    { label: '线下正常结清', id: 40 },
    { label: '线下非正常结清', id: 41 },
    { label: '管理员操作', id: 50 }
]
//还款方式
storage.fangsi = [
    { label: '易宝主动支付', id: 10 },
     { label: '易宝被动支付', id: 11 },
    { label: '线下正常还款', id: 30 },
    { label: '线下一般还款', id: 31 },
    { label: '线下特殊还款', id: 32 },
    { label: '线下正常结清', id: 40 },
    { label: '线下非正常结清', id: 41 },
    { label: '本金结清', id: 42 },
    { label: '管理员操作', id: 50 },
     { label: '微网页支付', id: 70 },
]
//已还款状态
storage.repaymentStatus = [
    { label: '待还款', id: 0 },
    { label: '还款失败', id: 1 },
    { label: '还款成功', id: 2 },
    { label: '处理中', id: 3 }
]
//催收结果
storage.collectResults = [
    { label: '已还钱', id: 1 },
    { label: '承诺全额还款', id: 2 },
    { label: '承诺部分还款', id: 3 },
    { label: '联系不上', id: 4 },
    { label: '态度强硬', id: 5 },
    { label: '没钱还', id: 6 }
]
//催收结果
storage.collectResultsa = [
    { label: '门店催收', id: 1 },
    { label: '总部电催', id: 2 },
    { label: '门店法催', id: 3 },
    { label: '总部电催', id: 4 },
]
//还款方式
storage.repayType = [
    { label: '主动支付', id: 1 },
    { label: '店长还款', id: 2 },
    { label: '店长代扣', id: 3 },
    { label: '支付宝还款', id: 4 },
    { label: '管理员修改', id: 5 },
    { label: '被动扣款', id: 6 }
]
//在职
storage.zaizhi = [
    { label: '在职', id: 1 },
    { label: '离职', id: -1 },
   
]
// <el-option v-for="item in storage.collectResults" :key="item.id" :label="item.label" :value="item.id + ''"></el-option>
export {
    storage
}