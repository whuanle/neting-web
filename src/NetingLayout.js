import React from 'react';
import { Route, Link, Routes, BrowserRouter, Outlet } from 'react-router-dom';


import Axios from 'axios';
import './Neingayout.css';

import { Layout, Menu, Row, Col } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;



// 这是后台页面的整体框架，左侧菜单栏，页头页脚


class LayoutPage extends React.Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo"><center> Neting 项目 </center></div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']}>
                        <Menu.Item key="0" icon={<UserOutlined />}>
                            <Link to="/">首页</Link>
                        </Menu.Item>
                        <Menu.Item key="1" icon={<UserOutlined />}>
                            <Link to="route">Route</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                            <Link to="cluster">Cluster</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<VideoCameraOutlined />}>
                            <Link to="service">Service</Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<UploadOutlined />}>
                            <Link to="endpoint">Endpoint</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        <Row>
                            <Col span={2}>
                                {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: 'trigger',
                                    onClick: this.toggle,
                                })}

                            </Col>
                            <Col span={20}><h2>Neting 项目</h2></Col>
                        </Row>

                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                        }}
                    >
                        <Outlet />
                    </Content>
                    <Footer>
                    <h2>Git 后端：<a href='https://github.com/whuanle/neting'>https://github.com/whuanle/neting</a><br />
                    Git 前端：<a href='https://github.com/whuanle/neting-web'>https://github.com/whuanle/neting-web</a></h2>
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

const NetingLayout = () => (
    <div className="NetingLayout">
        <LayoutPage />
    </div >
);

export default NetingLayout;