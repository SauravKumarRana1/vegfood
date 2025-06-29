import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Menu as MenuIcon, 
  ShoppingCart, 
  ClipboardList, 
  Settings as SettingsIcon, 
  LogIn, 
  Sun, 
  Moon,
  User,
  Heart,
  Star,
  Plus,
  Minus,
  Trash2,
  Check
} from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  spiceLevel: number;
  isVegan: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  date: Date;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Butter Paneer Masala",
    description: "Rich and creamy paneer in aromatic tomato-based gravy",
    price: 280,
    category: "Main Course",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
    rating: 4.8,
    spiceLevel: 2,
    isVegan: false
  },
  {
    id: 2,
    name: "Dal Makhani",
    description: "Slow-cooked black lentils with butter and cream",
    price: 220,
    category: "Main Course",
    image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
    rating: 4.9,
    spiceLevel: 1,
    isVegan: false
  },
  {
    id: 3,
    name: "Chole Bhature",
    description: "Spicy chickpea curry with fluffy fried bread",
    price: 250,
    category: "Main Course",
    image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
    rating: 4.7,
    spiceLevel: 3,
    isVegan: true
  },
  {
    id: 4,
    name: "Masala Dosa",
    description: "Crispy rice crepe with spiced potato filling",
    price: 180,
    category: "South Indian",
    image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
    rating: 4.6,
    spiceLevel: 2,
    isVegan: true
  },
  {
    id: 5,
    name: "Palak Paneer",
    description: "Fresh spinach curry with soft paneer cubes",
    price: 260,
    category: "Main Course",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
    rating: 4.5,
    spiceLevel: 2,
    isVegan: false
  },
  {
    id: 6,
    name: "Aloo Gobi",
    description: "Dry curry with potatoes and cauliflower",
    price: 200,
    category: "Main Course",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
    rating: 4.4,
    spiceLevel: 2,
    isVegan: true
  }
];

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      return prev.reduce((acc, item) => {
        if (item.id === id) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
    });
  };

  const deleteFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: Date.now(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      date: new Date()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setActiveSection('orders');
  };

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
    setIsLoggedIn(true);
    setActiveSection('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ name: '', email: '' });
    setCart([]);
    setOrders([]);
    setActiveSection('home');
  };

  const Navigation = () => (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-black border-emerald-800' : 'bg-white border-emerald-200'} border-b backdrop-blur-md bg-opacity-95`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'} flex items-center justify-center`}>
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Veg Delight
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'menu', label: 'Menu', icon: MenuIcon },
              { id: 'cart', label: 'Cart', icon: ShoppingCart },
              { id: 'orders', label: 'Orders', icon: ClipboardList },
              { id: 'settings', label: 'Settings', icon: SettingsIcon },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  activeSection === id
                    ? `${isDarkMode ? 'bg-emerald-400 text-black' : 'bg-emerald-600 text-white'}`
                    : `${isDarkMode ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'}`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {id === 'cart' && cart.length > 0 && (
                  <span className={`ml-1 px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-emerald-400 text-black' : 'bg-emerald-600 text-white'}`}>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className={`px-3 py-2 rounded-md text-sm ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveSection('login')}
                className={`flex items-center space-x-1 px-4 py-2 rounded-md ${isDarkMode ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const HomePage = () => (
    <div className={`min-h-screen pt-16 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className={`relative h-screen flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-black to-gray-900' : 'bg-gradient-to-br from-emerald-50 to-emerald-100'}`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Authentic Vegetarian
            <span className={`block ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Indian Cuisine
            </span>
          </h1>
          <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience the rich flavors and aromatic spices of traditional Indian vegetarian dishes
          </p>
          <button
            onClick={() => setActiveSection('menu')}
            className={`px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 ${isDarkMode ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            Explore Our Menu
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-4xl font-bold text-center mb-16 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Why Choose Veg Delight?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "100% Vegetarian",
                description: "All our dishes are completely vegetarian with many vegan options",
                icon: Heart
              },
              {
                title: "Fresh & Authentic",
                description: "Made with fresh ingredients and traditional cooking methods",
                icon: Star
              },
              {
                title: "Fast Delivery",
                description: "Hot, fresh food delivered to your doorstep in 30 minutes",
                icon: Check
              }
            ].map(({ title, description, icon: Icon }, index) => (
              <div key={index} className={`text-center p-8 rounded-2xl ${isDarkMode ? 'bg-black border border-gray-800' : 'bg-gray-50 border border-gray-200'}`}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'}`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const MenuPage = () => {
    const categories = [...new Set(menuItems.map(item => item.category))];

    return (
      <div className={`min-h-screen pt-16 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <h1 className={`text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Our Menu
          </h1>

          {categories.map(category => (
            <div key={category} className="mb-12">
              <h2 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <div key={item.id} className={`rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-105 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.name}
                          </h3>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className={`ml-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {item.rating}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            ₹{item.price}
                          </span>
                          <div className="flex items-center space-x-2">
                            {item.isVegan && (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                Vegan
                              </span>
                            )}
                            <div className="flex">
                              {[...Array(item.spiceLevel)].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className={`w-full py-3 rounded-xl font-semibold transition-colors ${isDarkMode ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CartPage = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
      <div className={`min-h-screen pt-16 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <h1 className={`text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Cart
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className={`w-24 h-24 mx-auto mb-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-xl mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your cart is empty
              </p>
              <button
                onClick={() => setActiveSection('menu')}
                className={`px-6 py-3 rounded-xl font-semibold ${isDarkMode ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4 mb-8">
                {cart.map(item => (
                  <div key={item.id} className={`p-6 rounded-2xl flex items-center space-x-6 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </h3>
                      <p className={`text-lg font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ₹{item.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className={`text-lg font-semibold w-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteFromCart(item.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Total: ₹{total}
                  </span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={!isLoggedIn}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
                    isLoggedIn
                      ? `${isDarkMode ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`
                      : `${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-300 text-gray-500'} cursor-not-allowed`
                  }`}
                >
                  {isLoggedIn ? 'Place Order' : 'Login to Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const OrdersPage = () => (
    <div className={`min-h-screen pt-16 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList className={`w-24 h-24 mx-auto mb-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-xl mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No orders yet
            </p>
            <button
              onClick={() => setActiveSection('menu')}
              className={`px-6 py-3 rounded-xl font-semibold ${isDarkMode ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map(order => (
              <div key={order.id} className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Order #{order.id}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'ready' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {item.name} x {item.quantity}
                      </span>
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {order.date.toLocaleDateString()} at {order.date.toLocaleTimeString()}
                  </span>
                  <span className={`text-xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Total: ₹{order.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className={`min-h-screen pt-16 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Theme Preferences
            </h3>
            <div className="flex items-center justify-between">
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Dark Mode
              </span>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-emerald-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {isLoggedIn && (
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className={`w-full p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-300'} border`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className={`w-full p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-300'} border`}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Order Updates
                </span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Promotional Offers
                </span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (name && email) {
        handleLogin(name, email);
      }
    };

    return (
      <div className={`min-h-screen pt-16 flex items-center justify-center ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className={`w-full max-w-md p-8 rounded-2xl ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'}`}>
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome Back
            </h2>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white border-gray-700 focus:border-emerald-400' : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-emerald-600'} border focus:outline-none focus:ring-2 focus:ring-emerald-200`}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white border-gray-700 focus:border-emerald-400' : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-emerald-600'} border focus:outline-none focus:ring-2 focus:ring-emerald-200`}
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${isDarkMode ? 'bg-emerald-400 text-black hover:bg-emerald-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />;
      case 'menu':
        return <MenuPage />;
      case 'cart':
        return <CartPage />;
      case 'orders':
        return <OrdersPage />;
      case 'settings':
        return <SettingsPage />;
      case 'login':
        return <LoginPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Navigation />
      {renderContent()}
    </div>
  );
}

export default App;