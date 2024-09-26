import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import GalleryPage from './components/GalleryPage';
import ImageView from './components/ImageView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/gallery' element={<GalleryPage />} />
        <Route path="/view/:imageUrl" element={<ImageView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
