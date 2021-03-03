import * as React from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import '@ant-design/compatible/assets/index.css';
import { Card, Input, InputNumber, Button, Checkbox, Tooltip, Switch } from 'antd';
import BaseLayout from '../../layout/BaseLayout'
import { getUrlParam, getRequest, trimEmpty } from '../../utils/utils'
import API from '../../config/api'
import Bread from '../../components/Layout/Bread'
// import { FormComponentProps } from '@ant-design/compatible/lib/form';
import Status from 'src/config/status'

// interface AddProps extends FormComponentProps {
//     history: any
// }
interface Props { 
    history: any
}
interface State {
    token: any,
    loading: boolean,
    userInfo: any,
    defaultObject: any,
    formRef: React.RefObject<FormInstance>,
    initialValues: any
}

class EditDaemon extends React.Component<Props,State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            token: '',
            loading: false,
            userInfo: {},
            defaultObject: this.defObj,
            formRef: React.createRef<FormInstance>(),
            initialValues: {}
        }
    }

    private defObj: {
        mailTo: string[]
        APITo: string[]
        DingdingTo: string[]
        WorkIp: string[]
        command: [[]]
    } = { mailTo: [], APITo: [], DingdingTo: [], WorkIp: [], command: [[]] }

    // state = {
    //     token: '',
    //     loading: false,
    //     userInfo: JSON.parse('{}'),
    //     defaultObject: this.defObj
    // }
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
                        const propsAddr2 = getUrlParam(
                            'addr',
                            this.props.history.location.search
                        )
                        let initCurrentValues = {
                            addr: propsAddr2,
                        }

                        this.setState({
                            initialValues: initCurrentValues
                        })
                        setTimeout(() => {
                            this.state.formRef.current?.resetFields()
                            this.state.formRef.current?.setFieldsValue({ initialValues: initCurrentValues})
                        },10)
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
                const propsAddr1 = getUrlParam(
                    'addr',
                    this.props.history.location.search
                )
                const defaultFormValus: any = data
                
                let initCurrentValues = { 
                    addr: propsAddr1,
                    name: defaultFormValus.name,
                    command: defaultFormValus.command.join(' '),
                    code: defaultFormValus.code,
                    workDir:defaultFormValus.workDir,
                    workEnv: defaultFormValus.workEnv
                    ? defaultFormValus.workEnv.join(',')
                    : '',
                    workUser: defaultFormValus.workUser,
                    workIp: defaultFormValus.workIp
                    ? defaultFormValus.workIp.join(',')
                    : '',
                    failRestart:defaultFormValus.failRestart,
                    retryNum: defaultFormValus.retryNum || 0,
                    mailTo: defaultFormValus.mailTo
                    ? defaultFormValus.mailTo.join(',')
                    : '',
                    APITo:defaultFormValus.APITo ? defaultFormValus.APITo.join(',') : '',
                    DingdingTo:defaultFormValus.DingdingTo ? defaultFormValus.DingdingTo.join(',') : '',
                    taskError:[
                        (defaultFormValus.errorMailNotify &&
                            'errorMailNotify') ||
                        '',
                        (defaultFormValus.errorAPINotify &&
                            'errorAPINotify') ||
                        '',
                        (defaultFormValus.errorDingdingNotify &&
                            'errorDingdingNotify') ||
                        ''
                    ]
                }
                this.setState({
                    initialValues: initCurrentValues
                })

                setTimeout(() => {
                    this.state.formRef.current?.resetFields()
                    this.state.formRef.current?.setFieldsValue({ initialValues: initCurrentValues})
                },10)
                this.setState({
                    defaultObject: data
                })
            }
        })
    }
    
    private handleSubmit = (value: any) => {
        this.state.formRef.current?.validateFields().then((values: any) => {
            this.daemonEdit(this.state.token, this.parseValues(values))
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
        if (values.DingdingTo !== undefined) {
            newPrams.DingdingTo = trimEmpty(values.DingdingTo.split(','))
        }

        if (values.workIp !== undefined) {
            newPrams.workIp = trimEmpty(values.workIp.split(','))
        }

        if (values.workEnv !== undefined) {
            newPrams.workEnv = trimEmpty(values.workEnv.split(','))
        }

        newPrams.errorMailNotify = values.taskError && values.taskError.includes('errorMailNotify')
            ? true
            : false

        newPrams.errorAPINotify = values.taskError && values.taskError.includes('errorAPINotify')
            ? true
            : false

        newPrams.errorDingdingNotify = values.taskError && values.taskError.includes('errorDingdingNotify')
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
        // const { getFieldDecorator } = this.state.form
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
                        <Form 
                            onFinish={this.handleSubmit} 
                            ref={this.state.formRef}
                            initialValues={this.state.initialValues}
                        >
                            <Form.Item 
                                {...formItemLayout} 
                                label="地址" 
                                name="addr"
                                rules={[{ required: true, message: '请输入地址' }]}
                            >
                                <Input
                                    placeholder="请输入地址"
                                    disabled
                                />
                            </Form.Item>

                            <Form.Item 
                                {...formItemLayout} 
                                label="脚本名称" 
                                name="name"
                                validateTrigger={['onChange','onBlur']}
                                rules={[{ required: true, message: '请输入脚本名称' }]}
                            >
                                <Input
                                    placeholder="请输入脚本名称"
                                />
                            </Form.Item>

                            <Form.Item
                                {...formItemLayout}
                                label={
                                    <span>
                                        命令&nbsp;
                                        <Tooltip title="执行简单命令时并不需要编辑代码，比如'ls -l,uname -a',当你需要在线编辑代码并执行时，请选者相关启动命令并在'代码'中写入你要执行的代码">
                                            <QuestionCircleOutlined />
                                        </Tooltip>
                                    </span>
                                }
                                style={{ marginBottom: 6 }}
                                name="command"
                                rules={[{ required: true, message: '请输入命令' }]}
                            >
                                <Input placeholder="请输入命令" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label={
                                    <span>
                                        代码&nbsp;
                                        <Tooltip title="当命令是sh -c,python -c,php -r等可以运行代码片段的命令时请编辑代码">
                                            <QuestionCircleOutlined />
                                        </Tooltip>
                                    </span>
                                }
                                name="code"
                            >
                                <Input.TextArea
                                    autoSize={{ minRows: 4, maxRows: 12 }}
                                    placeholder="请输入将要被执行的代码"
                                />
                                
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="工作目录" name="workDir">
                                <Input placeholder="请输入工作目录" />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="环境变量" name="workEnv">
                                <Input placeholder="请输入工作环境变量，key=value格式，多个变量以逗号分割" />
                                
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="执行用户" name="workUser">
                                <Input placeholder="执行用户" />
                            </Form.Item>

                            <Form.Item {...formItemLayout}
                                label={
                                    <span>
                                        IP绑定&nbsp;
                                        <Tooltip title="允许执行任务的服务器IP，支持IP段绑定，不填为不限制，主要应用于弹性伸缩服务器">
                                            <QuestionCircleOutlined />
                                        </Tooltip>
                                    </span>
                                }
                                name="workIp"
                            >
                                <Input placeholder="格式为192.168.0.1/24，或者192.168.0.1，多个以逗号分隔，不填为不限制" />
                                
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="失败重启" name="failRestart" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="失败重试次数" name="retryNum">
                                <InputNumber
                                    min={0}
                                    placeholder="请输入失败重试次数"
                                />
                                
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="邮箱地址" name="mailTo">
                                <Input placeholder="请输入邮箱地址" />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="api地址" name="APITo">
                                <Input placeholder="请输入api地址" />
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="钉钉webhook地址" name="DingdingTo">
                                <Input placeholder="请输入钉钉webhook地址（包含关键词：告警）,多个地址以逗号分割" />
                            </Form.Item>
                            <Form.Item {...formItemLayoutWithOutLabel} name="taskError">
                                <Checkbox.Group>
                                    <Checkbox value="errorMailNotify">
                                        任务执行失败邮件通知
                                    </Checkbox>
                                    <Checkbox value="errorAPINotify">
                                        任务执行失败api通知
                                    </Checkbox>
                                    <Checkbox value="errorDingdingNotify">
                                        任务执行失败钉钉通知
                                    </Checkbox>
                                </Checkbox.Group>
                                
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
        );
    }
}

export default EditDaemon
