import * as React from 'react'
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, Radio, Checkbox } from 'antd';
import { ModalProps } from 'antd/lib/modal/Modal'
// import { FormComponentProps }  from 'antd/lib/form/Form';

interface Props extends ModalProps {
    visible: boolean
    handleOk?: any
    handleCancel?: any
    handleGroupChange?: any
    title: string
    groups: any[]
    changeVisible: any
    onRef?:any
    currentGroup: any
}
interface State {
    radioValue: string
    checked: boolean
    disabled: boolean
    formRef: React.RefObject<FormInstance>
}
interface Data {
    groupID: number | string
}
class EditUserGroupForm extends React.Component<
    Props,
    State
    > {
    public state: State
    public data: Data
    constructor(props: Props ) {
        super(props)
        this.state = {
            checked: false,
            radioValue: 'new',
            disabled: false,
            formRef: React.createRef<FormInstance>()
        }
        this.data = {
            groupID: 0
        }
    }
    componentWillReceiveProps(nextProps:any) {
        if (nextProps.visible) {
            this.data.groupID = nextProps.currentGroup.groupID
            this.setState({
                checked: nextProps.currentGroup.root
            })
            if (this.data.groupID == 1) {
                this.setState({
                    checked: true,
                    disabled: true
                })
            } else {
                this.setState({
                    disabled: false
                })
            }
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    private handleCancel = () => {
        this.props.changeVisible(false)
        this.state.formRef.current?.resetFields();
    }
    private radioChange = (e: any) => {
        

        this.setState({
            radioValue: e.target.value
        })
        if (e.target.value !== 'new') {
            if (this.data.groupID == 1) {
                this.setState({
                    checked: true,
                    disabled: true
                })
            }
        } else {
            this.setState({
                checked: false,
                disabled: false
            })
        }
    }
    private currentModalOk = (e: any) => {
        this.handleSubmit()
    }
    private handleSubmit = () => {
        this.state.formRef.current?.validateFields().then((values) => {
            values.root = this.state.checked
            this.props.handleOk(values)
        }) 
    }
    resetForm = () => {
        this.state.formRef.current?.resetFields() 
    }
    render() {
        const { currentGroup } = this.props
        // const { getFieldDecorator } = form
        this.data.groupID = currentGroup.groupID
        
        let defaultValue = {
            types: this.state.radioValue, 
            groupId: currentGroup.groupID,
            root: currentGroup.root
        }
        setTimeout(() => {
            this.state.formRef.current?.resetFields()
            this.state.formRef.current?.setFieldsValue({ initialValues: defaultValue})
        },10)
        return (
            <div>
                <Modal
                    title={this.props.title}
                    cancelText="取消"
                    okText="提交"
                    visible={this.props.visible}
                    onOk={this.currentModalOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <Form 
                        layout="vertical"
                        ref={this.state.formRef}
                        initialValues={
                            defaultValue
                        }
                    >
                        <Form.Item name="types">
                                <Radio.Group onChange={this.radioChange}>
                                    <Radio value="new">新建分组</Radio>
                                    <Radio value="move">移动到指定分组</Radio>
                                </Radio.Group>
                        </Form.Item>
                        {this.state.radioValue == 'new' ? (
                            <Form.Item
                                name="title"
                                rules={[{ required: true, message: '请输入分组名称' }]}
                            >
                                <Input placeholder="请输入分组名称" />
                            </Form.Item>
                        ) : (
                                <Form.Item name="groupId">
                                    
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
                                    
                                </Form.Item>
                            )}
                        <Form.Item name="root">
                                <Checkbox
                                    disabled={this.state.disabled}
                                    onChange={(val) => {
                                        if (this.data.groupID == 1) {
                                            this.setState({
                                                disabled: true,
                                                checked: true
                                            })
                                        } else {
                                            this.setState({
                                                disabled: false,
                                                checked: val.target.checked
                                            })
                                        }
                                    }}
                                    checked={this.state.checked}
                                >
                                    管理员
                                </Checkbox>
                            
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

// export default Form.create({})(EditUserGroupForm)
export default EditUserGroupForm
// ReactDOM.render(<EditUserGroupForm />, mountNode);
// export default Form.create<FormComponentProps & ModalProps & Props>()(EditUserGroupForm)
