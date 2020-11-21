import * as React from 'react'
import { Table, Button, Input } from 'antd'
import { time, getRequest } from '../../utils/utils'
import API from 'src/config/api'
import EditGroupForm from '../Modal/EditGroupForm'
import EditGroupName from '../Modal/EditGroupName'

interface Props {
    history: any
    groups: any[]
    loading: boolean
    changeLoading: any
    getGroupList: any
    total: number
    page: number
    pageSize: number
}

interface State {
    showEditUserGroupForm: boolean
    settingGroupID: number
    groups: any[]
    nodeListAddr: string
    nodeListName: string
    users: any[],
    showEditGroupName: boolean,
    editorName: string,
    editorGroupId: number
    child: any
}

interface Data {
    searchTxt: string
    token: string | null
}

class GroupList extends React.Component<Props, State> {
    public state: State
    public data: Data
    public formRef: any
    constructor(props: any) {
        super(props)
        this.state = {
            showEditUserGroupForm: false,
            settingGroupID: -1,
            groups: [],
            nodeListAddr: '',
            nodeListName: '',
            users: [],
            showEditGroupName: false,
            editorName: '',
            editorGroupId: -1,
            child: ''
        }
        this.data = {
            token: '',
            searchTxt: ''
        }
    }

    public componentDidMount(): void {
        if (window.localStorage) {
            this.data.token = localStorage.getItem('jiaToken')
        }
    }

    private getUserList(id: any, callback: () => void) {
        getRequest({
            url: API.userList,
            token: this.data.token,
            data: {
                page: 1,
                pagesize: 9999,
                queryGroupID: id
            },
            succ: (data: any) => {
                this.setState({
                    users: data.list
                })
                callback()
                this.props.changeLoading(false)
            },
            error: () => {
                this.props.changeLoading(false)
            },
            catch: () => {
                this.props.changeLoading(false)
            }
        })
    }

    private changeVisible = (status: boolean) => {
        this.setState({ showEditUserGroupForm: status })
    }

    private groupNameVisible = (status: boolean) => {
        this.setState({ showEditGroupName: status })
    }

    public settingGroup(record: any) {
        this.setState({
            settingGroupID: record.ID,
            nodeListAddr: record.addr,
            nodeListName: record.name
        })
        this.getUserList(record.ID, () => {
            this.setState({
                showEditUserGroupForm: true
            })
        })
    }
    public editorGroupName(record: any) {
        this.setState({
            showEditGroupName: true,
            editorName: record.name,
            editorGroupId: record.ID
        })
    }
    
    public handleOk = (values:any) => {
        // e.preventDefault()
        // const form = this.formRef.props.form
        // form.validateFields((err: any, values: any) => {
        //     if (!err) {
                let paramsData = {
                    groupName: values.groupName,
                    groupID: this.state.editorGroupId
                }
                
                getRequest({
                    url: API.editGroup,
                    token: this.data.token,
                    data: paramsData,
                    succ: (data: any) => {
                        this.state.child.resetForm()
                        this.setState({
                            showEditGroupName: false
                        })
                        this.props.changeLoading(true)
                        this.props.getGroupList()
                    }
                })
        //     }
        // })
    }
    onRef = (ref:any) => {
        this.state.child = ref
    }

    public render(): any {
        const columns: any[] = [
            { title: '序号', dataIndex: 'ID', key: 'ID', width: 120 },
            { title: '组', dataIndex: 'name', key: 'name' },
            // { title: '节点', dataIndex: 'addr', key: 'addr' },
            {
                title: '加入时间',
                dataIndex: 'CreatedAt',
                key: 'CreatedAt',
                render: (record: string) => (
                    <span>{time.UTCToTime(record)}</span>
                )
            },
            {
                title: '更新时间',
                dataIndex: 'UpdatedAt',
                key: 'UpdatedAt',
                render: (record: string) => (
                    <span>{time.UTCToTime(record)}</span>
                )
            },
            {
                title: '操作',
                key: 'operation',
                render: (record: any) => {
                    return (
                        <React.Fragment>
                            <Button
                                htmlType="button"
                                size="small"
                                type="primary"
                                style={{ marginRight: 10 }}
                                onClick={() => {
                                    this.settingGroup(record)
                                }}
                            >
                                查看
                            </Button>
                            <Button
                                htmlType="button"
                                size="small"
                                type="primary"
                                onClick={() => {
                                    this.editorGroupName(record)
                                }}
                            >
                                修改
                            </Button>
                        </React.Fragment>
                    )
                }
            }
        ]

        const runData: any[] = this.props.groups
        const { Search } = Input
        return (
            <div>
                <Search
                    placeholder="分组名"
                    onSearch={value => {
                        this.data.searchTxt = value
                        this.props.getGroupList(value, 1, this.props.pageSize)
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
                            this.props.getGroupList(
                                this.data.searchTxt,
                                1,
                                pageSize
                            )
                        },
                        onChange: (page: number) => {
                            this.props.getGroupList(
                                this.data.searchTxt,
                                page,
                                this.props.pageSize
                            )
                        }
                    }}
                    loading={this.props.loading}
                    dataSource={runData}
                    columns={columns}
                />
                <EditGroupForm
                    visible={this.state.showEditUserGroupForm}
                    title="分组详情"
                    group={this.state.settingGroupID}
                    users={this.state.users}
                    changeVisible={this.changeVisible}
                />
                <EditGroupName
                    visible={this.state.showEditGroupName}
                    title="修改分组名称"
                    defaultName={this.state.editorName}
                    // wrappedComponentRef={this.saveFormRef}
                    handleOk={this.handleOk}
                    groups={this.state.groups}
                    onRef={this.onRef}
                    changeVisible={this.groupNameVisible}
                />
            </div>
        )
    }
}

export default GroupList
