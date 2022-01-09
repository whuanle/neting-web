import React, { Component, useState } from 'react';
import { Form, Input, Button, Checkbox, message, Col, Row, Space, Tooltip, Select, Card } from 'antd';

// http 请求三部件
import { Options } from '../Constants'
import Request from '../NetRequest'
import { CheckResponse } from '../Response'

import './CreateRoute.css'
import {
    MinusCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
const { Option } = Select;

const CreateClusterPage = () => {

    // 提交事件
    // 创建 Clsuter
    const onFinish = (values) => {
        console.log(values);
        var hosts = new Array();
        values.hosts.map(host => {
            hosts.push(host.host)
            return host;
        })

        var body = {
            name: values.name,
            description: values.description,
            clusterName: values.clusterName,
            match: {
                hosts: hosts,
                path: values.path,

            }
        };

        Request.post(Options.host + '/route/create', body)
            .then(res => {
                message.success("创建成功");
                window.location.href = '/route';
            })
            .catch(err => {
                if (!CheckResponse(err.request)) return;
                message.error(err)
            })
    };

    // 提交失败事件
    const onFinishFailed = (errorInfo) => {
        console.error(errorInfo)
        message.error('请完整填写表单', errorInfo);
    };

    // 表单被修改事件
    const handleChange = (event) => {
        // message.error('T名称重复');
    }

    const [clusterState, setclusterData] = React.useState([]);

    // 刷新 cluster 列表
    const handleClusterNamesChange = value => {
        Request.get(Options.host + '/cluster/names')
            .then(res => {
                setclusterData([]);
                if (!CheckResponse(res)) return;

                setclusterData(on => on = res.data.data);
            })
            .catch(err => {
                if (!CheckResponse(err.request)) return;
                message.error(err)
            })
    };

    return (
        <div>
            <Form
                name="basic"
                labelCol={{ offset: 1, span: 2 }}
                wrapperCol={{ offset: 1, span: 20 }}
                initialValues={{ remember: true, }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item onChange={handleChange}
                    wrapperCol={{
                        offset: 0,
                        span: 4,
                    }}
                    label="名称"
                    name="name"
                    rules={[{
                        required: true,
                        message: '请输入 Route 名称',
                    },]}
                >
                    <Input name="name" placeholder='Route ID' />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 4,
                    }}
                    label="描述"
                    name="description"
                    rules={[
                        {
                            required: false,
                            message: '请输入描述',
                        },
                    ]}
                >
                    <Input.TextArea name="description" />
                </Form.Item>

                <Form.Item onChange={handleChange}
                    wrapperCol={{
                        offset: 0,
                        span: 4,
                    }}
                    label="访问路径"
                    name="path"
                    rules={[{
                        required: false,
                        message: '请输入 路径 名称',
                    },]}
                >
                    <Input name="path" placeholder='例如  /user' />
                </Form.Item>

                {/* 动态添加主机来源 */}

                <Form.List name="hosts">
                    {(fields, { add, remove }) => (
                        <>

                            <Form.Item label="访问来源："
                                wrapperCol={{
                                    offset: 0,
                                    span: 24,
                                }}>
                                <Card style={{ width: '100%' }}
                                >
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (

                                        <div>
                                            <Row>
                                                <Col span={16}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'host']}
                                                        fieldKey={[fieldKey, 'host']}
                                                        rules={[{ required: true, message: '请输入来源地址' }]}
                                                        wrapperCol={{
                                                            offset: 0,
                                                            span: 16,
                                                        }}
                                                    >
                                                        <Input placeholder="如 abc.com:8080，请不要带上 http://" />
                                                    </Form.Item></Col>
                                                <Col span={1}>
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                </Col>
                                                <Col span={7}></Col>
                                            </Row>

                                        </div>

                                    ))}
                                </Card>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 0,
                                    span: 4,
                                }}
                                label="添加访问来源"
                            >
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    创建
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 4,
                    }}
                    label="绑定 Cluster "
                    name="clusterName"
                    rules={[{ required: true, message: '请选择 Cluster!' }]}
                >
                    {/* 选择命名空间 */}
                    <Select name="clusterName" defaultValue={clusterState[0]} style={{ width: 200 }} onClick={handleClusterNamesChange} >
                        {clusterState.map(cluster => (
                            <Option key={cluster}>{cluster}</Option>
                        ))}
                    </Select>


                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >

                    <Button type="primary" htmlType="submit">
                        创建
                    </Button>

                </Form.Item>
            </Form>
        </div>

    );


}

const CreateCluster = () => (
    <div className="Login">
        <CreateClusterPage />
    </div >
);


export default CreateCluster;
