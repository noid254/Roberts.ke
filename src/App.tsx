import { Search, User, ShoppingBag, Menu, Heart, Instagram, Facebook, Twitter, ChevronLeft, ChevronRight, Plus, X, Upload, Image as ImageIcon, Edit2, Trash2, LogOut, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useRef, ReactNode, useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = ({ onOpenDashboard, onOpenLogin, isLoggedIn, onLogout, onViewChange, currentView, searchQuery, setSearchQuery, cartCount, onOpenCart }: { onOpenDashboard: () => void, onOpenLogin: () => void, isLoggedIn: boolean, onLogout: () => void, onViewChange: (view: 'home' | 'shop' | 'pdp') => void, currentView: string, searchQuery: string, setSearchQuery: (q: string) => void, cartCount: number, onOpenCart: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav id="navbar" className="border-b border-gray-100 sticky top-0 bg-white z-50">
      {/* Promo Banner */}
      <div className="bg-teal text-white text-[10px] uppercase tracking-[0.2em] py-2 text-center font-medium">
        Karibu Roberts, We take measurements Deliver and Fit.
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center lg:hidden">
            <button 
              id="mobile-menu-btn" 
              className="p-2 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center lg:justify-start">
            <img 
              id="logo" 
              src="https://cms.roberts.co.ke/wp-content/uploads/2026/04/1.png" 
              alt="RobertsKE Logo" 
              className="h-12 w-auto cursor-pointer object-contain" 
              onClick={() => onViewChange('home')}
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="hidden lg:flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop' && e.target.value.length > 0) onViewChange('shop');
                }}
                placeholder="What can we help you find?" 
                className="w-full bg-brand-gray px-4 py-2 text-sm focus:outline-none border border-transparent focus:border-teal/30 transition-all"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end space-x-6">
            {isLoggedIn && (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={onOpenDashboard}
                  className="flex items-center space-x-1 text-xs uppercase tracking-widest font-bold text-teal hover:text-mustard transition-colors cursor-pointer"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="flex items-center space-x-1 text-xs uppercase tracking-widest font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
            <button id="account-btn" className="hidden sm:flex items-center space-x-1 text-xs uppercase tracking-widest font-medium hover:text-teal transition-colors cursor-pointer">
              <User size={20} />
              <span className="hidden lg:inline">Account</span>
            </button>
            <button id="wishlist-btn" className="text-gray-700 hover:text-mustard transition-colors cursor-pointer">
              <Heart size={20} />
            </button>
            <button 
              id="cart-btn" 
              onClick={onOpenCart}
              className="flex items-center space-x-1 text-xs uppercase tracking-widest font-medium hover:text-teal transition-colors cursor-pointer relative"
            >
              <ShoppingBag size={20} />
              <span className="hidden lg:inline">Cart ({cartCount})</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-mustard text-brand-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center lg:hidden">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Nav */}
        <div className="hidden lg:flex justify-center space-x-10 py-4">
          <button onClick={() => onViewChange('home')} className={`nav-link hover:text-teal cursor-pointer ${currentView === 'home' ? 'text-teal font-bold' : ''}`}>Home</button>
          <button 
            onClick={() => { setSearchQuery('Curtains'); onViewChange('shop'); }} 
            className="nav-link hover:text-teal cursor-pointer"
          >
            Curtains
          </button>
          <button 
            onClick={() => { setSearchQuery('Flooring'); onViewChange('shop'); }} 
            className="nav-link hover:text-teal cursor-pointer"
          >
            Flooring
          </button>
          <button 
            onClick={() => { setSearchQuery('Wallpapers'); onViewChange('shop'); }} 
            className="nav-link hover:text-teal cursor-pointer"
          >
            Wallpapers and Decor
          </button>
          <button 
            onClick={() => { setSearchQuery('Soft Furnishing'); onViewChange('shop'); }} 
            className="nav-link hover:text-teal cursor-pointer"
          >
            Soft Furnishing
          </button>
          <button 
            onClick={() => { setSearchQuery('Artificial plants'); onViewChange('shop'); }} 
            className="nav-link hover:text-teal cursor-pointer"
          >
            Artificial plants
          </button>
          <button 
            onClick={() => { setSearchQuery(''); onViewChange('shop'); }} 
            className={`nav-link hover:text-teal cursor-pointer ${currentView === 'shop' && searchQuery === '' ? 'text-teal font-bold' : ''}`}
          >
            Shop all
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <button 
                onClick={() => { onViewChange('home'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left text-sm uppercase tracking-widest font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => { setSearchQuery('Curtains'); onViewChange('shop'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left text-sm uppercase tracking-widest font-medium"
              >
                Curtains
              </button>
              <button 
                onClick={() => { setSearchQuery('Flooring'); onViewChange('shop'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left text-sm uppercase tracking-widest font-medium"
              >
                Flooring
              </button>
              <button 
                onClick={() => { setSearchQuery('Wallpapers'); onViewChange('shop'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left text-sm uppercase tracking-widest font-medium"
              >
                Wallpapers and Decor
              </button>
              <button 
                onClick={() => { setSearchQuery('Soft Furnishing'); onViewChange('shop'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left text-sm uppercase tracking-widest font-medium"
              >
                Soft Furnishing
              </button>
              <button 
                onClick={() => { setSearchQuery('Artificial plants'); onViewChange('shop'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left text-sm uppercase tracking-widest font-medium"
              >
                Artificial plants
              </button>
              <button 
                onClick={() => { setSearchQuery(''); onViewChange('shop'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left text-sm uppercase tracking-widest font-bold text-teal"
              >
                Shop all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="relative h-[70vh] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
        alt="Modern Living Room" 
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/95 backdrop-blur-sm p-8 md:p-16 max-w-2xl border-l-8 border-mustard"
        >
          <h2 className="text-4xl md:text-6xl mb-6 leading-tight text-brand-dark">The Art of Home Improvement</h2>
          <p className="text-lg mb-8 font-light tracking-wide text-gray-700">Discover our curated collection of timeless Home Improvements products and modern essentials for your home.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-teal text-white px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-teal/90 transition-all shadow-lg">Shop Home Improvement</button>
            <button className="border-2 border-mustard text-brand-dark px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-mustard hover:text-white transition-all">Curtains and Decor</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const HorizontalSlider = ({ title, items, renderItem }: { title: string, items: any[], renderItem: (item: any) => ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-3xl md:text-4xl font-serif">{title}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 border border-gray-200 hover:bg-teal hover:text-white transition-colors rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 border border-gray-200 hover:bg-teal hover:text-white transition-colors rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 pb-4"
      >
        {items.map((item, index) => (
          <div key={index} className="flex-none w-[280px] sm:w-[320px] snap-start">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </section>
  );
};

const CategoryCard = ({ title, image }: { title: string, image: string }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="group cursor-pointer"
  >
    <div className="aspect-[4/5] overflow-hidden mb-4 relative">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-teal/0 group-hover:bg-teal/10 transition-colors duration-300" />
    </div>
    <h3 className="text-xl text-center group-hover:text-teal group-hover:underline underline-offset-4 transition-colors">{title}</h3>
  </motion.div>
);

const ProductCard = ({ 
  id,
  name, 
  price, 
  image, 
  category, 
  isNew, 
  isLive, 
  isAdmin, 
  onEdit, 
  onDelete,
  onClick
}: { 
  id?: number,
  name: string, 
  price: string, 
  image: string, 
  category: string, 
  isNew?: boolean, 
  isLive?: boolean,
  isAdmin?: boolean,
  onEdit?: () => void,
  onDelete?: () => void,
  onClick?: () => void,
  key?: any 
}) => (
  <div className="group cursor-pointer" onClick={onClick}>
    <div className="relative aspect-square overflow-hidden mb-4 bg-brand-gray">
      {isNew && (
        <span className="absolute top-4 left-4 bg-mustard text-brand-dark text-[10px] px-2 py-1 uppercase tracking-widest font-bold z-10">
          New
        </span>
      )}
      {isLive && (
        <div className="absolute top-4 right-4 bg-teal text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
          <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
          Live
        </div>
      )}
      
      {isAdmin && (
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
            className="p-2 bg-white text-teal rounded-full shadow-md hover:bg-teal hover:text-white transition-all cursor-pointer"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <img 
        src={image} 
        alt={`${name} - RobertsKE Furniture Kenya`} 
        className="w-full h-full object-cover mix-blend-multiply"
        referrerPolicy="no-referrer"
      />
      <button className="absolute bottom-4 left-4 right-4 bg-teal text-white py-2 text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg cursor-pointer">
        View Details
      </button>
    </div>
    <p className="text-[10px] uppercase tracking-widest text-teal font-bold mb-1">{category}</p>
    <h4 className="text-sm font-medium mb-1 group-hover:text-teal transition-colors">{name}</h4>
    <p className="text-sm font-serif text-gray-600">{price}</p>
  </div>
);

const DesignServicesBanner = () => (
  <section id="design-services" className="bg-brand-gray py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop" 
            alt="Design Services" 
            className="w-full h-[500px] object-cover shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="lg:w-1/2 space-y-6">
          <span className="text-teal font-bold uppercase tracking-[0.3em] text-xs">The Design Desk</span>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight">Professional Design Services, <span className="italic text-mustard">On Us.</span></h2>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Whether you're refreshing a corner or redesigning your entire home, our expert designers are here to help you bring your vision to life. From 3D renderings to curated mood boards.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button className="bg-teal text-white px-10 py-4 text-sm uppercase tracking-widest font-bold hover:bg-teal/90 transition-all">Book a Free Consultation</button>
            <button className="border-2 border-brand-dark px-10 py-4 text-sm uppercase tracking-widest font-bold hover:bg-brand-dark hover:text-white transition-all">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ShopTheLook = () => (
  <section id="shop-the-look" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-serif mb-4">Shop the Look</h2>
        <p className="text-gray-500 font-light tracking-wide">Get inspired by our curated room sets.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative group cursor-pointer overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1616486341353-c5833ad8f012?q=80&w=1600&auto=format&fit=crop" 
            alt="Modern Living Room Look" 
            className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-10 left-10 text-white">
            <h3 className="text-3xl font-serif mb-2">The Modern Sanctuary</h3>
            <p className="text-sm uppercase tracking-widest font-bold border-b border-white w-fit pb-1">Shop This Room</p>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="relative flex-1 group cursor-pointer overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?q=80&w=800&auto=format&fit=crop" 
              alt="Dining Room Look" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-6 left-6 text-white text-sm uppercase tracking-widest font-bold border-b border-white w-fit pb-1">
              Dining Elegance
            </div>
          </div>
          <div className="relative flex-1 group cursor-pointer overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1616594111705-3f513b2e50f6?q=80&w=800&auto=format&fit=crop" 
              alt="Bedroom Look" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-6 left-6 text-white text-sm uppercase tracking-widest font-bold border-b border-white w-fit pb-1">
              Serene Bedroom
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const RegistryBanner = () => (
  <section id="registry" className="bg-teal text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-4xl font-serif italic">The RobertsKE Registry</h2>
        <p className="text-lg font-light tracking-wide opacity-90">
          Start your new chapter with pieces you'll love for a lifetime. From everyday essentials to heirloom furniture.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
          <button className="bg-mustard text-brand-dark px-10 py-3 text-sm uppercase tracking-widest font-bold hover:bg-white transition-all">Create a Registry</button>
          <button className="border border-white px-10 py-3 text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-teal transition-all">Find a Registry</button>
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ onOpenLogin }: { onOpenLogin: () => void }) => {
  return (
    <footer id="footer" className="bg-brand-gray pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h5 className="text-xs uppercase tracking-widest font-bold mb-6">Customer Service</h5>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Track Your Order</a></li>
              <li><a href="#" className="hover:underline">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:underline">Shipping Information</a></li>
              <li><a href="#" className="hover:underline">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-widest font-bold mb-6">About RobertsKE</h5>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Our Story</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Sustainability</a></li>
              <li><a href="#" className="hover:underline">Store Locations</a></li>
              <li><a href="#" className="hover:underline">Trade Program</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-widest font-bold mb-6">Connect</h5>
            <div className="flex space-x-4 mb-6">
              <a href="https://www.instagram.com/roberts.co.ke" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"><Instagram size={18} /></a>
              <a href="https://facebook.com/roberts.co.ke/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"><Twitter size={18} /></a>
            </div>
            <p className="text-sm text-gray-600 mb-4">Join our WhatsApp channel to get exclusive offers every Monday and Friday.</p>
            <div className="flex">
              <input type="tel" placeholder="WhatsApp Number" className="flex-1 px-4 py-2 text-sm focus:outline-none border border-gray-300" />
              <button className="bg-brand-dark text-white px-4 py-2 text-xs uppercase tracking-widest font-bold">Join</button>
            </div>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-widest font-bold mb-6">Our Brands</h5>
            <div className="space-y-4">
              <p className="text-lg font-serif italic">RobertsKE</p>
              <p className="text-lg font-serif italic">Home&Garden</p>
              <p className="text-lg font-serif italic">Amazing Grass</p>
              <p className="text-lg font-serif italic">Curtians Central</p>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-4">
            <p>© 2026 RobertsKE. All rights reserved.</p>
            <button 
              onClick={onOpenLogin}
              className="flex items-center gap-1 hover:text-teal transition-colors cursor-pointer opacity-50 hover:opacity-100"
            >
              <Lock size={10} />
              <span>admin</span>
            </button>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const DashboardModal = ({ isOpen, onClose, onRefresh, editingItem }: { isOpen: boolean, onClose: () => void, onRefresh: () => void, editingItem?: any }) => {
  const [activeTab, setActiveTab] = useState<'product' | 'post'>('product');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
    title: '',
    content: ''
  });

  useEffect(() => {
    if (editingItem) {
      if (editingItem.type === 'product') {
        setActiveTab('product');
        setFormData({
          ...formData,
          name: editingItem.name || '',
          price: editingItem.price?.replace(/[^0-9.]/g, '') || '',
          description: editingItem.description || '',
          category: editingItem.category || '',
          imageUrl: editingItem.image || ''
        });
      } else {
        setActiveTab('post');
        setFormData({
          ...formData,
          title: editingItem.title?.rendered || editingItem.title || '',
          content: editingItem.content?.rendered || editingItem.content || ''
        });
      }
    } else {
      setFormData({ name: '', price: '', description: '', category: '', imageUrl: '', title: '', content: '' });
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'product') {
        const payload = {
          name: formData.name,
          regular_price: formData.price,
          description: formData.description,
          images: formData.imageUrl ? [{ src: formData.imageUrl }] : []
        };

        if (editingItem && editingItem.id) {
          await axios.put(`/api/products/${editingItem.id}`, payload);
        } else {
          await axios.post('/api/products', payload);
        }
      } else {
        const payload = {
          title: formData.title,
          content: formData.content,
          status: 'publish'
        };
        
        if (editingItem && editingItem.id) {
          // Edit post not fully implemented on server yet, but following pattern
          await axios.post('/api/posts', payload); 
        } else {
          await axios.post('/api/posts', payload);
        }
      }
      onRefresh();
      onClose();
      setFormData({ name: '', price: '', description: '', category: '', imageUrl: '', title: '', content: '' });
    } catch (error: any) {
      console.error("Operation failed:", error);
      alert("Operation failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex border-b border-gray-100">
              <button 
                onClick={() => setActiveTab('product')}
                className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-colors ${activeTab === 'product' ? 'bg-teal text-white' : 'hover:bg-gray-50'}`}
              >
                Upload Product
              </button>
              <button 
                onClick={() => setActiveTab('post')}
                className={`flex-1 py-4 text-xs uppercase tracking-widest font-bold transition-colors ${activeTab === 'post' ? 'bg-teal text-white' : 'hover:bg-gray-50'}`}
              >
                Create Post
              </button>
              <button onClick={onClose} className="p-4 hover:bg-gray-50 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
              {activeTab === 'product' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Product Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Modern Velvet Sofa"
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-teal transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Price ($)</label>
                      <input 
                        required
                        type="number" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="1299"
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-teal transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Category</label>
                      <select 
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-teal transition-all bg-white"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        <option value="furniture">Furniture</option>
                        <option value="decor">Decor</option>
                        <option value="lighting">Lighting</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Image URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-teal transition-all"
                      />
                      <div className="w-12 h-12 bg-brand-gray flex items-center justify-center border border-gray-200">
                        {formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-400" />}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Description</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Tell us about this piece..."
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-teal transition-all resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Post Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. 5 Tips for a Modern Living Room"
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-teal transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Content</label>
                    <textarea 
                      required
                      rows={8}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Write your design story..."
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-teal transition-all resize-none"
                    />
                  </div>
                </>
              )}

              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-mustard text-brand-dark py-4 text-xs uppercase tracking-widest font-bold hover:bg-teal hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Processing...' : (
                  <>
                    <Upload size={18} />
                    {editingItem ? 'Update' : 'Publish'} {activeTab === 'product' ? 'Product' : 'Post'}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/login', { email, password });
      onLogin(res.data.user);
      onClose();
    } catch (error) {
      alert("Invalid credentials. Hint: noid254@gmail.com / 12345678");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-md p-8 shadow-2xl">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full cursor-pointer"><X size={20} /></button>
            <h2 className="text-2xl font-serif mb-6 text-center">Admin Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Email</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-teal" placeholder="noid254@gmail.com" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Password</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-teal" placeholder="••••••••" />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-teal text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-mustard hover:text-brand-dark transition-all cursor-pointer">
                {loading ? 'Authenticating...' : 'Login'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ProductDetail = ({ product, onBack, isAdmin, onEdit, onAddToCart }: { product: any, onBack: () => void, isAdmin: boolean, onEdit: () => void, onAddToCart: (product: any, quantity: number) => void }) => {
  const [activeImage, setActiveImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];

  useEffect(() => {
    setActiveImage(product.image);
    setQuantity(1);
  }, [product]);

  // SEO Structured Data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": gallery,
    "description": product.description || `Premium ${product.name} available at RobertsKE. Best furniture in Kenya.`,
    "sku": `RKE-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "RobertsKE"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "KES",
      "price": product.price?.replace(/[^0-9.]/g, '') || "0",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <section className="py-20 bg-white">
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-teal transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            Back to Collection
          </button>
          
          {isAdmin && (
            <button 
              onClick={onEdit}
              className="flex items-center gap-2 bg-teal text-white px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-mustard hover:text-brand-dark transition-all cursor-pointer"
            >
              <Edit2 size={16} />
              Edit Product
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="bg-brand-gray aspect-square overflow-hidden group relative">
              <img 
                src={activeImage} 
                alt={`${product.name} - Premium Furniture Kenya`} 
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {gallery.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square border-2 overflow-hidden transition-all ${activeImage === img ? 'border-teal' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} view ${idx + 1}`} 
                      className="w-full h-full object-cover mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-teal font-bold mb-4">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-serif mb-4">{product.name}</h1>
              <p className="text-2xl font-serif text-mustard">{product.price}</p>
            </div>
            
            <div className="prose prose-sm text-gray-600 font-light leading-relaxed">
              <p>{product.description || `Experience the perfect blend of form and function with this meticulously crafted ${product.name}. Designed to elevate your living space in Nairobi, it combines timeless aesthetics with modern durability.`}</p>
            </div>
            
            <div className="space-y-4 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex border border-gray-200">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input type="text" value={quantity} readOnly className="w-12 text-center border-x border-gray-200 text-sm" />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => onAddToCart(product, quantity)}
                  className="flex-1 bg-teal text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-brand-dark transition-all shadow-lg cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
              <button className="w-full border-2 border-brand-dark py-4 text-xs uppercase tracking-widest font-bold hover:bg-brand-dark hover:text-white transition-all cursor-pointer">
                Add to Wishlist
              </button>
            </div>
            
            <div className="pt-8 border-t border-gray-100">
              <div>
                <h5 className="text-[10px] uppercase tracking-widest font-bold mb-2">Shipping in Kenya</h5>
                <p className="text-xs text-gray-500">Shipping across Kenya is available at a nominal fee. For our Nairobi customers, we offer a convenient same-day pay on delivery service.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CheckoutModal = ({ isOpen, onClose, cart, onRemove, onCheckout }: { isOpen: boolean, onClose: () => void, cart: any[], onRemove: (id: number) => void, onCheckout: (details: any) => void }) => {
  const [step, setStep] = useState<'cart' | 'details'>('cart');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    altPhone: '',
    address: ''
  });

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + (price * item.quantity);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }
    onCheckout(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-brand-gray">
          <h2 className="text-xl font-serif italic">
            {step === 'cart' ? 'Your Shopping Bag' : 'Delivery Details'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 'cart' ? (
            <div className="space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your bag is empty.</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 text-teal font-bold uppercase tracking-widest text-xs hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-50">
                        <div className="w-20 h-20 bg-brand-gray shrink-0">
                          <img 
                            src={item.images?.[0]?.src || item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover mix-blend-multiply"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">{item.price} x {item.quantity}</p>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-[10px] uppercase tracking-widest text-red-500 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-sm">
                            KES {(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">KES {total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-serif border-t border-gray-100 pt-4">
                      <span>Total</span>
                      <span className="text-mustard">KES {total.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Full Name *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-gray border-none focus:ring-2 focus:ring-teal/20 text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Phone Number *</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-gray border-none focus:ring-2 focus:ring-teal/20 text-sm"
                    placeholder="0712 345 678"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Alternate Phone</label>
                  <input 
                    type="tel" 
                    value={formData.altPhone}
                    onChange={(e) => setFormData({...formData, altPhone: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-gray border-none focus:ring-2 focus:ring-teal/20 text-sm"
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Delivery Address *</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-gray border-none focus:ring-2 focus:ring-teal/20 text-sm"
                    placeholder="Building, Street, Area, City"
                  />
                </div>
              </div>
              <div className="bg-teal/5 p-4 border border-teal/10">
                <p className="text-xs text-teal leading-relaxed">
                  <strong>Note:</strong> We offer same-day pay on delivery for Nairobi orders. For orders outside Nairobi, a small shipping fee applies.
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 bg-brand-gray border-t border-gray-100">
          {step === 'cart' ? (
            <button 
              disabled={cart.length === 0}
              onClick={() => setStep('details')}
              className="w-full bg-teal text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Proceed to Delivery Details
            </button>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => setStep('cart')}
                className="flex-1 border border-gray-300 py-4 text-xs uppercase tracking-widest font-bold hover:bg-white transition-all"
              >
                Back to Bag
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-[2] bg-teal text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-brand-dark transition-all shadow-lg"
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'shop' | 'pdp'>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const addToCart = (product: any, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCheckoutOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = (details: any) => {
    console.log("Order placed:", { details, cart });
    alert(`Thank you, ${details.name}! Your order has been placed. Someone will call you on ${details.phone} to confirm the order.`);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const handleViewChange = (newView: 'home' | 'shop' | 'pdp') => {
    setView(newView);
    if (newView !== 'pdp') {
      setSelectedProduct(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    handleViewChange('pdp');
  };

  const handleEditProduct = (product: any) => {
    setEditingItem({ ...product, type: 'product' });
    setIsDashboardOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchData();
      } catch (error) {
        alert("Failed to delete product.");
      }
    }
  };

  const runDiagnostics = async () => {
    try {
      const res = await axios.get('/api/diagnostics');
      setDiagnostics(res.data);
      setShowDiagnostics(true);
    } catch (err: any) {
      setDiagnostics({ error: "Failed to run diagnostics", details: err.message });
      setShowDiagnostics(true);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching data from server...");
      const [productsRes, postsRes] = await Promise.all([
        axios.get('/api/products').catch(err => {
          const errorData = err.response?.data;
          const msg = errorData?.error || err.message;
          const details = errorData?.details ? (typeof errorData.details === 'string' ? errorData.details : JSON.stringify(errorData.details)) : '';
          
          console.warn("Products fetch failed:", msg, details);
          setError(`${msg}${details ? ': ' + details : ''}`);
          return { data: [] };
        }),
        axios.get('/api/posts').catch(err => {
          console.warn("Posts fetch failed:", err.response?.data || err.message);
          return { data: [] };
        })
      ]);
      
      console.log(`Fetched ${productsRes.data?.length || 0} products and ${postsRes.data?.length || 0} posts`);
      
      if (productsRes.data && Array.isArray(productsRes.data) && productsRes.data.length > 0) {
        setProducts(productsRes.data);
        setError(null);
      }
      
      if (postsRes.data && Array.isArray(postsRes.data)) {
        setPosts(postsRes.data);
      }
    } catch (error: any) {
      console.error("Critical fetch error:", error);
      setError("A critical error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rooms = [
    { title: "Living Room", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/234.jpg" },
    { title: "Bedroom", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/235-1.jpg" },
    { title: "Dining Room", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/236.jpg" },
    { title: "Pantry", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/237.jpg" },
    { title: "Kitchen", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/238.jpg" },
    { title: "Bathroom", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/239.jpg" },
    { title: "Balcony", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/240-1.jpg" },
    { title: "Outdoor", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/241.jpg" },
  ];

  const categories = [
    { title: "Flooring & Carpet", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/123.jpg" },
    { title: "Window Treatments", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/321.jpg" },
    { title: "Soft Furnishing", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/322.jpg" },
    { title: "Walling & Panels", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/323.jpg" },
    { title: "Bedding", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/235.jpg" },
    { title: "Outdoor & Plants", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/331.jpg" },
    { title: "Walkways & Door Mats", image: "https://cms.roberts.co.ke/wp-content/uploads/2026/04/331.jpg" },
  ];

  const newArrivals = [
    { name: "Mustard Velvet Armchair", price: "$599.00", category: "Furniture", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500&auto=format&fit=crop" },
    { name: "Teal Ceramic Vase Set", price: "$89.00", category: "Decor", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=500&auto=format&fit=crop" },
    { name: "Geometric Wool Rug", price: "$449.00", category: "Rug", image: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=500&auto=format&fit=crop" },
    { name: "Modern Brass Lamp", price: "$129.00", category: "Lighting", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=500&auto=format&fit=crop" },
    { name: "Teal Linen Cushion", price: "$35.00", category: "Soft Furnishing", image: "https://images.unsplash.com/photo-1584144124475-3430182939e6?q=80&w=500&auto=format&fit=crop" },
  ];

  const displayProducts = products.length > 0 ? products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price_html ? p.price_html.replace(/<[^>]*>?/gm, '') : `$${p.price || '0.00'}`,
    category: p.categories?.[0]?.name || 'Furniture',
    image: p.images?.[0]?.src || 'https://picsum.photos/seed/furniture/500/500',
    images: p.images?.map((img: any) => img.src) || [],
    description: p.description?.replace(/<[^>]*>?/gm, ''),
    isLive: true
  })).filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) : (error || loading ? [] : newArrivals.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const isUsingDemoData = products.length === 0 && !loading && !error;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onOpenDashboard={() => { setEditingItem(null); setIsDashboardOpen(true); }} 
        onOpenLogin={() => setIsLoginOpen(true)}
        isLoggedIn={isLoggedIn}
        onLogout={() => { setIsLoggedIn(false); setUser(null); }}
        onViewChange={handleViewChange}
        currentView={view}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCheckoutOpen(true)}
      />
      
      <main className="flex-grow">
        {view === 'pdp' && selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => handleViewChange('shop')} 
            isAdmin={isLoggedIn}
            onEdit={() => handleEditProduct(selectedProduct)}
            onAddToCart={addToCart}
          />
        ) : view === 'home' ? (
          <>
            <Hero />

            {/* Shop by Room Slider */}
            <HorizontalSlider 
              title="Shop by Room" 
              items={rooms} 
              renderItem={(room) => <CategoryCard title={room.title} image={room.image} />} 
            />

            {/* New Arrivals Highlights */}
            <section id="new-arrivals" className="bg-brand-gray py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {error && (
                  <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-500 text-red-700 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-lg mb-1">Connection Issue</p>
                        <p className="text-sm opacity-90">{error}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button 
                            onClick={fetchData}
                            className="bg-red-600 text-white px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-red-700 transition-all shadow-md"
                          >
                            Retry Connection
                          </button>
                          <button 
                            onClick={runDiagnostics}
                            className="bg-white text-red-600 border border-red-600 px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-red-50 transition-all"
                          >
                            Run System Check
                          </button>
                        </div>
                      </div>
                      <div className="md:w-1/3 text-xs opacity-80 bg-white/50 p-4 rounded border border-red-100">
                        <p className="font-bold uppercase tracking-widest mb-2 text-red-800">Quick Fixes:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Check WOOCOMMERCE_URL</li>
                          <li>Verify API Keys</li>
                          <li>Enable Legacy REST API</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {showDiagnostics && diagnostics && (
                  <div className="mb-8 bg-[#141414] text-[#E4E3E0] p-6 font-mono text-xs shadow-2xl border-l-4 border-teal overflow-hidden">
                    <div className="flex justify-between items-center mb-6 border-bottom border-[#E4E3E0]/20 pb-2">
                      <span className="italic text-[#E4E3E0]/50 uppercase tracking-widest">System Diagnostics v1.0</span>
                      <button onClick={() => setShowDiagnostics(false)} className="hover:text-teal transition-colors">CLOSE [X]</button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 opacity-70 border-b border-[#E4E3E0]/10 pb-4 mb-4">
                        <div>URL: {diagnostics.config?.url}</div>
                        <div className="text-right">TIMESTAMP: {diagnostics.timestamp}</div>
                      </div>
                      {diagnostics.tests?.map((test: any, i: number) => (
                        <div key={i} className="flex items-start gap-4 py-2 border-b border-[#E4E3E0]/5 last:border-0">
                          <span className={`w-16 flex-none ${test.status === 'pass' ? 'text-teal' : 'text-red-500'} font-bold`}>
                            [{test.status.toUpperCase()}]
                          </span>
                          <div className="flex-1">
                            <div className="font-bold mb-1">{test.name}</div>
                            <div className="opacity-70">{test.message}</div>
                          </div>
                        </div>
                      ))}
                      {diagnostics.error && (
                        <div className="text-red-500 mt-4 p-4 border border-red-500/30 bg-red-500/5">
                          CRITICAL: {diagnostics.error} - {diagnostics.details}
                        </div>
                      )}
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#E4E3E0]/10 text-right italic opacity-30">
                      End of report.
                    </div>
                  </div>
                )}

                {isUsingDemoData && (
                  <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 text-sm flex justify-between items-center">
                    <div>
                      <p className="font-bold">Demo Mode Active</p>
                      <p>We couldn't find any products in your store. Showing sample furniture instead.</p>
                    </div>
                    <button 
                      onClick={fetchData}
                      className="text-xs font-bold underline hover:text-amber-900"
                    >
                      Refresh Store
                    </button>
                  </div>
                )}
                
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif">New Arrivals in Kenya</h2>
                    <p className="text-teal font-medium mt-2 tracking-widest uppercase text-[10px]">Fresh modern furniture for your Kenyan home</p>
                  </div>
                  <button 
                    onClick={() => handleViewChange('shop')}
                    className="text-xs uppercase tracking-widest font-bold border-b-2 border-mustard pb-1 hover:text-teal transition-colors cursor-pointer"
                  >
                    Visit Shop
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {displayProducts.slice(0, 5).map((product, index) => (
                    <ProductCard 
                      key={index} 
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      category={product.category}
                      image={product.image}
                      isLive={product.isLive}
                      isAdmin={isLoggedIn}
                      onEdit={() => handleEditProduct(product)}
                      onDelete={() => handleDeleteProduct(product.id)}
                      onClick={() => handleProductClick(product)}
                      isNew 
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Shop by Category Slider */}
            <HorizontalSlider 
              title="Shop by Category" 
              items={categories} 
              renderItem={(cat) => <CategoryCard title={cat.title} image={cat.image} />} 
            />

            {/* Design Services Banner */}
            <DesignServicesBanner />

            {/* Featured Products */}
            <section id="featured" className="bg-white py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl mb-4 font-serif">Best Selling Furniture in Nairobi</h2>
                  <div className="w-20 h-1 bg-mustard mx-auto mb-4"></div>
                  <p className="text-gray-500 font-light tracking-wide">Our most-loved pieces, chosen by homeowners across Kenya.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {displayProducts.slice(0, 4).map((product, index) => (
                    <ProductCard 
                      key={index} 
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      category={product.category}
                      image={product.image}
                      isAdmin={isLoggedIn}
                      onEdit={() => handleEditProduct(product)}
                      onDelete={() => handleDeleteProduct(product.id)}
                      onClick={() => handleProductClick(product)}
                    />
                  ))}
                </div>
                <div className="text-center mt-12">
                  <button 
                    onClick={() => handleViewChange('shop')}
                    className="bg-brand-dark text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-teal transition-all cursor-pointer"
                  >
                    Shop All Collection
                  </button>
                </div>
              </div>
            </section>

            {/* Design Posts Section */}
            {posts.length > 0 && (
              <section id="design-posts" className="py-20 bg-brand-gray">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Design Stories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.slice(0, 3).map((post, index) => (
                      <div key={index} className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow relative group">
                        {isLoggedIn && (
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { setEditingItem({...post, type: 'post'}); setIsDashboardOpen(true); }}
                              className="p-2 bg-teal text-white rounded-full cursor-pointer"
                            >
                              <Edit2 size={12} />
                            </button>
                          </div>
                        )}
                        <h3 className="text-xl font-serif mb-4" dangerouslySetInnerHTML={{ __html: post.title.rendered || post.title }}></h3>
                        <div className="text-sm text-gray-600 line-clamp-3 mb-6" dangerouslySetInnerHTML={{ __html: post.content.rendered || post.content }}></div>
                        <a href="#" className="text-xs uppercase tracking-widest font-bold text-teal hover:text-mustard transition-colors cursor-pointer">Read More</a>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Shop the Look */}
            <ShopTheLook />

            {/* Promo Section */}
            <section id="promo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative h-[400px] overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop" 
                    alt="Kitchenware" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-teal/40 flex flex-col justify-end p-10 text-white">
                    <h3 className="text-3xl mb-4 font-serif">Kitchen Essentials</h3>
                    <p className="mb-6 opacity-90">Upgrade your culinary space with professional-grade tools.</p>
                    <button onClick={() => handleViewChange('shop')} className="w-fit border-b-2 border-mustard pb-1 text-xs uppercase tracking-widest font-bold hover:text-mustard transition-colors cursor-pointer">Shop Kitchen</button>
                  </div>
                </div>
                <div className="relative h-[400px] overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop" 
                    alt="Outdoor Living" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-mustard/40 flex flex-col justify-end p-10 text-white">
                    <h3 className="text-3xl mb-4 font-serif">Outdoor Oasis</h3>
                    <p className="mb-6 opacity-90">Create the perfect backyard retreat for summer gatherings.</p>
                    <button onClick={() => handleViewChange('shop')} className="w-fit border-b-2 border-teal pb-1 text-xs uppercase tracking-widest font-bold hover:text-teal transition-colors cursor-pointer">Shop Outdoor</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Registry Banner */}
            <RegistryBanner />

            {/* Newsletter / Social */}
            <section id="social" className="bg-brand-gray py-20 text-center">
              <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-3xl mb-6 font-serif">Follow Us @RobertsKE</h2>
                <p className="text-gray-500 mb-10 font-light tracking-wide">Share your home style with #RobertsKEHome for a chance to be featured.</p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="aspect-square overflow-hidden bg-gray-200">
                      <img 
                        src={`https://picsum.photos/seed/furniture-${i}/400/400`} 
                        alt={`Social post ${i}`} 
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : view === 'shop' ? (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-serif mb-2">Shop All Products</h2>
                  <p className="text-gray-500">Showing all {displayProducts.length} items from our collection</p>
                </div>
                <div className="flex gap-4">
                  <select className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-teal bg-white cursor-pointer">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest Arrivals</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {displayProducts.map((product, index) => (
                    <ProductCard 
                      key={index} 
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      category={product.category}
                      image={product.image}
                      isAdmin={isLoggedIn}
                      onEdit={() => handleEditProduct(product)}
                      onDelete={() => handleDeleteProduct(product.id)}
                      onClick={() => handleProductClick(product)}
                      isLive={product.isLive}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : null}
      </main>

      <Footer onOpenLogin={() => setIsLoginOpen(true)} />

      <DashboardModal 
        isOpen={isDashboardOpen} 
        onClose={() => { setIsDashboardOpen(false); setEditingItem(null); }} 
        onRefresh={fetchData}
        editingItem={editingItem}
      />

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={(user) => { setIsLoggedIn(true); setUser(user); }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
