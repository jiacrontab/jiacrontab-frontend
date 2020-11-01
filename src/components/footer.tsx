import * as React from 'react'
import { Layout } from 'antd'

class Footerjia extends React.Component {
    render() {
        const currentYear = new Date().getFullYear();
        let currentHost = window.location.host
        const isProHost = (currentHost === "jiacrontab-spa.iwannay.cn" || currentHost === "jiacrontab.iwannay.cn") ? true : false;
        return (
            <Layout.Footer style={{ textAlign: 'center', padding: 10 }}>
                Jiacrontab ©{currentYear} Created by iwannay 
                {isProHost ? (
                    <a href="http://www.beian.miit.gov.cn"> 沪ICP备18002924号</a> 
                ) : null}
            </Layout.Footer>
        )
    }
}

export default Footerjia
