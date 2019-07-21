import * as React from 'react'
import { Modal, Form, Input, Select, Radio, Checkbox } from 'antd'
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
interface State {
    radioValue: string
    checked: boolean
    disabled: boolean
}
interface Data {
    groupID: number
}
class EditUserGroupForm extends React.Component<
    Props & FormComponentProps,
    State
    > {
    public state: State
    public data: Data
    constructor(props: Props & FormComponentProps) {
        super(props)
        this.state = {
            checked: false,
            radioValue: 'new',
            disabled: false
        }
        this.data = {
            groupID: 0
        }
    }

    componentDidMount() { }
    private handleCancel = () => {
        this.props.changeVisible(false)
        this.props.form.resetFields()
    }
    private radioChange = (e: any) => {
        if (e.target.value === 'new') {
            this.setState({
                checked: false,
                disabled: false,
                radioValue: e.target.value
            })
        } else {
            this.data.groupID = 1
            this.setState({
                checked: true,
                disabled: true,
                radioValue: e.target.value
            })
        }
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
                                    <Radio value="move">移动到指定分组</Radio>
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
                                        initialValue: this.data.groupID
                                    })(
                                        <Select
                                            onChange={(id: any, e: any) => {
                                                this.data.groupID = id
                                                if (id == 1) {
                                                    this.setState({
                                                        checked: true,
                                                        disabled: true
                                                    })
                                                } else {
                                                    this.setState({
                                                        disabled: false
                                                    })
                                                }
                                            }}
                                        >
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
                        <Form.Item>
                            {getFieldDecorator('root', {
                                initialValue: true
                            })(
                                <Checkbox
                                    disabled={this.state.disabled}
                                    onChange={() => {
                                        if (this.data.groupID == 1) {
                                            this.setState({
                                                disabled: true,
                                                checked: true
                                            })
                                        } else {
                                            this.setState({
                                                disabled: false,
                                                checked: !this.state.checked
                                            })
                                        }
                                    }}
                                    checked={this.state.checked}
                                >
                                    管理员
                                </Checkbox>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

// export default Form.create({})(EditUserGroupForm)
export default Form.create<FormComponentProps & ModalProps & Props>()(EditUserGroupForm)
