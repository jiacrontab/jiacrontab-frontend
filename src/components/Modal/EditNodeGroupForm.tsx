import * as React from 'react'
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, Radio } from 'antd';
import { ModalProps } from 'antd/lib/modal/Modal'

interface Props extends ModalProps {
    visible: boolean
    handleOk?: any
    handleCancel?: any
    handleGroupChange?: any
    title: string
    groups: any[]
    changeVisible: any
    onRef?:any
}
// interface UserFormProps extends FormComponentProps {

// }
interface State {
    radioValue: string
    formRef: React.RefObject<FormInstance>
}
class EditNodeGroupForm extends React.Component<
    Props,
    State
    > {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
            radioValue: 'new',
            formRef: React.createRef<FormInstance>()
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
    }
    private currentModalOk = (e: any) => {
        this.handleSubmit()
    }
    private handleSubmit = () => {
        this.state.formRef.current?.validateFields().then((values) => {
            this.props.handleOk(values)
        }) 
    }
    resetForm = () => {
        this.state.formRef.current?.resetFields() 
    }
    render() {
        // const { form } = this.props
        // const { getFieldDecorator } = form
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
                            { 
                                types: this.state.radioValue, 
                                groupId:1
                            }
                        }
                    >
                        <Form.Item name="types">
                            <Radio.Group onChange={this.radioChange}>
                                <Radio value="new">新建分组</Radio>
                                <Radio value="move">复制到指定分组</Radio>
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
                                    
                                </Form.Item>
                            )}
                    </Form>
                </Modal>
            </div>
        )
    }
}

// export default Form.create({})(EditNodeGroupForm)
export default EditNodeGroupForm
// export default Form.create<UserFormProps & ModalProps & Props>()(EditNodeGroupForm)
