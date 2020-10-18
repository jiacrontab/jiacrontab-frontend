import * as React from 'react'
import { Link } from 'react-router-dom'
import Footers from '../components/footer'
import { hashHistory } from '../utils/history'

import {
    BarsOutlined,
    DownOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    LogoutOutlined,
    SettingOutlined,
    SnippetsOutlined,
} from '@ant-design/icons';

import { Layout, Menu, Avatar, Dropdown, Modal } from 'antd';
const { Header, Content } = Layout

interface Props {
    children: any
    pages: string
}
interface State {
    userName: string
    subName: string
    colors: any[]
    groupID: number
    root: boolean
}
class HomeLayout extends React.Component<Props, State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            userName: '',
            subName: '',
            colors: [
                '#87d068',
                '#f56a00',
                '#7265e6',
                '#ffbf00',
                '#00a2ae',
                '#FF1493',
                '#B23AEE',
                '#EE9A00',
                '#FF4500',
                '#1E90FF'
            ],
            groupID: -1,
            root: false
        }
    }
    componentDidMount() {
        if (localStorage && localStorage.getItem('userInfo')) {
            let userInfos: any = localStorage.getItem('userInfo')
            let user_name = JSON.parse(userInfos).username
            if (!user_name) {
                hashHistory.push('/login')
                return
            }
            let user_sub_name = user_name.substr(0, 1).toLocaleUpperCase()
            this.setState({
                userName: user_name,
                subName: user_sub_name,
                groupID: JSON.parse(userInfos).groupID,
                root: JSON.parse(userInfos).root
            })
        }
    }
    private menuItemEvent = (item: any) => {
        if (item.key === 'logout') {
            this.showConfirm()
        }
        if (item.key === 'setting') {
            if (this.state.groupID === 1 && this.state.root) {
                if (hashHistory.location.pathname == '/setting/mail') return
                hashHistory.push('/setting/mail')
            } else {
                if (hashHistory.location.pathname == '/setting/info') return
                hashHistory.push('/setting/info')
            }

        }
    }
    private showConfirm = () => {
        Modal.confirm({
            title: '你确定需要退出登录吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                localStorage.removeItem('jiaToken')
                localStorage.removeItem('userInfo')
                hashHistory.push('/login')
            }
        })
    }
    render() {
        const { children } = this.props
        let { userName, colors, groupID } = this.state
        let colorIndex = userName.charCodeAt(0) % 10
        const menu = (
            <Menu onClick={this.menuItemEvent}>
                <Menu.Item key="setting">
                    <SettingOutlined />
                    应用设置
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                    <LogoutOutlined />
                    退出登录
                </Menu.Item>
            </Menu>
        )
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Header className="header">
                    <div className="logo">
                        <Link to="/home" replace>
                            <span
                                className="large-w"
                                style={{ display: 'block' }}
                            >
                                jiacrontab
                            </span>
                        </Link>
                    </div>
                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={[this.props.pages]}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="home">
                            <Link to="/home" replace>
                                <HomeOutlined />
                                <span>首页</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="nodeList">
                            <Link to="/node/list" replace>
                                <BarsOutlined />
                                <span>节点列表</span>
                            </Link>
                        </Menu.Item>
                        {groupID === 1 ? (
                            <Menu.Item key="groupList">
                                <Link to="/group/list" replace>
                                    <SnippetsOutlined />
                                    <span>分组</span>
                                </Link>
                            </Menu.Item>
                        ) : null}

                        {/* <Menu.Item key="configInfo">
                            <Link to="/configInfo" replace>
                                <Icon type="setting" />
                                <span>配置信息</span>
                            </Link>
                        </Menu.Item> */}
                        <Menu.Item key="help">
                            <Link to="/help" replace>
                                <InfoCircleOutlined />
                                <span>帮助</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                    <div style={{ position: 'absolute', top: 0, right: '4%' }}>
                        <Dropdown overlay={menu} placement="bottomRight">
                            <div>
                                <Avatar
                                    style={{
                                        color: '#ffffff',
                                        backgroundColor: colors[colorIndex],
                                        marginRight: 10
                                    }}
                                >
                                    {this.state.subName}
                                </Avatar>
                                <span
                                    className="ant-dropdown-link"
                                    style={{
                                        cursor: 'pointer',
                                        color: '#1890ff'
                                    }}
                                >
                                    {this.state.userName} <DownOutlined />
                                </span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ position: 'relative' }}>{children}</Content>
                <Footers />
            </Layout>
        );
    }
}

export default HomeLayout
