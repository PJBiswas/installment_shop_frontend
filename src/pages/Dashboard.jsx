import { Card, Col, Row, Statistic, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Bar } from '@ant-design/plots';

const { Title } = Typography;

const Dashboard = () => {
  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/overview');
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) return <p>Loading...</p>;

  const { summary, weekly_report, monthly_report, top_customers } = data;

  const columns = [
    { title: 'Customer', dataIndex: 'name' },
    { title: 'Total Paid', dataIndex: 'total_paid' },
    { title: 'Total Due', dataIndex: 'total_due' },
  ];

  const barWeekly = {
    data: weekly_report.flatMap(item => [
      { week: item.week, type: 'Paid', value: item.paid },
      { week: item.week, type: 'Due', value: item.due }
    ]),
    xField: 'week',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    height: 300,
    legend: { position: 'top' },
  };

  const barMonthly = {
    data: monthly_report.flatMap(item => [
      { month: item.month, type: 'Paid', value: item.paid },
      { month: item.month, type: 'Due', value: item.due }
    ]),
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    height: 300,
    legend: { position: 'top' },
  };

  return (
    <>
      <Title level={2}>📊 Admin Dashboard</Title>

      {/* Summary Cards */}
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Customers" value={summary.total_customers} /></Card></Col>
        <Col span={6}><Card><Statistic title="Products" value={summary.total_products} /></Card></Col>
        <Col span={6}><Card><Statistic title="Purchases" value={summary.total_purchases} /></Card></Col>
        <Col span={6}><Card><Statistic title="Paid Amount" value={summary.total_paid_amount} prefix="৳" /></Card></Col>
        <Col span={6}><Card><Statistic title="Due Amount" value={summary.total_due_amount} prefix="৳" /></Card></Col>
      </Row>

      {/* Weekly Chart */}
      <Title level={4} style={{ marginTop: 32 }}>📆 Weekly Report</Title>
      <Bar {...barWeekly} />

      {/* Monthly Chart */}
      <Title level={4} style={{ marginTop: 48 }}>📅 Monthly Report</Title>
      <Bar {...barMonthly} />

      {/* Top Customers */}
      <Title level={4} style={{ marginTop: 48 }}>🏆 Top Customers</Title>
      <Table
        dataSource={top_customers}
        columns={columns}
        pagination={false}
        rowKey={(record) => record.name}
      />
    </>
  );
};

export default Dashboard;
