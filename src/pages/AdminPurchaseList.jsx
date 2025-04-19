import {
  Table,
  Collapse,
  Typography,
  message,
  Button,
  Input,
  DatePicker,
  Row,
  Col,
  Card,
  Space
} from 'antd';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import dayjs from 'dayjs';
import { FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

const { Panel } = Collapse;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const AdminPurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [sortInfo, setSortInfo] = useState({ field: 'created_at', order: 'descend' });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    customer_name: '',
    product_name: '',
    date_range: null
  });

  const fetchPurchases = async (sortField, sortOrder, appliedFilters = {}) => {
    try {
      const params = {
        sort_by: sortField,
        order: sortOrder === 'ascend' ? 'asc' : 'desc',
        ...appliedFilters
      };

      if (appliedFilters.date_range) {
        params.start_date = appliedFilters.date_range[0];
        params.end_date = appliedFilters.date_range[1];
      }

      delete params.date_range;

      const res = await api.get('/purchase/admin/all', { params });
      setPurchases(res.data.items);
    } catch (err) {
      message.error('Failed to load purchases');
    }
  };

  useEffect(() => {
    fetchPurchases(sortInfo.field, sortInfo.order, filters);
  }, [sortInfo]);

  const handleTableChange = (_, __, sorter) => {
    if (sorter.order) {
      setSortInfo({ field: sorter.field, order: sorter.order });
    }
  };

  const handleSearch = () => {
    const payload = {
      customer_name: filters.customer_name || undefined,
      product_name: filters.product_name || undefined,
      date_range: filters.date_range
        ? [
            dayjs(filters.date_range[0]).format('YYYY-MM-DD'),
            dayjs(filters.date_range[1]).format('YYYY-MM-DD')
          ]
        : undefined
    };

    fetchPurchases(sortInfo.field, sortInfo.order, payload);
  };

  const downloadExcel = async () => {
    try {
      const res = await api.get('/api/reports/excel', { responseType: 'blob' });
      saveAs(new Blob([res.data]), 'purchase_report.xlsx');
    } catch (err) {
      message.error('Failed to download Excel');
    }
  };

  const downloadPDF = async () => {
    try {
      const res = await api.get('/reports/reports/pdf', { responseType: 'blob' });
      saveAs(new Blob([res.data]), 'purchase_report.pdf');
    } catch (err) {
      message.error('Failed to download PDF');
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
      <h2>📋 All Purchases (Admin)</h2>

      <Card
        size="small"
        style={{ marginBottom: 20 }}
        title={
          <Space>
            <Button type="dashed" onClick={() => setFiltersVisible(!filtersVisible)}>
              {filtersVisible ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<FileExcelOutlined />} onClick={downloadExcel}>
              Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={downloadPDF}>
              PDF
            </Button>
          </Space>
        }
      >
        {filtersVisible && (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Customer Name"
                value={filters.customer_name}
                onChange={(e) => setFilters({ ...filters, customer_name: e.target.value })}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Product Name"
                value={filters.product_name}
                onChange={(e) => setFilters({ ...filters, product_name: e.target.value })}
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <RangePicker
                value={filters.date_range}
                onChange={(dates) => setFilters({ ...filters, date_range: dates })}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={2}>
              <Button type="primary" block onClick={handleSearch}>
                Apply
              </Button>
            </Col>
            <Col xs={24} sm={12} md={2}>
              <Button
                block
                onClick={() => {
                  const resetFilters = {
                    customer_name: '',
                    product_name: '',
                    date_range: null
                  };
                  setFilters(resetFilters);
                  fetchPurchases(sortInfo.field, sortInfo.order, resetFilters);
                }}
              >
                Reset
              </Button>
            </Col>
          </Row>
        )}
      </Card>

      <Table
        dataSource={purchases}
        columns={columns}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AdminPurchaseList;
