import * as React from 'react'
import { Layout } from 'antd'

class Footerjia extends React.Component {
    render() {
        const currentYear = new Date().getFullYear()
        return (
            <Layout.Footer style={{ textAlign: 'center', padding: 10 }}>
                Jiacrontab ©{currentYear} Created by iwannay{' '}
                <a href="http://www.beian.miit.gov.cn">沪ICP备18002924号</a>
            </Layout.Footer>
        )
    }
}

export default Footerjia
