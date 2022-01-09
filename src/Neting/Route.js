import { Table, message, Button, Tag, Space } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Request from '../NetRequest'
import { Options } from '../Constants'
import { CheckResponse } from '../Response'

class RoutePage extends React.Component {

    // 表单头部
    columns = [
        {
            title: 'Route 名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '绑定的 Cluster',
            dataIndex: 'clusterName',
            key: 'clusterName',
        },
        {
            title: '主机地址',
            dataIndex: 'hosts',
            key: 'hosts',
        },
        {
            title: '路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '授权策略',
            dataIndex: 'authorizationPolicy',
            key: 'authorizationPolicy',
        },
        {
            title: '跨域',
            dataIndex: 'corsPolicy',
            key: 'corsPolicy',
        },
        {
            title: '元数据',
            dataIndex: 'metadata',
            key: 'metadata',
        },
        {
            title: '操作',
            dataIndex: 'delete',
            key: 'delete',
            render: (name) => <div>
                <Button type="dashed" onClick={() => this.Delete(name)}>
                    删除
                </Button>
            </div>,
          },
    ];



    constructor(props) {
        super(props)
        this.state = {
            tableData: []
        }
        this.Resflsh();
    }

    Delete = (name)=>{
        Request.delete(Options.host + '/route/delete?name='+name)
            .then(res => {
                if (!CheckResponse(res)) return;
                try {
                    this.Resflsh();
                }
                catch (err) {
                    this.setState({
                        tableData: []
                    })
                    message.error(err);
                    console.log(err);
                }
            })
            .catch(err => {
                if (!CheckResponse(err.request)) return;
                message.error(err)
            })

    }


    Resflsh = () => {
        Request.get(Options.host + '/route/list?pageNo=1&pageSize=10')
            .then(res => {
                if (!CheckResponse(res)) return;
                try {
                    // 每一列数据
                    var data = new Array();
                    if (res.data.data != null && res.data.data.length !== 0) {
                        res.data.data.map(route => {
                            data.push({
                                name: route.name,
                                description: route.description,
                                clusterName: route.clusterName,
                                hosts: route.match.hosts,
                                path: route.match.path,
                                metadata: route.metadata,
                                authorizationPolicy: route.authorizationPolicy,
                                corsPolicy: route.corsPolicy,
                                delete: route.name
                            });
                            return route;
                        });
                    }
                    this.setState({
                        tableData: data
                    })
                }
                catch (err) {
                    this.setState({
                        tableData: []
                    })
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
                <Button><Link to="/createroute">创建 Route</Link></Button>
                <Table columns={this.columns} dataSource={this.state.tableData} />
            </div>

        );
    }
}

const Route = () => (
    <div className="NetingRoute">
        <RoutePage />
    </div >
);


export default Route;
