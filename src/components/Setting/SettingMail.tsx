import * as React from 'react'
import { Form, Input, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { getRequest } from '../../utils/utils'
import API from 'src/config/api'

interface Props { }
interface State {
    loading: boolean
    token: any
    defaultData: any
}
class SettingMail extends React.Component<Props & FormComponentProps, State> {
    public state: State
    constructor(props: Props & FormComponentProps) {
        super(props)
        this.state = {
            loading: false,
            token: '',
            defaultData: {}
        }
    }

    componentDidMount() {
        this.setState({ token: localStorage.getItem('jiaToken') }, () => {
            this.getDefaultData()
        })
    }

    private handleSubmit = (e: any) => {
        e.preventDefault()
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.setState({
                    loading: true
                })

                getRequest({
                    url: API.configSend,
                    token: this.state.token,
                    data: {
                        mailTo: values.testEmail
                    },
                    succ: (data: any) => {
                        this.setState({
                            loading: false
                        })
                        this.props.form.resetFields(['testEmail'])
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
            }
        })
    }
    private getDefaultData() {
        getRequest({
            url: API.configGet,
            token: this.state.token,
            data: {},
            succ: (data: any) => {
                this.setState({
                    defaultData: JSON.parse(data).mail
                })
            }
        })
    }

    render() {
        const { form } = this.props
        const { getFieldDecorator } = form

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 10 }
        }
        const formTailLayout = {
            wrapperCol: {
                xs: { span: 10, offset: 4 },
                sm: { span: 10, offset: 4 }
            }
        }
        const { defaultData } = this.state
        let lableKey = []
        for (let i in defaultData) {
            lableKey.push(i)
        }

        return (
            <div>
                <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }}>
                    {lableKey.map(function (ele, index) {
                        return defaultData[ele] !== '' ? (
                            <Form.Item
                                {...formItemLayout}
                                label={ele}
                                key={index}
                            >
                                {getFieldDecorator(`forms[${ele}]`, {
                                    initialValue: defaultData[ele]
                                })(<Input disabled />)}
                            </Form.Item>
                        ) : null
                    })}
                    <Form.Item {...formItemLayout} label="测试地址">
                        {getFieldDecorator('testEmail', {
                            rules: [
                                {
                                    message: '请输入测试地址',
                                    required: true
                                }
                            ]
                        })(
                            <Input
                                size="large"
                                type="email"
                                placeholder="请输入测试地址"
                            />
                        )}
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

export default Form.create({})(SettingMail)
