import { Router, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import zhCN from 'antd/es/locale-provider/zh_CN'
import { hashHistory } from './utils/history'

import Login from './page/login/Login'
import Init from './page/init/Init'
import Home from './page/home/Home'
import Help from './page/help/Help'
import UserCenter from './page/userCenter/UserCenter'
import NodeList from './page/node/List'
import GroupList from './page/group/List'
import SettingMail from './page/setting/SettingMail'
import SettingUser from './page/setting/SettingUser'
import SettingInfo from './page/setting/SettingInfo'
import SettingDiskClean from './page/setting/SettingDiskClean'

import NodeDetail from './page/node/Detail'
import CrontabJobForm from './page/edit/CrontabJob'
import DaemonJobForm from './page/edit/DaemonJob'
import Log from './page/log/Log'
import { ConfigProvider } from 'antd';

ReactDOM.render(
    <ConfigProvider locale={zhCN} >
        <Router history={hashHistory} >
            <Switch>
                <Route path="/" exact={true} component={App} />
                <Route path="/init" component={Init} />
                <Route path="/login" component={Login} />
                <Route path="/home" component={Home} />
                <Route path="/help" component={Help} />
                <Route path="/userCenter" component={UserCenter} />
                <Route path="/node/list" component={NodeList} />
                <Route strict exact path="/group/list" component={GroupList} />
                <Route path="/setting/mail" component={SettingMail} />
                <Route path="/setting/user" component={SettingUser} />
                <Route path="/setting/info" component={SettingInfo} />
                <Route path="/setting/disk_clean" component={SettingDiskClean} />
                <Route path="/node/detail" component={NodeDetail} />
                <Route path="/edit/crontab_job" component={CrontabJobForm} />
                <Route path="/edit/daemon_job" component={DaemonJobForm} />
                <Route path="/log" component={Log} />
            </Switch>
        </Router>
    </ConfigProvider>,
    document.getElementById('root') as HTMLElement
)

registerServiceWorker()
