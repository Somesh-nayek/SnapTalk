import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Room } from './components/room';
import { Code } from './components/code';
import { WebSocketProvider } from './components/ws';

function App() {
   return<BrowserRouter>
   <WebSocketProvider>
   <Routes>
    <Route element={<Code/>} path='/'/>
    <Route element={<Room/>} path='/room'/>
   </Routes>
   </WebSocketProvider>
   </BrowserRouter>
}
export default App;
