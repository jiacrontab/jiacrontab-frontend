import * as React from 'react'
import { Table, Tabs, Button, Input} from 'antd'
import { FormInstance } from 'antd/lib/form';
import { getRequest, time, getGroupID } from '../../utils/utils'
import BaseLayout from '../../layout/BaseLayout'
import API from 'src/config/api'
import EditUserGroupForm from 'src/components/Modal/EditUserGroupForm'
import GroupNodeList from '../../components/Group/NodeList'
import GroupList from '../../components/Group/GroupList'

const { TabPane } = Tabs
interface Props {
    history: any
}

interface State {
    loading: boolean
    users: any[]
    groups: any[]
    showEditUserGroupForm: boolean
    nodeListData: any[],
    formRef: React.RefObject<FormInstance>
    child: any,
    currentGroup: any
}

interface Data {
    page: number
    pageSize: number
    searchUserTxt: string
    searchNodeTxt: string
    searchGroupTxt: string
    settingUserID: number
    total: number
    token: string | null
}

class UserList extends React.Component<Props, State> {
    public state: State
    public data: Data
    constructor(props: any) {
        super(props)
        this.state = {
            loading: true,
            groups: [],
            showEditUserGroupForm: false,
            users: [],
            nodeListData: [],
            formRef: React.createRef<FormInstance>(),
            child: '',
            currentGroup: {},
        }
        this.data = {
            page: 1,
            pageSize: 20,
            total: 0,
            token: '',
            searchUserTxt: '',
            searchNodeTxt: '',
            searchGroupTxt: '',
            settingUserID: -1
        }
    }

    componentDidMount() {
        this.data.token = localStorage.getItem('jiaToken')
        this.getUserList()
    }

    private changeLoading = (status: boolean) => {
        this.setState({
            loading: status
        })
    }

    private getGroups(data: object, callback?: () => void) {
        this.setState({
            loading: true
        })
        getRequest({
            url: API.groupList,
            token: this.data.token,
            data: data,
            succ: (data: any) => {
                let groups = data
                this.data.total = groups.total
                this.setState({
                    loading: false,
                    groups: groups.list
                })
                callback && callback()
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

    private getAllGroups(callback?: () => void) {
        this.getGroups(
            {
                page: 1,
                pagesize: 9999
            },
            callback
        )
    }

    private getGroupList(callback?: () => void) {
        this.getGroups(
            {
                page: this.data.page,
                pagesize: this.data.pageSize,
                searchTxt: this.data.searchGroupTxt
            },
            callback
        )
    }

    private getUserList() {
        this.getUsers({
            page: this.data.page,
            pagesize: this.data.pageSize,
            searchTxt: this.data.searchUserTxt,
            isAll: true,
            queryGroupID: getGroupID()
        })
    }

    // private getAllUsers() {
    //     this.getUsers({
    //         page: 1,
    //         pagesize: 9999,
    //         queryGroupID: getGroupID()
    //     })
    // }

    private getUsers(data: object) {
        this.setState({
            loading: true
        })
        getRequest({
            url: API.userList,
            token: this.data.token,
            data: data,
            succ: (data: any) => {
                let users = data
                this.data.total = users.total
                this.data.page = users.page
                this.data.pageSize = users.pagesize
                this.setState({
                    loading: false,
                    users: users.list
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

    private getNodes(data: object) {
        this.setState({
            loading: true
        })
        getRequest({
            url: API.NodeList,
            token: this.data.token,
            data: data,
            succ: (data: any) => {
                let nodes = data
                this.data.total = nodes.total
                this.setState({
                    loading: false,
                    nodeListData: nodes.list
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
        this.getNodes({
            page: this.data.page,
            pagesize: this.data.pageSize,
            searchTxt: this.data.searchNodeTxt,
            queryGroupID: getGroupID()
        })
    }

    // private getAllGroupNodes() {
    //     this.getNodes({
    //         page: 1,
    //         pagesize: 9999,
    //         queryGroupID: getGroupID()
    //     })
    // }

    public handleOk = (values: any) => {
        // e.preventDefault()
        // const form = this.formRef.props.form
        // this.state.formRef.current?.validateFields().then((values) => {
            // if (!err) {
                let paramsData = {}
                if (values.types === 'new') {
                    paramsData = {
                        userID: this.data.settingUserID,
                        targetGroupName: values.title,
                        root: values.root
                    }
                } else {
                    paramsData = {
                        userID: this.data.settingUserID,
                        targetGroupID: values.groupId,
                        root: values.root
                    }
                }
                this.setState({
                    loading: true
                })
                getRequest({
                    url: API.groupUser,
                    token: this.data.token,
                    data: paramsData,
                    succ: (data: any) => {
                        this.state.child.resetForm()
                        this.setState({
                            loading: false,
                            showEditUserGroupForm: false
                        })
                        this.getUserList()
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
            // }
        // })
    }
    private changeVisible = (status: boolean) => {
        this.setState({ showEditUserGroupForm: status })
    }

    private handle(record: any) {
        this.data.settingUserID = record.ID
        this.setState({
            currentGroup: record
        })
        this.getAllGroups(() => {
            this.setState({
                showEditUserGroupForm: true
            })
        })
    }
    // private saveFormRef = (formRef: any) => {
    //     this.formRef = formRef
    // }
    private tabChange = (activeKey: string) => {
        this.data.page = 1
        this.data.pageSize = 20
        this.setState({
            loading: true
        })
        if (activeKey == '1') {
            this.getUserList()
        }
        if (activeKey == '2') {
            this.getGroupNodeList()
        }
        if (activeKey == '3') {
            this.getGroupList()
        }
    }
    private removeUserList = (record: any) => {
        this.setState({
            loading: true
        })
        getRequest({
            url: API.deleteUser,
            token: this.data.token,
            data: {
                userID: record.ID,
            },
            succ: (data: any) => {
                this.getUserList()
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
    onRef = (ref:any) => {
        this.state.child = ref
    }

    public render(): any {
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
            { title: '分组', dataIndex: ["group","name"], key: ["group","name"] },
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
            },
            {
                title: '操作',
                key: 'operate',
                width: 140,
                render: (val: any) => {
                    return (
                        <React.Fragment>
                            <Button
                                htmlType="button"
                                size="small"
                                type="primary"
                                style={{ marginRight: 8 }}
                                onClick={() => {
                                    this.handle(val)
                                }}
                            >
                                设置
                            </Button>
                            <Button
                                htmlType="button"
                                size="small"
                                danger
                                onClick={() => {
                                    this.removeUserList(val)
                                }}
                            >
                                删除
                            </Button>
                        </React.Fragment>
                    )
                }
            }
        ]
        const { Search } = Input
        return (
            <div>
                <BaseLayout pages="groupList">
                    <div className="jia-content">
                        <Tabs
                            defaultActiveKey="1"
                            onChange={this.tabChange}
                            style={{
                                background: '#fff',
                                padding: '0 16px'
                            }}
                        >
                            <TabPane tab="用户列表" key="1">
                                <Search
                                    placeholder="用户名"
                                    onSearch={value => {
                                        this.data.searchUserTxt = value
                                        this.data.page = 1
                                        this.getUserList()
                                    }}
                                    enterButton="查询"
                                    style={{ width: 350, marginBottom: 10 }}
                                />
                                <Table
                                    bordered
                                    size="small"
                                    pagination={{
                                        total: this.data.total,
                                        pageSize: this.data.pageSize,
                                        defaultCurrent: this.data.page,
                                        showSizeChanger: true,
                                        pageSizeOptions: [
                                            '1',
                                            '10',
                                            '20',
                                            '50',
                                            '100'
                                        ],
                                        onShowSizeChange: (
                                            current: number,
                                            pageSize: number
                                        ) => {
                                            this.data.page = 1
                                            this.data.pageSize = pageSize
                                            this.getUserList()
                                        },
                                        onChange: (page: number) => {
                                            this.data.page = page
                                            this.getUserList()
                                        }
                                    }}
                                    loading={this.state.loading}
                                    dataSource={this.state.users}
                                    rowKey="ID"
                                    columns={runColumns}
                                />
                            </TabPane>
                            <TabPane tab="节点列表" key="2">
                                <GroupNodeList
                                    page={this.data.page}
                                    pageSize={this.data.pageSize}
                                    total={this.data.total}
                                    history={this.props.history}
                                    nodeListData={this.state.nodeListData}
                                    loading={this.state.loading}
                                    changeLoading={this.changeLoading}
                                    getGroupNodeList={(
                                        searchTxt: string,
                                        page: number,
                                        pageSize: number
                                    ) => {
                                        this.data.searchNodeTxt = searchTxt
                                        this.data.page = page
                                        this.data.pageSize = pageSize
                                        this.getGroupNodeList()
                                    }}
                                />
                            </TabPane>
                            <TabPane tab="分组列表" key="3">
                                <GroupList
                                    page={this.data.page}
                                    pageSize={this.data.pageSize}
                                    total={this.data.total}
                                    history={this.props.history}
                                    groups={this.state.groups}
                                    loading={this.state.loading}
                                    changeLoading={this.changeLoading}
                                    getGroupList={(
                                        searchTxt: string,
                                        page: number,
                                        pageSize: number
                                    ) => {
                                        this.data.searchGroupTxt = searchTxt
                                        this.data.page = page
                                        this.data.pageSize = pageSize
                                        this.getGroupList()
                                    }}
                                />
                            </TabPane>
                        </Tabs>
                    </div>
                </BaseLayout>
                <EditUserGroupForm
                    visible={this.state.showEditUserGroupForm}
                    title="编辑用户分组"
                    handleOk={this.handleOk}
                    groups={this.state.groups}
                    currentGroup={this.state.currentGroup}
                    onRef={this.onRef}
                    changeVisible={this.changeVisible}
                />
            </div>
        )
    }
}

export default UserList
