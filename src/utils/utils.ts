import httpRequest from './http'
import { Modal } from 'antd'
import { hashHistory } from './history'
function format(m: number): string {
    return m < 10 ? '0' + m : String(m)
}

interface reqOpts {
    token?: string | null
    url: any
    data: object
    succ(data: object): any
    error?(data: object): any
    catch?(): any
}
export const getRequest = (opt: reqOpts) => {
    const succ = opt.succ ? opt.succ : (data: object) => { },
        catchfn = opt.catch ? opt.catch : (e: any) => { },
        error = opt.error ? opt.error : (data: any) => { },
        defaultConfig = {
            headers: { token: opt.token },
            callback: (response: any) => {
                if (response.data.code === 0) {
                    succ(response.data.data)
                } else if (response.data.code === 5001) {
                    if (hashHistory.location.pathname === '/login') {
                        Modal.error({
                            title: '温馨提示',
                            content: response.data.msg
                        })
                    } else {
                        hashHistory.push('/login')
                    }
                } else if (response.data.code === 5006) {
                    Modal.error({
                        title: '温馨提示',
                        content: '登录凭证失效：' + response.data.msg
                    })
                    localStorage.removeItem('jiaToken')
                    localStorage.removeItem('userInfo')
                    hashHistory.push('/login')
                } else {
                    Modal.error({
                        title: '温馨提示',
                        content: response.data.msg
                    })
                    error(response.data)
                }
            },
            catch: (e: any) => {
                Modal.error({
                    title: '温馨提示',
                    content: '接口请求失败'
                })
                catchfn(e)
            },
            data: opt.data
        },
        finalConfig = { ...defaultConfig, ...opt.url }
    httpRequest.post(finalConfig)
}

export const getUrlParam = (name: string, str: string) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = str.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2])
    return ''
}
export const getGroupID = (): number => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        return JSON.parse(userInfo).groupID
    } else {
        return 0
    }
}
export const time = {
    UTCToTime: function (UTCTime: string): string {
        if (UTCTime === '0001-01-01T00:00:00Z') return '--'
        const date = new Date(UTCTime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        const Y = date.getFullYear()
        const M = date.getMonth() + 1
        const D = date.getDate()
        const h = date.getHours()
        const m = date.getMinutes()
        const s = date.getSeconds()
        return (
            Y +
            '-' +
            format(M) +
            '-' +
            format(D) +
            ' ' +
            format(h) +
            ':' +
            format(m) +
            ':' +
            format(s)
        )
    }
}
export const trimEmpty = (currentArray: any) => {
    if (!currentArray) return ''
    return currentArray.filter((item: any) => item != '')
}
