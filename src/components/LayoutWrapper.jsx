import {Layout, Menu} from 'antd';
import {AppstoreOutlined, DashboardOutlined, LogoutOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import React from 'react';

const {Header, Sider, Content} = Layout;

const LayoutWrapper = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = ({key}) => {
        if (key === 'logout') {
            localStorage.removeItem('token');
            localStorage.removeItem('user_type');
            navigate('/');
        } else {
            navigate(key);
        }
    };
    const userType = localStorage.getItem('user_type');
    const menuItems = [

        ...(userType === 'admin' ? [
            {key: '/dashboard', icon: <DashboardOutlined/>, label: 'Dashboard'},
            {key: '/admin/purchases', icon: <ShoppingCartOutlined/>, label: 'Admin Purchases'},
            {key: '/products', icon: <AppstoreOutlined/>, label: 'Product Items'},
        ] : []),

        ...(userType === 'customer' ? [
            {key: '/buy', icon: <ShoppingCartOutlined/>, label: 'Buy Products'},
            {key: '/my-purchases', icon: <AppstoreOutlined/>, label: 'My Purchases'}
        ] : []),

        {key: 'logout', icon: <LogoutOutlined/>, label: 'Logout'}
    ];
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible>
                <div style={{height: 32, margin: 16, color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
                    Installment App
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={handleMenuClick}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header style={{background: '#fff', padding: '0 16px'}}>
                    <h2 style={{margin: 0}}>Welcome</h2>
                </Header>
                <Content style={{margin: '16px'}}>
                    <Outlet/> {/* nested routes render here */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutWrapper;
