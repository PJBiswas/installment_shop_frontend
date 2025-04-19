// src/pages/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from '../api/axios';

const { Title } = Typography;

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (step === 3) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = '/';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [step]);

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', values);
      message.success(res.data.message);
      setEmail(res.data.email);
      setStep(2);
    } catch (error) {
      message.error(error.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/verify-otp', { email, otp: values.otp });
      message.success(res.data.message);
      setStep(3); // 🟢 Go to success + countdown message
    } catch (error) {
      message.error(error.response?.data?.detail || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Title level={3}>Register</Title>
            <Form layout="vertical" form={form} onFinish={handleRegister}>
              <Form.Item name="first_name" label="First Name" rules={[{ required: true, min: 2 }]}>
                <Input />
              </Form.Item>
              <Form.Item name="last_name" label="Last Name" rules={[{ required: true, min: 2 }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Register
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      case 2:
        return (
          <>
            <Title level={3}>Verify OTP</Title>
            <Form layout="vertical" onFinish={handleOtpVerify}>
              <Form.Item name="otp" label="Enter the OTP sent to your email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Verify OTP
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      case 3:
        return (
          <>
            <Title level={3} style={{ textAlign: 'center' }}>✅ OTP Verified</Title>
            <div style={{ textAlign: 'center', fontSize: '16px', marginTop: 20 }}>
              Kindly check your email for reset password<br />
              <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '12px 0' }}>{countdown}</div>
              <div style={{ fontSize: '14px', color: '#888' }}>Redirecting to login page...</div>
            </div>
          </>
        );
      default:
        return null;
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
      {renderStepForm()}
    </div>
  );
};

export default RegisterPage;
