import * as React from 'react'
import { Table, Button, Input } from 'antd'
import { time, getRequest } from '../../utils/utils'
import API from 'src/config/api'
import EditNodeGroupForm from '../Modal/EditNodeGroupForm'

interface Props {
    history: any
    nodeListData: any[]
    loading: boolean
    changeLoading: any
    getGroupNodeList: any
    total: number
    page: number
    pageSize: number
}

interface State {
    showEditUserGroupForm: boolean
    groups: any[]
    nodeListAddr: string
    nodeListName: string
    child: any
}

interface Data {
    searchTxt: string
    settingUserID: number
    token: string | null
}

class GroupNodeList extends React.Component<Props, State> {
    public state: State
    public data: Data
    public formRef: any
    constructor(props: Props) {
        super(props)
        this.state = {
            showEditUserGroupForm: false,
            groups: [],
            nodeListAddr: '',
            nodeListName: '',
            child: ''
        }
        this.data = {
            token: '',
            searchTxt: '',
            settingUserID: -1
        }
    }

    public componentDidMount(): void {
        if (window.localStorage) {
            this.data.token = localStorage.getItem('jiaToken')
        }
    }

    private getGroupList(callback: () => void) {
        getRequest({
            url: API.groupList,
            token: this.data.token,
            data: {
                page: 1,
                pagesize: 9999
            },
            succ: (data: any) => {
                let groups = data
                this.setState({
                    groups: groups.list
                })
                callback()
            }
        })
    }

    
    public handleOk = (values:any) => {
        // e.preventDefault()
        // const form = this.formRef.props.form
        // form.validateFields((err: any, values: any) => {
        //     if (!err) {
                let paramsData = {}
                if (values.types === 'new') {
                    paramsData = {
                        addr: this.state.nodeListAddr,
                        targetGroupName: values.title,
                        targetNodeName: this.state.nodeListName
                    }
                } else {
                    paramsData = {
                        addr: this.state.nodeListAddr,
                        targetNodeName: this.state.nodeListName,
                        targetGroupId: values.groupId
                    }
                }
                getRequest({
                    url: API.groupNode,
                    token: this.data.token,
                    data: paramsData,
                    succ: (data: any) => {
                        this.state.child.resetForm()
                        this.setState({
                            showEditUserGroupForm: false
                        })
                        this.props.changeLoading(true)
                        this.props.getGroupNodeList()
                    }
                })
        //     }
        // })
    }
    private changeVisible = (status: boolean) => {
        this.setState({ showEditUserGroupForm: status })
    }

    public settingGroup(record: any) {
        this.data.settingUserID = record.ID
        this.setState({
            nodeListAddr: record.addr,
            nodeListName: record.name
        })
        this.getGroupList(() => {
            this.setState({
                showEditUserGroupForm: true
            })
        })
    }
    private removeNode = (record: any) => {
        this.props.changeLoading(true)
        getRequest({
            url: API.nodeDelete,
            token: this.data.token,
            data: {
                groupID: record.groupID,
                addr: record.addr
            },
            succ: (data: any) => {
                this.props.getGroupNodeList(
                    this.data.searchTxt,
                    this.props.page,
                    this.props.pageSize
                )
            },
            error: () => {
                this.props.changeLoading(false)
            },
            catch: () => {
                this.props.changeLoading(false)
            }
        })
    }
    onRef = (ref:any) => {
        this.state.child = ref
    }

    public render(): any {
        const columns: any[] = [
            { title: '序号', dataIndex: 'ID', key: 'ID', width: 120 },
            { title: '名称', dataIndex: 'name', key: 'name' },
            { title: '地址', dataIndex: 'addr', key: 'addr' },
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
                title: '运行的定时任务',
                dataIndex: 'crontabTaskNum',
                key: 'crontabTaskNum'
            },
            {
                title: '运行的常驻任务',
                dataIndex: 'daemonTaskNum',
                key: 'daemonTaskNum'
            },
            {
                title: '待审核的定时任务',
                dataIndex: 'crontabJobAuditNum',
                key: 'crontabJobAuditNum'
            },
            {
                title: '待审核的常驻任务',
                dataIndex: 'daemonJobAuditNum',
                key: 'daemonJobAuditNum'
            },
            {
                title: '执行失败的定时任务',
                dataIndex: 'crontabJobFailNum',
                key: 'crontabJobFailNum'
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
                width: 160,
                render: (record: any) => {
                    return (
                        <React.Fragment>
                            <Button
                                htmlType="button"
                                size="small"
                                type="primary"
                                style={{ marginRight: 8 }}
                                onClick={() => {
                                    this.settingGroup(record)
                                }}
                            >
                                设置分组
                            </Button>
                            <Button
                                htmlType="button"
                                size="small"
                                // danger
                                disabled={!record.disabled}
                                onClick={() => {
                                    this.removeNode(record)
                                }}
                            >
                                删除
                            </Button>
                        </React.Fragment>
                    )
                }
            }
        ]

        const runData: any[] = this.props.nodeListData
        const { Search } = Input
        return (
            <div>
                <Search
                    placeholder="节点名"
                    onSearch={value => {
                        this.data.searchTxt = value
                        this.props.getGroupNodeList(
                            value,
                            1,
                            this.props.pageSize
                        )
                    }}
                    enterButton="查询"
                    style={{ width: 350, marginBottom: 10 }}
                />
                <Table
                    style={{
                        wordWrap: 'break-word',
                        wordBreak: 'break-all'
                    }}
                    bordered
                    rowKey="ID"
                    size="small"
                    loading={this.props.loading}
                    pagination={{
                        total: this.props.total,
                        pageSize: this.props.pageSize,
                        defaultCurrent: this.props.page,
                        showSizeChanger: true,
                        pageSizeOptions: ['1', '10', '20', '50', '100'],
                        onShowSizeChange: (
                            current: number,
                            pageSize: number
                        ) => {
                            this.props.getGroupNodeList(
                                this.data.searchTxt,
                                1,
                                pageSize
                            )
                        },
                        onChange: (page: number) => {
                            this.props.getGroupNodeList(
                                this.data.searchTxt,
                                page,
                                this.props.pageSize
                            )
                        }
                    }}
                    dataSource={runData}
                    columns={columns}
                />
                <EditNodeGroupForm
                    visible={this.state.showEditUserGroupForm}
                    title="编辑节点分组"
                    handleOk={this.handleOk}
                    groups={this.state.groups}
                    onRef={this.onRef}
                    changeVisible={this.changeVisible}
                />
            </div>
        )
    }
}

export default GroupNodeList
