import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Week from './components/Week';
//import './App.css';
import './App.scss';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Week />} />
      </Routes>
    </Router>
  );
}
