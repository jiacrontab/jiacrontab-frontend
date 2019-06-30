import * as React from 'react'
import { Layout } from 'antd'

class Footerjia extends React.Component {
    render() {
        const currentYear = new Date().getFullYear();
        return (
            <Layout.Footer style={{ textAlign: 'center', padding: 10 }}>
                Jiacrontab ©{currentYear} Created by iwannay
            </Layout.Footer>
        )
    }
}

export default Footerjia
