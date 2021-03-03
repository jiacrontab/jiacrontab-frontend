import * as React from 'react'
import { MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import '@ant-design/compatible/assets/index.css';
import {
    Card,
    Input,
    InputNumber,
    Button,
    Checkbox,
    Select,
    Row,
    Tooltip,
    Col,
    Radio,
} from 'antd';
import BaseLayout from '../../layout/BaseLayout'
import { getUrlParam, getRequest, getGroupID, trimEmpty } from '../../utils/utils'
import API from '../../config/api'
import Bread from '../../components/Layout/Bread'
// import { FormComponentProps } from '@ant-design/compatible/lib/form';
import Status from 'src/config/status'
const { Option } = Select

// interface EditProps extends FormComponentProps {
//     history: any
// }
interface Props { 
    history: any
}

interface State {
    token: any,
    loading: boolean,
    defaultObject: object,
    userInfo: any,
    nodeList: any,
    formRef: React.RefObject<FormInstance>,
    relyArray: any,
    initialValues: any
}
class Add extends React.Component<Props,State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            token: '',
            loading: false,
            defaultObject: this.defObj,
            userInfo: {
                mail: ''
            },
            nodeList: [],
            formRef: React.createRef<FormInstance>(),
            relyArray: [],
            initialValues: {}
        }
    }

    private defObj: {
        mailTo: string[]
        APITo: string[]
        DingdingTo: string[]
        workEnv: string[]
        command: string[]
        timeArgs: any
        dependJobs: any
    } = {
            mailTo: [],
            APITo: [],
            DingdingTo: [],
            workEnv: [],
            command: [],
            timeArgs: {},
            dependJobs: []
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
    // public 

    private getDefaultData = (id: number, addr: string, jiaToken: string) => {
        
        getRequest({
            url: API.getTaskList,
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
                const timeArgs: any = defaultFormValus.timeArgs
                let resultRely: object[] = []
                if (
                    defaultFormValus.dependJobs &&
                    defaultFormValus.dependJobs.length > 0
                ) {
                    defaultFormValus.dependJobs.map((value:any,index:number) => {
                        let defaultKey:any = {
                            isListField: true,
                            key: index,
                            relyAddr: value.dest,
                            relyCommand: value.command.join(' '),
                            relyCode: value.code,
                            relyTimeOut: value.timeout
                        }
                        resultRely.push(defaultKey)
                    })
                }
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
                    timeout: defaultFormValus.timeout || 0,
                    timeoutTrigger: defaultFormValus.timeoutTrigger ? defaultFormValus.timeoutTrigger : [],
                    killChildProcess: defaultFormValus.killChildProcess ? ['childProcess'] : [],
                    // killChildProcess: [
                    //     defaultFormValus.killChildProcess
                    // ],
                    retryNum: defaultFormValus.retryNum || 0,
                    mailTo: defaultFormValus.mailTo
                    ? defaultFormValus.mailTo.join(',')
                    : '',
                    APITo:defaultFormValus.APITo ? defaultFormValus.APITo.join(',') : '',
                    DingdingTo:defaultFormValus.DingdingTo ? defaultFormValus.DingdingTo.join(',') : '',
                    maxConcurrent: defaultFormValus.maxConcurrent || 1,
                    second: timeArgs.second,

                    minute: timeArgs.minute,
                    hour: timeArgs.hour,
                    day: timeArgs.day,
                    weekday: timeArgs.weekday,
                    month: timeArgs.month,
                    isSync: defaultFormValus.isSync ? 'synchrony' : 'asychrony',
                    relayItem: resultRely,
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
                let templeListData = data
                this.setState({
                    nodeList: templeListData.list
                })
            }
        })
    }
    private handleSubmit = (values: any) => {
        this.state.formRef.current?.validateFields().then((values: any) => {
            this.addEditorList(this.state.token, this.parseValues(values))
        })
    }
    private parseValues = (values: any) => {
        let newPrams: any = {
            addr: values.addr,
            isSync: values.isSync === 'synchrony' ? true : false,
            name: values.name,
            command: trimEmpty(values.command.split(' ')),
            code: values.code,
            maxConcurrent: values.maxConcurrent,
            killChildProcess: values.killChildProcess && values.killChildProcess.includes('childProcess')
            ? true
            : false,
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
            newPrams.mailTo = trimEmpty(values.mailTo.split(','))
        }
        if (values.APITo !== undefined) {
            newPrams.APITo = trimEmpty(values.APITo.split(','))
        }
        if (values.DingdingTo !== undefined) {
            newPrams.DingdingTo = trimEmpty(values.DingdingTo.split(','))
        }
        if (values.timeoutTrigger !== undefined) {
            newPrams.timeoutTrigger = values.timeoutTrigger
        }

        if (values.workEnv !== undefined) {
            newPrams.workEnv = trimEmpty(values.workEnv.split(','))
        }

        if (values.workIp !== undefined) {
            newPrams.workIp = trimEmpty(values.workIp.split(','))
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
        //if (values.workIp !== undefined) {
            //newPrams.workIp = values.workIp
        //}
        if (values.timeout !== undefined) {
            newPrams.timeout = values.timeout
        }
        if (values.retryNum !== undefined) {
            newPrams.retryNum = values.retryNum
        }

        if (values.relayItem && values.relayItem.length > 0) {
            values.relayItem.map((item: any) => {
                newPrams.dependJobs.push({
                    from: values.addr,
                    dest: item.relyAddr,
                    command: trimEmpty(item.relyCommand.split(' ')),
                    code: item.relyCode,
                    timeout: Number(item.relyTimeOut)
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


    

    public render(): any {
        const { nodeList,initialValues } = this.state
        let defaultFormValus: any = this.state.defaultObject

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
                                        ? '编辑常驻任务'
                                        : '编辑定时任务',
                                icon: 'ss',
                                route: '/edit/crontab_job'
                            }
                        ]}
                    />
                    <Card size="small" title="编辑定时任务">
                        <Form 
                        onFinish={this.handleSubmit} 
                        ref={this.state.formRef}
                        initialValues={initialValues}
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
                                <Input placeholder="请输入脚本名称"/>
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
                                
                                <Input placeholder="请输入命令,常用的有'sh -c'、'php -r'、'python -c'" />
                                
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

                            <Form.Item 
                                {...formItemLayout} 
                                label="工作目录" 
                                name="workDir"
                            >
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

                            <Form.Item {...formItemLayout} label="脚本超时" >
                                <Form.Item noStyle name="timeout">
                                    <InputNumber
                                        style={{ width: 120 }}
                                        min={0}
                                        placeholder="脚本超时"
                                    />
                                </Form.Item>
                                <span className="ant-form-text">秒</span>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="超时触发" name="timeoutTrigger">
                                
                                <Checkbox.Group>
                                    <Checkbox value="SendEmail">
                                        邮件通知
                                    </Checkbox>
                                    <Checkbox value="CallApi">
                                        api通知
                                    </Checkbox>
                                    <Checkbox value="DingdingWebhook">
                                        钉钉通知
                                    </Checkbox>
                                    <Checkbox value="Kill">强杀</Checkbox>
                                </Checkbox.Group>
                                
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="子进程" name="killChildProcess">
                                
                                <Checkbox.Group>
                                    <Checkbox value="childProcess">
                                        主进程退出后允许子进程继续存在
                                    </Checkbox>
                                </Checkbox.Group>
                                
                            </Form.Item>

                            <Form.Item {...formItemLayout} label="失败重试次数" name="retryNum">
                                
                                <InputNumber
                                    style={{ width: 150 }}
                                    min={0}
                                    placeholder="失败重试次数"
                                />
                                
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="邮箱地址" name="mailTo">
                                
                                <Input placeholder="请输入邮箱地址,多个地址以逗号分割" />
                                
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="api地址" name="APITo">
                                
                                <Input placeholder="请输入api地址,多个地址以逗号分割" />
                                
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="钉钉webhook地址" name="DingdingTo">
                                
                                <Input placeholder="请输入钉钉webhook地址（包含关键词：告警）,多个地址以逗号分割" />
                                
                            </Form.Item>
                            <Form.Item 
                                {...formItemLayout} 
                                label="最大并发数" 
                                name="maxConcurrent"
                                rules={[{ required: true, message: '请输入最大并发数' }]}
                            >
                                <InputNumber min={1} />
                            </Form.Item>

                            <Row>
                                <Col span={3}>
                                    <div className="tast-timing">定时:</div>
                                </Col>
                                <Col span={14}>
                                    <Row>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                                name="second"
                                                rules={[{ required: true, message: 'second' }]}
                                            >
                                                
                                                <Input placeholder="second" />
                                                
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                                name="minute"
                                                rules={[{ required: true, message: 'minute' }]}
                                            >
                                                
                                                <Input placeholder="minute" />
                                                
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                                name="hour"
                                                rules={[{ required: true, message: 'hour' }]}
                                            >
                                                
                                                <Input placeholder="hour" />
                                                
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                                name="day"
                                                rules={[{ required: true, message: 'day' }]}
                                            >
                                                <Input placeholder="day" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                                name="weekday"
                                                rules={[{ required: true, message: 'weekday' }]}
                                            >
                                                
                                                <Input placeholder="weekday" />
                                                
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 20,
                                                    offset: 0
                                                }}
                                                name="month"
                                                rules={[{ required: true, message: 'month' }]}
                                            >
                                                
                                                <Input placeholder="month" />
                                                
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Form.Item
                                {...formItemLayout}
                                label="添加依赖"
                                style={{ marginBottom: 6 }}
                                name="isSync"
                            >
                                
                                <Radio.Group>
                                    <Radio value="synchrony">
                                        同步执行
                                    </Radio>
                                    <Radio value="asychrony">
                                        异步执行
                                    </Radio>
                                </Radio.Group>
                                
                            </Form.Item>

                            <Form.List name="relayItem">
                            {(fields, { add, remove }) => {
                                return (
                                    <>

                                    {fields.map(field => (
                                        <Row key={field.key} >
                                            <Col span={3} />
                                            <Col span={14}>
                                                <Row>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            wrapperCol={{
                                                                span: 24,
                                                                offset: 0
                                                            }}
                                                            {...field}
                                                            name={[field.name, 'relyAddr']}
                                                            rules={[{ required: true, message: '请选择依赖的地址' }]}
                                                        >
                                                            
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
                                                            {...field}
                                                            name={[field.name, 'relyCommand']}
                                                            rules={[{ required: true, message: '请输入命令' }]}
                                                        >
                                                            
                                                            <Input placeholder="请输入命令" />
                                                            
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
                                                            {...field}
                                                            name={[field.name, 'relyCode']}
                                                            rules={[{ required: true, message: '请输入代码' }]}
                                                        >
                                                            
                                                            <Input placeholder="请输入代码" />
                                                            
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
                                                            {...field}
                                                            name={[field.name, 'relyTimeOut']}
                                                            rules={[{ required: true, message: '超时' }]}
                                                        >
                                                            
                                                            <InputNumber
                                                                min={0}
                                                                placeholder="超时(s)"
                                                                style={{
                                                                    marginRight: 8
                                                                }}
                                                            />
                                                            
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
                                                            <MinusCircleOutlined
                                                                className="dynamic-delete-button"
                                                                style={{ margin: '0 8px' }}
                                                                onClick={() => {
                                                                    remove(field.name);
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        
                                    ))}

                                    <Form.Item {...formItemLayoutWithOutLabel}>
                                        <Button
                                            htmlType="button"
                                            type="dashed"
                                            onClick={() => {
                                                add();
                                            }}
                                            style={{ width: '40%' }}
                                        >
                                            <PlusOutlined /> 添加依赖1
                                        </Button>
                                    </Form.Item>

                                    </>
                                )
                            }}
                            </Form.List>

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
        );
    }
}

export default Add
