import * as React from 'react'
import BaseLayout from '../../layout/BaseLayout'
import './Setting.css'
import SettingMail from '../../components/Setting/SettingMail'
import SettingMenu from '../../components/Setting/SettingMenu'
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

    public render(): any {
        return (<BaseLayout pages="setting">
            <div className="setting-page">
                <div className="setting-left">
                    <SettingMenu history={{ history }} />
                </div>
                <div style={{ marginLeft: 256, height: '100%', overflowY: 'auto' }}>
                    <div className="setting-box">
                        <SettingMail />
                    </div>
                </div>
            </div>
        </BaseLayout>)
    }
}


export default Setting;