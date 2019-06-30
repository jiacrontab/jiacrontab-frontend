import * as React from 'react'
import { Tabs } from 'antd'
import BaseLayout from '../../layout/BaseLayout'
import Bread from '../../components/Layout/Bread'
import SystemInfo from '../../components/SystemInfo/SystemInfo'
import CrontabJobList from '../../components/Job/CrontabJobList'
import DaemonJobList from '../../components/Job/DaemonJobList'
import API from '../../config/api'
import { getUrlParam, getRequest } from '../../utils/utils'
import './Detail.css'

const { TabPane } = Tabs
interface Props {
    history: any
}

interface State {
    selectKey: string

    crontabList: any[]
    daemonJobList: any[]
    userInfo: any
    systemInfo: any
    loading: boolean
}

interface Data {
    page: number
    pageSize: number
    token: any
    total: number
    searchCrontabJobTxt: string
    searchDaemonJobTxt: string
}

class NodeDetail extends React.Component<Props> {
    public state: State
    public data: Data
    constructor(props: Props) {
        super(props)
        this.state = {
            selectKey: '1',

            crontabList: [],
            daemonJobList: [],
            loading: true,
            userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
            systemInfo: {}
        }
        this.data = {
            page: 1,
            token: '',
            pageSize: 20,
            total: 0,
            searchCrontabJobTxt: '',
            searchDaemonJobTxt: ''
        }
    }

    public componentDidMount() {
        const propsTabKey = getUrlParam(
            'tabKey',
            this.props.history.location.search
        )
        if (propsTabKey && this.props.history.action == 'PUSH') {
            this.setState({
                selectKey: propsTabKey
            })
        }
        if (window.localStorage) {
            this.data.token = localStorage.getItem('jiaToken')
            this.setState(
                {
                    loading: true
                },
                () => {
                    if (this.state.selectKey == '1') {
                        this.getCrontabJobList(this.data.token, '')
                    } else if (this.state.selectKey == '2') {
                        this.getDaemonJobList(this.data.token, '')
                    }
                }
            )
        }
    }
    private reload = (search: string, page: number, pageSize: number) => {
        this.data.page = page
        this.data.pageSize = pageSize

        this.setState({
            loading: true
        })
        if (this.state.selectKey == '1') {
            this.getCrontabJobList(this.data.token, search)
        } else if (this.state.selectKey == '2') {
            this.getDaemonJobList(this.data.token, search)
        }
    }

    private tabChange = (activeKey: string) => {
        this.data.page = 1
        this.data.pageSize = 20
        this.setState({
            selectKey: activeKey,
            loading: true
        })
        if (activeKey == '1') {
            this.getCrontabJobList(
                this.data.token,
                this.data.searchCrontabJobTxt
            )
        }
        if (activeKey == '2') {
            this.getDaemonJobList(this.data.token, this.data.searchDaemonJobTxt)
        }
        if (activeKey == '3') {
            this.getSystemInfo(this.data.token)
        }
    }

    private getCrontabJobList = (jiaToken: string, search: string) => {
        this.data.searchCrontabJobTxt = search
        getRequest({
            url: API.CrontabList,
            token: jiaToken,
            data: {
                page: this.data.page,
                pagesize: this.data.pageSize,
                addr: getUrlParam('addr', this.props.history.location.search),
                searchTxt: search
            },
            succ: (data: any) => {
                this.setState(
                    {
                        loading: false
                    },
                    () => {
                        let templeListData = JSON.parse(data)
                        this.data.total = templeListData.total
                        this.setState({
                            crontabList: templeListData.list
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
    private getDaemonJobList = (jiaToken: string, search: string) => {
        this.setState({
            searchDaemonJobTxt: search
        })
        getRequest({
            url: API.DaemonList,
            token: jiaToken,
            data: {
                page: this.data.page,
                pagesize: this.data.pageSize,
                addr: getUrlParam('addr', this.props.history.location.search),
                searchTxt: search
            },
            succ: (data: any) => {
                this.setState(
                    {
                        loading: false
                    },
                    () => {
                        let templeListData = JSON.parse(data)
                        this.data.total = templeListData.total
                        this.setState({
                            daemonJobList: templeListData.list
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

    private getSystemInfo = (jiaToken: string) => {
        this.setState({
            loading: true
        })
        getRequest({
            url: API.systemInfo,
            token: jiaToken,
            data: {
                addr: getUrlParam('addr', this.props.history.location.search)
            },
            succ: (data: any) => {
                this.setState({
                    systemInfo: JSON.parse(data),
                    loading: false
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
    private changeLoading = (loading: boolean) => {
        this.setState({
            loading
        })
    }

    public render(): any {
        const currentTab = this.state.selectKey
        const addr: string = getUrlParam(
            'addr',
            this.props.history.location.search
        )

        return (
            <BaseLayout pages="nodeList">
                <div className="jia-content">
                    <Bread
                        paths={[
                            {
                                id: 'first1',
                                name: '节点列表',
                                icon: 'ss',
                                route: '/node/list'
                            },
                            {
                                id: 'first2',
                                name: addr,
                                icon: 'ss',
                                route: '/node/detail'
                            }
                        ]}
                    />

                    <Tabs
                        activeKey={currentTab}
                        onChange={this.tabChange}
                        style={{
                            background: '#fff',
                            padding: '0 16px'
                        }}
                    >
                        <TabPane tab="定时任务" key="1">
                            <CrontabJobList
                                changeLoading={this.changeLoading}
                                reload={this.reload}
                                jobData={this.state.crontabList}
                                loading={this.state.loading}
                                currentKey="1"
                                page={this.data.page}
                                pageSize={this.data.pageSize}
                                total={this.data.total}
                                history={this.props.history}
                                addr={addr}
                            />
                        </TabPane>
                        <TabPane tab="常驻任务" key="2">
                            <DaemonJobList
                                changeLoading={this.changeLoading}
                                reload={this.reload}
                                jobData={this.state.daemonJobList}
                                loading={this.state.loading}
                                currentKey="2"
                                page={this.data.page}
                                pageSize={this.data.pageSize}
                                total={this.data.total}
                                history={this.props.history}
                                addr={addr}
                            />
                        </TabPane>
                        <TabPane tab="运行信息" key="3">
                            <SystemInfo
                                infoData={this.state.systemInfo}
                                history={this.props}
                                loading={this.state.loading}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </BaseLayout>
        )
    }
}

export default NodeDetail
