import * as React from 'react'
import { Form, Input, Button, Icon, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { getRequest } from '../../utils/utils'
import API from 'src/config/api'
import { hashHistory } from '../../utils/history'

interface Props { }
interface State {
    token: string | null
    loading: boolean
    user: string,
    userID: Number
}
class SettingUser extends React.Component<Props & FormComponentProps, State> {
    public state: State
    constructor(props: Props & FormComponentProps) {
        super(props)
        this.state = {
            loading: false,
            token: '',
            user: '',
            userID: -1
        }
    }

    componentDidMount() {
        if (window.localStorage) {
            if (localStorage.getItem('userInfo')) {
                let userInfos: any = localStorage.getItem('userInfo')
                this.setState({
                    user: JSON.parse(userInfos).username,
                    userID: JSON.parse(userInfos).userID,
                })
            }
            this.setState({
                token: localStorage.getItem('jiaToken')
            })
        }
    }

    private changePassword(values: any) {
        let params = {
            username: values.username,
            oldpwd: values.oldpwd,
            passwd: values.passwd,
            userID: this.state.userID
        }

        getRequest({
            url: API.editUser,
            token: this.state.token,
            data: params,
            succ: (data: any) => {
                this.setState({
                    loading: false
                })
                Modal.success({
                    title: '温馨提示',
                    content: '修改成功,请重新登陆',
                    onOk: () => {
                        this.props.form.resetFields()
                        localStorage.removeItem('jiaToken')
                        localStorage.removeItem('userInfo')
                        hashHistory.push('/login')
                    }
                })
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

    private compareToFirstPassword = (rule: any, value: string, callback: any) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('passwd')) {
            callback('两次输入的密码不一致，请重新输入!');
        } else {
            callback();
        }
    }

    private handleSubmit = (e: any) => {
        e.preventDefault()
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                this.changePassword(values)
            }
        })
    }


    render() {
        const { form } = this.props
        const { getFieldDecorator } = form
        let { user } = this.state

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

        return (
            <div>
                <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }}>
                    <Form.Item {...formItemLayout} label="用户名">
                        {getFieldDecorator('username', {
                            initialValue: user,
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
                                size="large"
                                prefix={
                                    <Icon
                                        type="user"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                placeholder="请输入用户名"
                                disabled
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="旧密码">
                        {getFieldDecorator('oldpwd', {
                            rules: [
                                {
                                    message: '请输入旧密码',
                                    required: true,
                                    whitespace: true
                                }
                            ]
                        })(
                            <Input
                                name="oldpwd"
                                size="large"
                                prefix={
                                    <Icon
                                        type="lock"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                type="password"
                                placeholder="请输入旧密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="新密码">
                        {getFieldDecorator('passwd', {
                            rules: [
                                {
                                    message: '请输入新的密码',
                                    required: true,
                                    whitespace: true
                                }
                            ]
                        })(
                            <Input
                                name="passwd"
                                size="large"
                                prefix={
                                    <Icon
                                        type="lock"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                type="password"
                                placeholder="请输入新的密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="确认新密码">
                        {getFieldDecorator('confirmpwd', {
                            rules: [
                                {
                                    message: '请确认新密码',
                                    required: true,
                                    whitespace: true
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                }
                            ]
                        })(
                            <Input
                                name="confirmpwd"
                                size="large"
                                prefix={
                                    <Icon
                                        type="lock"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                type="password"
                                placeholder="请确认新密码"
                            />
                        )}
                    </Form.Item>

                    <Form.Item {...formTailLayout}>
                        <Button
                            style={{ minWidth: 120, height: 38 }}
                            htmlType="submit"
                            className="ant-btn-primary"
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

export default Form.create({})(SettingUser)
