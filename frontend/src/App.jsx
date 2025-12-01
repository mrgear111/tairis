import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './components/StartPage.jsx';
import Auth from './pages/Auth.jsx';
import GetStarted from './pages/GetStarted.jsx';
import NearbyDoctors from './pages/NearbyDoctors.jsx';
import About from './pages/About.jsx';


import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/nearby-doctors" element={<NearbyDoctors />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </Router>
  );
}

export default App;
