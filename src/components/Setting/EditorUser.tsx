import * as React from 'react'
import { Card, Col, Row } from 'antd'
import EditorUserPwd from './EditorUserPwd'
import EditorUserInfo from './EditorUserInfo'

interface Props { }
class EditorUser extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card size="small" title="修改密码" bordered={false}>
                            <EditorUserPwd></EditorUserPwd>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" title="修改信息" bordered={false}>
                            <EditorUserInfo></EditorUserInfo>
                        </Card>
                    </Col>
                </Row>

            </div>
        )
    }
}

export default EditorUser
