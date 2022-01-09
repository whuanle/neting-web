import React, { Component, useState } from 'react';
import { Form, Input, Button, Checkbox, message, Col, Row, Space, Tooltip, Select, Card } from 'antd';

// http 请求三部件
import { Options } from '../Constants'
import Request from '../NetRequest'
import { CheckResponse } from '../Response'

import './CreateCluster.css'
import {
    MinusCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
const { Option } = Select;

const CreateClusterPage = () => {

    // 提交事件
    // 创建 Clsuter
    const onFinish = (values) => {
        Request.post(Options.host + '/cluster/create', values)
            .then(res => {
                message.success("创建成功");
                window.location.href = '/cluster';
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


    // 从 Kubernetes 添加，选择事件
    // 从 Kubernetes 添加，实时数据状态必须在函数顶层调用
    const [namespaceState, setNamespaceData] = React.useState([]);
    const [serviceState, setServiceData] = React.useState([{ name: "", namespace: "" }]);
    const [ipportState, setIpportData] = React.useState([]);

    const [currentSelectK8SState, setCurrentSelectK8SData] = React.useState({
        namespaceName: "",
        serviceName: "",
    });

    const handleNamespaceChange = value => {
        Request.get(Options.host + '/common/namespaces')
            .then(res => {
                setServiceData([]);
                if (!CheckResponse(res)) return;

                setNamespaceData(on => on = res.data.data);
            })
            .catch(err => {
                if (!CheckResponse(err.request)) return;
                message.error(err)
            })
    };

    const handleServiceChange = namespaceName => {
        Request.get(Options.host + '/svc/service_names?namespace=' + namespaceName)
            .then(res => {
                setCurrentSelectK8SData({
                    namespaceName: namespaceName,
                    serviceName: "",
                })

                try {
                    if (!CheckResponse(res)) return;
                    let dic = new Array();
                    res.data.data.map(svc => {
                        dic.push({
                            name: svc, namespace: namespaceName
                        });
                        return svc;
                    });
                    setServiceData(on => on = dic);
                } catch (err) {
                    message.error(err)
                    console.warn(err);
                }
            })
            .catch(err => {
                if (!CheckResponse(err.request)) return;
                message.error(err)
            })
    };

    const handleIPPortChange = (svcName) => {
        Request.get(Options.host + '/svc/service_ips?svcName=' + svcName + '&namespace=' + currentSelectK8SState.namespaceName)
            .then(res => {
                setCurrentSelectK8SData({
                    namespaceName: currentSelectK8SState.namespaceName,
                    serviceName: svcName,
                })

                try {
                    if (!CheckResponse(res)) return;
                    if (res.data.data.clusters == null || res.data.data.clusters.length === 0) {
                        message.error("没有获取到数据");
                        return;
                    }

                    var dic = new Array();
                    res.data.data.clusters.map(ip => {
                        dic.push(ip);
                        return ip;
                    });
                    setIpportData(on => on = dic);
                } catch (err) {
                    message.error(err)
                    console.warn(err);
                }
            })
            .catch(err => {
                if (!CheckResponse(err.request)) return;
                message.error(err)
            })
    }

    // 创建一个新的后端项，要返回一个结构
    const addserviceFromK8s = (index) => {
        var ipport = ipportState[index];
        return {
            name: ipport.address,
            protocol: 'http://',
            hostName: ipport.ip,
            port: ipport.port,
            path: '/'
        }
    }


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
                        message: '请输入 Cluster 名称',
                    },]}
                >
                    <Input name="name" placeholder='Cluster ID' />
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
                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 16,
                    }}
                    label="示例"
                >
                    <Input.Group size="large">
                        <Row gutter={16}>
                            <Col span={2}>
                                <Input disabled='true' defaultValue="web" />
                            </Col>
                            <Col span={2}>
                                <Input disabled='true' defaultValue="http://" />
                            </Col>
                            <Col span={3}>
                                <Input disabled='true' defaultValue="127.0.0.1" />
                            </Col>
                            <Col span={2}>
                                <Input disabled='true' defaultValue="8080" />
                            </Col>
                            <Col span={5}>
                                <Input disabled='true' defaultValue="/abc" />
                            </Col>
                        </Row>
                    </Input.Group>
                </Form.Item>

                {/* 动态绑定 Service */}


                <Form.List name="services">
                    {(fields, { add, remove }) => (
                        <>

                            <Form.Item label="后端服务："
                                wrapperCol={{
                                    offset: 0,
                                    span: 16,
                                }}>
                                <Card>
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (

                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'name']}
                                                fieldKey={[fieldKey, 'name']}
                                                rules={[{ required: true, message: '请输入名称' }]}
                                            >
                                                <Input placeholder="名称" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'protocol']}
                                                fieldKey={[fieldKey, 'protocol']}
                                                rules={[{ required: true, message: '请输入http://或https://' }]}
                                            >
                                                <Input placeholder="http://或https://" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'hostName']}
                                                fieldKey={[fieldKey, 'hostName']}
                                                rules={[{ required: true, message: '请填写域名或IP' }]}
                                            >
                                                <Input placeholder="域名或IP" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'port']}
                                                fieldKey={[fieldKey, 'port']}
                                                rules={[{ required: true, message: '请填写端口' }]}
                                            >
                                                <Input placeholder="80" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'path']}
                                                fieldKey={[fieldKey, 'path']}
                                                rules={[{ required: true, message: '请填写路径' }]}
                                            >
                                                <Input placeholder="以/开头如 /abc" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                </Card>
                            </Form.Item>


                            {/* 动态添加行记录 */}
                            <Form.Item
                                wrapperCol={{
                                    offset: 0,
                                    span: 16,
                                }}
                                label="从 K8S 添加"
                                rules={[{ required: true, message: '请选择!' }]}
                            >
                                {/* 选择命名空间 */}
                                <Select defaultValue={namespaceState[0]} style={{ width: 200 }} onClick={handleNamespaceChange} onChange={(e) => { handleServiceChange(e) }}>
                                    {namespaceState.map(namespace => (
                                        <Option key={namespace}>{namespace}</Option>
                                    ))}
                                </Select>
                                {/* 选择  Service */}
                                <Select style={{ width: 200 }} onChange={(e) => { handleIPPortChange(e) }} >
                                    {serviceState.map(service => (
                                        <Option key={service.name} value={service.name}>{service.name}</Option>
                                    ))}
                                </Select>
                                {/* 选择 IP、端口 */}
                                <Select style={{ width: 200 }} onChange={(index) => { add(addserviceFromK8s(index)) }}>
                                    {ipportState.map((ip, index) => (
                                        <Option key={ip.address} value={index}>{ip.address}</Option>
                                    ))}
                                </Select>

                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 0,
                                    span: 4,
                                }}
                                label="手动添加"
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
