import * as React from 'react'
import BaseLayout from '../../layout/BaseLayout'
import { Menu, Icon } from 'antd'
import './Setting.css'
import SettingMail from '../../components/Setting/SettingMail'
import SettingUser from '../../components/Setting/SettingUser'
interface Props {
    history: any
}
interface State {
    defaultSelect: string
}
class Setting extends React.Component<Props, State> {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            defaultSelect: 'mail'
        }
    }

    private menuItemEvent = (item: any) => {
        this.setState({
            defaultSelect: item.key
        })
    }

    public render(): any {
        return (<BaseLayout pages="setting">
            <div className="setting-page">
                <div className="setting-left">
                    <Menu
                        style={{ width: 256, height: '100%' }}
                        defaultSelectedKeys={['mail']}
                        mode='inline'
                        onClick={this.menuItemEvent}
                    >
                        <Menu.Item key="mail">
                            <Icon type="mail" />
                            邮箱配置
                        </Menu.Item>
                        <Menu.Item key="user">
                            <Icon type="user" />
                            添加用户
                        </Menu.Item>
                    </Menu>
                </div>
                <div style={{ marginLeft: 256, height: '100%', overflowY: 'auto' }}>
                    <div className="setting-box">
                        {
                            this.state.defaultSelect === 'mail' && (
                                <SettingMail />
                            )
                        }
                        {
                            this.state.defaultSelect === 'user' && (
                                <SettingUser />
                            )
                        }
                    </div>
                </div>
            </div>
        </BaseLayout>)
    }
}


export default Setting;