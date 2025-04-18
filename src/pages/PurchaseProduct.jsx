import {Button, Card, Col, message, Row} from 'antd';
import {useEffect, useState} from 'react';
import api from '../api/axios';
import {useNavigate} from 'react-router-dom';

const PurchaseProduct = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products/');
            setProducts(res.data.items);
        } catch (err) {
            message.error('Failed to load products');
        }
    };

    const handlePurchase = async (productId) => {
        try {
            await api.post('/purchase/', {product_id: productId});
            message.success('Purchase successful!');
            navigate('/my-purchases'); // Redirect
        } catch (err) {
            message.error('Purchase failed');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <h2>🛒 Purchase Product</h2>
            <Row gutter={[16, 16]}>
                {products.map((product) => (
                    <Col span={8} key={product.id}>
                        <Card title={product.name} bordered={false}>
                            <p>{product.description}</p>
                            <p><b>৳ {product.price}</b></p>
                            <Button type="primary" onClick={() => handlePurchase(product.id)}>
                                Buy Now
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default PurchaseProduct;
