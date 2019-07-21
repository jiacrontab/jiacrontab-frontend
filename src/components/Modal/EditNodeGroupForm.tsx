import * as React from 'react'
import { Modal, Form, Input, Select, Radio } from 'antd'
import { ModalProps } from 'antd/lib/modal/Modal'
import { FormComponentProps } from 'antd/lib/form'

interface Props extends ModalProps {
    visible: boolean
    handleOk?: any
    handleCancel?: any
    handleGroupChange?: any
    title: string
    groups: any[]
    changeVisible: any
}
interface UserFormProps extends FormComponentProps {

}
interface State {
    radioValue: string
}
class EditNodeGroupForm extends React.Component<
    Props & UserFormProps,
    State
    > {
    public state: State
    constructor(props: Props & FormComponentProps) {
        super(props)
        this.state = {
            radioValue: 'new'
        }
    }

    componentDidMount() { }
    private handleCancel = () => {
        this.props.changeVisible(false)
        this.props.form.resetFields()
    }
    private radioChange = (e: any) => {
        this.setState({
            radioValue: e.target.value
        })
    }
    render() {
        const { form } = this.props
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
                            {getFieldDecorator('types', {
                                initialValue: this.state.radioValue
                            })(
                                <Radio.Group onChange={this.radioChange}>
                                    <Radio value="new">新建分组</Radio>
                                    <Radio value="move">复制到指定分组</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        {this.state.radioValue == 'new' ? (
                            <Form.Item>
                                {getFieldDecorator('title', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入分组名称'
                                        }
                                    ]
                                })(<Input placeholder="请输入分组名称" />)}
                            </Form.Item>
                        ) : (
                                <Form.Item>
                                    {getFieldDecorator('groupId', {
                                        initialValue: 1
                                    })(
                                        <Select>
                                            {this.props.groups.map(
                                                (value: any, index: number) => {
                                                    return (
                                                        <Select.Option
                                                            key={value['ID']}
                                                            value={value['ID']}
                                                        >
                                                            {value['name']}
                                                        </Select.Option>
                                                    )
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                            )}
                    </Form>
                </Modal>
            </div>
        )
    }
}

// export default Form.create({})(EditNodeGroupForm)
export default Form.create<UserFormProps & ModalProps & Props>()(EditNodeGroupForm)
