import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, isAuthenticated, user, logout }) => {
  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} user={user} logout={logout} />
      <Container fluid>
        <Row>
          {isAuthenticated && (
            <Col md={2} className="px-0">
              <Sidebar userRole={user?.role || 'babysitter'} />
            </Col>
          )}
          <Col md={isAuthenticated ? 10 : 12}>
            <div className="content-wrapper">
              {children}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardLayout;
