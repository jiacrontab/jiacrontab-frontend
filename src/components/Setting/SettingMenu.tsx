import * as React from 'react'
import { Menu, Icon } from 'antd'
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
        if (hashHistory.location.pathname == '/setting/chpwd') {
            selectText = 'chpwd'
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
        if (item.key === 'chpwd') {
            if (hashHistory.location.pathname == '/setting/chpwd') return
            hashHistory.push('/setting/chpwd')
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
                        <Icon type="mail" />
                        邮箱配置
                        </Menu.Item>
                ) : null}
                {groupID === 1 && root ? (
                    <Menu.Item key="user">
                        <Icon type="user" />
                        添加用户
                        </Menu.Item>
                ) : null}

                <Menu.Item key="chpwd">
                    <Icon type="edit" />
                    修改信息
                </Menu.Item>
            </Menu>
        )
    }
}

export default SettingMenu
