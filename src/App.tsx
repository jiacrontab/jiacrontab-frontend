import * as React from 'react'
import './App.css'
import { Layout, Spin } from 'antd'
import { getCookie } from './utils/cookie'
const { Content } = Layout

interface Props {
    history?: any
}
class App extends React.Component<Props> {
    constructor(props: any) {
        super(props)
    }
    state = {}

    public componentDidMount(): void {
        if (getCookie('ready') === 'false') {
            this.props.history.push('/init')
            return
        }
        if (window.localStorage) {
            if (localStorage.getItem('jiaToken')) {
                this.props.history.push('/home')
            } else {
                this.props.history.push('/login')
            }
        } else {
            this.props.history.push('/login')
        }
    }

    public render() {
        return (
            <Layout className="init-page" style={{ minHeight: '100vh' }}>
                <Content>
                    <div className="middle-center">
                        <Spin size="large" />
                    </div>
                </Content>
            </Layout>
        )
    }
}

export default App
