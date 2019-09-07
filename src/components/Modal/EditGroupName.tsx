import * as React from 'react'
import { Modal, Form, Input } from 'antd'
import { ModalProps } from 'antd/lib/modal/Modal'
import { FormComponentProps } from 'antd/lib/form'

interface Props extends ModalProps {
    visible: boolean
    handleOk?: any
    handleCancel?: any
    handleGroupChange?: any
    title: string
    groups: any[]
    changeVisible: any,
    defaultName: string
}
interface UserFormProps extends FormComponentProps {

}
interface State {
    // radioValue: string
}
class EditGroupName extends React.Component<
    Props & UserFormProps,
    State
    > {
    public state: State
    constructor(props: Props & FormComponentProps) {
        super(props)
        this.state = {
            // radioValue: 'new'
        }
    }

    componentDidMount() { }
    private handleCancel = () => {
        this.props.changeVisible(false)
        this.props.form.resetFields()
    }

    render() {
        const { form, defaultName } = this.props
        const { getFieldDecorator } = form
        return (
            <div>
                <Modal
                    title={this.props.title}
                    cancelText="取消"
                    okText="提交"
                    visible={this.props.visible}
                    onOk={this.props.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <Form layout="vertical">
                        <Form.Item>
                            {getFieldDecorator('groupName', {
                                initialValue: defaultName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入分组名称'
                                    }
                                ]
                            })(<Input placeholder="请输入分组名称" />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create<UserFormProps & ModalProps & Props>()(EditGroupName)
