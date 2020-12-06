import * as React from 'react'
import { List, Skeleton, DatePicker, Input, Radio, Button } from 'antd'
import BaseLayout from '../../layout/BaseLayout'
import API from '../../config/api'
import { getUrlParam, getRequest } from '../../utils/utils'
import Bread from '../../components/Layout/Bread'
import './Log.css'

interface LogProps {
    history: any
}
interface State {
    token: any
    initLoading: boolean
    loading: boolean
    logList: any[]
    pageSize: number
    totalNumber: number
    searchText: string
    searchDate: any
    searchTextTemp: string
    searchDateTemp: any
    isTail: boolean
    noMoreData: boolean
    offset: number
    tempTail: boolean
}

class Log extends React.Component<LogProps, State> {
    public state: State
    constructor(props: LogProps) {
        super(props)
        this.state = {
            token: '',
            initLoading: true,
            loading: false,
            pageSize: 10,
            totalNumber: 0,
            logList: [],
            searchText: '',
            searchDate: '',
            searchTextTemp: '',
            searchDateTemp: '',
            isTail: true,
            noMoreData: false,
            offset: -1,
            tempTail: true
        }
    }

    public componentDidMount() {
        if (window.localStorage) {
            this.setState(
                {
                    token: localStorage.getItem('jiaToken')
                },
                () => {
                    if (getUrlParam('id', this.props.history.location.search)) {
                        const id: number = Number(
                            getUrlParam(
                                'id',
                                this.props.history.location.search
                            )
                        )
                        const addr: string = getUrlParam(
                            'addr',
                            this.props.history.location.search
                        )
                        const date: string = getUrlParam(
                            'date',
                            this.props.history.location.search
                        )
                        const offset: number = this.state.offset
                        this.getLogData(
                            id,
                            addr,
                            this.state.token,
                            date,
                            offset
                        )
                    }
                }
            )
        }
    }
    private getLogData = (
        id: number,
        addr: string,
        jiaToken: string,
        date: string,
        offset: number
    ) => {
        const currentApi =
            getUrlParam('tabKey', this.props.history.location.search) == '2'
                ? API.daemonLog
                : API.crontabLog
        getRequest({
            url: currentApi,
            token: jiaToken,
            data: {
                addr: addr,
                jobID: id,
                date: date,
                pageSize: 20,
                pattern: this.state.searchText,
                isTail: this.state.isTail,
                offset: offset
            },
            succ: (data: any) => {
                const logDatas = data
                if (logDatas.logList[0] == '' && logDatas.logList.length <= 1) {
                    logDatas.logList = []
                }
                let resultList = this.state.logList.concat(logDatas.logList)
                this.setState({
                    initLoading: false,
                    pageSize: Number(logDatas.pagesize),
                    totalNumber: Number(logDatas.filesize),
                    logList: resultList,
                    loading: false,
                    offset: Number(logDatas.offset)
                })
                if (
                    resultList.length > 0 &&
                    Number(logDatas.filesize) == Number(logDatas.offset)
                ) {
                    this.setState({
                        noMoreData: true
                    })
                }
                if (logDatas.offset === 0 && resultList.length > 0) {
                    this.setState({
                        noMoreData: true
                    })
                }
            },
            error: () => {
                this.setState({
                    loading: false,
                    initLoading: false
                })
            },
            catch: () => {
                this.setState({
                    loading: false,
                    initLoading: false
                })
            }
        })
    }

    private dateChange = (date: any, dateString: string) => {
        this.setState({
            searchDateTemp: dateString.split('-').join('/')
        })
    }
    private searchTextChange = (e: any) => {
        this.setState({
            searchTextTemp: e.target.value
        })
    }
    private switchChange = (e: any) => {
        this.setState({
            tempTail: e.target.value
        })
    }
    private searchLog = () => {
        const id: number = Number(
            getUrlParam('id', this.props.history.location.search)
        )
        const addr: string = getUrlParam(
            'addr',
            this.props.history.location.search
        )
        this.setState(
            {
                initLoading: true,
                logList: [],
                loading: false,
                offset: this.state.tempTail ? -1 : 0,
                noMoreData: false,
                isTail: this.state.tempTail,
                searchText: this.state.searchTextTemp,
                searchDate: this.state.searchDateTemp
            },
            () => {
                this.getLogData(
                    id,
                    addr,
                    this.state.token,
                    this.state.searchDate,
                    this.state.offset
                )
            }
        )
    }
    private onLoadMore = () => {
        this.setState({
            loading: true
        })

        const propsId = getUrlParam('id', this.props.history.location.search)
        const propsAddr = getUrlParam(
            'addr',
            this.props.history.location.search
        )
        // const propsDate = getUrlParam(
        //     'date',
        //     this.props.history.location.search
        // )

        const totalNumber: number = this.state.totalNumber
        const id: number = Number(propsId)
        const addr: string = propsAddr
        const date: string = this.state.searchDate
        const offset: number = this.state.offset
        if (totalNumber == offset) {
            this.setState({
                noMoreData: true
            })
            return
        }
        this.getLogData(id, addr, this.state.token, date, offset)
    }
    public render(): any {
        const {
            initLoading,
            logList,
            loading,
            offset,
            totalNumber,
            noMoreData
        } = this.state
        // const pageSize: number = this.state.pageSize
        // const totalNumber: number = this.state.totalNumber
        const propsId = getUrlParam('id', this.props.history.location.search)
        const propsAddr = getUrlParam(
            'addr',
            this.props.history.location.search
        )
        const propsTabKey = getUrlParam(
            'tabKey',
            this.props.history.location.search
        )
        // const propsDate = getUrlParam('date', this.props.history.location.search);
        const loadMore =
            !initLoading && !loading && !noMoreData && logList.length > 0 ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 12,
                        height: 32,
                        lineHeight: '32px'
                    }}
                >
                    <Button onClick={this.onLoadMore}>
                        加载更多({offset}/{totalNumber})
                    </Button>
                </div>
            ) : null

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
                                        ? '常驻任务日志'
                                        : '定时任务日志',
                                icon: 'ss',
                                route: '/log'
                            }
                        ]}
                    />
                    <div style={{ marginBottom: 10 }}>
                        <Input
                            placeholder="输入搜索内容"
                            onChange={this.searchTextChange}
                            style={{ width: '180px', marginRight: '12px' }}
                        />
                        <DatePicker
                            onChange={this.dateChange}
                            style={{ width: '180px', marginRight: '12px' }}
                            placeholder="请选择筛选日期"
                        />
                        <Radio.Group onChange={this.switchChange} defaultValue={this.state.isTail}>
                            <Radio value={false}>顺序</Radio>
                            <Radio value={true}>倒序</Radio>
                        </Radio.Group>
                        {/* <Switch
                            checkedChildren="顺序"
                            onChange={this.switchChange}
                            unCheckedChildren="倒序"
                            style={{ marginRight: '12px' }}
                        /> */}
                        <Button
                            type="primary"
                            htmlType="button"
                            onClick={this.searchLog}
                        >
                            搜索
                        </Button>
                    </div>
                    <List
                        className="loadmore-list"
                        loading={initLoading}
                        itemLayout="horizontal"
                        dataSource={logList}
                        loadMore={loadMore}
                        renderItem={(item: any) => (
                            <List.Item>{item}</List.Item>
                        )}
                    />
                    <div className="loadmore-list">
                        <Skeleton
                            title={false}
                            loading={loading}
                            paragraph={{ rows: 4 }}
                            active
                        />
                    </div>
                    {this.state.noMoreData ? (
                        <div
                            className="loadmore-list"
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            没有更多数据了
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </BaseLayout>
        )
    }
}

export default Log
