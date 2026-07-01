import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Board from '@/components/Board';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6">
      <Board />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
