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
    page: number
    pageSize: number
    total: number
}

interface Data {
    token: any
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
            systemInfo: {},
            page: 1,
            pageSize: 20,
            total: 0,
        }
        this.data = {
            token: '',
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
        if (page) {
            this.setState({
                page
            })
        }
        if (pageSize) {
            this.setState({
                pageSize
            })
        }

        this.setState({
            loading: true
        })
        if (this.state.selectKey == '1') {
            this.getCrontabJobList(this.data.token, search)
        } else if (this.state.selectKey == '2') {
            this.getDaemonJobList(this.data.token, search)
        }
    }
    changePage(page:any,pageSize:any) {
        console.log(page,pageSize,'----')
        console.log(this.state)
        if (page) {
            this.setState({
                page
            })
        }
        if (pageSize) {
            this.setState({
                pageSize
            })
        }
        console.log(this.state,'xdkfsk')
        
        
    }

    private tabChange = (activeKey: string) => {
        this.setState({
            page: 1,
            pageSize: 20
        })
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
                page: this.state.page,
                pagesize: this.state.pageSize,
                addr: getUrlParam('addr', this.props.history.location.search),
                searchTxt: search
            },
            succ: (data: any) => {
                this.setState(
                    {
                        loading: false
                    },
                    () => {
                        let templeListData = data
                        this.state.total = templeListData.total
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
                page: this.state.page,
                pagesize: this.state.pageSize,
                addr: getUrlParam('addr', this.props.history.location.search),
                searchTxt: search
            },
            succ: (data: any) => {
                this.setState(
                    {
                        loading: false
                    },
                    () => {
                        let templeListData = data
                        this.state.total = templeListData.total
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
                    systemInfo: data,
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
                            padding: '0 16px 16px'
                        }}
                    >
                        <TabPane tab="定时任务" key="1">
                            <CrontabJobList
                                changeLoading={this.changeLoading}
                                reload={this.reload}
                                jobData={this.state.crontabList}
                                loading={this.state.loading}
                                currentKey="1"
                                page={this.state.page}
                                pageSize={this.state.pageSize}
                                total={this.state.total}
                                history={this.props.history}
                                addr={addr}
                                changePage={this.changePage.bind(this)}
                            />
                        </TabPane>
                        <TabPane tab="常驻任务" key="2">
                            <DaemonJobList
                                changeLoading={this.changeLoading}
                                reload={this.reload}
                                jobData={this.state.daemonJobList}
                                loading={this.state.loading}
                                currentKey="2"
                                page={this.state.page}
                                pageSize={this.state.pageSize}
                                total={this.state.total}
                                history={this.props.history}
                                addr={addr}
                                changePage={this.changePage.bind(this)}
                            />
                        </TabPane>
                        <TabPane tab="节点信息" key="3">
                            <SystemInfo
                                resetInfo={this.getSystemInfo}
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
