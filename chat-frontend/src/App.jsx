import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, } from "react";
import './App.css'
import NotFound from './pages/NotFound/NotFound'
import Index from './pages/main/index.jsx'
import Login from './pages/login/login.jsx';
import Register from './pages/register/register.jsx';
import Chat from './pages/chat/chat.jsx';

function App() {



  const [profileData, setProfileData] = useState(null);


  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="*" element={<NotFound />}></Route> {/* 404 */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login setProfileData={setProfileData} />} />
            <Route path="/registration" element={<Register />} />
            <Route path="/chat" element={<Chat profileData={profileData} setProfileData={setProfileData}/>} />
          </Routes>

        </div>
      </Router>
    </>
  )
}

export default App
