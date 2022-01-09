import React, { Component } from 'react';
import Axios from 'axios'
import './Login.css'

import { Options } from './Constants'
import { CheckResponse } from './Response'

import { Form, Input, Button, Checkbox, Card, Row, Col, Layout, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: "abcd"
        }
    }

    setValue = (e) => {
        console.log(e)
        this.setState({
            value: e
        });
    }
    onFinish = (values) => {
        Axios.post(Options.host + '/common/login', {
            "userName": values.username,
            "password": values.password
        })
            .then(res => {
                if (!CheckResponse(res)) return;
                localStorage.setItem("neting_token", res.data.data);
                message.success("登录成功");
                window.location.href = '/';
            })
            .catch(err => {
                message.error(err);
            })
    };

    render() {

        // 进入页面时先判断是否携带 token，判断是否过期，如果正常则跳转到首页，
        var token = localStorage.getItem("neting_token");
        if (token != null) {
            window.location.href = '/';
        }

        return (
            <div>
                <Layout>
                    <Content>
                        <Row>
                            <Col span={8} offset={10}>

                                <Card title="登录 Neting 系统" bordered={true} style={{ width: 300 }}>
                                    <Form
                                        name="normal_login"
                                        className="login-form"
                                        initialValues={{ remember: true }}
                                        onFinish={this.onFinish}
                                    >
                                        <Form.Item
                                            name="username"
                                            rules={[{ required: true, message: '请输入账号名称' }]}
                                        >
                                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            rules={[{ required: true, message: '请输入密码' }]}
                                        >
                                            <Input
                                                prefix={<LockOutlined className="site-form-item-icon" />}
                                                type="password"
                                                placeholder="Password"
                                            />
                                        </Form.Item>

                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="login-form-button">
                                                登录
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card>

                            </Col>
                        </Row></Content>
                    <Footer><center>Neting 系统，github:</center></Footer>
                </Layout>


            </div>

        );
    }
}

const Login = () => (
    <div className="Login">
        <LoginPage />
    </div >
);


export default Login;
