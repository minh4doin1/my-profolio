"use client";
import withAdminAuth from '../../components/admin/withAdminAuth';
import AdminDashboard from './AdminDashboard';

const ProtectedAdminPage = withAdminAuth(AdminDashboard);

export default ProtectedAdminPage;