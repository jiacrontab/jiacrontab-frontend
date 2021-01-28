import * as React from 'react'
import { MailOutlined, UserOutlined } from '@ant-design/icons';
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
    mail: string,
    formRef: React.RefObject<FormInstance>
}
class EditorUserInfo extends React.Component<Props, State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            loading: false,
            token: '',
            user: '',
            userID: -1,
            mail: '',
            formRef: React.createRef<FormInstance>()
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



    private submitInfo = (e: any) => {
        // e.preventDefault()
        this.state.formRef.current?.validateFields().then((values) => {
            // if (!err) {
                this.setState({
                    loading: true
                })
                this.changeInfo(values)
            // }
        })
    }


    render() {
        // const { getFieldDecorator } = this.state.form
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
        let defaultValue = {
            username: user,
            mail
        }
        setTimeout(() => {
            this.state.formRef.current?.resetFields()
            this.state.formRef.current?.setFieldsValue({ initialValues: defaultValue})
        },10)


        return (
            <Form 
                onFinish={this.submitInfo} 
                ref={this.state.formRef}
                initialValues={
                    defaultValue
                }
                style={{ marginTop: 20 }}
            >
                <Form.Item {...formItemLayout} label="用户名" name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}>
                    
                        <Input
                            disabled
                            // name="username"
                            size="large"
                            prefix={
                                <UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                            }
                            placeholder="请输入用户名"
                        />
                    
                </Form.Item>
                <Form.Item {...formItemLayout} label="邮箱" name="mail"
                        rules={[{ required: true, message: '请输入邮箱地址' }]}>
                    
                        <Input
                            size="large"
                            type="email"
                            prefix={
                                <MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                            }
                            placeholder="请输入邮箱地址"
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
export default EditorUserInfo
// export default Form.create({})(EditorUserInfo)
