import * as React from 'react'
import { Spin } from 'antd'
import './SystemInfo.css'

interface Props {
    history: any
    infoData: any
    loading: boolean
}
class SystemInfo extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
    }
    public changeLoading = (loadingStatus: boolean) => {
        this.setState({
            loading: loadingStatus
        })
    }
    public render(): any {
        const { infoData } = this.props
        let infos = []
        for (let i in infoData) {
            infos.push(i)
        }
        let newInfos = [];
        for (var i = 0; i < infos.length; i += 2) {
            newInfos.push(infos.slice(i, i + 2));
        }
        return (
            <div
                className="run-info-page"
                style={{
                    width: '100%',
                    overflowX: 'hidden',
                    paddingBottom: 20
                }}
            >
                <Spin spinning={this.props.loading}>
                    <table>
                        <tbody>
                            {newInfos.map((item, index) => {
                                return (<tr className="system-info" key={index}>
                                    {item.map((m, o) => {
                                        return (
                                            <React.Fragment key={o}>
                                                <td className="title">{m}</td>
                                                <td className="description">{infoData[m]}</td>
                                            </React.Fragment>
                                        )
                                    })}

                                </tr>)
                            })}
                        </tbody>
                    </table>
                </Spin>

            </div>
        )
    }
}

export default SystemInfo
