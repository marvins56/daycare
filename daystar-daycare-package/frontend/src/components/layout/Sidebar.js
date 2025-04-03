import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUserFriends, 
  FaChild, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCog
} from 'react-icons/fa';

const Sidebar = ({ userRole }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-heading">Main Navigation</div>
      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/dashboard" 
          className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <FaHome className="sidebar-icon" /> Dashboard
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/babysitters" 
          className={`sidebar-link ${isActive('/babysitters') ? 'active' : ''}`}
        >
          <FaUserFriends className="sidebar-icon" /> Babysitters
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/children" 
          className={`sidebar-link ${isActive('/children') ? 'active' : ''}`}
        >
          <FaChild className="sidebar-icon" /> Children
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/attendance" 
          className={`sidebar-link ${isActive('/attendance') ? 'active' : ''}`}
        >
          <FaCalendarAlt className="sidebar-icon" /> Attendance
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/incidents" 
          className={`sidebar-link ${isActive('/incidents') ? 'active' : ''}`}
        >
          <FaExclamationTriangle className="sidebar-icon" /> Incidents
        </Nav.Link>
        
        {userRole === 'manager' && (
          <>
            <div className="sidebar-heading mt-3">Management</div>
            <Nav.Link 
              as={Link} 
              to="/finances" 
              className={`sidebar-link ${isActive('/finances') ? 'active' : ''}`}
            >
              <FaMoneyBillWave className="sidebar-icon" /> Finances
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/settings" 
              className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}
            >
              <FaCog className="sidebar-icon" /> Settings
            </Nav.Link>
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
