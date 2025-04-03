import React, { useState, useEffect } from 'react';
import { incidentAPI, childAPI, babysitterAPI } from '../../services/api';
import { Card, Row, Col, Button, Table, Form, Modal, Alert } from 'react-bootstrap';
import { FaExclamationTriangle, FaSearch, FaEdit } from 'react-icons/fa';

const IncidentReporting = () => {
  const [incidents, setIncidents] = useState([]);
  const [children, setChildren] = useState([]);
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    child: '',
    reportedBy: '',
    date: new Date().toISOString().split('T')[0],
    incidentType: 'health',
    description: '',
    severity: 'low',
    actionTaken: '',
    parentNotified: false,
    followUpRequired: false,
    followUpNotes: ''
  });
  
  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Fetch all necessary data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [incidentsData, childrenData, babysittersData] = await Promise.all([
        incidentAPI.getAllIncidents(),
        childAPI.getAllChildren(),
        babysitterAPI.getAllBabysitters()
      ]);
      
      setIncidents(incidentsData);
      setChildren(childrenData);
      setBabysitters(babysittersData);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = (incident = null) => {
    if (incident) {
      // Edit mode
      setFormData({
        child: incident.child._id,
        reportedBy: incident.reportedBy._id,
        date: new Date(incident.date).toISOString().split('T')[0],
        incidentType: incident.incidentType,
        description: incident.description,
        severity: incident.severity,
        actionTaken: incident.actionTaken,
        parentNotified: incident.parentNotified,
        followUpRequired: incident.followUpRequired,
        followUpNotes: incident.followUpNotes || ''
      });
      setCurrentIncident(incident);
    } else {
      // Add mode
      setFormData({
        child: '',
        reportedBy: '',
        date: new Date().toISOString().split('T')[0],
        incidentType: 'health',
        description: '',
        severity: 'low',
        actionTaken: '',
        parentNotified: false,
        followUpRequired: false,
        followUpNotes: ''
      });
      setCurrentIncident(null);
    }
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };
  
  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (!formData.child || !formData.reportedBy) {
      setError('Please select both child and babysitter');
      return;
    }
    
    if (!formData.description || !formData.actionTaken) {
      setError('Please provide both incident description and action taken');
      return;
    }
    
    try {
      if (currentIncident) {
        // Update existing incident
        await incidentAPI.updateIncident(currentIncident._id, formData);
      } else {
        // Create new incident
        await incidentAPI.createIncident(formData);
      }
      
      // Refresh incident list
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError(err.msg || 'An error occurred. Please try again.');
      console.error(err);
    }
  };
  
  const handleResolve = async (id) => {
    try {
      await incidentAPI.resolveIncident(id);
      // Refresh incident list
      fetchData();
    } catch (err) {
      setError(err.msg || 'Failed to resolve incident. Please try again.');
      console.error(err);
    }
  };
  
  // Filter incidents based on search term
  const filteredIncidents = incidents.filter(incident => 
    (incident.child && incident.child.fullName && incident.child.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.incidentType.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h5 className="mb-0">Incident Reporting</h5>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => handleOpenModal()}
                className="d-flex align-items-center"
              >
                <FaExclamationTriangle className="me-1" /> Report Incident
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
                    placeholder="Search incidents..."
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
                  <th>Date</th>
                  <th>Child</th>
                  <th>Reported By</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Description</th>
                  <th>Parent Notified</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map(incident => (
                    <tr key={incident._id}>
                      <td>{new Date(incident.date).toLocaleDateString()}</td>
                      <td>{incident.child ? incident.child.fullName : 'Unknown'}</td>
                      <td>
                        {incident.reportedBy 
                          ? `${incident.reportedBy.firstName} ${incident.reportedBy.lastName}` 
                          : 'Unknown'}
                      </td>
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
                      <td>{incident.description.length > 50 ? incident.description.substring(0, 50) + '...' : incident.description}</td>
                      <td>
                        {incident.parentNotified ? (
                          <span className="text-success">Yes</span>
                        ) : (
                          <span className="text-danger">No</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${incident.status === 'open' ? 'bg-warning' : 'bg-success'}`}>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleOpenModal(incident)}
                          className="me-1"
                        >
                          <FaEdit />
                        </Button>
                        {incident.status === 'open' && (
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            onClick={() => handleResolve(incident._id)}
                          >
                            Resolve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">No incidents found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {/* Report Incident Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentIncident ? 'Edit Incident Report' : 'Report New Incident'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Reported By</Form.Label>
                  <Form.Select
                    name="reportedBy"
                    value={formData.reportedBy}
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
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
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
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Incident Type</Form.Label>
                  <Form.Select
                    name="incidentType"
                    value={formData.incidentType}
                    onChange={handleChange}
                    required
                  >
                    <option value="health">Health</option>
                    <option value="behavior">Behavior</option>
                    <option value="accident">Accident</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Severity</Form.Label>
                  <Form.Select
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label className="required-field">Incident Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what happened in detail"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="required-field">Action Taken</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="actionTaken"
                value={formData.actionTaken}
                onChange={handleChange}
                placeholder="Describe what actions were taken to address the incident"
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Parent/Guardian Notified"
                    name="parentNotified"
                    checked={formData.parentNotified}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Follow-up Required"
                    name="followUpRequired"
                    checked={formData.followUpRequired}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {formData.followUpRequired && (
              <Form.Group className="mb-3">
                <Form.Label>Follow-up Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="followUpNotes"
                  value={formData.followUpNotes}
                  onChange={handleChange}
                  placeholder="Describe any follow-up actions needed"
                />
              </Form.Group>
            )}
            
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentIncident ? 'Update Report' : 'Submit Report'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default IncidentReporting;
