import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import HealthTips from "./components/HealthTips"; 

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/health-tips" element={<HealthTips />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
