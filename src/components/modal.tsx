import * as React from 'react'
import { Modal } from 'antd'

interface ModalData {
    visible: boolean
    handleOk: any
    handleCancel: any
    modalListData: string[]
}
class ModalTemple extends React.Component<ModalData> {
    constructor(props: ModalData) {
        super(props)
    }
    render() {
        return (
            <div>
                <Modal
                    title="log"
                    cancelButtonProps={{ className: 'jia-hide' }}
                    okText="确定"
                    closable={false}
                    visible={this.props.visible}
                    onOk={this.props.handleOk}
                    onCancel={this.props.handleCancel}
                    bodyStyle={{ maxHeight: '470px', overflowY: 'auto' }}
                >
                    {(() => {
                        if (this.props.modalListData.length > 0) {
                            return this.props.modalListData.map(
                                (item: any, index: number) => (
                                    <p key={index}>{item}</p>
                                )
                            )
                        } else {
                            return <p>暂无数据</p>
                        }
                    })()}
                </Modal>
            </div>
        )
    }
}

export default ModalTemple
