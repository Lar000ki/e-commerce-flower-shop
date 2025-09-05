import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, Plus, Edit, Trash2, Search, X } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    items: []
  });

  const [productForm, setProductForm] = useState({
    name: '',
    price: ''
  });

  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    role: 'USER'
  });

  // Fetch data functions
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/order/all`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/product/all`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Save functions
  const saveOrder = async () => {
  try {
    const payload = {
      customerName: orderForm.customerName,
      customerPhone: orderForm.customerPhone,
      customerEmail: orderForm.customerEmail,
      items: orderForm.items.map(item => ({
        product: { id: item.productId },
        quantity: item.quantity
      }))
    };

    const response = await fetch(`${API_BASE}/order/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      fetchOrders();
      closeModal();
    }
  } catch (error) {
    console.error('Error saving order:', error);
  }
};


  const saveProduct = async () => {
    try {
      const response = await fetch(`${API_BASE}/product/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price)
        })
      });
      if (response.ok) {
        fetchProducts();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const saveUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      
      if (response.ok) {
        closeModal();
        alert('Пользователь успешно сохранен');
      } else {
        const errorText = await response.text();
        alert(`Ошибка: ${errorText}`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Ошибка сети при сохранении пользователя');
    }
  };

// Users
const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/all`);
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Delete
const deleteOrder = async (id) => {
  if (!window.confirm("Удалить заказ?")) return;
  try {
    const res = await fetch(`${API_BASE}/order?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchOrders();
  } catch (err) {
    console.error(err);
  }
};

const deleteProduct = async (id) => {
  if (!window.confirm("Удалить продукт?")) return;
  try {
    const res = await fetch(`${API_BASE}/product?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchProducts();
  } catch (err) {
    console.error(err);
  }
};

const deleteUser = async (id) => {
  if (!window.confirm("Удалить пользователя?")) return;
  try {
    const res = await fetch(`${API_BASE}/auth?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchUsers();
  } catch (err) {
    console.error(err);
  }
};

  // Modal functions
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);

    if (item) {
      switch (type) {
        case 'order':
          setOrderForm({ ...item });
          break;
        case 'product':
          setProductForm({ ...item });
          break;
        case 'user':
          setUserForm({ ...item });
          break;
      }
    } else {
      // Reset forms for new items
      setOrderForm({ customerName: '', customerPhone: '', customerEmail: '', items: [] });
      setProductForm({ name: '', price: '' });
      setUserForm({ email: '', password: '', role: 'USER' });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const handleSave = () => {
    switch (modalType) {
      case 'order':
        saveOrder();
        break;
      case 'product':
        saveProduct();
        break;
      case 'user':
        saveUser();
        break;
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
    fetchOrders();
    fetchProducts();
  } else if (activeTab === 'products') {
    fetchProducts();
  } else if (activeTab === 'users') {
    fetchUsers();
  }
  }, [activeTab]);

  // Filter function
  const filterData = (data, type) => {
    if (!searchTerm) return data;
    return data.filter(item => {
      switch (type) {
        case 'orders':
          return item.customerPhone?.includes(searchTerm.toLowerCase());
        case 'products':
          return item.name?.toLowerCase().includes(searchTerm.toLowerCase());
        case 'users':
          return item.email?.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return true;
      }
    });
  };

  const renderOrdersTab = () => {
    const filteredOrders = filterData(orders, 'orders');
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Заказы</h2>
          <button
            onClick={() => openModal('order')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Новый заказ
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Клиент</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">🔎Телефон</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Дата</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Сумма</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.customerPhone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.customerEmail}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ru-RU') : '-'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                        ₽{order.totalPrice?.toFixed(2) ?? '0.00'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                        <button
                            onClick={() => openModal('order', order)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 size={16} />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderProductsTab = () => {
    const filteredProducts = filterData(products, 'products');
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Продукты</h2>
          <button
            onClick={() => openModal('product')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Новый продукт
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <div>
                <button
                  onClick={() => openModal('product', product)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Edit size={16} />
                </button>
                <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                    >
                    <Trash2 size={16} />
                </button>
                </div>

              </div>
              <div className="text-2xl font-bold text-green-600">₽{product.price}</div>
              <div className="text-sm text-gray-500 mt-2">ID: {product.id}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

 const renderUsersTab = () => {
  const filteredUsers = filterData(users, 'users');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Пользователи</h2>
        <button
          onClick={() => openModal('user')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Новый пользователь
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">🔎Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Роль</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => openModal('user', user)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


  const renderModal = () => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {editingItem ? 'Редактировать' : 'Создать'}{' '}
            {modalType === 'order'
              ? 'заказ'
              : modalType === 'product'
              ? 'продукт'
              : 'пользователя'}
          </h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {modalType === 'order' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя клиента
                </label>
                <input
                  type="text"
                  value={orderForm.customerName}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, customerName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={orderForm.customerPhone}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, customerPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={orderForm.customerEmail}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, customerEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* === Товары в заказе === */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Товары
                </label>
                <div className="space-y-3">
                  {orderForm.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const productId = parseInt(e.target.value);
                          const product = products.find((p) => p.id === productId);
                          const newItems = [...orderForm.items];
                          newItems[idx] = {
                            ...newItems[idx],
                            productId,
                            productName: product?.name || '',
                            price: product?.price || 0,
                          };
                          setOrderForm({ ...orderForm, items: newItems });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Выберите продукт</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (₽{p.price})
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...orderForm.items];
                          newItems[idx] = {
                            ...newItems[idx],
                            quantity: parseInt(e.target.value),
                          };
                          setOrderForm({ ...orderForm, items: newItems });
                        }}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                      />

                      <button
                        onClick={() => {
                          const newItems = orderForm.items.filter((_, i) => i !== idx);
                          setOrderForm({ ...orderForm, items: newItems });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setOrderForm({
                      ...orderForm,
                      items: [...orderForm.items, { productId: '', quantity: 1 }],
                    })
                  }
                  className="mt-3 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm"
                >
                  + Добавить продукт
                </button>
              </div>
            </>
          )}

          {modalType === 'product' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </>
          )}

          {modalType === 'user' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Роль
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="USER">Пользователь</option>
                  <option value="ADMIN">Администратор</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
          >
            Сохранить
          </button>
          <button
            onClick={closeModal}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Админ Панель</h1>
        </div>
        
        <nav className="mt-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'orders' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ShoppingCart size={20} />
            Заказы
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'products' ? 'bg-green-50 text-green-600 border-r-2 border-green-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Package size={20} />
            Продукты
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'users' ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users size={20} />
            Пользователи
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'orders' && renderOrdersTab()}
        {activeTab === 'products' && renderProductsTab()}
        {activeTab === 'users' && renderUsersTab()}
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default AdminDashboard;