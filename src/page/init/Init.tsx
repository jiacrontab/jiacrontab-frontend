import * as React from 'react'
import './Init.css'
import API from '../../config/api'
import Footers from '../../components/footer'
import { getRequest } from '../../utils/utils'

import { Form, Button, Input, Icon, Layout, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { setCooket } from 'src/utils/cookie'
const { Content, Footer } = Layout
const FormItem = Form.Item

function hasErrors(fieldsError: object) {
    return Object.keys(fieldsError).some(field => fieldsError[field])
}
interface Props {
    history?: any
}
class Init extends React.Component<FormComponentProps & Props> {
    constructor(props: FormComponentProps) {
        super(props)
    }

    state = {
        isMysql: false,
        loading: false
    }

    public componentDidMount() {
        //driverName dsn
        // DSN (Data Source Name)
        //[username[:password]@][protocol[(address)]]/dbname[?param1=value1&...&paramN=valueN]
    }
    private handleSubmit = (e: any) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                getRequest({
                    url: API.AppInit,
                    data: {
                        ...values
                    },
                    succ: (data: any) => {
                        this.setState(
                            {
                                loading: false
                            },
                            () => {
                                setCooket('ready', 'true')
                                this.props.history.push('/login')
                                message.success('已成功初始化，请登录')
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

    public render() {
        const { getFieldDecorator, getFieldsError } = this.props.form
        return (
            <Layout className="init-page" style={{ minHeight: '100vh' }}>
                <Content>
                    <div className="login-panel">
                        <Form
                            onSubmit={this.handleSubmit}
                            style={{
                                background: '#fff',
                                borderRadius: '4px',
                                width: '100%',
                                padding: '20px 40px 40px'
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
                                            required: true
                                        }
                                    ]
                                })(
                                    <Input
                                        name="username"
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
                                            required: true
                                        }
                                    ]
                                })(
                                    <Input
                                        name="passwd"
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
                                {getFieldDecorator('mail', {
                                    rules: [
                                        {
                                            type: 'email',
                                            message: '请输入正确的邮箱'
                                        },
                                        {
                                            required: true,
                                            message: '请输入邮箱地址'
                                        }
                                    ]
                                })(
                                    <Input
                                        name="mail"
                                        prefix={
                                            <Icon
                                                type="mail"
                                                style={{
                                                    color: 'rgba(0,0,0,.25)'
                                                }}
                                            />
                                        }
                                        type="email"
                                        placeholder="请输入邮箱"
                                    />
                                )}
                            </FormItem>

                            <FormItem>
                                <Button
                                    htmlType="submit"
                                    className="login-form-button ant-btn-primary"
                                    block
                                    loading={this.state.loading}
                                    disabled={hasErrors(getFieldsError())}
                                >
                                    初始化应用
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    <Footers />
                </Footer>
            </Layout>
        )
    }
}

export default Form.create({})(Init)
