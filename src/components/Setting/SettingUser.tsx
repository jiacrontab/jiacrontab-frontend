import * as React from 'react'
import { Form, Input, Button, Icon, Radio, Select, Checkbox, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { getRequest } from '../../utils/utils'
import API from 'src/config/api'

interface Props {}
interface State {
    token: string | null
    loading: boolean
    radioValue: string
    groups: any[]
}
class SettingUser extends React.Component<Props & FormComponentProps, State> {
    public state: State
    constructor(props: Props & FormComponentProps) {
        super(props)
        this.state = {
            loading: false,
            radioValue: 'new',
            groups: [],
            token: ''
        }
    }

    componentDidMount() {
        if (window.localStorage) {
            this.setState(
                {
                    token: localStorage.getItem('jiaToken')
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
                let groups = JSON.parse(data)
                this.setState({
                    groups: groups.list
                })
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
                        this.props.form.resetFields()
                    }
                })
            },
            error: () => {
                this.setState({
                    loading: false
                })
                this.props.form.resetFields()
            },
            catch: () => {
                this.setState({
                    loading: false
                })
            }
        })
    }

    private handleSubmit = (e: any) => {
        e.preventDefault()
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                this.submitSetting(values)
            }
        })
    }
    private radioChange = (e: any) => {
        this.setState({
            radioValue: e.target.value
        })
    }

    render() {
        const { form } = this.props
        const { getFieldDecorator } = form
        const { groups } = this.state

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
                <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }}>
                    <Form.Item {...formItemLayout} label="用户名">
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
                    <Form.Item {...formItemLayout} label="密码">
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
                                size="large"
                                prefix={
                                    <Icon
                                        type="lock"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                type="password"
                                placeholder="请输入密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="邮箱">
                        {getFieldDecorator('mail', {
                            rules: [
                                {
                                    message: '请输入邮箱地址',
                                    required: true
                                }
                            ]
                        })(
                            <Input
                                size="large"
                                prefix={
                                    <Icon
                                        type="mail"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                type="email"
                                placeholder="请输入邮箱地址"
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="分组">
                        {getFieldDecorator('groupType', {
                            initialValue: this.state.radioValue
                        })(
                            <Radio.Group onChange={this.radioChange}>
                                <Radio value="new">新建</Radio>
                                <Radio value="move">移动到指定分组</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {this.state.radioValue == 'new' ? (
                        <Form.Item {...formTailLayout}>
                            {getFieldDecorator('groupName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入分组名称'
                                    }
                                ]
                            })(<Input placeholder="请输入分组名称" />)}
                        </Form.Item>
                    ) : (
                        <Form.Item {...formTailLayout}>
                            {getFieldDecorator('groupId', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择一个分组'
                                    }
                                ]
                            })(
                                <Select placeholder="请选择一个分组">
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
                            )}
                        </Form.Item>
                    )}
                    <Form.Item {...formTailLayout}>
                        {getFieldDecorator('root')(<Checkbox>管理员</Checkbox>)}
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
