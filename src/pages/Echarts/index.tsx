import React, { memo, useEffect, useRef, useState } from "react";
// import data from "./data.json"
import { filterData } from "./utils/filterData";
import ReactECharts from 'echarts-for-react';
import {
    ProCard,
    ProForm,
    ProFormText,
    ProFormDateRangePicker
} from '@ant-design/pro-components';
import styled from "styled-components"
import { getDataFromSouHu, getName } from "./server";
import { message } from "antd";
import { Live2D } from "./live2d";
import { FirstInfoType, TempInfoType } from "./interface";
const Main = styled.div`
    padding:22px;
    min-height:800px;
    background:white;
    b{
        font-size:16px;
    }
`
const CardList = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
`
export default memo(() => {
    const [echartData, setEchartData] = useState<TempInfoType[]>([])
    const [tempInfo, setTempInfo] = useState<TempInfoType>({
        date: '',
        value: 0
    })
    const [firstInfo, setFirstInfo] = useState<FirstInfoType>({
        date: '',
        value: 0
    })
    const [baseInfo, setBaseInfo] = useState(['股票编号', 0, "股票名称"])
    let timer = useRef()

    const handleData = (data) => {
        let result = filterData(data)
        let i = 0;
        let list = result.reverse()
        setFirstInfo(list[0])
        if (timer.current) clearInterval(timer.current)
        let copyEchartData: any[] = []
        timer.current = setInterval(() => {
            if (i >= list.length) {
                clearInterval(timer.current)
            } else {
                if (copyEchartData.length < 80) {
                    copyEchartData.push(list[i])
                    setTempInfo(list[i])
                } else {
                    copyEchartData.shift()
                    copyEchartData.push(list[i])
                    setTempInfo(list[i])
                }
                let sliceData = [...copyEchartData]
                setEchartData(sliceData)
                i = i + 1
            }
        }, 100)
    }
    const getNameInfo = async (code: string) => {
        let reponse = await getName(code)
        if (reponse.status == 200) {
            setBaseInfo(reponse.result[0])
        } else {
            message.info('未查询到相关股票')
        }
    }
    const options = {
        // backgroundColor:'#DFDFDF',
        title: {
            text: `${baseInfo[2]}-${baseInfo[0]}`
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            name: '日期',
            nameLocation: 'middle',
            nameGap: 30,
            type: "category",
            animation: false,
            splitLine: {
                show: false
            },
            data: [...echartData.map(item => item.date)]
        },
        yAxis: {
            name: '单股价格',
            type: 'value',
            nameGap: 20,
            nameLocation: 'middle',
            boundaryGap: [0, '100%'],
            animation: false,
            splitLine: {
                show: true
            }
        },
        grid: {
            top: 80,
        },
        series: [
            {
                name: '股价',
                type: 'line',
                showSymbol: false,
                data: echartData,
                smooth: true,
                endLabel: {
                    show: true,
                    formatter: function (params: any) {
                        return `100股：${Math.ceil(params.data.value * 100)}元`
                    }
                },
            }
        ]
    }
    const handleSubmit = async (values: any) => {
        let result = await getDataFromSouHu(values)
        if (result[0] && result[0].status == 0) {
            handleData(result[0].hq)
        } else {
            message.error('获取数据失败')
        }
    }
    return <Main>
        <ProForm
            style={{ marginBottom: '25px' }}
            onFinish={async (values: any) => {
                if (timer.current) clearInterval(timer.current)
                const { code } = values
                await getNameInfo(code)
                await handleSubmit({ ...values, code: 'cn_' + code })
            }}
            layout={'inline'}>
            <ProForm.Group>
                <ProFormText
                    name="code"
                    label="股票编号"
                    tooltip="最长为 24 位"
                    placeholder="请输入股票编号"
                />
                <ProFormDateRangePicker
                    transform={(values: any) => {
                        return {
                            start: values ? values[0].replaceAll('-', '') : undefined,
                            end: values ? values[1].replaceAll('-', '') : undefined,
                        };
                    }}
                    width="md"
                    name="createTimeRanger"
                    label="合同生效时间"
                />
            </ProForm.Group>
        </ProForm>
        <ReactECharts style={{ height: '600px' }} option={options} />
        <CardList>
            <ProCard
                title="基本信息"
                style={{ height: '120px' }}
                boxShadow
            >
                <div>股票名称：<b>{baseInfo[2]}</b></div>
                <div>股票编号：<b> {baseInfo[0]}</b></div>
            </ProCard>
            <ProCard
                title="股票单价"
                style={{ height: '120px' }}
                boxShadow
            >
                <div>{tempInfo.date ?? "时间"}: <b >{tempInfo.value ?? "---"}元</b></div>
            </ProCard>
            <ProCard
                style={{ height: '120px' }}
                title="盈利情况"
                boxShadow
            >
                <div>
                    总盈收：<b style={{ color: (Math.ceil((tempInfo.value ?? 0) - (firstInfo.value ?? 0)) > 0 ? 'red' : 'black') }}>{`${(Math.ceil(((tempInfo.value ?? 0) - (firstInfo.value ?? 0)) * 100))}`}元</b>
                </div>
            </ProCard>
        </CardList>
        <Live2D></Live2D>
    </Main>
})