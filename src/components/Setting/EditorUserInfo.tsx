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
    userID: Number,
    mail: string
}
class EditorUserInfo extends React.Component<Props & FormComponentProps, State> {
    public state: State
    constructor(props: Props & FormComponentProps) {
        super(props)
        this.state = {
            loading: false,
            token: '',
            user: '',
            userID: -1,
            mail: ''
        }
    }

    componentDidMount() {
        if (window.localStorage) {
            if (localStorage.getItem('userInfo')) {
                let userInfos: any = localStorage.getItem('userInfo')
                this.setState({
                    user: JSON.parse(userInfos).username,
                    userID: JSON.parse(userInfos).userID,
                    mail: JSON.parse(userInfos).mail
                })
            }
            this.setState({
                token: localStorage.getItem('jiaToken')
            })
        }
    }

    private changeInfo(values: any) {
        let params = {
            username: values.username,
            mail: values.mail,
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
                    content: '修改成功',
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



    private submitInfo = (e: any) => {
        e.preventDefault()
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                console.log(values)
                this.changeInfo(values)
            }
        })
    }


    render() {
        const { form } = this.props
        const { getFieldDecorator } = form
        let { user, mail } = this.state

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        }
        const formTailLayout = {
            wrapperCol: {
                xs: { span: 15, offset: 5 },
                sm: { span: 15, offset: 5 }
            }
        }

        return (

            <Form onSubmit={this.submitInfo} style={{ marginTop: 20 }}>
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
                            disabled
                            name="username"
                            size="large"
                            prefix={
                                <Icon
                                    type="user"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                />
                            }
                            placeholder="请输入用户名"
                        />
                    )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="邮箱">
                    {getFieldDecorator('mail', {
                        initialValue: mail,
                        rules: [
                            {
                                message: '请输入邮箱地址',
                                whitespace: true
                            }
                        ]
                    })(
                        <Input
                            size="large"
                            type="email"
                            prefix={
                                <Icon
                                    type="mail"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                />
                            }
                            placeholder="请输入邮箱地址"
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
        )
    }
}

export default Form.create({})(EditorUserInfo)
