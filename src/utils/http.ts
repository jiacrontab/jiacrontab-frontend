import axios from 'axios'
// import { getCookie } from './cookie'
let baseUrl = '/'

// if (getCookie('ready') === '') {
//     baseUrl = '//api-jiacrontab.iwannay.cn/'
// }

if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://localhost:3000/'
}

axios.defaults.baseURL = baseUrl
class HttpRequest {
    public get(config: any) {
        axios({
            method: 'get',
            headers: config.headers ? config.headers : {},
            url: config.url,
            params: config.params ? config.params : null,
            data: config.data ? config.data : null
        })
            .then(config.callback)
            .catch(config.catch ? config.catch : null)
    }
    public post(config: any) {
        axios({
            method: 'post',
            headers: config.headers ? config.headers : {},
            url: config.url,
            params: config.params ? config.params : null,
            data: config.data ? config.data : null
        })
            .then(config.callback)
            .catch(config.catch ? config.catch : null)
    }
}

export default new HttpRequest()
