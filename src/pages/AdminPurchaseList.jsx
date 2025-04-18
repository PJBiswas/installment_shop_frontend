import { Table, Collapse, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const { Panel } = Collapse;
const { Text } = Typography;

const AdminPurchaseList = () => {
  const [purchases, setPurchases] = useState([]);

  const fetchPurchases = async () => {
    try {
      const res = await api.get('/purchase/admin/all');
      setPurchases(res.data.items);
    } catch (err) {
      message.error('Failed to load purchases');
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const columns = [
    {
      title: 'Customer Name',
      render: (record) => `${record.user.first_name} ${record.user.last_name}`
    },
    {
      title: 'Product',
      render: (record) => record.product.name
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      render: (amount) => `৳ ${parseFloat(amount).toFixed(2)}`
    },
    {
      title: 'Installments',
      render: (_, record) => (
        <Collapse ghost>
          <Panel header="View Installments" key={record.id}>
            {record.installments_schedule.map((i, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <Text>
                  📅 <b>Due:</b> {new Date(i.due_date).toLocaleDateString()} &nbsp;
                  💰 <b>Amount:</b> ৳{i.amount_due} &nbsp;
                  🧾 <b>Status:</b> {i.is_paid ? '✅ Paid' : '❌ Unpaid'}
                </Text>
              </div>
            ))}
          </Panel>
        </Collapse>
      )
    }
  ];

  return (
    <div>
      <h2>🧾 All Purchases (Admin)</h2>
      <Table
        dataSource={purchases}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default AdminPurchaseList;
