// src/pages/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';

const { Title } = Typography;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // ✅ Extract token from URL
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token) {
      message.error("Invalid or missing token.");
      navigate('/');
    }
  }, [token, navigate]);

  const onFinish = async (values) => {
    if (values.new_password !== values.confirm_password) {
      message.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/reset-password', {
        token,
        new_password: values.new_password,
      });
      message.success("Password changed successfully. Redirecting to login...");
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: '50px auto',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: '#fff'
    }}>
      <Title level={3}>Reset Your Password</Title>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="new_password" label="New Password" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="confirm_password" label="Confirm Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Set New Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
