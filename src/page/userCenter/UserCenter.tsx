import * as React from 'react'
import BaseLayout from '../../layout/BaseLayout'
import Bread from '../../components/Layout/Bread'

interface T  {
    history:any
}
class UserCenter extends React.Component<T> {
    constructor(props: any) {
        super(props)
    }

    state = {
    };

    public render(): any {
        return (<BaseLayout pages="userCenter">
            <Bread paths={[
                {
                    id: 'first',
                    name: 'home',
                    icon: 'ff',
                    route: '/runList',
                },
                {
                    id: 'first2',
                    name: '用户动态',
                    icon: 'ss',
                    route: '/runInfo',
                },
            ]}></Bread>
            用户动态
        </BaseLayout>)
    }
}


export default UserCenter;