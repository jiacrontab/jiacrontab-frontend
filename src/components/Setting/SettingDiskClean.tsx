import * as React from 'react'
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Button, Select,Input } from 'antd';
import { getRequest } from '../../utils/utils'
import API from 'src/config/api'

interface Props { }
interface State {
    loading: boolean
    token: any
    defaultData: any
    formRef: React.RefObject<FormInstance>
}
class SettingDiskClean extends React.Component<Props, State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            loading: false,
            token: '',
            defaultData: {
            },
            formRef: React.createRef<FormInstance>()
        }
    }

    componentDidMount() {
        this.setState({ token: localStorage.getItem('jiaToken') })
    }

    private handleSubmit = (e: any) => {
        // e.preventDefault()
        this.state.formRef.current?.validateFields().then((values) => {
            // if (!err) {
                this.setState({
                    loading: true
                })

                getRequest({
                    url: API.CleanJobHistory,
                    token: this.state.token,
                    data: {
                        offset: values.offset,
                        unit: values.unit
                    },
                    succ: (data: any) => {
                        this.setState({
                            loading: false
                        })
                        this.state.formRef.current?.resetFields()
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
        const { defaultData } = this.state

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
                    <Form.Item 
                        {...formItemLayout} 
                        label="清除日志文件"
                    >
                        <Input.Group compact>
                            <Form.Item 
                                name="offset" 
                                {...formItemLayout}
                                rules={[{ required: true, message: '请输入时间' }]}
                            >
                                <Input size="large" style={{ width: 130 }} placeholder="请输入时间"/>
                            </Form.Item>
                            <Form.Item 
                                name="unit" 
                                {...formItemLayout}
                                rules={[{ required: true, message: '请选择时间单位' }]}
                            >
                                <Select size="large" style={{ width: 150 }} allowClear placeholder="选择时间单位">
                                    <Select.Option value="month">月前</Select.Option>
                                    <Select.Option value="week">周前</Select.Option>
                                    <Select.Option value="day">日前</Select.Option>
                                    <Select.Option value="hour">小时前</Select.Option>
                                </Select>
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
