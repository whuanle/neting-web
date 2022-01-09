import axios from "axios";
import { Options } from './Constants'

//设置请求得基准地址
axios.defaults.baseURL = Options.host;
const request = axios.create();
//设置请求头
request.interceptors.request.use(config => {
    // 给请求头加token的字段,值为token
    config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('neting_token')
    return config
})

//导出
export default request;

