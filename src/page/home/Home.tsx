import * as React from 'react'
import {
    Empty,
    Card,
    Row,
    Col,
    List,
    Radio,
    Tag,
    Skeleton,
    Button,
    Modal,
    Input
} from 'antd'
import BaseLayout from '../../layout/BaseLayout'
import { getRequest, time } from '../../utils/utils'
import API from '../../config/api'
import './Home.css'

interface Props {
    history: any
}

interface State {
    loading: boolean
    token: string | null
    listData: any[]
    loadingMore: boolean
    isHasMore: boolean
    defalutList: string
    visible: boolean
    content: object
    userStat: any
    systemInfo: any
    version: string
    searchTxt: string
}
class Home extends React.Component<Props, State> {
    public state: State
    constructor(props: any) {
        super(props)
        this.state = {
            loading: true,
            token: '',
            listData: [],
            loadingMore: false,
            isHasMore: false,
            defalutList: 'user',
            visible: false,
            content: {},
            userStat: {},
            systemInfo: {},
            version: '',
            searchTxt: ''
        }
    }

    public componentDidMount(): void {
        if (window.localStorage) {
            this.setState(
                {
                    token: localStorage.getItem('jiaToken')
                },
                () => {
                    this.getUserStat()
                    this.getActivityList(0)
                }
            )
        }
    }
    private getUserStat = () => {
        getRequest({
            url: API.userStat,
            token: this.state.token,
            data: {},
            succ: (data: any) => {
                const { auditStat, systemInfo, version } = data
                this.setState({
                    userStat: auditStat,
                    systemInfo: systemInfo,
                    version: version
                })
            }
        })
    }

    private getActivityList = (lastID: number) => {
        getRequest({
            url: API.ActivityList,
            token: this.state.token,
            data: {
                lastID,
                keywords: this.state.searchTxt
            },
            succ: (data: any) => {
                const resultData = data
                this.setState({
                    loading: false,
                    isHasMore:
                        resultData.list.length == resultData.pagesize
                            ? true
                            : false,
                    listData: [...this.state.listData, ...resultData.list]
                })
                setTimeout(() => {
                    this.setState({
                        loadingMore: false
                    })
                }, 200)
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
    private getJobHistory = (lastID: number) => {
        getRequest({
            url: API.JobHistory,
            token: this.state.token,
            data: {
                lastID,
                keywords: this.state.searchTxt
            },
            succ: (data: any) => {
                const resultData = data
                this.setState({
                    loading: false,
                    isHasMore:
                        resultData.list.length == resultData.pagesize
                            ? true
                            : false,
                    listData: [...this.state.listData, ...resultData.list]
                })
                setTimeout(() => {
                    this.setState({
                        loadingMore: false
                    })
                }, 200)
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
    private activityDesc = (item: any) => {
        if (this.state.defalutList == 'job') {
            return (
                <div>
                    <Tag
                        color="cyan"
                        onClick={() =>
                            this.props.history.push({
                                pathname: 'node/detail',
                                search: `?&addr=${item.addr}`
                            })
                        }
                    >
                        {item.addr}
                    </Tag>
                    <span>
                        在 {time.UTCToTime(item.StartTime)} -{' '}
                        {time.UTCToTime(item.endTime)}
                    </span>
                    <span>
                        {' '}
                        执行了 {item.jobType == 0
                            ? '定时任务'
                            : '常驻任务'}{' '}
                    </span>
                    <span style={{ color: '#f50' }}>{item.jobName}</span>
                </div>
            )
        } else {
            let desc = String(item.eventDesc)
            return (
                <div key={item.ID}>
                    {((): any => {
                        let ele = []
                        let tagStatus = 0
                        let tag = ''
                        let str = ''

                        for (var i = 0; i < desc.length; i++) {
                            if (desc[i] === '{') {
                                tag = ''
                                tagStatus = 1
                                if (str.length !== 0) {
                                    ele.push(<span key={i}>{str}</span>)
                                }
                                str = ''
                                continue
                            }

                            if (desc[i] === '}' && tagStatus === 1) {
                                tagStatus = 2
                                if (tag === 'sourceName') {
                                    ele.push(
                                        <Tag
                                            key={i}
                                            color="cyan"
                                            onClick={() =>
                                                this.props.history.push({
                                                    pathname: 'node/detail',
                                                    search: `?&addr=${
                                                        item.sourceName
                                                    }`
                                                })
                                            }
                                        >
                                            {item.sourceName}
                                        </Tag>
                                    )
                                }

                                if (tag === 'username') {
                                    ele.push(
                                        <span
                                            key={i}
                                            style={{
                                                color: '#f50',
                                                padding: '0 5px'
                                            }}
                                        >
                                            {item.username}
                                        </span>
                                    )
                                }

                                if (tag === 'sourceUsername') {
                                    ele.push(
                                        <span
                                            key={i}
                                            style={{
                                                color: '#f50',
                                                padding: '0 5px'
                                            }}
                                        >
                                            {item.sourceUsername}
                                        </span>
                                    )
                                }

                                if (tag === 'targetName') {
                                    ele.push(
                                        <span
                                            key={i}
                                            style={{
                                                color: '#f50',
                                                padding: '0 5px'
                                            }}
                                        >
                                            {item.targetName}
                                        </span>
                                    )
                                }

                                continue
                            }

                            if (tagStatus === 1) {
                                tag += desc[i]
                                continue
                            }

                            str += desc[i]
                            tagStatus = 0
                        }

                        if (str !== '') {
                            ele.push(<span key={i}>{str}</span>)
                        }

                        return ele
                    })()}
                </div>
            )
        }
    }

    private detail = (item: any) => {
        this.setState({
            visible: true,
            content: item.content ? JSON.parse(item.content) : item
        })
    }
    private onLoadMore = () => {
        let lastID = this.state.listData[this.state.listData.length - 1]
        this.setState(
            {
                loadingMore: true
            },
            () => {
                if (this.state.defalutList == 'job') {
                    this.getJobHistory(lastID.ID)
                } else {
                    this.getActivityList(lastID.ID)
                }
            }
        )
    }
    private changeActivity = (e: any) => {
        this.setState({
            defalutList: e.target.value,
            isHasMore: false,
            searchTxt: ''
        })
        // this.props.form.setFieldsValue({name:''});
        if (e.target.value == 'job') {
            this.setState(
                {
                    loadingMore: true,
                    listData: []
                },
                () => {
                    this.getJobHistory(0)
                }
            )
        } else {
            this.setState(
                {
                    loadingMore: true,
                    listData: []
                },
                () => {
                    this.getActivityList(0)
                }
            )
        }
    }
    private handleOk = () => {
        this.setState({
            visible: false
        })
    }
    private handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    private search = (value:string) => {
        this.setState({
            searchTxt: value
        })
        this.setState(
            {
                loadingMore: true
            },
            () => {
                if (this.state.defalutList == 'job') {
                    this.setState(
                        {
                            loadingMore: true,
                            listData: []
                        },
                        () => {
                            this.getJobHistory(0)
                        }
                    )
                } else {
                    this.setState(
                        {
                            loadingMore: true,
                            listData: []
                        },
                        () => {
                            this.getActivityList(0)
                        }
                    )
                }
            }
        )
    }

    private searchChange = (e:any) => {
        const { value } = e.target;
        this.setState({
            searchTxt: value
        })
    }

    public render(): any {
        const data = this.state.listData
        const { Search } = Input
        const loadMore =
            this.state.isHasMore && !this.state.loadingMore ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 12,
                        height: 32,
                        lineHeight: '32px'
                    }}
                >
                    <Button onClick={this.onLoadMore}>加载更多</Button>
                </div>
            ) : null

        // CrontabJobAuditNum: 7 未审核定时任务数量
        // CrontabJobFailNum: 0 定时任务失败数量
        // DaemonJobAuditNum: 0 未审核常驻任务数量
        // DaemonJobRunningNum: 0 常驻任务运行数量
        // NodeNum: 1  节点数量
        const userStat = this.state.userStat
        const systemInfo = this.state.systemInfo
        return (
            <BaseLayout pages="home">
                <div className="jia-content">
                    <Card size="small" style={{ marginTop: 10 }}>
                        <Row>
                            <Col span={6}>
                                <div className="stat-box">
                                    <p>
                                        <span>未审核定时任务 : </span>
                                        <span className="stat-num">
                                            {userStat.CrontabJobAuditNum}
                                        </span>
                                    </p>
                                    <p>
                                        <span>失败定时任务 :</span>
                                        <span className="stat-num">
                                            {userStat.CrontabJobFailNum}
                                        </span>
                                    </p>
                                    <p>
                                        <span>运行定时任务 :</span>
                                        <span className="stat-num">
                                            {userStat.CrontabTaskNum}
                                        </span>
                                    </p>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="stat-box">
                                    <p>
                                        <span>未审核常驻任务 :</span>
                                        <span className="stat-num">
                                            {userStat.DaemonJobAuditNum}
                                        </span>
                                    </p>
                                    <p>
                                        <span>运行常驻任务 :</span>
                                        <span className="stat-num">
                                            {userStat.DaemonTaskNum}
                                        </span>
                                    </p>
                                    <p>
                                        <span>节点 :</span>
                                        <span className="stat-num">
                                            {userStat.NodeNum}
                                        </span>
                                    </p>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="stat-box">
                                    <p>
                                        <span>goroutine : </span>
                                        <span className="stat-num">
                                            {systemInfo['goroutine数量']}
                                        </span>
                                    </p>
                                    <p>
                                        <span>内存占用 : </span>
                                        <span className="stat-num">
                                            {systemInfo['内存占用量']}
                                        </span>
                                    </p>
                                    <p>
                                        <span>当前内存使用 :</span>
                                        <span className="stat-num">
                                            {systemInfo['当前内存使用量']}
                                        </span>
                                    </p>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="stat-box no-border">
                                    <p>
                                        <span>cpu核心 : </span>
                                        <span className="stat-num">
                                            {systemInfo['cpu核心数']}
                                        </span>
                                    </p>
                                    <p>
                                        <span>服务运行 : </span>
                                        <span className="stat-num">
                                            {systemInfo['服务运行时间']}
                                        </span>
                                    </p>
                                    <p>
                                        <span>版本 : </span>
                                        <span className="stat-num">
                                            {this.state.version}
                                        </span>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                    <Card size="small" title="动态" style={{ marginTop: 10 }}>
                        <Radio.Group
                            onChange={this.changeActivity}
                            defaultValue="user"
                            style={{ marginBottom: 10 }}
                        >
                            <Radio.Button value="user">用户动态</Radio.Button>
                            <Radio.Button value="job">job动态</Radio.Button>
                        </Radio.Group>
                        <Search
                            placeholder="搜索动态"
                            onSearch={this.search}
                            value={this.state.searchTxt}
                            onChange={this.searchChange}
                            // onSearch={value => {
                            //     this.data.searchTxt = value
                            //     this.data.page = 1
                            //     this.reload()
                            // }}
                            enterButton="查询"
                            style={{ width: 200, marginBottom: 10, marginLeft: 20 }}
                        />
                        {data.length == 0 && this.state.loadingMore ? (
                            this.state.loadingMore ? (
                                <div style={{ height: 30 }} />
                            ) : (
                                <Empty />
                            )
                        ) : (
                            <List
                                itemLayout="horizontal"
                                loading={this.state.loading}
                                loadMore={loadMore}
                                dataSource={data}
                                renderItem={(item: any) => (
                                    <List.Item
                                        key={item.ID}
                                        actions={[
                                            <span
                                                style={{
                                                    marginRight: '20px',
                                                    color: '#1890ff',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    this.detail(item)
                                                }}
                                            >
                                                详情
                                            </span>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            key={item.ID}
                                            title={this.activityDesc(item)}
                                            description={time.UTCToTime(
                                                item.CreatedAt
                                            )}
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                        <Skeleton
                            title={false}
                            loading={this.state.loadingMore}
                            paragraph={{ rows: 4 }}
                            active
                        />
                    </Card>
                    <Modal
                        title="动态详情"
                        footer={null}
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <pre>{JSON.stringify(this.state.content, null, 2)}</pre>
                    </Modal>
                </div>
            </BaseLayout>
        )
    }
}

export default Home
