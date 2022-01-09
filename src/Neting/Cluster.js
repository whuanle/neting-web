import { Table, message, Button, Tag, Space } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Request from '../NetRequest'
import { Options } from '../Constants'
import { CheckResponse } from '../Response'

class ClusterPage extends React.Component {

    // 表单头部
    columns = [
        {
            title: 'cluster 名称',
            dataIndex: 'cluster',
            key: 'cluster',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '后端服务',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '协议',
            dataIndex: 'protocol',
            key: 'protocol',
        },
        {
            title: '主机地址',
            dataIndex: 'hostName',
            key: 'hostName',
        },
        {
            title: '端口',
            dataIndex: 'port',
            key: 'port',
        },
        {
            title: '路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '健康检查',
            dataIndex: 'health',
            key: 'health',
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
        Request.delete(Options.host + '/cluster/delete?name='+name)
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
        Request.get(Options.host + '/cluster/list?pageNo=1&pageSize=10')
            .then(res => {
                if (!CheckResponse(res)) return;
                try {
                    // 每一列数据
                    var data = new Array();
                    if (res.data.data != null && res.data.data.length !== 0) {
                        res.data.data.map(cluster => {
                            cluster.services.map(item => {
                                data.push({
                                    cluster: cluster.name,
                                    description: cluster.description,
                                    name: item.name,
                                    protocol: item.protocol,
                                    hostName: item.hostName,
                                    port: item.port,
                                    path: item.path,
                                    health: item.health,
                                    metadata: item.metadata,
                                    delete: cluster.name
                                });
                                return item;
                            });
                            return cluster;
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
                <Button><Link to="/createcluster">创建 Cluster</Link></Button>
                <Table columns={this.columns} dataSource={this.state.tableData} />
            </div>

        );
    }
}

const Cluster = () => (
    <div className="NetingCluster">
        <ClusterPage />
    </div >
);


export default Cluster;
