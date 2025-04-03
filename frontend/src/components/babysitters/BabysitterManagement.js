import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { babysitterAPI } from '../../services/api';
import { Card, Row, Col, Button, Table, Form, Modal, Alert } from 'react-bootstrap';
import { FaUserFriends, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const BabysitterManagement = () => {
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentBabysitter, setCurrentBabysitter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { hasRole } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nationalId: '',
    dateOfBirth: '',
    nextOfKin: {
      name: '',
      phoneNumber: ''
    }
  });
  
  // Load babysitters on component mount
  useEffect(() => {
    fetchBabysitters();
  }, []);
  
  // Fetch babysitters from API
  const fetchBabysitters = async () => {
    setLoading(true);
    try {
      const data = await babysitterAPI.getAllBabysitters();
      setBabysitters(data);
    } catch (err) {
      setError('Failed to load babysitters. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = (babysitter = null) => {
    if (babysitter) {
      // Edit mode
      setFormData({
        firstName: babysitter.firstName,
        lastName: babysitter.lastName,
        email: babysitter.email || '',
        phoneNumber: babysitter.phoneNumber,
        nationalId: babysitter.nationalId,
        dateOfBirth: new Date(babysitter.dateOfBirth).toISOString().split('T')[0],
        nextOfKin: {
          name: babysitter.nextOfKin.name,
          phoneNumber: babysitter.nextOfKin.phoneNumber
        }
      });
      setCurrentBabysitter(babysitter);
    } else {
      // Add mode
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        nationalId: '',
        dateOfBirth: '',
        nextOfKin: {
          name: '',
          phoneNumber: ''
        }
      });
      setCurrentBabysitter(null);
    }
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };
  
  const handleChange = e => {
    const { name, value } = e.target;
    
    if (name.includes('nextOfKin.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        nextOfKin: {
          ...formData.nextOfKin,
          [field]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    try {
      if (currentBabysitter) {
        // Update existing babysitter
        await babysitterAPI.updateBabysitter(currentBabysitter._id, formData);
      } else {
        // Create new babysitter
        await babysitterAPI.createBabysitter(formData);
      }
      
      // Refresh babysitter list
      fetchBabysitters();
      handleCloseModal();
    } catch (err) {
      setError(err.msg || 'An error occurred. Please try again.');
      console.error(err);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this babysitter?')) {
      try {
        await babysitterAPI.deleteBabysitter(id);
        // Refresh babysitter list
        fetchBabysitters();
      } catch (err) {
        setError(err.msg || 'Failed to delete babysitter. Please try again.');
        console.error(err);
      }
    }
  };
  
  // Filter babysitters based on search term
  const filteredBabysitters = babysitters.filter(babysitter => 
    babysitter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    babysitter.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    babysitter.phoneNumber.includes(searchTerm) ||
    (babysitter.email && babysitter.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <h5 className="mb-0">Babysitter Management</h5>
            </Col>
            {hasRole('manager') && (
              <Col xs="auto">
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => handleOpenModal()}
                  className="d-flex align-items-center"
                >
                  <FaPlus className="me-1" /> Add Babysitter
                </Button>
              </Col>
            )}
          </Row>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form className="mb-4">
            <Form.Group as={Row}>
              <Col md={6} className="mx-auto">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search babysitters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Col>
            </Form.Group>
          </Form>
          
          <div className="table-responsive">
            <Table hover bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>National ID</th>
                  <th>Date of Birth</th>
                  <th>Next of Kin</th>
                  {hasRole('manager') && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBabysitters.length > 0 ? (
                  filteredBabysitters.map(babysitter => (
                    <tr key={babysitter._id}>
                      <td>{`${babysitter.firstName} ${babysitter.lastName}`}</td>
                      <td>{babysitter.phoneNumber}</td>
                      <td>{babysitter.email || '-'}</td>
                      <td>{babysitter.nationalId}</td>
                      <td>{new Date(babysitter.dateOfBirth).toLocaleDateString()}</td>
                      <td>{`${babysitter.nextOfKin.name} (${babysitter.nextOfKin.phoneNumber})`}</td>
                      {hasRole('manager') && (
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => handleOpenModal(babysitter)}
                            className="me-1"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(babysitter._id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={hasRole('manager') ? 7 : 6} className="text-center">No babysitters found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {/* Add/Edit Babysitter Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentBabysitter ? 'Edit Babysitter' : 'Add New Babysitter'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                  <Form.Text className="text-muted">
                    Email is required if you want to create a user account for this babysitter.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">National ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Babysitter must be between 21 and 35 years old.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <h6 className="mt-4 mb-3">Next of Kin Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="nextOfKin.name"
                    value={formData.nextOfKin.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="nextOfKin.phoneNumber"
                    value={formData.nextOfKin.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentBabysitter ? 'Update Babysitter' : 'Add Babysitter'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BabysitterManagement;
