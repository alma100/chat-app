import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, } from "react";
import './App.css'
import NotFound from './pages/NotFound/NotFound'
import Index from './pages/main/index.jsx'
import Login from './pages/login/login.jsx';
import { UserDataContext } from './context/userDataContext.jsx';
import ChatStateWrapper from './pages/chat/ChatStateWrapper/ChatStateWrapper.jsx';
import RegisterStateWrapper from './pages/register/registerStateWrapper/registerStateWrapper.jsx';

function App() {



  const [profileData, setProfileData] = useState(null);


  return (
    <>
      <UserDataContext.Provider value={{profileData, setProfileData}}>
        <Router>
          <div className="App">
            <Routes>
              <Route exact path="*" element={<NotFound />}></Route> {/* 404 */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/registration" element={<RegisterStateWrapper />} />
              <Route path="/chat" element={<ChatStateWrapper />} />
            </Routes>

          </div>
        </Router>
      </UserDataContext.Provider>
    </>
  )
}

export default App
