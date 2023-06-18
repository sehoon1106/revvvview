import logo from './logo.svg';
import './App.css';
import Test from './components/Test'
import AlbumListPage from './components/AlbumListPage';
import Test2 from './components/Test2';
import Test3 from './components/Test3';
import AlbumReviewPage from './components/AlbumReviewPage'
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Test4 from './components/Test4';

import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import BackgroundParticles from './components/BackgroundParticles';

function App() {
  return (
    <>
    <ReactNotifications style={{zIndex:"10001"}} />
    <Routes>
      <Route path="/" element={<Login></Login>}></Route>
      <Route path="/:id" element={<AlbumListPage/>}/>
      <Route path="/:id/:albumId" element={<AlbumReviewPage/>}/>
      <Route path="/test/:albumName" element={<Test/>}/>
      <Route path="/test3" element={<Test3/>}/>
      <Route path="/test4" element={<Test4/>}/>
      <Route path="/test5" element={<BackgroundParticles/>}/>
      <Route path="/upload" element={<Test2/>}/>
    </Routes>
    </>
  );
}

export default App;
