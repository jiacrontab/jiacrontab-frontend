import * as React from 'react'
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import '@ant-design/compatible/assets/index.css';
import { Input, Button } from 'antd';
// import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { getRequest } from '../../utils/utils'
import API from 'src/config/api'

interface Props { }
interface State {
    loading: boolean
    token: any
    defaultData: any
    formRef: React.RefObject<FormInstance>
}
class SettingMail extends React.Component<Props, State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            loading: false,
            token: '',
            defaultData: {},
            formRef: React.createRef<FormInstance>()
        }
    }

    componentDidMount() {
        this.setState({ token: localStorage.getItem('jiaToken') }, () => {
            this.getDefaultData()
        })
    }

    private handleSubmit = (e: any) => {
        // e.preventDefault()
        this.state.formRef.current?.validateFields().then((values) => {
            // if (!err) {
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
                        this.state.formRef.current?.resetFields(['testEmail'])
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
    private getDefaultData() {
        getRequest({
            url: API.configGet,
            token: this.state.token,
            data: {},
            succ: (data: any) => {
                this.setState({
                    defaultData: data.mail
                })
            }
        })
    }

    render() {
        // const { getFieldDecorator } = this.state.form

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
        let defaultValue = {}
        for (let i in defaultData) {
            lableKey.push(i)
            defaultValue[`${i}`] = defaultData[i]
        }

        setTimeout(() => {
            this.state.formRef.current?.resetFields()
            this.state.formRef.current?.setFieldsValue({ initialValues: defaultValue})
        },10)

        return (
            <div>
                <Form 
                    onFinish={this.handleSubmit} 
                    style={{ marginTop: 20 }} 
                    ref={this.state.formRef}
                    initialValues={
                        defaultValue
                    }
                >
                    {lableKey.length && lableKey.map(function (ele, index) {
                        // let curName = `forms${ele}`
                        return defaultData[ele] !== '' ? (
                            <Form.Item
                                {...formItemLayout}
                                label={ele}
                                key={index}
                                name={ele}
                            >
                                <Input disabled />
                            </Form.Item>
                        ) : null
                    })}
                    <Form.Item 
                        name="testEmail" 
                        {...formItemLayout} 
                        label="测试地址"
                        rules={[{ required: true, message: '请输入测试地址' }]}
                        
                    >
                        <Input
                            size="large"
                            type="email"
                            placeholder="请输入测试地址"
                        />
                        
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
export default SettingMail
// export default Form.create({})(SettingMail)
