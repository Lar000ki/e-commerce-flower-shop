import { Routes, Route } from 'react-router-dom';
import Home from './pages/Main';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App;
