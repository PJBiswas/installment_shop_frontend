import { Table, Button, Modal, Typography, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import dayjs from 'dayjs';

const { Text } = Typography;

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedInstallments, setSelectedInstallments] = useState([]);

  const fetchPurchases = async () => {
    try {
      const res = await api.get('/purchase/my-purchases');
      setPurchases(res.data);
    } catch (err) {
      message.error('Failed to load purchases');
    }
  };

  const handleView = (record) => {
    setSelectedInstallments(record.installments_schedule);
    setVisible(true);
  };

  const handlePay = async (id) => {
    try {
      await api.post('/installments/pay', {
        schedule_id: id,
        paid_at: dayjs().toISOString()
      });
      message.success('Installment paid!');
      fetchPurchases(); // refresh
      setVisible(false);
    } catch (err) {
      message.error('Payment failed');
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

const columns = [
  { title: 'Product ID', dataIndex: 'product_id' },
  { title: 'Total Amount', dataIndex: 'total_amount' },
  {
    title: 'Full Paid',
    render: (record) => {
      const allPaid = record.installments_schedule.every(i => i.is_paid);
      return (
        <Tag color={allPaid ? 'green' : 'red'}>
          {allPaid ? '✅ Yes' : '❌ No'}
        </Tag>
      );
    }
  },
  {
    title: 'Action',
    render: (_, record) => (
      <Button onClick={() => handleView(record)}>View</Button>
    )
  }
];

  return (
    <>
      <h2>📦 My Purchases</h2>
      <Table dataSource={purchases} columns={columns} rowKey="id" />

      <Modal
        title="Installment Details"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        {selectedInstallments.map((i, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <Text>
              📅 <b>Due:</b> {new Date(i.due_date).toLocaleDateString()} &nbsp;
              💰 <b>Amount:</b> ৳{i.amount_due} &nbsp;
              <Tag color={i.is_paid ? 'green' : 'red'}>
                {i.is_paid ? 'Paid' : 'Unpaid'}
              </Tag>
              {!i.is_paid && (
                <Button type="link" onClick={() => handlePay(i.id)}>Pay</Button>
              )}
            </Text>
          </div>
        ))}
      </Modal>
    </>
  );
};

export default MyPurchases;
