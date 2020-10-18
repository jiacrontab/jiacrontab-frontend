import * as React from 'react'
// import { Icon } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom'
import './Bread.css'


const { Fragment, Component } = React

interface IBreadItem {
    id: string,
    icon: string
    name: string
    route: any
}

interface Props {
    paths: IBreadItem[],
}

interface State {

}

class Bread extends Component<Props, State> {

    constructor(props: any) {
        super(props)
    }

    public generateBreadcrumbs(paths: IBreadItem[]) {

        return paths.map((v: IBreadItem, k: number) => {
            const content = (
                <Fragment>
                    {v.icon ? (
                        <div></div>
                        // <Icon type={v.icon} style={{ marginRight: 4 }} />
                    ) : null}
                    {v.name}
                </Fragment>
            )

            return (
                <Breadcrumb.Item key={k}>
                    {paths.length - 1 !== k ? (<Link to={v.route || '#'} > {content}</Link>) : v.name}
                </Breadcrumb.Item>
            )
        });

    }

    public render() {
        let paths = [
            {
                id: '404',
                name: 'Not Found',
                icon: '',
                route: '',
            },
        ]

        if (this.props.paths.length != 0) {
            paths = this.props.paths
        }

        return (
            <Breadcrumb className='jiacrontab-bread'>
                {this.generateBreadcrumbs(paths)}
            </Breadcrumb>
        )
    }
}

export default Bread