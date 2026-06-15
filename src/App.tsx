import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import { AppDataProvider } from './lib/AppDataContext';

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:suffix" element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}
