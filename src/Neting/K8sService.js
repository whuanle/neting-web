import React, { Component } from 'react';
import { Table, message, Button, Tag, Space, Form, Select } from 'antd';
import { Link } from 'react-router-dom';
import Request from '../NetRequest'
import { Options } from '../Constants'
import { CheckResponse } from '../Response'
import './CreateRoute.css'
import {
    MinusCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';

const { Option } = Select;

// 表单头部
var columns = [
    {
        title: 'Service 名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Cluster IP',
        dataIndex: 'clusterIP',
        key: 'clusterIP',
    },
    {
        title: 'Service 类型',
        dataIndex: 'serviceType',
        key: 'serviceType',
    },
    {
        title: '标签',
        dataIndex: 'labels',
        key: 'labels',
    },
    {
        title: '选择器',
        dataIndex: 'selector',
        key: 'selector',
    },
    {
        title: '端口',
        dataIndex: 'ports',
        key: 'ports',
    },
    {
        title: '后端服务',
        dataIndex: 'endpoints',
        key: 'endpoints',
    },
    {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
    }
];

  class ServicePage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            namespaceState:[],
            tableState:[]
        }
        this.InitNamespace();
    }

    // 获取命名空间
    InitNamespace = () => {
        Request.get(Options.host + '/common/namespaces')
            .then(res => {
                if (!CheckResponse(res)) return;
                this.setState({
                    namespaceState:res.data.data,
                    tableState:[]
                });
                this.Resflsh(res.data.data[0]);
            })
            .catch(err => {
                if (!CheckResponse(err.request)) return;
                message.error(err)
            })
    };

    Resflsh = (namespace) => {
        Request.get(Options.host + '/svc/services?namespace=' + namespace + '&pageSize=50')
            .then(res => {
                if (!CheckResponse(res)) return;
                try {
                    console.log(res.data.data);
                    // 每一列数据
                    var data = new Array();
                    if (res.data.data != null && res.data.data.length !== 0) {
                        res.data.data.items.map(item => {

                            var labels = new Array();
                            for (var key1 in item.labels) {
                                labels.push(<span>{key1 + ':' + item.labels[key1]}<br/></span>);
                            }

                            var selector = new Array();
                            for (var key2 in item.selector) {
                                selector.push(<span>{key2 + ':' + item.selector[key2]}<br/></span>);
                            }

                            var endpoints = new Array();
                            for(var key3 in item.endpoints){
                                endpoints.push(<span>{item.endpoints[key3]}<br/></span>);
                            }

                            var ports = new Array();
                            for(var key4 in item.ports){
                                ports.push(<span>{item.ports[key4]}<br/></span>);
                            }

                            data.push({
                                name: item.name,
                                clusterIP: item.clusterIP,
                                serviceType: item.serviceType,
                                labels: <span>{labels}</span>,            // 数组
                                selector: <span>{selector}</span>,         // 数组
                                ports:  <span>{ports}</span>,              // 数组                          
                                endpoints: <span>{endpoints}</span>,      // 数组
                                creationTime: item.creationTime
                            });
                            return item;
                        });
                    }
                    this.setState({
                        namespaceState:this.state.namespaceState,
                        tableState:data
                    });
                }
                catch (err) {
                    message.error(err);
                    console.log(err);
                }
            })
            .catch(err => {
                if (!CheckResponse(err.request)) return;
                message.error(err)
            })
    }


    render() {
        return (
            <div>
            <Form
                name="basic"
                labelCol={{ offset: 1, span: 2 }}
                wrapperCol={{ offset: 1, span: 20 }}
                initialValues={{ remember: true, }}
                autoComplete="off"
            >
                <Form.Item
                    wrapperCol={{
                        offset: 0,
                        span: 4,
                    }}
                    label="选择 Service "
                    name="serviceName"
                    rules={[{ required: true, message: '请选择 Service!' }]}
                >
                    {/* 选择命名空间 */}
                    <Select defaultValue={this.state.namespaceState[0]} style={{ width: 200 }} onChange={(key) => this.Resflsh(key)}>
                        {this.state.namespaceState.map(namespace => (
                            <Option key={namespace}>{namespace}</Option>
                        ))}
                    </Select>


                </Form.Item>
            </Form>

            <Table columns={columns} dataSource={this.state.tableState} />
            </div>

        );
    }
  }

const Service = () => (
    <div className="Service">
        <ServicePage />
    </div >
);


export default Service;
