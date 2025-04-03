import React, { useState, useEffect } from 'react';
import { childAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, Row, Col, Button, Table, Form, Modal, Alert } from 'react-bootstrap';
import { FaChild, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ChildManagement = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentChild, setCurrentChild] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { hasRole } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    parent: {
      name: '',
      phoneNumber: '',
      email: ''
    },
    specialCareNeeds: {
      allergies: '',
      medicalConditions: '',
      dietaryRestrictions: '',
      other: ''
    },
    sessionType: 'full-day'
  });
  
  // Load children on component mount
  useEffect(() => {
    fetchChildren();
  }, []);
  
  // Fetch children from API
  const fetchChildren = async () => {
    setLoading(true);
    try {
      const data = await childAPI.getAllChildren();
      setChildren(data);
    } catch (err) {
      setError('Failed to load children. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = (child = null) => {
    if (child) {
      // Edit mode
      setFormData({
        fullName: child.fullName,
        age: child.age,
        parent: {
          name: child.parent.name,
          phoneNumber: child.parent.phoneNumber,
          email: child.parent.email || ''
        },
        specialCareNeeds: {
          allergies: child.specialCareNeeds.allergies || '',
          medicalConditions: child.specialCareNeeds.medicalConditions || '',
          dietaryRestrictions: child.specialCareNeeds.dietaryRestrictions || '',
          other: child.specialCareNeeds.other || ''
        },
        sessionType: child.sessionType
      });
      setCurrentChild(child);
    } else {
      // Add mode
      setFormData({
        fullName: '',
        age: '',
        parent: {
          name: '',
          phoneNumber: '',
          email: ''
        },
        specialCareNeeds: {
          allergies: '',
          medicalConditions: '',
          dietaryRestrictions: '',
          other: ''
        },
        sessionType: 'full-day'
      });
      setCurrentChild(null);
    }
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };
  
  const handleChange = e => {
    const { name, value } = e.target;
    
    if (name.includes('parent.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        parent: {
          ...formData.parent,
          [field]: value
        }
      });
    } else if (name.includes('specialCareNeeds.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        specialCareNeeds: {
          ...formData.specialCareNeeds,
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
      if (currentChild) {
        // Update existing child
        await childAPI.updateChild(currentChild._id, formData);
      } else {
        // Create new child
        await childAPI.createChild(formData);
      }
      
      // Refresh child list
      fetchChildren();
      handleCloseModal();
    } catch (err) {
      setError(err.msg || 'An error occurred. Please try again.');
      console.error(err);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this child record?')) {
      try {
        await childAPI.deleteChild(id);
        // Refresh child list
        fetchChildren();
      } catch (err) {
        setError(err.msg || 'Failed to delete child record. Please try again.');
        console.error(err);
      }
    }
  };
  
  // Filter children based on search term
  const filteredChildren = children.filter(child => 
    child.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.parent.phoneNumber.includes(searchTerm) ||
    (child.parent.email && child.parent.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <h5 className="mb-0">Child Management</h5>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => handleOpenModal()}
                className="d-flex align-items-center"
              >
                <FaPlus className="me-1" /> Add Child
              </Button>
            </Col>
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
                    placeholder="Search children..."
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
                  <th>Age</th>
                  <th>Parent/Guardian</th>
                  <th>Contact</th>
                  <th>Session Type</th>
                  <th>Special Care Needs</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChildren.length > 0 ? (
                  filteredChildren.map(child => (
                    <tr key={child._id}>
                      <td>{child.fullName}</td>
                      <td>{child.age}</td>
                      <td>{child.parent.name}</td>
                      <td>
                        {child.parent.phoneNumber}
                        {child.parent.email && <div><small>{child.parent.email}</small></div>}
                      </td>
                      <td>
                        <span className={`badge ${child.sessionType === 'full-day' ? 'bg-primary' : 'bg-secondary'}`}>
                          {child.sessionType === 'full-day' ? 'Full Day' : 'Half Day'}
                        </span>
                      </td>
                      <td>
                        {child.specialCareNeeds.allergies !== 'None' && 
                          <div><small><strong>Allergies:</strong> {child.specialCareNeeds.allergies}</small></div>}
                        {child.specialCareNeeds.medicalConditions !== 'None' && 
                          <div><small><strong>Medical:</strong> {child.specialCareNeeds.medicalConditions}</small></div>}
                        {child.specialCareNeeds.dietaryRestrictions !== 'None' && 
                          <div><small><strong>Dietary:</strong> {child.specialCareNeeds.dietaryRestrictions}</small></div>}
                        {child.specialCareNeeds.other !== 'None' && 
                          <div><small><strong>Other:</strong> {child.specialCareNeeds.other}</small></div>}
                        {(child.specialCareNeeds.allergies === 'None' && 
                          child.specialCareNeeds.medicalConditions === 'None' && 
                          child.specialCareNeeds.dietaryRestrictions === 'None' && 
                          child.specialCareNeeds.other === 'None') && 
                          <span>None</span>}
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleOpenModal(child)}
                          className="me-1"
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDelete(child._id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No children found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {/* Add/Edit Child Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentChild ? 'Edit Child Record' : 'Add New Child'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="12"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <h6 className="mt-4 mb-3">Parent/Guardian Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="parent.name"
                    value={formData.parent.name}
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
                    name="parent.phoneNumber"
                    value={formData.parent.phoneNumber}
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
                    name="parent.email"
                    value={formData.parent.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>
            
            <h6 className="mt-4 mb-3">Special Care Needs</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Allergies</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialCareNeeds.allergies"
                    value={formData.specialCareNeeds.allergies}
                    onChange={handleChange}
                    placeholder="If any"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Medical Conditions</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialCareNeeds.medicalConditions"
                    value={formData.specialCareNeeds.medicalConditions}
                    onChange={handleChange}
                    placeholder="If any"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dietary Restrictions</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialCareNeeds.dietaryRestrictions"
                    value={formData.specialCareNeeds.dietaryRestrictions}
                    onChange={handleChange}
                    placeholder="If any"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Other Special Needs</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialCareNeeds.other"
                    value={formData.specialCareNeeds.other}
                    onChange={handleChange}
                    placeholder="If any"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentChild ? 'Update Child Record' : 'Add Child'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChildManagement;
