
import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import Layout from './components/Layout';
import Marketplace from './pages/Marketplace';
import SellerDashboard from './pages/SellerDashboard';
import InvestorDashboard from './pages/InvestorDashboard';
import WholesaleDashboard from './pages/WholesaleDashboard';
import CategoryPage from './pages/CategoryPage';
import FashionCategoryPage from './pages/FashionCategoryPage';
import ProductRegistration from './pages/ProductRegistration';
import ProductDetail from './pages/ProductDetail';
import CustomerPortal from './pages/CustomerPortal';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import Checkout from './pages/Checkout';
import SellerProfile from './pages/SellerProfile';
import SearchPage from './pages/SearchPage';
import { MOCK_PRODUCTS } from './constants';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { RewardsProvider } from './context/RewardsContext';
import CartSidebar from './components/CartSidebar';
import ToastContainer from './components/ToastContainer';
import PageTransition from './components/PageTransition';
import { ChatProvider } from './context/ChatContext';
import ChatWidget from './components/ChatWidget';
import RewardsPage from './pages/RewardsPage';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.BUYER);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#marketplace');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#marketplace');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync role with hash
  useEffect(() => {
    if (currentHash === '#marketplace' || currentHash === '' || currentHash.startsWith('#category/') || currentHash.startsWith('#search')) setActiveRole(UserRole.BUYER);
    if (currentHash === '#sellers' || currentHash === '#seller/products/new' || currentHash.startsWith('#seller/products/edit/')) setActiveRole(UserRole.SELLER);
    if (currentHash === '#wholesale') setActiveRole(UserRole.WHOLESALE);
    // #investors is footer-only, keep role as-is
  }, [currentHash]);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === UserRole.BUYER) window.location.hash = '#marketplace';
    if (role === UserRole.SELLER) window.location.hash = '#sellers';
    if (role === UserRole.WHOLESALE) window.location.hash = '#wholesale';
  };

  const renderContent = () => {
    if (currentHash === '#checkout') {
      return <Checkout />;
    }
    // Seller profile: #seller/s1, #seller/s2, etc.
    if (currentHash.startsWith('#seller/') && !currentHash.includes('products')) {
      const sellerId = currentHash.replace('#seller/', '');
      return (
        <SellerProfile
          sellerId={sellerId}
          onBack={() => { window.location.hash = '#marketplace'; }}
        />
      );
    }
    // Product registration (lojista)
    if (currentHash === '#seller/products/new') {
      return <ProductRegistration onBack={() => { window.location.hash = '#sellers'; }} />;
    }
    if (currentHash.startsWith('#seller/products/edit/')) {
      const productId = currentHash.replace('#seller/products/edit/', '');
      const product = MOCK_PRODUCTS.find(p => p.id === productId);
      return <ProductRegistration onBack={() => { window.location.hash = '#sellers'; }} initialProduct={product} />;
    }
    // Investor portal — footer-only link, must be checked before role-based conditions
    if (currentHash === '#investors') {
      return <InvestorDashboard />;
    }
    // Página de Moda
    if (currentHash.startsWith('#moda')) {
      const subPath = currentHash.substring(5); // remove '#moda'
      const subcategory = subPath.startsWith('/') ? subPath.substring(1) : 'all';
      return <FashionCategoryPage subcategory={subcategory || 'all'} />;
    }
    // Category pages
    if (currentHash.startsWith('#category/')) {
      const slug = currentHash.replace('#category/', '');
      return <CategoryPage slug={slug} />;
    }

    // Product Detail Page
    if (currentHash.startsWith('#product/')) {
      const id = currentHash.replace('#product/', '');
      return <ProductDetail productId={id} />;
    }

    // Customer Portal (Minha Conta)
    if (currentHash.startsWith('#customer')) {
      return <CustomerPortal />;
    }

    // Order Success
    if (currentHash === '#order-success') {
      return <OrderSuccess />;
    }

    // Track Order
    if (currentHash === '#track-order') {
      return <TrackOrder />;
    }

    // Rewards Page
    if (currentHash === '#rewards') {
      return <RewardsPage />;
    }

    // Auth Page
    if (currentHash === '#auth') {
      return <Auth />;
    }

    // Search Page
    if (currentHash.startsWith('#search')) {
      const urlParams = new URLSearchParams(currentHash.split('?')[1] || '');
      const query = urlParams.get('q') || '';
      return <SearchPage query={query} />;
    }
    if (currentHash.startsWith('#marketplace') || currentHash === '' || activeRole === UserRole.BUYER) {
      return <Marketplace />;
    }
    if (currentHash === '#sellers' || activeRole === UserRole.SELLER) {
      return <SellerDashboard />;
    }
    if (currentHash === '#wholesale' || activeRole === UserRole.WHOLESALE) {
      return <WholesaleDashboard />;
    }
    return <Marketplace />;
  };

  return (
    <ToastProvider>
      <AuthProvider>
        <RewardsProvider>
          <CartProvider>
            <ChatProvider>
              <div className="min-h-screen bg-slate-50">
                <Layout activeRole={activeRole} onRoleChange={handleRoleChange}>
                  <PageTransition transitionKey={currentHash}>
                    {renderContent()}
                  </PageTransition>
                </Layout>
                <CartSidebar />
                <ChatWidget />
                <ToastContainer />
              </div>
            </ChatProvider>
          </CartProvider>
        </RewardsProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
