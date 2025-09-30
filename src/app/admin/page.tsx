"use client";
import withAdminAuth from './withAdminAuth';
import AdminDashboard from './AdminDashboard'; // Component này chứa giao diện dashboard

// Bọc AdminDashboard bằng HOC
const ProtectedAdminPage = withAdminAuth(AdminDashboard);

export default ProtectedAdminPage;