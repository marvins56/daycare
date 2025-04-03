import React, { useState, useEffect } from 'react';
import { attendanceAPI, childAPI, babysitterAPI } from '../../services/api';
import { Card, Row, Col, Button, Table, Form, Modal, Alert } from 'react-bootstrap';
import { FaCalendarCheck, FaSearch, FaPlus, FaSignOutAlt } from 'react-icons/fa';

const AttendanceTracking = () => {
  const [attendance, setAttendance] = useState([]);
  const [children, setChildren] = useState([]);
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Form state
  const [formData, setFormData] = useState({
    child: '',
    babysitter: '',
    date: new Date().toISOString().split('T')[0],
    sessionType: 'full-day',
    checkInTime: new Date().toTimeString().slice(0, 5),
    notes: ''
  });
  
  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [currentDate]);
  
  // Fetch all necessary data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [attendanceData, childrenData, babysittersData] = await Promise.all([
        attendanceAPI.getAllAttendance(currentDate),
        childAPI.getAllChildren(),
        babysitterAPI.getAllBabysitters()
      ]);
      
      setAttendance(attendanceData);
      setChildren(childrenData);
      setBabysitters(babysittersData);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = () => {
    setFormData({
      child: '',
      babysitter: '',
      date: currentDate,
      sessionType: 'full-day',
      checkInTime: new Date().toTimeString().slice(0, 5),
      notes: ''
    });
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (!formData.child || !formData.babysitter) {
      setError('Please select both child and babysitter');
      return;
    }
    
    try {
      await attendanceAPI.createAttendance(formData);
      fetchData(); // Refresh attendance list
      handleCloseModal();
    } catch (err) {
      setError(err.msg || 'An error occurred. Please try again.');
      console.error(err);
    }
  };
  
  const handleCheckout = async (id) => {
    try {
      const checkoutData = {
        checkOutTime: new Date().toTimeString().slice(0, 5)
      };
      
      await attendanceAPI.checkoutAttendance(id, checkoutData);
      fetchData(); // Refresh attendance list
    } catch (err) {
      setError(err.msg || 'Failed to check out. Please try again.');
      console.error(err);
    }
  };
  
  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };
  
  // Filter attendance records based on search term
  const filteredAttendance = attendance.filter(record => 
    (record.child && record.child.fullName && record.child.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (record.babysitter && 
      `${record.babysitter.firstName} ${record.babysitter.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
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
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Attendance Tracking</h5>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleOpenModal}
                className="d-flex align-items-center"
              >
                <FaPlus className="me-1" /> Check In
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={currentDate}
                  onChange={handleDateChange}
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search by child or babysitter name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          
          <div className="table-responsive">
            <Table hover bordered>
              <thead>
                <tr>
                  <th>Child</th>
                  <th>Babysitter</th>
                  <th>Session Type</th>
                  <th>Check-In Time</th>
                  <th>Check-Out Time</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map(record => (
                    <tr key={record._id}>
                      <td>{record.child ? record.child.fullName : 'Unknown'}</td>
                      <td>
                        {record.babysitter 
                          ? `${record.babysitter.firstName} ${record.babysitter.lastName}` 
                          : 'Unknown'}
                      </td>
                      <td>
                        <span className={`badge ${record.sessionType === 'full-day' ? 'bg-primary' : 'bg-secondary'}`}>
                          {record.sessionType === 'full-day' ? 'Full Day' : 'Half Day'}
                        </span>
                      </td>
                      <td>{record.checkInTime}</td>
                      <td>{record.checkOutTime || '-'}</td>
                      <td>
                        <span className={`badge ${record.status === 'checked-in' ? 'bg-success' : 'bg-secondary'}`}>
                          {record.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                        </span>
                      </td>
                      <td>{record.notes || '-'}</td>
                      <td>
                        {record.status === 'checked-in' && (
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => handleCheckout(record._id)}
                          >
                            <FaSignOutAlt className="me-1" /> Check Out
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No attendance records found for this date</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {/* Check In Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Check In Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="required-field">Child</Form.Label>
              <Form.Select
                name="child"
                value={formData.child}
                onChange={handleChange}
                required
              >
                <option value="">Select Child</option>
                {children.map(child => (
                  <option key={child._id} value={child._id}>
                    {child.fullName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="required-field">Babysitter</Form.Label>
              <Form.Select
                name="babysitter"
                value={formData.babysitter}
                onChange={handleChange}
                required
              >
                <option value="">Select Babysitter</option>
                {babysitters.map(babysitter => (
                  <option key={babysitter._id} value={babysitter._id}>
                    {`${babysitter.firstName} ${babysitter.lastName}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Check-In Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label className="required-field">Session Type</Form.Label>
              <Form.Select
                name="sessionType"
                value={formData.sessionType}
                onChange={handleChange}
                required
              >
                <option value="full-day">Full Day</option>
                <option value="half-day">Half Day</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions for today"
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Check In
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AttendanceTracking;
