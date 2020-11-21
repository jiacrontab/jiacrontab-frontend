import * as React from 'react'
import './Login.css'
import API from '../../config/api'
import Canvas from '../../components/Canvas/Canvas'
import Footers from '../../components/footer'
import { getRequest } from '../../utils/utils'
import { FormInstance } from 'antd/lib/form';

import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { Form } from 'antd';
// import '@ant-design/compatible/assets/index.css';

import { Button, Input, Checkbox, Layout } from 'antd';
// import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { getCookie } from 'src/utils/cookie'
const { Content, Footer } = Layout

interface IUserFormProps {
    age: number
    name: string
    history: any
}
interface State {
    loginForm: any,
    loading: boolean,
    formRef: React.RefObject<FormInstance>
}



class Login extends React.Component<IUserFormProps, State> {
    public state: State
    constructor(props: IUserFormProps) {
        super(props)
        // const [form] = Form.useForm()
        this.state = {
            loginForm: {
                password: '',
                username: ''
            },
            loading: false,
            formRef: React.createRef<FormInstance>()
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

    public submitForm() {
        // e.preventDefault()
        this.state.formRef.current?.validateFields().then(value => {
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
                                let templeToken = data
                                localStorage.setItem(
                                    'jiaToken',
                                    templeToken.token
                                )
                                localStorage.setItem('userInfo', JSON.stringify(data))
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
        })
    }

    public render(): any {
        return (
            <div className="login-page">
                <Canvas />
                <Layout>
                    <Layout className="login-panel">
                        <Content>
                            <Form
                                ref={this.state.formRef}
                                onFinish={this.submitForm}
                                style={{
                                    background: '#fff',
                                    borderRadius: '4px',
                                    width: '100%',
                                    padding: '40px'
                                }}
                                className="login-form"
                                name="loginForm"
                                initialValues={{ remember: true }}
                            >
                                <div className="login-header">Jiacrontab</div>
                                <div className="login-sub">
                                    简单可信赖的任务管理工具
                                </div>
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: '请输入用户名' }]}
                                >
                                    <Input
                                        onChange={this.handleInputChange}
                                        size="large"
                                        prefix={
                                            <UserOutlined
                                                style={{
                                                    color: 'rgba(0,0,0,.25)'
                                                }} />
                                        }
                                        placeholder="请输入用户名"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="passwd"
                                    rules={[{ required: true, message: '请输入密码' }]}

                                >
                                    <Input
                                        onChange={this.handleInputChange}
                                        size="large"
                                        prefix={
                                            <LockOutlined
                                                style={{
                                                    color: 'rgba(0,0,0,.25)'
                                                }} />
                                        }
                                        type="password"
                                        placeholder="请输入密码"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="remember"
                                    rules={[{ required: true }]}
                                    valuePropName="checked"
                                >
                                    <Checkbox>记住我</Checkbox>
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        loading={false}
                                        block
                                        size='large'
                                    >
                                        登录
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Content>
                    </Layout>
                    <Footer className="jia-footer">
                        <Footers />
                    </Footer>
                </Layout>
            </div>
        );
    }
}

export default Login
