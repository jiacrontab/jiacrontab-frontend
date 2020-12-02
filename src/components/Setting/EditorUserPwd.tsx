import * as React from 'react'
import { LockOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import '@ant-design/compatible/assets/index.css';
import { Input, Button, Modal } from 'antd';
// import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { getRequest } from '../../utils/utils'
import API from 'src/config/api'
import { hashHistory } from '../../utils/history'

interface Props { }
interface State {
    token: string | null
    loading: boolean
    user: string,
    userID: Number,
    formRef: React.RefObject<FormInstance>
}
class EditorUserPwd extends React.Component<Props, State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            loading: false,
            token: '',
            user: '',
            userID: -1,
            formRef: React.createRef<FormInstance>()
        }
    }

    componentDidMount() {
        if (window.localStorage) {
            if (localStorage.getItem('userInfo')) {
                let userInfos: any = localStorage.getItem('userInfo')
                this.setState({
                    user: JSON.parse(userInfos).username,
                    userID: JSON.parse(userInfos).userID
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
                        this.state.formRef.current?.resetFields()
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


    private submitPwd = (e: any) => {
        this.state.formRef.current?.validateFields().then((values) => {
            // if (!err) {
                this.setState({
                    loading: true
                })
                this.changePassword(values)
            // }
        })
    }

    render() {
        // const { form } = this.props
        // const { getFieldDecorator } = this.state.form

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
            <Form 
                onFinish={this.submitPwd} 
                style={{ marginTop: 20 }} 
                ref={this.state.formRef}
                initialValues={
                    {
                        
                    }
                }
            >
                {/* <Form.Item {...formItemLayout} label="用户名">
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
                            // name="username"
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
                </Form.Item> */}
                <Form.Item {...formItemLayout} label="旧密码" name="oldpwd"
                        rules={[{ required: true, message: '请输入旧密码' }]}>
                    
                        <Input
                            // name="oldpwd"
                            size="large"
                            prefix={
                                <LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                            }
                            type="password"
                            placeholder="请输入旧密码"
                        />
                    
                </Form.Item>
                <Form.Item {...formItemLayout} label="新密码" name="passwd"
                        rules={[{ required: true, message: '请输入新的密码' }]}>
                    
                        <Input
                            // name="passwd"
                            size="large"
                            prefix={
                                <LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                            }
                            type="password"
                            placeholder="请输入新的密码"
                        />
                    
                </Form.Item>
                <Form.Item 
                    {...formItemLayout} 
                    label="确认新密码" 
                    name="confirmpwd"
                    rules={[
                        { required: true, message: '请确认新密码' },
                        {
                            validator: (_, value) =>{
                                if (value && value == this.state.formRef.current?.getFieldValue('passwd')) {
                                    return Promise.resolve()
                                }else{
                                    return Promise.reject('两次输入的密码不一致，请重新输入!')
                                }
                              }
                        }
                    ]}>
                        <Input
                            // name="confirmpwd"
                            size="large"
                            prefix={
                                <LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                            }
                            type="password"
                            placeholder="请确认新密码"
                        />
                    
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
        );
    }
}
export default EditorUserPwd
// export default Form.create({})(EditorUserPwd)
