
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
import SearchResults from './pages/SearchResults';
import AllCategoriesPage from './pages/AllCategoriesPage';
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
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import ComoFunciona from './pages/ComoFunciona';
import SegurancaTrust from './pages/SegurancaTrust';
import Logistica from './pages/Logistica';
import SellersVerificados from './pages/SellersVerificados';
import SobreNos from './pages/SobreNos';
import Carreiras from './pages/Carreiras';
import Contato from './pages/Contato';
import CatalogIntegration from './pages/CatalogIntegration';
import Wishlist from './pages/Wishlist';
import { WishlistProvider } from './context/WishlistContext';

// ── Inner app — has access to AuthContext ─────────────────────────────────────
const AppInner: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.BUYER);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#marketplace');
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#marketplace');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync role with hash
  useEffect(() => {
    if (currentHash === '#marketplace' || currentHash === '' || currentHash.startsWith('#category/') || currentHash.startsWith('#search') || currentHash === '#all-categories') setActiveRole(UserRole.BUYER);
    if (currentHash === '#sellers' || currentHash === '#seller/products/new' || currentHash.startsWith('#seller/products/edit/')) setActiveRole(UserRole.SELLER);
    if (currentHash === '#wholesale') setActiveRole(UserRole.WHOLESALE);
  }, [currentHash]);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === UserRole.BUYER) window.location.hash = '#marketplace';
    if (role === UserRole.SELLER) window.location.hash = '#sellers';
    if (role === UserRole.WHOLESALE) window.location.hash = '#wholesale';
  };

  // Guard: redirects to #auth and shows Auth page if visitor is not logged in
  const requireAuth = (element: React.ReactElement): React.ReactElement => {
    if (loading) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      );
    }
    if (!user) {
      // Remember where the visitor wanted to go so we can redirect after login
      sessionStorage.setItem('redirectAfterLogin', currentHash);
      window.location.hash = '#auth';
      return <Auth />;
    }
    return element;
  };

  const renderContent = () => {
    // ── Public routes (no login required) ─────────────────────────────────────
    if (currentHash === '#auth') return <Auth />;
    if (currentHash.startsWith('#marketplace') || currentHash === '') return <Marketplace />;
    if (currentHash === '#all-categories') return <AllCategoriesPage />;
    if (currentHash.startsWith('#category/')) return <CategoryPage slug={currentHash.replace('#category/', '')} />;
    if (currentHash.startsWith('#moda')) {
      const subPath = currentHash.substring(5);
      const subcategory = subPath.startsWith('/') ? subPath.substring(1) : 'all';
      return <FashionCategoryPage subcategory={subcategory || 'all'} />;
    }
    if (currentHash.startsWith('#product/')) return <ProductDetail productId={currentHash.replace('#product/', '')} />;
    if (currentHash.startsWith('#seller/') && !currentHash.includes('products')) {
      return <SellerProfile sellerId={currentHash.replace('#seller/', '')} onBack={() => { window.location.hash = '#marketplace'; }} />;
    }
    if (currentHash.startsWith('#search')) return <SearchResults />;
    if (currentHash === '#wishlist') return requireAuth(<Wishlist />);
    if (currentHash === '#investors') return requireAuth(<InvestorDashboard />);
    if (currentHash === '#track-order') return <TrackOrder />;
    // Info pages
    if (currentHash === '#como-funciona') return <ComoFunciona />;
    if (currentHash === '#seguranca') return <SegurancaTrust />;
    if (currentHash === '#logistica') return <Logistica />;
    if (currentHash === '#sellers-verificados') return <SellersVerificados />;
    if (currentHash === '#sobre-nos') return <SobreNos />;
    if (currentHash === '#carreiras') return <Carreiras />;
    if (currentHash === '#contato') return <Contato />;
    if (currentHash === '#catalogo') return <CatalogIntegration />;

    // ── Protected routes (login required) ─────────────────────────────────────
    if (currentHash === '#checkout') return requireAuth(<Checkout />);
    if (currentHash.startsWith('#customer')) return requireAuth(<CustomerPortal />);
    if (currentHash === '#order-success') return requireAuth(<OrderSuccess />);
    if (currentHash === '#rewards') return requireAuth(<RewardsPage />);
    if (currentHash === '#sellers' || activeRole === UserRole.SELLER) return requireAuth(<SellerDashboard />);
    if (currentHash === '#seller/products/new') return requireAuth(<ProductRegistration onBack={() => { window.location.hash = '#sellers'; }} />);
    if (currentHash.startsWith('#seller/products/edit/')) {
      const productId = currentHash.replace('#seller/products/edit/', '');
      const product = MOCK_PRODUCTS.find(p => p.id === productId);
      return requireAuth(<ProductRegistration onBack={() => { window.location.hash = '#sellers'; }} initialProduct={product} />);
    }
    if (currentHash === '#wholesale' || activeRole === UserRole.WHOLESALE) return requireAuth(<WholesaleDashboard />);

    return <Marketplace />;
  };

  return (
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
  );
};

// ── Root app — provides all contexts ─────────────────────────────────────────
const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <RewardsProvider>
          <CartProvider>
            <WishlistProvider>
              <ChatProvider>
                <AppInner />
              </ChatProvider>
            </WishlistProvider>
          </CartProvider>
        </RewardsProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
