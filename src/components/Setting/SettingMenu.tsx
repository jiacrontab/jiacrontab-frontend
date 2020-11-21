import * as React from 'react'
import { EditOutlined, MailOutlined, UserOutlined, ClearOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { hashHistory } from '../../utils/history'

interface Props {
    history: any
}
interface State {
    defaultSelect: string
    groupID: number
    root: boolean
}
class SettingMenu extends React.Component<Props, State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            groupID: -1,
            root: false,
            defaultSelect: ''
        }
    }
    componentDidMount() {
        if (localStorage && localStorage.getItem('userInfo')) {
            let userInfos: any = localStorage.getItem('userInfo')
            this.setState({
                groupID: JSON.parse(userInfos).groupID,
                root: JSON.parse(userInfos).root
            })
        }
        let selectText = ''
        if (hashHistory.location.pathname == '/setting/mail') {
            selectText = 'mail'
        }
        if (hashHistory.location.pathname == '/setting/user') {
            selectText = 'user'
        }
        if (hashHistory.location.pathname == '/setting/info') {
            selectText = 'info'
        }
        if (hashHistory.location.pathname == '/setting/disk_clean') {
            selectText = 'disk'
        }
        this.setState({
            defaultSelect: selectText
        })
    }
    private menuItemEvent = (item: any) => {
        if (item.key === 'mail') {
            if (hashHistory.location.pathname == '/setting/mail') return
            hashHistory.push('/setting/mail')
        }
        if (item.key === 'user') {
            if (hashHistory.location.pathname == '/setting/user') return
            hashHistory.push('/setting/user')
        }
        if (item.key === 'info') {
            if (hashHistory.location.pathname == '/setting/info') return
            hashHistory.push('/setting/info')
        }
        if (item.key === 'disk') {
            if (hashHistory.location.pathname == '/setting/disk_clean') return
            hashHistory.push('/setting/disk_clean')
        }
    }
    public render(): any {
        let { root, groupID, defaultSelect } = this.state
        return (
            <Menu
                style={{ width: 256, height: '100%' }}
                selectedKeys={[defaultSelect]}
                mode='inline'
                onClick={this.menuItemEvent}
            >
                {groupID === 1 && root ? (
                    <Menu.Item key="mail">
                        <MailOutlined />
                        邮箱配置
                        </Menu.Item>
                ) : null}
                {groupID === 1 && root ? (
                    <Menu.Item key="user">
                        <UserOutlined />
                        添加用户
                        </Menu.Item>
                ) : null}

                <Menu.Item key="info">
                    <EditOutlined />
                    修改信息
                </Menu.Item>
                {groupID === 1 && root ? (
                    <Menu.Item key="disk">
                        <ClearOutlined />
                        数据清理
                    </Menu.Item>
                ) : null}
                
            </Menu>
        );
    }
}

export default SettingMenu
