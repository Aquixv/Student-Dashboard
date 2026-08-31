import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';

import './App.css';

function App() {
  return (
    <div className="layout-container">
      <Sidebar />
      
      <div className="main-wrapper">
        <Navbar />
        
        <main className="dashboard-content">
          
        </main>
      </div>
    </div>
  );
}

export default App;