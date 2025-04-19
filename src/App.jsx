import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import LayoutWrapper from "./components/LayoutWrapper";
import AdminPurchaseList from "./pages/AdminPurchaseList";
import PurchaseProduct from "./pages/PurchaseProduct";
import MyPurchases from "./pages/pages";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage"; // ✅ <-- Add this line

const App = () => (
  <ConfigProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/admin/purchases" element={<AdminPurchaseList />} />
          <Route path="/buy" element={<PurchaseProduct />} />
          <Route path="/my-purchases" element={<MyPurchases />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);

export default App;
