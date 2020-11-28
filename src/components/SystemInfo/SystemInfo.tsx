import * as React from 'react'
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Button, Select,Input,Modal } from 'antd';
import { Spin } from 'antd'
import { getRequest,getUrlParam } from '../../utils/utils'
import API from 'src/config/api'
import './SystemInfo.css'

interface Props {
    history: any
    infoData: any
    loading: boolean
    resetInfo: any
}
interface State {
    loading: boolean
    token: any
    userInfo: any
    formRef: React.RefObject<FormInstance>
}
class SystemInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            loading: false,
            token: '',
            userInfo: '',
            formRef: React.createRef<FormInstance>()
        }
    }
    componentDidMount() {
        this.setState({ token: localStorage.getItem('jiaToken') })
        this.setState({ userInfo: localStorage.getItem('userInfo') })
    }
    public changeLoading = (loadingStatus: boolean) => {
        this.setState({
            loading: loadingStatus
        })
    }

    private handleSubmit = (e: any) => {
        this.state.formRef.current?.validateFields().then((values) => {
            this.setState({
                loading: true
            })
            getRequest({
                url: API.CleanNodeLog,
                token: this.state.token,
                data: {
                    addr: getUrlParam('addr', this.props.history.location.search),
                    offset: Number(values.offset),
                    unit: values.unit
                },
                succ: (data: any) => {
                    this.setState({
                        loading: false
                    })
                    Modal.success({
                        content: `共清理了${data.total}个日志文件，大小为${data.size}`,
                        onOk:()=> {
                            this.state.formRef.current?.resetFields()
                            this.props.resetInfo(this.state.token)
                        }
                    });
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

        })
    }

    public render(): any {
        const { infoData } = this.props
        let infos = []
        for (let i in infoData) {
            infos.push(i)
        }
        let newInfos = [];
        for (var i = 0; i < infos.length; i += 2) {
            newInfos.push(infos.slice(i, i + 2));
        }

        const formItemLayout = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 }
        }
        const { userInfo } = this.state
        const userDatas = userInfo ? JSON.parse(userInfo) : {}
        // if (userInfo) {
        //     const userDatas = JSON.parse(userInfo)
        //     // const groupID = userDatas.groupID
        //     // const root = userDatas.root
        // }

        return (
            <div
                className="run-info-page"
                style={{
                    width: '100%',
                    overflowX: 'hidden',
                    paddingBottom: 20
                }}
            >
                <Spin spinning={this.props.loading}>
                    <table>
                        <tbody>
                            {newInfos.map((item, index) => {
                                return (<tr className="system-info" key={index}>
                                    {item.map((m, o) => {
                                        return (
                                            <React.Fragment key={o}>
                                                <td className="title">{m}</td>
                                                <td className="description">{infoData[m]}</td>
                                            </React.Fragment>
                                        )
                                    })}

                                </tr>)
                            })}
                        </tbody>
                    </table>
                </Spin>
                {userDatas.groupID === 1 && userDatas.root ? (
                    <div>
                        <Form 
                            onFinish={this.handleSubmit} 
                            style={{ marginTop: 26 }} 
                            ref={this.state.formRef}
                            layout="inline" 
                        >
                            
                            <Form.Item 
                                {...formItemLayout} 
                                label="清理"
                            >
                                <Input.Group compact>
                                    <Form.Item 
                                        name="offset" 
                                        {...formItemLayout}
                                        rules={[{ required: true, message: '请输入时间' }]}
                                    >
                                        <Input type="number" size="large" style={{ width: 130 }} placeholder="请输入时间"/>
                                    </Form.Item>
                                    <Form.Item 
                                        name="unit" 
                                        {...formItemLayout}
                                        rules={[{ required: true, message: '请选择单位' }]}
                                    >
                                        <Select size="large" style={{ width: 120 }} allowClear placeholder="选择单位">
                                            <Select.Option value="month">月</Select.Option>
                                            {/* <Select.Option value="week">周前</Select.Option> */}
                                            <Select.Option value="day">日</Select.Option>
                                            {/* <Select.Option value="hour">小时前</Select.Option> */}
                                        </Select>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                            <Form.Item style={{ marginTop: 4,marginLeft:-22 }}>
                                <span>前的日志文件</span>
                            </Form.Item>
                            <Form.Item>
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
                ) : null}

            </div>
        )
    }
}

export default SystemInfo
