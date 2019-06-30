import * as React from 'react'
import './Login.css'
import API from '../../config/api'
import Canvas from '../../components/Canvas/Canvas'
import Footers from '../../components/footer'
import { getRequest } from '../../utils/utils'

import { Form, Button, Input, Checkbox, Icon, Layout } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { getCookie } from 'src/utils/cookie'
const { Content, Footer } = Layout

interface IUserFormProps extends FormComponentProps {
    age: number
    name: string
    history: any
}

const FormItem = Form.Item

class Login extends React.Component<IUserFormProps> {
    constructor(props: IUserFormProps) {
        super(props)
        this.state = {
            loginForm: {
                password: '',
                username: ''
            },
            loading: false
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }

    public componentDidMount(): void {
        if (getCookie('ready') === 'false') {
            this.props.history.push('/init')
            return
        }
    }

    public handleInputChange(event: any) {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            loginForm: {
                password: value,
                username: name
            }
        })
    }

    public submitForm(e: any) {
        e.preventDefault()
        this.props.form.validateFields((err: any, value: any) => {
            if (!err) {
                getRequest({
                    url: API.LoginConfig,
                    data: {
                        ...value
                    },
                    succ: (data: any) => {
                        this.setState(
                            {
                                loading: false
                            },
                            () => {
                                //开始跳转
                                if (window.localStorage) {
                                    let templeToken = JSON.parse(data)
                                    localStorage.setItem(
                                        'jiaToken',
                                        templeToken.token
                                    )
                                    localStorage.setItem('userInfo', data)
                                }
                                this.props.history.push('/home')
                            }
                        )
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

    public render(): any {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="login-page">
                <Canvas />
                <Layout>
                    <Layout className="login-panel">
                        <Content>
                            <Form
                                onSubmit={this.submitForm}
                                style={{
                                    background: '#fff',
                                    borderRadius: '4px',
                                    width: '100%',
                                    padding: '40px'
                                }}
                                className="login-form"
                            >
                                <div className="login-header">Jiacrontab</div>
                                <div className="login-sub">
                                    简单可信赖的任务管理工具
                                </div>
                                <FormItem>
                                    {getFieldDecorator('username', {
                                        rules: [
                                            {
                                                message: '请输入用户名',
                                                required: true,
                                                whitespace: true
                                            }
                                        ]
                                    })(
                                        <Input
                                            name="username"
                                            onChange={this.handleInputChange}
                                            size="large"
                                            prefix={
                                                <Icon
                                                    type="user"
                                                    style={{
                                                        color: 'rgba(0,0,0,.25)'
                                                    }}
                                                />
                                            }
                                            placeholder="请输入用户名"
                                        />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('passwd', {
                                        rules: [
                                            {
                                                message: '请输入密码',
                                                required: true,
                                                whitespace: true
                                            }
                                        ]
                                    })(
                                        <Input
                                            name="passwd"
                                            onChange={this.handleInputChange}
                                            size="large"
                                            prefix={
                                                <Icon
                                                    type="lock"
                                                    style={{
                                                        color: 'rgba(0,0,0,.25)'
                                                    }}
                                                />
                                            }
                                            type="password"
                                            placeholder="请输入密码"
                                        />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('remember', {
                                        initialValue: true,
                                        valuePropName: 'checked'
                                    })(<Checkbox>记住我</Checkbox>)}
                                    <Button
                                        htmlType="submit"
                                        className="login-form-button ant-btn-primary"
                                        loading={false}
                                        block
                                    >
                                        登录
                                    </Button>
                                </FormItem>
                            </Form>
                        </Content>
                    </Layout>
                    <Footer className="jia-footer">
                        <Footers />
                    </Footer>
                </Layout>
            </div>
        )
    }
}

export default Form.create({})(Login)
