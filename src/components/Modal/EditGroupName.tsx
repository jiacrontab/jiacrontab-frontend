import * as React from 'react'
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
// import '@ant-design/compatible/assets/index.css';
import { Modal, Input } from 'antd';
import { ModalProps } from 'antd/lib/modal/Modal'
// import { FormComponentProps } from '@ant-design/compatible/lib/form';

interface Props extends ModalProps {
    visible: boolean
    handleOk?: any
    handleCancel?: any
    handleGroupChange?: any
    title: string
    groups: any[]
    changeVisible: any,
    defaultName: string
    onRef?:any
}
// interface UserFormProps extends FormComponentProps {

// }
interface State {
    // radioValue: string
    formRef: React.RefObject<FormInstance>
}
class EditGroupName extends React.Component<
    Props,
    State
    > {
    public state: State
    constructor(props: Props) {
        super(props)
        this.state = {
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
        const { defaultName } = this.props
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
                                groupName: defaultName
                            }
                        }
                    >
                        <Form.Item
                                name="groupName"
                                rules={[{ required: true, message: '请输入分组名称' }]}
                            >
                            <Input placeholder="请输入分组名称" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default EditGroupName

// export default Form.create<UserFormProps & ModalProps & Props>()(EditGroupName)
