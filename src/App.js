import logo from './logo.svg';
import './App.css';
import Test from './components/Test'
import AlbumListPage from './components/AlbumListPage';
import Test2 from './components/Test2';
import AlbumReviewPage from './components/AlbumReviewPage'
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/:id" element={<AlbumListPage/>}/>
      <Route path="/:id/:albumId" element={<AlbumReviewPage/>}/>
      <Route path="/test/:albumName" element={<Test/>}/>
      <Route path="/upload" element={<Test2/>}/>
    </Routes>
  );
}

export default App;
