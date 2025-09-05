import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Truck, Shield, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const FlowerPanLanding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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

  const products = [
    {
      id: 1,
      name: "Букет роз 'Страсть'",
      price: 2500,
      image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop",
      rating: 4.9
    },
    {
      id: 2,
      name: "Композиция 'Нежность'",
      price: 1800,
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300&h=300&fit=crop",
      rating: 4.8
    },
    {
      id: 3,
      name: "Букет тюльпанов",
      price: 1200,
      image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=300&h=300&fit=crop",
      rating: 4.7
    },
    {
      id: 4,
      name: "Свадебный букет",
      price: 4500,
      image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=300&h=300&fit=crop",
      rating: 5.0
    }
  ];

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
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50 transition-all duration-300">
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
              <button className="p-2 text-gray-700 hover:text-pink-600 transition-colors relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
              </button>
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">{product.price} ₽</span>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Посмотреть все букеты
            </button>
          </div>
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
                  Мы создаем моменты радости и красоты уже более 10 лет. Наша команда профессиональных флористов 
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
                  <div className="text-3xl font-bold text-pink-600">10+</div>
                  <div className="text-gray-600">лет опыта</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">5000+</div>
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
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Адрес</h3>
              <p className="opacity-90">ул. Цветочная, 15<br />Москва, 125009</p>
            </div>
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
    </div>
  );
};

export default FlowerPanLanding;
