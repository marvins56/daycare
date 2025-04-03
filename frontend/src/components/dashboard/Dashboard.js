import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table } from 'react-bootstrap';
import { 
  FaUserFriends, 
  FaChild, 
  FaMoneyBillWave, 
  FaCalendarCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import { babysitterAPI, childAPI, attendanceAPI, incidentAPI, paymentAPI, expenseAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    babysitterCount: 0,
    childrenCount: 0,
    attendanceToday: 0,
    incidentsOpen: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0
  });
  
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Get current month first and last day for financial data
        const currentDate = new Date();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
          .toISOString().split('T')[0];
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          .toISOString().split('T')[0];
        
        // Fetch all data in parallel
        const [babysitters, children, todayAttendance, openIncidents, recentIncidents, payments, expenses] = await Promise.all([
          babysitterAPI.getAllBabysitters(),
          childAPI.getAllChildren(),
          attendanceAPI.getAllAttendance(today),
          incidentAPI.getAllIncidents('open'),
          incidentAPI.getAllIncidents(), // Get all incidents, will filter for recent ones
          paymentAPI.getAllPayments({ startDate: firstDay, endDate: lastDay }),
          expenseAPI.getAllExpenses({ startDate: firstDay, endDate: lastDay })
        ]);
        
        // Calculate monthly income (sum of payments)
        const monthlyIncome = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
        
        // Calculate monthly expenses (sum of expenses)
        const monthlyExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Set statistics
        setStats({
          babysitterCount: babysitters.length,
          childrenCount: children.length,
          attendanceToday: todayAttendance.length,
          incidentsOpen: openIncidents.length,
          monthlyIncome,
          monthlyExpenses
        });
        
        // Set recent attendance (today's records)
        setRecentAttendance(todayAttendance);
        
        // Set recent incidents (latest 5)
        const sortedIncidents = recentIncidents.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        ).slice(0, 5);
        
        setRecentIncidents(sortedIncidents);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <h4 className="mb-4">Dashboard</h4>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="dashboard-card dashboard-card-primary h-100">
            <Card.Body>
              <Row>
                <Col>
                  <h6 className="text-primary">Babysitters</h6>
                  <h4>{stats.babysitterCount}</h4>
                </Col>
                <Col xs="auto">
                  <div className="dashboard-card-icon">
                    <FaUserFriends />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="dashboard-card dashboard-card-success h-100">
            <Card.Body>
              <Row>
                <Col>
                  <h6 className="text-success">Children</h6>
                  <h4>{stats.childrenCount}</h4>
                </Col>
                <Col xs="auto">
                  <div className="dashboard-card-icon">
                    <FaChild />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="dashboard-card dashboard-card-warning h-100">
            <Card.Body>
              <Row>
                <Col>
                  <h6 className="text-warning">Today's Attendance</h6>
                  <h4>{stats.attendanceToday}</h4>
                </Col>
                <Col xs="auto">
                  <div className="dashboard-card-icon">
                    <FaCalendarCheck />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="dashboard-card dashboard-card-danger h-100">
            <Card.Body>
              <Row>
                <Col>
                  <h6 className="text-danger">Open Incidents</h6>
                  <h4>{stats.incidentsOpen}</h4>
                </Col>
                <Col xs="auto">
                  <div className="dashboard-card-icon">
                    <FaExclamationTriangle />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="dashboard-card dashboard-card-primary h-100">
            <Card.Body>
              <Row>
                <Col>
                  <h6 className="text-primary">Monthly Income</h6>
                  <h4>UGX {(stats.monthlyIncome / 100).toLocaleString()}</h4>
                </Col>
                <Col xs="auto">
                  <div className="dashboard-card-icon">
                    <FaMoneyBillWave />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="dashboard-card dashboard-card-danger h-100">
            <Card.Body>
              <Row>
                <Col>
                  <h6 className="text-danger">Monthly Expenses</h6>
                  <h4>UGX {(stats.monthlyExpenses / 100).toLocaleString()}</h4>
                </Col>
                <Col xs="auto">
                  <div className="dashboard-card-icon">
                    <FaMoneyBillWave />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Activity */}
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Today's Attendance</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Child</th>
                      <th>Babysitter</th>
                      <th>Check-In</th>
                      <th>Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttendance.length > 0 ? (
                      recentAttendance.map(record => (
                        <tr key={record._id}>
                          <td>{record.child.fullName}</td>
                          <td>{`${record.babysitter.firstName} ${record.babysitter.lastName}`}</td>
                          <td>{new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                          <td>
                            <span className={`badge ${record.sessionType === 'full-day' ? 'bg-primary' : 'bg-secondary'}`}>
                              {record.sessionType === 'full-day' ? 'Full Day' : 'Half Day'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No attendance records for today</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="text-end mt-3">
                <Button variant="outline-primary" size="sm" href="/attendance">
                  View All
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">Recent Incidents</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Child</th>
                      <th>Type</th>
                      <th>Severity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentIncidents.length > 0 ? (
                      recentIncidents.map(incident => (
                        <tr key={incident._id}>
                          <td>{new Date(incident.date).toLocaleDateString()}</td>
                          <td>{incident.child.fullName}</td>
                          <td>
                            <span className={`badge ${
                              incident.incidentType === 'health' ? 'bg-danger' : 
                              incident.incidentType === 'behavior' ? 'bg-warning' : 
                              incident.incidentType === 'accident' ? 'bg-info' : 'bg-secondary'
                            }`}>
                              {incident.incidentType.charAt(0).toUpperCase() + incident.incidentType.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              incident.severity === 'high' ? 'bg-danger' : 
                              incident.severity === 'medium' ? 'bg-warning' : 'bg-info'
                            }`}>
                              {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${incident.status === 'open' ? 'bg-warning' : 'bg-success'}`}>
                              {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No recent incidents</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="text-end mt-3">
                <Button variant="outline-primary" size="sm" href="/incidents">
                  View All
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;