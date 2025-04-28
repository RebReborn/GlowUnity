// Futuristic Homepage for GlowUnity Dropshipping Beauty Store - Enhanced UI/UX
// Shopify-integrated frontend using React

import React, { useEffect, useState } from 'react';
import Client from 'shopify-buy';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Orbitron, Poppins } from 'next/font/google';
import { motion, AnimatePresence } from "framer-motion";

const client = Client.buildClient({
  domain: 'your-store.myshopify.com',
  storefrontAccessToken: 'your-storefront-access-token',
});

const categories = [
  { id: 'skincare', name: 'Skincare', icon: '💧', description: 'Glow Up with Serums & Masks', color: 'from-purple-500 to-pink-500' },
  { id: 'haircare', name: 'Haircare', icon: '✂️', description: 'Healthy Hair Starts Here', color: 'from-blue-500 to-teal-400' },
  { id: 'grooming', name: 'Grooming', icon: '🧔', description: 'Style Meets Substance', color: 'from-amber-500 to-orange-500' },
  { id: 'bundles', name: 'Bundles', icon: '🎁', description: 'Curated Beauty Sets', color: 'from-emerald-500 to-cyan-400' },
];

export default function DropshippingStore() {
  const [products, setProducts] = useState([]);
  const [checkout, setCheckout] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartNotification, setIsCartNotification] = useState(false);

  useEffect(() => {
    client.product.fetchAll().then((fetchedProducts) => setProducts(fetchedProducts));
    client.checkout.create().then((checkout) => setCheckout(checkout));
  }, []);

  const addToCart = (variantId) => {
    const lineItemsToAdd = [{ variantId, quantity: 1 }];
    client.checkout.addLineItems(checkout.id, lineItemsToAdd).then((updatedCheckout) => {
      setCheckout(updatedCheckout);
      setCartItems(prev => prev + 1);
      showCartNotification();
    });
  };

  const showCartNotification = () => {
    setIsCartNotification(true);
    setTimeout(() => setIsCartNotification(false), 3000);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || 
      product.productType.toLowerCase() === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const navItems = ['Shop', 'Skincare', 'Haircare', 'Grooming', 'Bundles', 'About', 'Contact'];

  return (
    <div className="font-[Poppins] text-white bg-gradient-to-br from-[#1A1A2E] to-[#16213E] min-h-screen overflow-x-hidden selection:bg-[#FF007A]/50">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 bg-[#1A1A2E]/90 backdrop-blur-md border-b border-[#2A2A3E]">
        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-[#2A2A3E] transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold font-[Orbitron] text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#FF007A]">
            GlowUnity
          </h1>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-64 h-screen bg-[#1A1A2E] z-50 p-4 shadow-2xl md:hidden"
            >
              <button 
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#2A2A3E]"
                onClick={() => setIsMenuOpen(false)}
              >
                ✕
              </button>
              <nav className="flex flex-col space-y-4 mt-12">
                {navItems.map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`} 
                    className="px-4 py-2 rounded-lg hover:bg-[#2A2A3E] transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="px-4 py-2 rounded-lg hover:bg-[#2A2A3E] transition hover:text-[#FF007A]"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Search Bar */}
          <div className="relative">
            {isSearchOpen ? (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 200 }}
                exit={{ opacity: 0, width: 0 }}
                className="absolute right-0 top-0"
              >
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#2A2A3E] border-none text-white placeholder-gray-400"
                />
              </motion.div>
            ) : null}
            <button 
              className="p-2 rounded-lg hover:bg-[#2A2A3E] transition"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              🔍
            </button>
          </div>

          {/* Cart with badge */}
          <div className="relative">
            <button 
              className="p-2 rounded-lg hover:bg-[#2A2A3E] transition relative"
              onClick={() => window.open(checkout?.webUrl, '_blank')}
            >
              🛒
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF007A] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </button>
          </div>

          <button className="hidden md:block p-2 rounded-lg hover:bg-[#2A2A3E] transition">
            👤
          </button>
        </div>
      </header>

      {/* Cart Notification */}
      <AnimatePresence>
        {isCartNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 right-4 bg-[#2A2A3E] px-4 py-2 rounded-lg shadow-lg border border-[#FF007A] z-50 flex items-center"
          >
            <span className="mr-2">✅</span>
            Item added to cart!
            <button 
              className="ml-4 text-[#FF007A]"
              onClick={() => setIsCartNotification(false)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative text-center px-6 py-16 sm:py-24 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-[Orbitron] text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#FF007A] mb-6"
          >
            Beauty for Everyone
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover Inclusive Skincare & Haircare Solutions for All Skin Types and Textures
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              className="px-8 py-6 text-lg bg-gradient-to-r from-[#FF007A] to-[#00D4FF] hover:from-[#FF007A]/90 hover:to-[#00D4FF]/90 transform hover:scale-105 transition duration-300 shadow-lg shadow-[#FF007A]/20"
              onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </Button>
          </motion.div>
        </div>
        
        {/* Floating product images */}
        <motion.img 
          src="/hero-product.png" 
          alt="Hero Product" 
          className="absolute top-1/4 right-10 w-32 h-32 object-contain hidden lg:block"
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.img 
          src="/hero-product-2.png" 
          alt="Hero Product" 
          className="absolute top-1/3 left-10 w-24 h-24 object-contain hidden lg:block"
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </section>

      {/* Categories */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-[Orbitron] mb-8 text-center">Shop by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card 
                className={`bg-gradient-to-br ${cat.color} border-none cursor-pointer`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <CardContent className="p-6 text-center flex flex-col items-center">
                  <div className="text-5xl mb-4">{cat.icon}</div>
                  <CardTitle className="text-xl mb-2">{cat.name}</CardTitle>
                  <CardDescription className="text-white/80">{cat.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-[Orbitron] mb-4 sm:mb-0">
            {activeCategory === 'all' ? 'Featured Products' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Collection`}
          </h3>
          <div className="flex space-x-2">
            <Button 
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('all')}
              className="border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF]/10"
            >
              All
            </Button>
            {categories.map(cat => (
              <Button 
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setActiveCategory(cat.id)}
                className={`border-[${cat.color.split('to-')[1].split('-')[0]}-400] text-[${cat.color.split('to-')[1].split('-')[0]}-400] hover:bg-[${cat.color.split('to-')[1].split('-')[0]}-400]/10`}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No products found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-[#1F1F2E] border border-[#2A2A3E] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#FF007A]/20 transition">
                  <div className="relative group">
                    <img 
                      src={product.images[0]?.src} 
                      alt={product.title} 
                      className="w-full h-60 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-[#FF007A] to-[#00D4FF] hover:from-[#FF007A]/90 hover:to-[#00D4FF]/90"
                        onClick={() => addToCart(product.variants[0].id)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold line-clamp-1">{product.title}</h4>
                        <p className="text-sm text-gray-400">{product.productType}</p>
                      </div>
                      <p className="font-bold text-[#00D4FF]">${product.variants[0].price.amount}</p>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 ml-1">(42)</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-3 border-[#FF007A] text-[#FF007A] hover:bg-[#FF007A]/10 sm:hidden"
                      onClick={() => addToCart(product.variants[0].id)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="px-6 py-16 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border-t border-b border-[#2A2A3E]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-[Orbitron] mb-4">Join Our Beauty Community</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Subscribe to get exclusive offers, beauty tips, and early access to new products.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-[#2A2A3E] border-none text-white placeholder-gray-400"
            />
            <Button className="bg-gradient-to-r from-[#FF007A] to-[#00D4FF] hover:from-[#FF007A]/90 hover:to-[#00D4FF]/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-[#0F0F1C] border-t border-[#2A2A3E]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h1 className="font-[Orbitron] text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#FF007A] text-xl mb-4">GlowUnity</h1>
            <p className="text-gray-400 mb-4">Futuristic Beauty for All</p>
            <div className="flex space-x-4">
              {['📸', '🎵', '📘'].map((icon, i) => (
                <button key={i} className="p-2 rounded-full bg-[#2A2A3E] hover:bg-[#FF007A] transition">
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.id}>
                  <a href={`#${cat.id}`} className="text-gray-400 hover:text-[#FF007A] transition">
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              {['Shipping', 'Returns', 'FAQ', 'Contact Us'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-[#FF007A] transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Blog', 'Careers', 'Press'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-[#FF007A] transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#2A2A3E] text-center text-gray-500 text-sm">
          <p>© 2025 GlowUnity. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-[#FF007A] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#FF007A] transition">Terms of Service</a>
            <a href="#" className="hover:text-[#FF007A] transition">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}