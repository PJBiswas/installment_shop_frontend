import { Table, Collapse, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const { Panel } = Collapse;
const { Text } = Typography;

const AdminPurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [sortInfo, setSortInfo] = useState({
    field: 'created_at',
    order: 'descend'
  });

  const fetchPurchases = async (sortField, sortOrder) => {
    try {
      const res = await api.get('/purchase/admin/all', {
        params: {
          sort_by: sortField,
          order: sortOrder === 'ascend' ? 'asc' : 'desc'
        }
      });
      setPurchases(res.data.items);
    } catch (err) {
      message.error('Failed to load purchases');
    }
  };

  useEffect(() => {
    fetchPurchases(sortInfo.field, sortInfo.order);
  }, [sortInfo]);

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      setSortInfo({
        field: sorter.field,
        order: sorter.order
      });
    }
  };

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
      sorter: true,
      sortOrder: sortInfo.field === 'total_amount' ? sortInfo.order : null,
      render: (amount) => `৳ ${parseFloat(amount).toFixed(2)}`
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      sorter: true,
      sortOrder: sortInfo.field === 'created_at' ? sortInfo.order : null,
      render: (val) => new Date(val).toLocaleString()
    },
    {
      title: 'Status',
      dataIndex: 'is_completed',
      sorter: true,
      sortOrder: sortInfo.field === 'is_completed' ? sortInfo.order : null,
      render: (val) => (val ? '✅ Completed' : '❌ Pending')
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
        onChange={handleTableChange}
      />
    </div>
  );
};

export default AdminPurchaseList;
