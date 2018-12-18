<template>
    <div class="app-container calendar-list-container ggg_user" v-loading="loading">
        <div id="main"></div>
        <p></p>
        <div id="main1" v-show="isShow"></div>
        <p></p>
        <div id="main2" v-show="isShow"></div>
        <p></p>
        <div id="main3" v-show="isShow"></div>
        <p></p>
        <div id="main4" v-show="isShow"></div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { Common } from '@common/common';
export default {
    data() {
        return {
            loading: true,
            isShow: false
        }
    },
    computed: {
    },
    created() {
    },
    mounted() {
        this.gtedata();
    },
    methods: {
        gtedata() {
            ajax({
                url: 'diagram/getDiagramData',
                optionParams: {}
            }).post()
                .then(response => {
                    if (response.code === 200) {
                        console.log(response)
                        this.init(response.data.list1);
                        this.init1(response.data.list2);
                        this.init2(response.data.list3);
                        this.init3(response.data.list4);
                        this.init4(response.data.list5);
                    } else {
                        this.$message.warning(response.message)
                    }
                    this.loading = false
                    this.isShow = true;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        init(data) {
            let date = [];//时间
            let applyNum = [];//进件量
            let loanPassRate = [];//放款通过率
            let loanSucNum = [];//放款笔数
            let realPayAmout = [];//放款金额
            data.map((item) => {
                // console.log(item)
                date.push(item.date)
                applyNum.push(item.applyNum)
                loanPassRate.push(item.loanPassRate)
                loanSucNum.push(item.loanSucNum)
                realPayAmout.push(item.realPayAmout)
            })
            let loanPassRate1 = JSON.parse(JSON.stringify(loanPassRate))
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('main'));
            var colors = ['#144781', '#3f81da', '#5c47d1', '#ff9400'];
            let option = {
                color: colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    // formatter: (params) => {
                    //     var relVal = params[0].name + "<br/>";
                    //     relVal += params[0].seriesName + ' : ' + params[0].value + "<br/>";
                    //     relVal += params[1].seriesName + ' : ' + params[1].value + "<br/>";
                    //     relVal += params[2].seriesName + ' : ' + params[2].value + "<br/>";
                    //     relVal += params[3].seriesName + ' : ' + params[3].value + "%";
                    //     return relVal;

                    // }
                },
                grid: {
                    right: '20%'
                },
                //工具
                // toolbox: {
                //     feature: {
                //         dataView: { show: true, readOnly: false },
                //         restore: { show: true },
                //         saveAsImage: { show: true }
                //     }
                // },
                legend: {
                    data: ['进件量', '放款笔数', '放款金额', '放款通过率'] //控制顶部各数据显示的颜色
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: date
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '进件量',
                        // min: 0,
                        // max: 250,
                        position: 'right',
                        axisLine: {
                            lineStyle: {
                                color: colors[0]
                            }
                        },
                        axisLabel: {
                            formatter: '{value}' //y轴名字格式
                        }
                    },
                    {
                        type: 'value',
                        name: '放款笔数',
                        min: 0,
                        // max: 250,
                        position: 'right',
                        offset: 70,
                        axisLine: {
                            lineStyle: {
                                color: colors[1]
                            }
                        },
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '放款金额',
                        min: 0,
                        // max: 25,
                        position: 'left',
                        axisLine: {
                            lineStyle: {
                                color: colors[2]
                            }
                        },
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '放款通过率',
                        min: loanPassRate1.sort(Common.compare(undefined, true))[0],
                        // max: 100,
                        position: 'right',
                        offset: 140,
                        axisLine: {
                            lineStyle: {
                                color: colors[3]
                            }
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: [
                    {
                        name: '进件量',
                        type: 'bar',
                        data: applyNum,
                        barGap: '10%'
                    },
                    {
                        name: '放款笔数',
                        type: 'bar',
                        yAxisIndex: 1,
                        data: loanSucNum
                    },
                    {
                        name: '放款金额',
                        type: 'bar',
                        yAxisIndex: 2,
                        barGap: '10%',
                        data: realPayAmout
                    },
                    {
                        name: '放款通过率',
                        type: 'line',
                        yAxisIndex: 3,
                        data: loanPassRate
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        init1(data) {
            let date = [];//时间
            let alAmount = [];//实际还款金额
            let dueAmount = [];//应还款金额
            let unAmount = [];//未还款金额
            data.map((item) => {
                if (parseInt(item.alAmount) != 0) {
                    date.push(item.date)
                    alAmount.push(item.alAmount)
                    dueAmount.push(item.dueAmount)
                    unAmount.push(item.unAmount)
                }
            })
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('main1'));
            var colors = ['#144781', '#3f81da', '#5c47d1'];
            let option = {
                color: colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: true
                        }
                    }
                },
                grid: {
                    right: '20%'
                },
                //工具
                // toolbox: {
                //     feature: {
                //         dataView: { show: true, readOnly: false },
                //         restore: { show: true },
                //         saveAsImage: { show: true }  
                //     }
                // },
                legend: {
                    data: ['应还款金额', '实际还款金额', '未还款金额']
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: date
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '金额'
                    }
                ],
                series: [
                    {
                        name: '应还款金额',
                        type: 'bar',
                        data: dueAmount,
                        barGap: '10%'
                    },
                    {
                        name: '实际还款金额',
                        type: 'bar',
                        data: alAmount,
                        barGap: '10%'
                    },
                    {
                        name: '未还款金额',
                        type: 'bar',
                        data: unAmount,
                        barGap: '10%'
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        init2(data) {
            let date = [];//时间
            let returnMoneyRate = [];//回款率
            let unNum = [];//未还款笔数
            data.map((item) => {
                if (parseInt(item.returnMoneyRate) != 0) {
                    date.push(item.date)
                    returnMoneyRate.push(item.returnMoneyRate)
                    unNum.push(item.unNum)
                }
            })
            let returnMoneyRate1 = JSON.parse(JSON.stringify(returnMoneyRate))
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('main2'));
            var colors = ['#3f81da', '#ff9400'];
            let option = {
                color: colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: true
                        }
                    },
                    // formatter: (params) => {
                    //     var relVal = params[0].name + "<br/>";
                    //     relVal += params[0].seriesName + ' : ' + params[0].value + "<br/>";
                    //     relVal += params[1].seriesName + ' : ' + params[1].value + "%";
                    //     return relVal;

                    // }
                },
                grid: {
                    right: '20%'
                },
                legend: {
                    data: ['未还款笔数', '回款率']
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: date
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '未还款笔数',
                        axisLine: {
                            lineStyle: {
                                color: colors[0]
                            }
                        },
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '回款率',
                        min: returnMoneyRate1.sort(Common.compare(undefined, true))[0],
                        // max: 100,
                        position: 'right',
                        axisLine: {
                            lineStyle: {
                                color: colors[1]
                            }
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: [
                    {
                        name: '未还款笔数',
                        type: 'bar',
                        barMaxWidth: 30,//最大宽度
                        data: unNum,
                        barGap: '10%'
                    },
                    {
                        name: '回款率',
                        type: 'line',
                        yAxisIndex: 1,
                        data: returnMoneyRate
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        init3(data) {
            let date = [];//时间
            let overDueOrdNum = [];//逾期笔数
            let overDueRate = [];//逾期率
            data.map((item) => {
                //console.log(item)
                date.push(item.date)
                overDueOrdNum.push(item.overDueOrdNum)
                overDueRate.push(item.overDueRate)
            })
            let overDueRate1 = JSON.parse(JSON.stringify(overDueRate))
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('main3'));
            var colors = ['#3f81da', '#ff9400'];
            let option = {
                color: colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: true
                        }
                    },
                    // formatter: (params) => {
                    //     var relVal = params[0].name + "<br/>";
                    //     relVal += params[0].seriesName + ' : ' + params[0].value + "<br/>";
                    //     relVal += params[1].seriesName + ' : ' + params[1].value + "%";
                    //     return relVal;

                    // }
                },
                grid: {
                    right: '20%'
                },
                legend: {
                    data: ['逾期笔数', '逾期率（笔数）']
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: date
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '逾期笔数',
                        axisLine: {
                            lineStyle: {
                                color: colors[0]
                            }
                        },
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '逾期率（笔数）',
                        min: overDueRate1.sort(Common.compare(undefined, true))[0],
                        // max: 100,
                        position: 'right',
                        axisLine: {
                            lineStyle: {
                                color: colors[1]
                            }
                        },
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: [
                    {
                        name: '逾期笔数',
                        type: 'bar',
                        barMaxWidth: 30,//最大宽度
                        data: overDueOrdNum,
                        barGap: '10%'
                    },
                    {
                        name: '逾期率（笔数）',
                        type: 'line',
                        yAxisIndex: 1,
                        data: overDueRate
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        init4(data) {
            let date = [];//时间
            let unRePayPrincAmount = [];//逾期剩余金额（本金）
            let unRePayPrincAmountRate = [];//逾期率（剩余本金）
            data.map((item) => {
                date.push(item.date)
                unRePayPrincAmount.push(item.unRePayPrincAmount)
                unRePayPrincAmountRate.push(item.unRePayPrincAmountRate)
            })
            let unRePayPrincAmountRate1 = JSON.parse(JSON.stringify(unRePayPrincAmountRate))
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('main4'));
            var colors = ['#3f81da', '#ff9400'];
            let option = {
                color: colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: true
                        }
                    },
                    // formatter: (params) => {
                    //     var relVal = params[0].name + "<br/>";
                    //     relVal += params[0].seriesName + ' : ' + params[0].value + "<br/>";
                    //     relVal += params[1].seriesName + ' : ' + params[1].value + "%";
                    //     return relVal;

                    // }
                },
                grid: {
                    right: '20%'
                },
                legend: {
                    data: ['逾期剩余金额（本金）', '逾期率（剩余本金）']
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: date
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '金额',
                        axisLine: {
                            lineStyle: {
                                color: colors[0]
                            }
                        },
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '百分比',
                        min: unRePayPrincAmountRate1.sort(Common.compare(undefined, true))[0],
                        // max: 100,
                        position: 'right',
                        axisLine: {
                            lineStyle: {
                                color: colors[1]
                            }
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: [
                    {
                        name: '逾期剩余金额（本金）',
                        type: 'bar',
                        barMaxWidth: 30,//最大宽度
                        data: unRePayPrincAmount,
                    },
                    {
                        name: '逾期率（剩余本金）',
                        type: 'line',
                        yAxisIndex: 1,
                        data: unRePayPrincAmountRate,
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
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
.ggg_user {
    >div {
        width: 1000px;
        height: 400px;
        margin: 0 auto;
    }
    >p {
        width: 70%;
        height: 2px;
        background: #f5f5f5;
        margin: 50px auto;
    }
}
</style>


