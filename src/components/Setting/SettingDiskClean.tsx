import * as React from 'react'
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Button, Select,Input,Modal,Radio } from 'antd';
import { getRequest } from '../../utils/utils'
import API from 'src/config/api'

interface Props { }
interface State {
    loading: boolean
    token: any
    defaultData: any
    isEvent: boolean
    formRef: React.RefObject<FormInstance>
    logInfo: any
}
class SettingDiskClean extends React.Component<Props, State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            isEvent: false,//true 是用户动态 false是历史
            loading: false,
            token: '',
            defaultData: {
                types: 'job_total'
            },
            logInfo: {},
            formRef: React.createRef<FormInstance>()
        }
    }

    componentDidMount() {
        this.setState({ token: localStorage.getItem('jiaToken') }, () => {
            this.getLogInfo()
        })

    }
    private getLogInfo = () => {
        getRequest({
            url: API.logInfo,
            token: this.state.token,
            data: {},
            succ: (data: any) => {
                this.setState({
                    logInfo: data
                })
            }
        })
    }
    private onChange = (e:any) => {
        const currentValue = e.target.value
        if (currentValue == 'job_total'){
            this.setState({
                isEvent: false
            })
        } else {
            this.setState({
                isEvent: true
            })
        }
    }

    private handleSubmit = (e: any) => {
        // e.preventDefault()
        this.state.formRef.current?.validateFields().then((values) => {
            // if (!err) {
                this.setState({
                    loading: true
                })

                getRequest({
                    url: API.CleanLog,
                    token: this.state.token,
                    data: {
                        offset: Number(values.offset),
                        unit: values.unit,
                        isEvent: this.state.isEvent
                    },
                    succ: (data: any) => {
                        this.setState({
                            loading: false
                        })
                        Modal.success({
                            content: `成功清理了${data.total}条数据～`,
                            onOk:()=> {
                                this.setState({
                                    isEvent: false
                                })
                                this.state.formRef.current?.resetFields()
                                this.getLogInfo()
                            }
                        });
                        
                    },
                    error: () => {
                        this.setState({
                            loading: false
                        })
                    },
                    catch: () => {
                        this.setState({
                            loading: false
                        })
                    }
                })
            // }
        })
    }


    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        }
        const formTailLayout = {
            wrapperCol: {
                xs: { span: 18, offset: 4 },
                sm: { span: 18, offset: 4 }
            }
        }
        const { defaultData,logInfo,isEvent } = this.state

        return (
            <div>
                <Form 
                    onFinish={this.handleSubmit} 
                    style={{ marginTop: 20 }} 
                    ref={this.state.formRef}
                    initialValues={
                        defaultData
                    }
                >
                    <Form.Item {...formItemLayout} label="总量">
                        <span style={{color: 'red'}}>{isEvent ? logInfo.event_total : logInfo.job_total}</span> 条
                    </Form.Item>

                    <Form.Item {...formItemLayout} name="types" label="类型">
                        <Radio.Group onChange={this.onChange}>
                            <Radio value="job_total">job动态</Radio>
                            <Radio value="event_total">用户动态</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item 
                        {...formItemLayout} 
                        label="清理"
                    >
                        <Input.Group compact>
                            <Form.Item 
                                name="offset" 
                                {...formItemLayout}
                                rules={[{ required: true, message: '请输入时间1' }]}
                            >
                                <Input type="number" size="large" style={{ width: 120 }} placeholder="请输入时间"/>
                            </Form.Item>
                            <Form.Item 
                                name="unit" 
                                {...formItemLayout}
                                rules={[{ required: true, message: '请选择单位' }]}
                            >
                                <Select size="large" style={{ width: 120 }} allowClear placeholder="选择单位">
                                    <Select.Option value="month">月</Select.Option>
                                    {/* <Select.Option value="week">周前</Select.Option> */}
                                    <Select.Option value="day">日</Select.Option>
                                    {/* <Select.Option value="hour">小时前</Select.Option> */}
                                </Select>
                            </Form.Item>
                            <Form.Item style={{ marginTop: 4,marginLeft:10 }}>
                                <span>前的动态</span>
                            </Form.Item>
                        </Input.Group>
                        
                    </Form.Item>
                    <Form.Item {...formTailLayout}>
                        <Button
                            style={{ minWidth: 120, height: 38 }}
                            className="ant-btn-primary"
                            htmlType="submit"
                            loading={this.state.loading}
                        >
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
export default SettingDiskClean
