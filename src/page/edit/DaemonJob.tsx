import * as React from 'react'
import {
    Card,
    Form,
    Input,
    InputNumber,
    Button,
    Checkbox,
    Tooltip,
    Switch,
    Icon
} from 'antd'
import BaseLayout from '../../layout/BaseLayout'
import { getUrlParam, getRequest, trimEmpty } from '../../utils/utils'
import API from '../../config/api'
import Bread from '../../components/Layout/Bread'
import { FormComponentProps } from 'antd/lib/form'
import Status from 'src/config/status'

interface AddProps extends FormComponentProps {
    history: any
}

class EditDaemon extends React.Component<AddProps> {
    constructor(props: AddProps) {
        super(props)
    }

    private defObj: {
        mailTo: string[]
        APITo: string[]
        WorkIp: string[]
        command: [[]]
    } = { mailTo: [], APITo: [], WorkIp: [], command: [[]] }

    state = {
        token: '',
        loading: false,
        userInfo: JSON.parse('{}'),
        defaultObject: this.defObj
    }
    public componentDidMount() {
        if (window.localStorage) {
            this.setState(
                {
                    token: localStorage.getItem('jiaToken'),
                    userInfo: JSON.parse(
                        localStorage.getItem('userInfo') || '{}'
                    )
                },
                () => {
                    if (getUrlParam('id', this.props.history.location.search)) {
                        const id: number = Number(
                            getUrlParam(
                                'id',
                                this.props.history.location.search
                            )
                        )
                        const addr: any = getUrlParam(
                            'addr',
                            this.props.history.location.search
                        )
                        this.getDefaultData(id, addr, this.state.token)
                    } else {
                        this.defObj.mailTo = [this.state.userInfo.mail]
                        this.setState({
                            defaultObject: this.defObj
                        })
                    }
                }
            )
        }
    }
    private getDefaultData = (id: number, addr: string, jiaToken: string) => {
        getRequest({
            url: API.getDaemonData,
            token: jiaToken,
            data: {
                addr: addr,
                jobID: id
            },
            succ: (data: any) => {
                this.setState({
                    defaultObject: JSON.parse(data)
                })
            }
        })
    }
    private handleSubmit = (e: any) => {
        e.preventDefault()
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.daemonEdit(this.state.token, this.parseValues(values))
            }
        })
    }
    private parseValues = (values: any) => {
        let newPrams: any = {
            addr: values.addr,
            name: values.name,
            code: values.code,
            failRestart: values.failRestart,
            command: trimEmpty(values.command.split(' '))
        }
        if (getUrlParam('id', this.props.history.location.search)) {
            newPrams.jobID = Number(
                getUrlParam('id', this.props.history.location.search)
            )
        }
        if (values.mailTo !== undefined) {
            newPrams.mailTo = trimEmpty(values.mailTo.split(','))
        }
        if (values.APITo !== undefined) {
            newPrams.APITo = trimEmpty(values.APITo.split(','))
        }

        if (values.workIp !== undefined) {
            newPrams.workIp = trimEmpty(values.workIp.split(','))
        }

        if (values.workEnv !== undefined) {
            newPrams.workEnv = trimEmpty(values.workEnv.split(','))
        }

        newPrams.errorMailNotify = values.taskError.includes('errorMailNotify')
            ? true
            : false

        newPrams.errorAPINotify = values.taskError.includes('errorAPINotify')
            ? true
            : false

        if (values.workDir !== undefined) {
            newPrams.workDir = values.workDir
        }
        if (values.workUser !== undefined) {
            newPrams.workUser = values.workUser
        }
        if (values.retryNum !== undefined) {
            newPrams.retryNum = values.retryNum
        }

        return newPrams
    }
    private daemonEdit = (jiaToken: string, values: object) => {
        this.setState({
            loading: true
        })
        getRequest({
            url: API.daemonEdit,
            token: jiaToken,
            data: values,
            succ: (data: any) => {
                this.setState(
                    {
                        loading: false
                    },
                    () => {
                        let params: any = {
                            id: getUrlParam(
                                'id',
                                this.props.history.location.search
                            ),
                            addr: getUrlParam(
                                'addr',
                                this.props.history.location.search
                            ),
                            tabKey: getUrlParam(
                                'tabKey',
                                this.props.history.location.search
                            )
                        }
                        let path: any = {
                            pathname: '/node/detail',
                            search: `?id=${params.id}&addr=${
                                params.addr
                                }&tabKey=${params.tabKey}`
                        }
                        this.props.history.push(path)
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

    public render(): any {
        const defaultFormValus: any = this.state.defaultObject
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 14 }
        }
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 14, offset: 3 },
                sm: { span: 14, offset: 3 }
            }
        }
        const taskErrorDefault = []
        if (defaultFormValus.errorMailNotify) {
            taskErrorDefault.push('errorMailNotify')
        }
        if (defaultFormValus.errorAPINotify) {
            taskErrorDefault.push('errorAPINotify')
        }
        const propsId = getUrlParam('id', this.props.history.location.search)
        const propsAddr = getUrlParam(
            'addr',
            this.props.history.location.search
        )
        const propsTabKey = getUrlParam(
            'tabKey',
            this.props.history.location.search
        )
        return (
            <BaseLayout pages="nodeList">
                <div className="jia-content">
                    <Bread
                        paths={[
                            {
                                id: 'first',
                                name: '节点列表',
                                icon: 'ff',
                                route: '/node/list'
                            },
                            {
                                id: 'first2',
                                name: propsAddr,
                                icon: 'ss',
                                route: {
                                    pathname: '/node/detail',
                                    search: `?id=${propsId}&addr=${propsAddr}&tabKey=${propsTabKey}`
                                }
                            },
                            {
                                id: 'first3',
                                name:
                                    propsTabKey == '2'
                                        ? '添加常驻任务'
                                        : '添加定时任务',
                                icon: 'ss',
                                route: '/editDaemon'
                            }
                        ]}
                    />
                    <Card size="small" title="编辑常驻任务">
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item {...formItemLayout} label="地址">
                                {getFieldDecorator('addr', {
                                    initialValue: propsAddr,
                                    rules: [{ required: true }]
                                })(
                                    <Input
                                        placeholder="请输入脚本名称"
                                        disabled
                                    />
                                )}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="脚本名称">
                                {getFieldDecorator('name', {
                                    validateTrigger: ['onChange', 'onBlur'],
                                    initialValue: defaultFormValus.name,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入脚本名称'
                                        }
                                    ]
                                })(
                                    <Input
                                        name="name"
                                        placeholder="请输入脚本名称"
                                    />
                                )}
                            </Form.Item>

                            <Form.Item
                                {...formItemLayout}
                                label={
                                    <span>
                                        命令&nbsp;
                                        <Tooltip title="执行简单命令时并不需要编辑代码，比如'ls -l,uname -a',当你需要在线编辑代码并执行时，请选者相关启动命令并在'代码'中写入你要执行的代码">
                                            <Icon type="question-circle-o" />
                                        </Tooltip>
                                    </span>
                                }
                                required={true}
                                style={{ marginBottom: 6 }}
                            >
                                {getFieldDecorator(`command`, {
                                    initialValue: defaultFormValus.command.join(
                                        ' '
                                    ),
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入命令'
                                        }
                                    ]
                                })(<Input placeholder="请输入命令" />)}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label={
                                    <span>
                                        代码&nbsp;
                                        <Tooltip title="当命令是sh -c,python -c,php -r等可以运行代码片段的命令时请编辑代码">
                                            <Icon type="question-circle-o" />
                                        </Tooltip>
                                    </span>
                                }
                            >
                                {getFieldDecorator('code', {
                                    initialValue: defaultFormValus.code
                                })(
                                    <Input.TextArea
                                        autosize={{ minRows: 4, maxRows: 12 }}
                                        placeholder="请输入将要被执行的代码"
                                    />
                                )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="工作目录">
                                {getFieldDecorator('workDir', {
                                    initialValue: defaultFormValus.workDir
                                })(<Input placeholder="请输入工作目录" />)}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="环境变量">
                                {getFieldDecorator('workEnv', {
                                    initialValue: defaultFormValus.workEnv
                                        ? defaultFormValus.workEnv.join(',')
                                        : ''
                                })(
                                    <Input placeholder="请输入工作环境变量，key=value格式，多个变量以逗号分割" />
                                )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="执行用户">
                                {getFieldDecorator('workUser', {
                                    initialValue: defaultFormValus.workUser
                                })(<Input placeholder="执行用户" />)}
                            </Form.Item>

                            <Form.Item {...formItemLayout}
                                label={
                                    <span>
                                        IP绑定&nbsp;
                                        <Tooltip title="允许执行任务的服务器IP，支持IP段绑定，不填为不限制，主要应用于弹性伸缩服务器">
                                            <Icon type="question-circle-o" />
                                        </Tooltip>
                                    </span>
                                }
                            >
                                {getFieldDecorator('workIp', {
                                    initialValue: defaultFormValus.workIp
                                        ? defaultFormValus.workIp.join(',')
                                        : ''
                                })(
                                    <Input placeholder="格式为192.168.0.1/24，或者192.168.0.1，多个以逗号分隔，不填为不限制" />
                                )}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="失败重启">
                                {getFieldDecorator('failRestart', {
                                    initialValue: defaultFormValus.failRestart,
                                    valuePropName: 'checked'
                                })(<Switch />)}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="失败重试次数">
                                {getFieldDecorator('retryNum', {
                                    initialValue: defaultFormValus.retryNum || 0
                                })(
                                    <InputNumber
                                        min={0}
                                        placeholder="请输入失败重试次数"
                                    />
                                )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="邮箱地址">
                                {getFieldDecorator('mailTo', {
                                    initialValue:
                                        defaultFormValus.mailTo ||
                                            this.state.userInfo.mail
                                            ? defaultFormValus.mailTo.join(' ')
                                            : ''
                                })(<Input placeholder="请输入邮箱地址" />)}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="api地址">
                                {getFieldDecorator('APITo', {
                                    initialValue: defaultFormValus.APITo
                                        ? defaultFormValus.APITo.join(' ')
                                        : ''
                                })(<Input placeholder="请输入api地址" />)}
                            </Form.Item>

                            <Form.Item {...formItemLayoutWithOutLabel}>
                                {getFieldDecorator('taskError', {
                                    initialValue: taskErrorDefault
                                })(
                                    <Checkbox.Group>
                                        <Checkbox value="errorMailNotify">
                                            任务执行失败邮件通知
                                        </Checkbox>
                                        <Checkbox value="errorAPINotify">
                                            任务执行失败api通知
                                        </Checkbox>
                                    </Checkbox.Group>
                                )}
                            </Form.Item>
                            <Form.Item {...formItemLayoutWithOutLabel}>
                                <Button
                                    className="ant-btn-primary"
                                    htmlType="submit"
                                    loading={this.state.loading}
                                >
                                    {(() => {
                                        if (
                                            defaultFormValus.status ===
                                            Status.StatusJobUnaudited &&
                                            (this.state.userInfo.root ||
                                                this.state.userInfo.groupID ===
                                                1)
                                        ) {
                                            return '审核通过'
                                        } else {
                                            return '立即提交'
                                        }
                                    })()}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </BaseLayout>
        )
    }
}

export default Form.create({})(EditDaemon)
