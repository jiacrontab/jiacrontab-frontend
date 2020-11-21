import * as React from 'react'
import { Modal, Table, Button, Radio } from 'antd'
import { time, getRequest } from '../../utils/utils'
import API from 'src/config/api'
import { ModalProps } from 'antd/lib/modal/Modal'

interface Props extends ModalProps {
    visible: boolean
    handleOk?: any
    handleCancel?: any
    handleGroupChange?: any
    title: string
    group: any
    changeVisible: any
    users: any[]
}
interface State {
    token: any
    loading: boolean
    users: any[]
    nodeListData: any[]
    mode: string
}
class EditGroupForm extends React.Component<Props, State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            token: '',
            loading: false,
            users: [],
            nodeListData: [],
            mode: 'user'
        }
    }

    componentDidMount() {
        this.setState({ token: localStorage.getItem('jiaToken') }, () => {})
    }
    private handleCancel = () => {
        this.setState({
            users: [],
            mode: 'user'
        })
        this.props.changeVisible(false)
    }
    private getUsers() {
        getRequest({
            url: API.userList,
            token: this.state.token,
            data: {
                page: 1,
                pagesize: 9999,
                queryGroupID: this.props.group
            },
            succ: (data: any) => {
                this.setState({
                    loading: false,
                    users: data.list
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
    private getGroupNodeList() {
        getRequest({
            url: API.NodeList,
            token: this.state.token,
            data: {
                page: 1,
                pagesize: 9999,
                queryGroupID: this.props.group
            },
            succ: (data: any) => {
                this.setState(
                    {
                        loading: false
                    },
                    () => {
                        let templeListData = data
                        this.setState({
                            nodeListData: templeListData.list
                        })
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

    private handleModeChange = (e: any) => {
        const mode = e.target.value
        this.setState({ mode })
        this.setState({
            loading: true
        })
        if (mode === 'user') {
            this.getUsers()
        } else {
            this.getGroupNodeList()
        }
    }

    private removeNode = (record: any) => {
        this.setState({
            loading: true
        })
        getRequest({
            url: API.nodeDelete,
            token: this.state.token,
            data: {
                groupID: record.groupID,
                addr: record.addr
            },
            succ: (data: any) => {
                this.getGroupNodeList()
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

    render() {
        const runColumns: any[] = [
            {
                title: 'ID',
                dataIndex: 'ID',
                key: 'ID',
                width: 80
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username'
            },
            { title: '分组', dataIndex: 'group.name', key: 'group.name' },
            {
                title: 'root',
                dataIndex: 'root',
                key: 'root',
                render: (val: any) => {
                    if (val === true) {
                        return 'true'
                    }
                    return 'false'
                }
            },
            { title: '邮箱', dataIndex: 'mail', key: 'mail' },
            {
                title: '添加日期',
                dataIndex: 'CreatedAt',
                key: 'CreatedAt',
                render: (val: any) => time.UTCToTime(val)
            }
        ]

        const nodeColumns: any[] = [
            { title: '序号', dataIndex: 'ID', key: 'ID', width: 120 },
            { title: '备注', dataIndex: 'name', key: 'name' },
            { title: '节点', dataIndex: 'addr', key: 'addr' },
            {
                title: '状态',
                dataIndex: 'disabled',
                key: 'disabled',
                render: (record: any) => {
                    if (!record) {
                        return <span style={{ color: 'green' }}>正常</span>
                    } else {
                        return <span style={{ color: 'red' }}>断开</span>
                    }
                }
            },
            {
                title: '加入时间',
                dataIndex: 'CreatedAt',
                key: 'CreatedAt',
                render: (record: string) => (
                    <span>{time.UTCToTime(record)}</span>
                )
            },
            {
                title: '操作',
                key: 'operation',
                render: (record: any) => (
                    <Button
                        htmlType="button"
                        size="small"
                        type="primary"
                        onClick={() => {
                            this.removeNode(record)
                        }}
                    >
                        移除
                    </Button>
                )
            }
        ]
        return (
            <div>
                <Modal
                    title={this.props.title}
                    visible={this.props.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    width="60%"
                >
                    <Radio.Group
                        onChange={this.handleModeChange}
                        value={this.state.mode}
                        style={{ marginBottom: 15 }}
                    >
                        <Radio.Button value="user">用户列表</Radio.Button>
                        <Radio.Button value="node">节点列表</Radio.Button>
                    </Radio.Group>
                    {this.state.mode === 'user' ? (
                        <Table
                            bordered
                            size="small"
                            loading={this.state.loading}
                            dataSource={
                                this.state.users.length > 0
                                    ? this.state.users
                                    : this.props.users
                            }
                            pagination={false}
                            rowKey="ID"
                            columns={runColumns}
                        />
                    ) : (
                        <Table
                            bordered
                            rowKey="ID"
                            size="small"
                            pagination={false}
                            loading={this.state.loading}
                            dataSource={this.state.nodeListData}
                            columns={nodeColumns}
                        />
                    )}
                </Modal>
            </div>
        )
    }
}

export default EditGroupForm
