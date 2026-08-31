import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';

import './App.css';
import Home from './Home';

function App() {
  return (
    <div className="layout-container">
      <Sidebar />
      
      <div className="main-wrapper">
        <Navbar />
        
        <main className="dashboard-content">
          <Home></Home>
        </main>
      </div>
    </div>
  );
}

export default App;