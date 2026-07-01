import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TicTacToe from '@/pages/TicTacToe';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicTacToe />} />
      </Routes>
    </BrowserRouter>
  );
}
