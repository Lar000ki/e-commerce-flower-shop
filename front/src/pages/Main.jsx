import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Truck, Shield, Phone, Mail, MapPin, Instagram, Facebook, Twitter, X, Plus, Minus, User, CreditCard, Calendar, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

// Хук для работы с localStorage (в реальном проекте работает с localStorage)
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
       const item = window.localStorage.getItem(key);
       return item ? JSON.parse(item) : initialValue;
      
      //return initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

// Компонент модального окна корзины
const CartModal = ({ isOpen, onClose, cartItems, updateQuantity, removeFromCart, clearCart, onCheckout }) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Корзина</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-96">
          {cartItems.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Корзина пуста</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <img 
                    src={item.imageUrl ? `${API_BASE}/product/images/${item.imageUrl}` : "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=100&h=100&fit=crop"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-pink-600 font-bold">{item.price} ₽</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Итого:</span>
              <span className="text-2xl font-bold text-pink-600">{total} ₽</span>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={clearCart}
                className="flex-1 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
              >
                Очистить корзину
              </button>
              <button 
                onClick={onCheckout}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-full hover:shadow-lg transition-all"
              >
                Оформить заказ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент формы оформления заказа
const CheckoutModal = ({ isOpen, onClose, cartItems, onOrderComplete }) => {
  const [formData, setFormData] = useState({
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  address: '',
  deliveryTime: '',
  comment: ''
});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Имя обязательно';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Телефон обязателен';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email обязателен';
    if (!formData.address.trim()) newErrors.deliveryAddress = 'Адрес доставки обязателен';
    
    if (formData.customerPhone && !/^(\+7|8)\d{10}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Неверный формат телефона';
    }
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Неверный формат email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        address: formData.address,
        deliveryTime: formData.deliveryTime,
        comment: formData.comment,
        items: cartItems.map(item => ({
          product: { id: item.id },
          quantity: item.quantity
        }))
      };

      // Отправка заказа на сервер
      const response = await fetch(`${API_BASE}/order/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        onOrderComplete();
        onClose();
        // Сброс формы
        setFormData({
          customerName: '', customerPhone: '', customerEmail: '',
          deliveryAddress: '', deliveryDate: '', deliveryTime: '', comment: ''
        });
      } else {
      const errorData = await response.json();
      setErrors({ server: errorData.error || "Неизвестная ошибка" });
    }
  } catch (error) {
    console.error('Ошибка:', error);
    setErrors({ server: "Ошибка соединения с сервером" });
  } finally {
    setIsSubmitting(false);
  }
};

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[99vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Оформление заказа</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Форма заказа */}
            <div>
              <h3 className="text-xl font-bold mb-6">Контактная информация</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Ваше имя"
                    />
                    {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="+7 (999) 123-45-67"
                    />
                    {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="your@email.com"
                    />
                    {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Адрес доставки *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      maxLength={255}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Улица, дом, квартира"
                    />
                    {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Доставим завтра в:
                    </label>
                    <select
                      value={formData.deliveryTime}
                      onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="00:00-23:59">Любое время</option>
                      <option value="09:00-12:00">09:00 - 12:00</option>
                      <option value="12:00-15:00">12:00 - 15:00</option>
                      <option value="15:00-18:00">15:00 - 18:00</option>
                      <option value="18:00-21:00">18:00 - 21:00</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Комментарий к заказу
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    maxLength={255}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Дополнительные пожелания к заказу"
                  />
                </div>
              </form>
            </div>

            {/* Информация о заказе */}
            <div>
              <h3 className="text-xl font-bold mb-6">Ваш заказ</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.imageUrl ? `${API_BASE}/product/images/${item.imageUrl}` : "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=50&h=50&fit=crop"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-gray-600 text-sm">{item.quantity} шт.</p>
                      </div>
                    </div>
                    <span className="font-semibold">{item.price * item.quantity} ₽</span>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Итого:</span>
                    <span className="text-pink-600">{total} ₽</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 mb-2">Информация о доставке</h4>
                  <p className="text-sm text-blue-700">
                    • Бесплатная доставка от 2000 ₽<br/>
                    • Доставка в день заказа<br/>
                    • Оплата наличными или картой курьеру
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3 border-t bg-gray-50">
          {errors.server && (
            <div className="mb-4 text-red-600 font-medium">{errors.server}</div>
          )}
          <div className="flex justify-between items-center">
            <button 
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            >
              Отменить
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Оформление...' : 'Подтвердить заказ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент уведомления об успешном заказе
const OrderSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Заказ оформлен!</h2>
        <p className="text-gray-600 mb-6">
          Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.
        </p>
        <button 
          onClick={onClose}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all"
        >
          Хорошо
        </button>
      </div>
    </div>
  );
};

const FlowerPanLanding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cartItems, setCartItems] = useLocalStorage('flowerpan-cart', []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      title: "Свежие цветы каждый день",
      subtitle: "Доставим букет мечты прямо к вашей двери",
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=600&fit=crop"
    },
    {
      title: "Премиум качество",
      subtitle: "Только лучшие цветы от проверенных поставщиков",
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800&h=600&fit=crop"
    },
    {
      title: "Быстрая доставка",
      subtitle: "Доставка в день заказа по всему городу",
      image: "https://images.unsplash.com/photo-1686740206168-0a4225a2ce9b?w=800&h=600&fit=crop"
    }
  ];

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await fetch(API_BASE + '/product/all');
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setProductsError(true);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductsError(true);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Функции для работы с корзиной
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item => 
        item.id === productId && item.inStock >= newQuantity
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    clearCart();
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Быстрая доставка",
      description: "Доставка в течение дня по городу"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Гарантия качества",
      description: "100% гарантия свежести наших цветов"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Индивидуальный подход",
      description: "Создаем букеты под ваши пожелания"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌸</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                FlowerPan
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Главная</a>
              <a href="#catalog" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Каталог</a>
              <a href="#about" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">О нас</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">Контакты</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-gray-700 hover:text-pink-600 transition-colors relative"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Заказать
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {heroSlides[currentSlide].title}
            </h1>
            <p className={`text-xl md:text-2xl text-white/90 mb-8 transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Смотреть каталог
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">
                Узнать больше
              </button>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="catalog" className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Популярные букеты</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Откройте для себя наши самые любимые композиции, созданные с особой заботой и вниманием к деталям
            </p>
          </div>
          
          {/* Состояние загрузки */}
          {productsLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <span className="ml-4 text-gray-600 text-lg">Загрузка товаров...</span>
            </div>
          )}

          {/* Ошибка загрузки */}
          {productsError && (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-red-800 font-semibold mb-2">Ошибка загрузки</h3>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Попробовать снова
                </button>
              </div>
            </div>
          )}

          {/* Пустой список */}
          {!productsLoading && !productsError && products.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-gray-800 font-semibold mb-2">Товары не найдены</h3>
                <p className="text-gray-600">В настоящее время товары отсутствуют в каталоге</p>
              </div>
            </div>
          )}

          {/* Список товаров */}
          {!productsLoading && !productsError && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">

                    <div className="relative overflow-hidden">
                      <img
                        src={product.imageUrl 
                          ? API_BASE + `/product/images/${product.imageUrl}` 
                          : "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300&h=300&fit=crop"
                        }
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300&h=300&fit=crop";
                        }}
                      />
                      
                      {/* Overlay для товаров не в наличии */}
                      {product.inStock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">Нет в наличии</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-pink-600">
                          {product.price} ₽
                        </span>
                      </div>

                      <button 
                        disabled={product.inStock === 0}
                        className={`w-full py-3 rounded-full font-semibold transition-all duration-300 transform flex items-center justify-center space-x-2 ${
                          product.inStock === 0 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                        }`}
                        onClick={() => {
                          if (product.inStock > 0) {
                            addToCart(product);
                          }
                        }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{product.inStock === 0 ? 'Нет в наличии' : 'В корзину'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">О FlowerPan</h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  Мы создаем моменты радости и красоты. Наша команда профессиональных флористов 
                  тщательно отбирает каждый цветок, чтобы ваши букеты были идеальными.
                </p>
                <p>
                  От нежных композиций для романтических свиданий до торжественных букетов для особых случаев — 
                  мы воплощаем ваши эмоции в цветах.
                </p>
                <p>
                  Наша миссия — дарить счастье и создавать незабываемые впечатления через красоту природы.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">1000+</div>
                  <div className="text-gray-600">счастливых клиентов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">100%</div>
                  <div className="text-gray-600">гарантия качества</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&h=800&fit=crop"
                alt="Флорист за работой"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Сделано с любовью</div>
                    <div className="text-gray-600">Каждый букет уникален</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-pink-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Свяжитесь с нами</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Готовы создать идеальный букет? Мы всегда готовы помочь вам выбрать лучший вариант
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Телефон</h3>
              <p className="opacity-90">+7 (999) 123-45-67</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Email</h3>
              <p className="opacity-90">info@flowerpan.ru</p>
            </div>
            
            {/* <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Адрес</h3>
              <p className="opacity-90">ул. Цветочная, 15<br />Москва, 125009</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">🌸</span>
                </div>
                <span className="text-2xl font-bold">FlowerPan</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Создаем моменты красоты и радости через искусство флористики. 
                Каждый букет — это история, рассказанная языком цветов.
              </p>
              <div className="flex space-x-4">
                <button className="p-3 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-800 rounded-full hover:bg-blue-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Каталог</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Букеты роз</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Композиции</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Свадебные букеты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Корзины цветов</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6">Информация</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">О компании</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Оплата</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FlowerPan. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Модальные окна */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        onCheckout={handleCheckout}
        products={products}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderComplete={handleOrderComplete}
      />

      <OrderSuccessModal 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </div>
  );
};

export default FlowerPanLanding;