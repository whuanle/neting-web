
import { message } from 'antd';

export const CheckResponse = (res) => {
    if (res === undefined) {
        return false;
    }
    if (res.status !== 200) {
        message.error(res.code);
        if (res.status === 401 || res.status === 403) {
            message.error('请重新登录!');
            localStorage.removeItem("neting_token");
            window.location.href = '/login';
            return false;
        }

        if (res.status === 500) {
            message.error('服务器出现错误');
            return false;
        }

        if (res.status === 400||res.status === 405||res.status === 415) {
            message.error('请求参数不正确');
            return false;
        }

        return false;
    }
    if (res.data.code !== 0) {
        message.error(res.data.message);
        return false;
    }
    return true;
}