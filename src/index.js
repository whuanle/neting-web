import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import reportWebVitals from './reportWebVitals';

import Login from './Login'
import NetingLayout from './NetingLayout'
import NetingRoute from './Neting/Route'
import NetingCluster from './Neting/Cluster'

import CreateRoute from './Neting/CreateRoute'
import CreateCluster from './Neting/CreateCluster'
import K8sService from './Neting/K8sService'
import K8sEndpoint from './Neting/K8sEndpoint'

// 此页面只配置路由，按照每个模块配置一个路由
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NetingLayout />}>
          <Route index element={<App />} />
          <Route path="route" element={<NetingRoute />} />
          <Route path="cluster" element={<NetingCluster />} />
          <Route path="service" element={<K8sService />} />
          <Route path="endpoint" element={<K8sEndpoint />} />
          <Route path="createroute" element={<CreateRoute />} />
          <Route path="createcluster" element={<CreateCluster />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
