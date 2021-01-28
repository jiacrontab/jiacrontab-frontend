import * as React from 'react'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import '@ant-design/compatible/assets/index.css';
import { Input, Button, Radio, Select, Checkbox, Modal } from 'antd';
// import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { getRequest } from '../../utils/utils'
import API from 'src/config/api'

interface Props { }
interface State {
    token: string | null
    userInfo: any
    loading: boolean
    radioValue: string
    groups: any[]
    defaultValue: object
    checked: boolean
    disabled: boolean
    formRef: React.RefObject<FormInstance>
}
interface Data {
    groupID: number
}
class SettingUser extends React.Component<Props, State> {
    public state: State
    public data: Data
    constructor(props: Props) {
        super(props)
        this.state = {
            loading: false,
            radioValue: 'new',
            groups: [],
            token: '',
            userInfo: {},
            defaultValue: {},
            checked: false,
            disabled: false,
            formRef: React.createRef<FormInstance>()
        }
        this.data = {
            groupID: 0
        }
    }

    componentDidMount() {
        if (window.localStorage) {
            this.setState(
                {
                    token: localStorage.getItem('jiaToken'),
                    userInfo: localStorage.getItem('userInfo')
                },
                () => {
                    this.getGroupList()
                }
            )
        }
    }

    private getGroupList() {
        getRequest({
            url: API.groupList,
            token: this.state.token,
            data: {
                page: 1,
                pagesize: 9999
            },
            succ: (data: any) => {
                let groups = data

                const { userInfo } = this.state

                let defaultValue = {
                    groupType: this.state.radioValue,
                    groupId: JSON.parse(userInfo).groupID,
                    root: this.state.checked
                }

                this.setState({
                    defaultValue
                })
                setTimeout(() => {
                    this.setState({
                        groups: groups.list
                    })
                    this.state.formRef.current?.resetFields()
                    this.state.formRef.current?.setFieldsValue({ initialValues: defaultValue })

                }, 10)
            }
        })
    }

    private submitSetting(values: any) {
        let defaultParams = {
            username: values.username,
            passwd: values.passwd,
            root: values.root,
            mail: values.mail
        }
        let groupName = {
            groupName: values.groupName
        }
        let groupId = {
            groupId: values.groupId
        }
        let params =
            values.groupType === 'new'
                ? { ...defaultParams, ...groupName }
                : { ...defaultParams, ...groupId }
        getRequest({
            url: API.userSignup,
            token: this.state.token,
            data: params,
            succ: (data: any) => {
                this.setState({
                    loading: false
                })
                Modal.success({
                    title: '温馨提示',
                    content: '添加成功',
                    onOk: () => {
                        this.getGroupList()
                    }
                })
            },
            error: () => {
                this.setState({
                    loading: false
                })
                this.state.formRef.current?.resetFields()
            },
            catch: () => {
                this.setState({
                    loading: false
                })
            }
        })
    }

    private handleSubmit = (e: any) => {
        // e.preventDefault()
        this.state.formRef.current?.validateFields().then((values) => {
            // if (!err) {
            this.setState({
                loading: true
            })
            this.submitSetting(values)
            // }
        })
    }
    private radioChange = (e: any) => {
        this.setState({
            radioValue: e.target.value
        })
        const { defaultValue } = this.state
        if (e.target.value !== 'new') {

            if (defaultValue['groupId'] == 1) {
                this.setState({
                    checked: true,
                    disabled: true
                })
            }
        } else {
            this.setState({
                checked: false,
                disabled: false
            })
        }

    }

    render() {
        const { groups, defaultValue } = this.state

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 }
        }
        const formTailLayout = {
            wrapperCol: {
                xs: { span: 10, offset: 3 },
                sm: { span: 10, offset: 3 }
            }
        }


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
                    <Form.Item
                        {...formItemLayout}
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input
                            // name="username"
                            size="large"
                            prefix={
                                <UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                            }
                            placeholder="请输入用户名"
                        />
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="密码" name="passwd"
                        rules={[{ required: true, message: '请输入密码' }]}>

                        <Input
                            // name="passwd"
                            size="large"
                            prefix={
                                <LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                            }
                            type="password"
                            placeholder="请输入密码"
                        />

                    </Form.Item>
                    <Form.Item {...formItemLayout} label="邮箱" name="mail"
                        rules={[{ required: true, message: '请输入邮箱地址' }]}>

                        <Input
                            size="large"
                            prefix={
                                <MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                            }
                            type="email"
                            placeholder="请输入邮箱地址"
                        />

                    </Form.Item>
                    <Form.Item {...formItemLayout} label="分组" name="groupType">

                        <Radio.Group onChange={this.radioChange}>
                            <Radio value="new">新建</Radio>
                            <Radio value="move">移动到指定分组</Radio>
                        </Radio.Group>

                    </Form.Item>
                    {this.state.radioValue == 'new' ? (
                        <Form.Item {...formTailLayout} name="groupName"
                            rules={[{ required: true, message: '请输入分组名称' }]}>
                            <Input placeholder="请输入分组名称" />
                        </Form.Item>
                    ) : (
                            <Form.Item {...formTailLayout} name="groupId">
                                <Select placeholder="请选择分组" onChange={(id: any, e: any) => {
                                    this.data.groupID = id
                                    if (id == 1) {
                                        this.setState({
                                            checked: true,
                                            disabled: true
                                        })
                                    } else {
                                        this.setState({
                                            checked: false,
                                            disabled: false
                                        })
                                    }
                                }}
                                >
                                    {groups.map((value: any) => {
                                        return (
                                            <Select.Option
                                                key={value['ID']}
                                                value={value['ID']}
                                            >
                                                {value['name']}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>

                            </Form.Item>
                        )}
                    <Form.Item {...formTailLayout} name="root">

                        <Checkbox
                            disabled={this.state.disabled}
                            onChange={() => {
                                if (this.data.groupID == 1) {
                                    this.setState({
                                        disabled: true,
                                        checked: true
                                    })
                                } else {
                                    this.setState({
                                        disabled: false,
                                        checked: !this.state.checked
                                    })
                                }
                            }}
                            checked={this.state.checked}
                        >
                            管理员
                                </Checkbox>

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
        );
    }
}
export default SettingUser
// export default Form.create({})(SettingUser)
