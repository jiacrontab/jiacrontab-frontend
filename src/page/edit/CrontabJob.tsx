import * as React from 'react'
import {
    Card,
    Form,
    Input,
    InputNumber,
    Button,
    Icon,
    Checkbox,
    Select,
    Row,
    Tooltip,
    Col,
    Radio
} from 'antd'
import BaseLayout from '../../layout/BaseLayout'
import { getUrlParam, getRequest, getGroupID } from '../../utils/utils'
import API from '../../config/api'
import Bread from '../../components/Layout/Bread'
import { FormComponentProps } from 'antd/lib/form'
import Status from 'src/config/status'
const { Option } = Select

interface EditProps extends FormComponentProps {
    history: any
}

let id = 0
let relyIndex = 0

class Add extends React.Component<EditProps> {
    constructor(props: EditProps) {
        super(props)
    }

    private defObj: {
        mailTo: string[]
        APITo: string[]
        workEnv: string[]
        command: string[]
        timeArgs: any
        dependJobs: any
    } = {
            mailTo: [],
            APITo: [],
            workEnv: [],
            command: [],
            timeArgs: {},
            dependJobs: []
        }

    public state = {
        token: '',
        loading: false,
        defaultObject: this.defObj,
        userInfo: JSON.parse('{}'),
        nodeList: []
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
                    this.getNodeList()

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
            url: API.getTaskList,
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
    private getNodeList() {
        getRequest({
            url: API.NodeList,
            token: this.state.token,
            data: {
                queryGroupID: getGroupID(),
                page: 1,
                pagesize: 1000
            },
            succ: (data: any) => {
                let templeListData = JSON.parse(data)
                this.setState({
                    nodeList: templeListData.list
                })
            }
        })
    }
    private handleSubmit = (e: any) => {
        e.preventDefault()
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.addEditorList(this.state.token, this.parseValues(values))
            } else {
                console.log(err)
            }
        })
    }
    private parseValues = (values: any) => {
        let newPrams: any = {
            addr: values.addr,
            isSync: values.isSync === 'synchrony' ? true : false,
            name: values.name,
            command: values.command.split(' '),
            code: values.code,
            maxConcurrent: values.maxConcurrent,
            killChildProcess: values.killChildProcess.includes('false')
                ? false
                : true,
            second: values.second,
            minute: values.minute,
            hour: values.hour,
            day: values.day,
            weekday: values.weekday,
            month: values.month,
            dependJobs: []
        }
        if (getUrlParam('id', this.props.history.location.search)) {
            newPrams.jobID = Number(
                getUrlParam('id', this.props.history.location.search)
            )
        }
        if (values.mailTo !== undefined) {
            newPrams.mailTo = values.mailTo.split(',')
        }
        if (values.APITo !== undefined) {
            newPrams.APITo = values.APITo.split(',')
        }

        if (values.workEnv !== undefined) {
            newPrams.workEnv = values.workEnv.split(',')
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
        if (values.timeout !== undefined) {
            newPrams.timeout = values.timeout
        }
        if (values.retryNum !== undefined) {
            newPrams.retryNum = values.retryNum
        }

        if (values.rely && values.rely.length > 0) {
            values.rely.map((item: string) => {
                newPrams.dependJobs.push({
                    from: values.addr,
                    dest: values.relyAddr[item],
                    command: values.relyCommand[item].split(' '),
                    code: values.relyCode[item],
                    timeout: Number(values.relyTimeOut[item])
                })
            })
        }
        return newPrams
    }
    private addEditorList = (jiaToken: string, values: object) => {
        this.setState({
            loading: true
        })
        getRequest({
            url: API.edit,
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

    addOrder = () => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(id++)
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys
        })
    }
    removeOrder = (k: any) => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')
        // We need at least one passenger
        if (keys.length === 1) {
            return
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter((key: any) => key !== k)
        })
    }
    addRely = () => {
        const { form } = this.props
        // can use data-binding to get
        const rely = form.getFieldValue('rely')
        const nextRely = rely.concat(`rely${relyIndex++}`)
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            rely: nextRely
        })
    }
    removeRely = (k: any) => {
        const { form } = this.props
        // can use data-binding to get
        const rely = form.getFieldValue('rely')
        // We need at least one passenger
        if (rely.length === 0) {
            return
        }
        // can use data-binding to set
        form.setFieldsValue({
            rely: rely.filter((key: any) => key !== k)
        })
    }

    public render(): any {
        const { nodeList } = this.state
        const defaultFormValus: any = this.state.defaultObject
        const timeArgs: any = defaultFormValus.timeArgs
        const { getFieldDecorator, getFieldValue } = this.props.form
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

        let relyArray: string[] = []
        let relyAddrData: string[] = []
        let relyCommandData: string[] = []
        let relyCodeData: string[] = []
        let relyTimeout: number[] = []
        if (
            defaultFormValus.dependJobs &&
            defaultFormValus.dependJobs.length > 0
        ) {
            for (var i = 0; i < defaultFormValus.dependJobs.length; i++) {
                relyArray.push(`rely${i}`)
                relyAddrData.push(defaultFormValus.dependJobs[i].dest)
                relyCommandData.push(
                    defaultFormValus.dependJobs[i].command.join(' ')
                )
                relyCodeData.push(defaultFormValus.dependJobs[i].code)
                relyTimeout.push(defaultFormValus.dependJobs[i].timeout)
            }
        }
        getFieldDecorator('rely', { initialValue: relyArray })
        const rely = getFieldValue('rely')

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
                                        ? '编辑常驻任务'
                                        : '编辑定时任务',
                                icon: 'ss',
                                route: '/edit/crontab_job'
                            }
                        ]}
                    />
                    <Card size="small" title="编辑定时任务">
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
                                })(
                                    <Input placeholder="请输入命令,常用的有'sh -c'、'php -r'、'python -c'" />
                                )}
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

                            <Form.Item {...formItemLayout} label="脚本超时">
                                {getFieldDecorator('timeout', {
                                    initialValue: defaultFormValus.timeout || 0
                                })(
                                    <InputNumber
                                        style={{ width: 120 }}
                                        min={0}
                                        placeholder="脚本超时"
                                    />
                                )}
                                <span className="ant-form-text">秒</span>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="超时触发">
                                {getFieldDecorator('timeoutTrigger', {
                                    initialValue:
                                        defaultFormValus.timeoutTrigger
                                })(
                                    <Checkbox.Group>
                                        <Checkbox value="SendEmail">
                                            邮件通知
                                        </Checkbox>
                                        <Checkbox value="CallApi">
                                            api通知
                                        </Checkbox>
                                        <Checkbox value="Killed">强杀</Checkbox>
                                    </Checkbox.Group>
                                )}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="子进程">
                                {getFieldDecorator('killChildProcess', {
                                    initialValue: [
                                        (defaultFormValus.killChildProcess ===
                                            true &&
                                            'true') ||
                                        (defaultFormValus.killChildProcess ===
                                            false &&
                                            'false') ||
                                        'true'
                                    ]
                                })(
                                    <Checkbox.Group>
                                        <Checkbox value="false">
                                            主进程退出后允许子进程继续存在
                                        </Checkbox>
                                    </Checkbox.Group>
                                )}
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="失败重试次数">
                                {getFieldDecorator('retryNum', {
                                    initialValue: defaultFormValus.retryNum || 0
                                })(
                                    <InputNumber
                                        style={{ width: 150 }}
                                        min={0}
                                        placeholder="失败重试次数"
                                    />
                                )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="邮箱地址">
                                {getFieldDecorator('mailTo', {
                                    initialValue: defaultFormValus.mailTo
                                        ? defaultFormValus.mailTo.join(',')
                                        : ''
                                })(
                                    <Input placeholder="请输入邮箱地址,多个地址以逗号分割" />
                                )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="api地址">
                                {getFieldDecorator('APITo', {
                                    initialValue: defaultFormValus.APITo
                                        ? defaultFormValus.APITo.join(',')
                                        : ''
                                })(
                                    <Input placeholder="请输入api地址,多个地址以逗号分割" />
                                )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="最大并发数">
                                {getFieldDecorator('maxConcurrent', {
                                    initialValue:
                                        defaultFormValus.maxConcurrent || 1,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入最大并发数'
                                        }
                                    ]
                                })(<InputNumber min={1} />)}
                            </Form.Item>

                            <Row>
                                <Col span={3}>
                                    <Form.Item
                                        label="定时"
                                        style={{ textAlign: 'right' }}
                                        required={true}
                                    />
                                </Col>
                                <Col span={14}>
                                    <Row>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                            >
                                                {getFieldDecorator('second', {
                                                    initialValue:
                                                        timeArgs.second,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: 'second'
                                                        }
                                                    ]
                                                })(
                                                    <Input placeholder="second" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                            >
                                                {getFieldDecorator('minute', {
                                                    initialValue:
                                                        timeArgs.minute,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: 'minute'
                                                        }
                                                    ]
                                                })(
                                                    <Input placeholder="minute" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                            >
                                                {getFieldDecorator('hour', {
                                                    initialValue: timeArgs.hour,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: 'hour'
                                                        }
                                                    ]
                                                })(
                                                    <Input placeholder="hour" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                            >
                                                {getFieldDecorator('day', {
                                                    initialValue: timeArgs.day,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: 'day'
                                                        }
                                                    ]
                                                })(<Input placeholder="day" />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                            >
                                                {getFieldDecorator('weekday', {
                                                    initialValue:
                                                        timeArgs.weekday,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: 'weekday'
                                                        }
                                                    ]
                                                })(
                                                    <Input placeholder="weekday" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                            >
                                                {this.props.form.getFieldDecorator(
                                                    'month',
                                                    {
                                                        initialValue:
                                                            timeArgs.month,
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: 'month'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <Input placeholder="month" />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Form.Item
                                {...formItemLayout}
                                label="添加依赖"
                                style={{ marginBottom: 6 }}
                            >
                                {getFieldDecorator('isSync', {
                                    initialValue: defaultFormValus.isSync
                                        ? 'synchrony'
                                        : 'asychrony'
                                })(
                                    <Radio.Group>
                                        <Radio value="synchrony">
                                            同步执行
                                        </Radio>
                                        <Radio value="asychrony">
                                            异步执行
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                            {rely.map((k: any, index: number) => (
                                <Row key={k}>
                                    <Col span={3} />
                                    <Col span={14}>
                                        <Row>
                                            <Col span={6}>
                                                <Form.Item
                                                    wrapperCol={{
                                                        span: 24,
                                                        offset: 0
                                                    }}
                                                >
                                                    {getFieldDecorator(
                                                        `relyAddr[${k}]`,
                                                        {
                                                            initialValue:
                                                                relyAddrData[
                                                                index
                                                                ],
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        '请选择依赖的地址'
                                                                }
                                                            ]
                                                        }
                                                    )(
                                                        <Select placeholder="请选择依赖的地址">
                                                            {nodeList.map(
                                                                (item: any) => {
                                                                    return (
                                                                        <Option
                                                                            key={
                                                                                item[
                                                                                'ID'
                                                                                ]
                                                                            }
                                                                            value={
                                                                                item[
                                                                                'addr'
                                                                                ]
                                                                            }
                                                                        >
                                                                            {
                                                                                item[
                                                                                'addr'
                                                                                ]
                                                                            }
                                                                        </Option>
                                                                    )
                                                                }
                                                            )}
                                                        </Select>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col
                                                span={4}
                                                style={{ marginLeft: 10 }}
                                            >
                                                <Form.Item
                                                    wrapperCol={{
                                                        span: 24,
                                                        offset: 0
                                                    }}
                                                >
                                                    {getFieldDecorator(
                                                        `relyCommand[${k}]`,
                                                        {
                                                            initialValue:
                                                                relyCommandData[
                                                                index
                                                                ],
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        '请输入命令'
                                                                }
                                                            ]
                                                        }
                                                    )(
                                                        <Input placeholder="请输入命令" />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col
                                                span={6}
                                                style={{ marginLeft: 10 }}
                                            >
                                                <Form.Item
                                                    wrapperCol={{
                                                        span: 24,
                                                        offset: 0
                                                    }}
                                                >
                                                    {getFieldDecorator(
                                                        `relyCode[${k}]`,
                                                        {
                                                            initialValue:
                                                                relyCodeData[
                                                                index
                                                                ],
                                                            rules: [
                                                                {
                                                                    message:
                                                                        '请输入代码'
                                                                }
                                                            ]
                                                        }
                                                    )(
                                                        <Input placeholder="请输入代码" />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col
                                                span={3}
                                                style={{ marginLeft: 10 }}
                                            >
                                                <Form.Item
                                                    wrapperCol={{
                                                        span: 24,
                                                        offset: 0
                                                    }}
                                                >
                                                    {getFieldDecorator(
                                                        `relyTimeOut[${k}]`,
                                                        {
                                                            initialValue:
                                                                relyTimeout[
                                                                index
                                                                ] || 0,
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        '超时'
                                                                }
                                                            ]
                                                        }
                                                    )(
                                                        <InputNumber
                                                            min={0}
                                                            placeholder="超时(s)"
                                                            style={{
                                                                marginRight: 8
                                                            }}
                                                        />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col
                                                span={3}
                                                style={{ marginLeft: 10 }}
                                            >
                                                <Form.Item
                                                    wrapperCol={{
                                                        span: 24,
                                                        offset: 1
                                                    }}
                                                >
                                                    <Icon
                                                        className="dynamic-delete-button"
                                                        type="minus-circle-o"
                                                        onClick={() =>
                                                            this.removeRely(k)
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            ))}

                            <Form.Item {...formItemLayoutWithOutLabel}>
                                <Button
                                    href="javascript:;"
                                    htmlType="button"
                                    type="dashed"
                                    onClick={this.addRely}
                                    style={{ width: '40%' }}
                                >
                                    <Icon type="plus" /> 添加依赖
                                </Button>
                            </Form.Item>

                            <Form.Item {...formItemLayoutWithOutLabel}>
                                {getFieldDecorator('taskError', {
                                    initialValue: [
                                        (defaultFormValus.errorMailNotify &&
                                            'errorMailNotify') ||
                                        '',
                                        (defaultFormValus.errorAPINotify &&
                                            'errorAPINotify') ||
                                        ''
                                    ]
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
                                    htmlType="submit"
                                    className="ant-btn-primary"
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

export default Form.create({})(Add)
