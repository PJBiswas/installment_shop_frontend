import { Button, Card, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom'; // ✅ Add Link for navigation
import api from '../api/axios';

const LoginPage = () => {
  const onFinish = async (values) => {
    try {
      const res = await api.post("/auth/login", values);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_type", res.data.user_type);
      message.success("Logged in successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      message.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Card title="Login" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            Don't have an account? <Link to="/register">Register here</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
