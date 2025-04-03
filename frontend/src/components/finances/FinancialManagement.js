import React, { useState, useEffect } from "react";
import { expenseAPI, paymentAPI, babysitterAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Form,
  Modal,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  FaMoneyBillWave,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChartBar,
} from "react-icons/fa";

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState("income");
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [expenseRecords, setExpenseRecords] = useState([]);
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { hasRole } = useAuth();

  // Income form state
  const [incomeFormData, setIncomeFormData] = useState({
    source: "parent_payment",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentType: "cash",
    notes: "",
    babysitterId: "",
    childrenCountHalfDay: 0,
    childrenCountFullDay: 1,
  });

  // Expense form state
  const [expenseFormData, setExpenseFormData] = useState({
    category: "salary",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    babysitterId: "",
    notes: "",
  });

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all necessary data
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Get current date for filtering
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      const dateRange = {
        startDate: firstDayOfMonth.toISOString().split("T")[0],
        endDate: lastDayOfMonth.toISOString().split("T")[0],
      };

      // Fetch data in parallel
      const [paymentsData, expensesData, expenseSummaryData, babysittersData] =
        await Promise.all([
          paymentAPI.getAllPayments(),
          expenseAPI.getAllExpenses(),
          expenseAPI.getExpenseSummary(dateRange),
          babysitterAPI.getAllBabysitters(),
        ]);

      setIncomeRecords(paymentsData);
      setExpenseRecords(expensesData);
      setExpenseSummary(expenseSummaryData.summary);
      setTotalIncome(
        paymentsData.reduce((sum, record) => sum + record.totalAmount, 0)
      );
      setTotalExpenses(
        expensesData.reduce((sum, record) => sum + record.amount, 0)
      );
      setBabysitters(babysittersData);
    } catch (err) {
      console.error("Error fetching financial data:", err);
      setError(
        "Failed to load financial data: " +
          (err.msg || err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  // Income modal handlers
  const handleOpenIncomeModal = (income = null) => {
    if (income) {
      // Edit mode
      setIncomeFormData({
        source: income.source || "parent_payment",
        description: income.description,
        amount: (income.totalAmount / 100).toString(), // Convert to display format
        date: new Date(income.date).toISOString().split("T")[0],
        paymentType: income.paymentType || "cash",
        notes: income.notes || "",
      });
      setCurrentIncome(income);
    } else {
      // Add mode
      setIncomeFormData({
        source: "parent_payment",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        paymentType: "cash",
        notes: "",
      });
      setCurrentIncome(null);
    }
    setShowIncomeModal(true);
  };

  const handleCloseIncomeModal = () => {
    setShowIncomeModal(false);
    setError("");
  };

  const handleIncomeChange = (e) => {
    setIncomeFormData({ ...incomeFormData, [e.target.name]: e.target.value });
  };
  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate amount
    const amount = parseFloat(incomeFormData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      // Prepare payment data according to what the API expects
      const paymentData = {
        babysitter: incomeFormData.babysitterId || babysitters[0]?._id, // First babysitter as default or add selection to form
        date: incomeFormData.date,
        childrenCount: {
          halfDay: incomeFormData.childrenCountHalfDay || 0,
          fullDay: incomeFormData.childrenCountFullDay || 0,
        },
        amountPerChild: {
          halfDay: 2000, // Default value or add to form
          fullDay: 5000, // Default value or add to form
        },
        notes: incomeFormData.notes || "",
        description: incomeFormData.description, // You might need to store this in notes
      };

      if (currentIncome) {
        // Update existing income
        await paymentAPI.updatePayment(currentIncome._id, paymentData);
      } else {
        // Add new income
        await paymentAPI.createPayment(paymentData);
      }

      // Refresh data
      fetchData();
      handleCloseIncomeModal();
    } catch (err) {
      setError(err.msg || "An error occurred. Please try again.");
      console.error(err);
    }
  };
  // const handleIncomeSubmit = async e => {
  //   e.preventDefault();
  //   setError('');

  //   // Validate amount
  //   const amount = parseFloat(incomeFormData.amount);
  //   if (isNaN(amount) || amount <= 0) {
  //     setError('Please enter a valid amount');
  //     return;
  //   }

  //   try {
  //     const paymentData = {
  //       ...incomeFormData,
  //       amount: Math.round(amount * 100) // Convert to cents for API
  //     };

  //     if (currentIncome) {
  //       // Update existing income
  //       await paymentAPI.updatePayment(currentIncome._id, paymentData);
  //     } else {
  //       // Add new income
  //       await paymentAPI.createPayment(paymentData);
  //     }

  //     // Refresh data
  //     fetchData();
  //     handleCloseIncomeModal();
  //   } catch (err) {
  //     setError(err.msg || 'An error occurred. Please try again.');
  //     console.error(err);
  //   }
  // };

  // Expense modal handlers
  const handleOpenExpenseModal = (expense = null) => {
    if (expense) {
      // Edit mode
      setExpenseFormData({
        category: expense.category,
        description: expense.description,
        amount: (expense.amount / 100).toString(), // Convert to display format
        date: new Date(expense.date).toISOString().split("T")[0],
        babysitterId: expense.babysitter ? expense.babysitter._id : "",
        notes: expense.notes || "",
      });
      setCurrentExpense(expense);
    } else {
      // Add mode
      setExpenseFormData({
        category: "salary",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        babysitterId: "",
        notes: "",
      });
      setCurrentExpense(null);
    }
    setShowExpenseModal(true);
  };

  const handleCloseExpenseModal = () => {
    setShowExpenseModal(false);
    setError("");
  };

  const handleExpenseChange = (e) => {
    setExpenseFormData({ ...expenseFormData, [e.target.name]: e.target.value });
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate amount
    const amount = parseFloat(expenseFormData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      const expenseData = {
        ...expenseFormData,
        amount: Math.round(amount * 100), // Convert to cents for API
      };

      if (currentExpense) {
        // Update existing expense
        await expenseAPI.updateExpense(currentExpense._id, expenseData);
      } else {
        // Add new expense
        await expenseAPI.createExpense(expenseData);
      }

      // Refresh data
      fetchData();
      handleCloseExpenseModal();
    } catch (err) {
      setError(err.msg || "An error occurred. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm("Are you sure you want to delete this income record?")) {
      try {
        await paymentAPI.deletePayment(id);
        // Refresh data
        fetchData();
      } catch (err) {
        setError(
          err.msg || "Failed to delete income record. Please try again."
        );
        console.error(err);
      }
    }
  };

  const handleDeleteExpense = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this expense record?")
    ) {
      try {
        await expenseAPI.deleteExpense(id);
        // Refresh data
        fetchData();
      } catch (err) {
        setError(
          err.msg || "Failed to delete expense record. Please try again."
        );
        console.error(err);
      }
    }
  };

  // Filter records based on search term
  const filteredIncome = incomeRecords.filter(
    (income) =>
      income.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.notes?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = expenseRecords.filter(
    (expense) =>
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.notes?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      (expense.babysitter?.firstName &&
        expense.babysitter?.lastName &&
        `${expense.babysitter.firstName} ${expense.babysitter.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );
  // Calculate balance
  const balance = totalIncome - totalExpenses;

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
      {/* Financial Summary */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="dashboard-card dashboard-card-primary h-100">
            <Card.Body>
              <Row>
                <Col>
                  <h6 className="text-primary">Total Income</h6>
                  <h4>UGX {(totalIncome / 100).toLocaleString()}</h4>
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
        <Col md={4}>
          <Card className="dashboard-card dashboard-card-danger h-100">
            <Card.Body>
              <Row>
                <Col>
                  <h6 className="text-danger">Total Expenses</h6>
                  <h4>UGX {(totalExpenses / 100).toLocaleString()}</h4>
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
        <Col md={4}>
          <Card
            className={`dashboard-card ${
              balance >= 0 ? "dashboard-card-success" : "dashboard-card-danger"
            } h-100`}
          >
            <Card.Body>
              <Row>
                <Col>
                  <h6 className={balance >= 0 ? "text-success" : "text-danger"}>
                    Balance
                  </h6>
                  <h4>UGX {(balance / 100).toLocaleString()}</h4>
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

      {/* Expense by Category Summary */}
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Expense by Category</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {expenseSummary.length > 0 ? (
              expenseSummary.map((category) => (
                <Col md={3} key={category.category}>
                  <Card className="mb-3">
                    <Card.Body className="p-3">
                      <h6 className="text-capitalize">
                        {category.category.replace("_", " ")}
                      </h6>
                      <h5>
                        UGX {(category.totalAmount / 100).toLocaleString()}
                      </h5>
                      <div className="progress">
                        <div
                          className={`progress-bar ${
                            category.category === "salary"
                              ? "bg-primary"
                              : category.category === "toys"
                              ? "bg-success"
                              : category.category === "maintenance"
                              ? "bg-warning"
                              : category.category === "utilities"
                              ? "bg-info"
                              : "bg-secondary"
                          }`}
                          role="progressbar"
                          style={{
                            width: `${
                              (category.totalAmount / totalExpenses) * 100
                            }%`,
                          }}
                          aria-valuenow={
                            (category.totalAmount / totalExpenses) * 100
                          }
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <small className="text-muted">
                        {Math.round(
                          (category.totalAmount / totalExpenses) * 100
                        )}
                        % of total
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-center">No expense data available</p>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Financial Records */}
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Financial Records</h5>
            </Col>
            {hasRole("manager") && (
              <Col xs="auto">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    activeTab === "income"
                      ? handleOpenIncomeModal()
                      : handleOpenExpenseModal()
                  }
                  className="d-flex align-items-center"
                >
                  <FaPlus className="me-1" />{" "}
                  {activeTab === "income" ? "Add Income" : "Add Expense"}
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
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Col>
            </Form.Group>
          </Form>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="income" title="Income">
              <div className="table-responsive">
                <Table hover bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Source</th>
                      <th>Payment Type</th>
                      <th>Amount</th>
                      <th>Notes</th>
                      {hasRole("manager") && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncome.length > 0 ? (
                      filteredIncome.map((income) => (
                        <tr key={income._id}>
                          <td>{new Date(income.date).toLocaleDateString()}</td>
                          <td>{income.description}</td>
                          <td>
                            <span className="text-capitalize">
                              {(income.source || "parent_payment").replace(
                                "_",
                                " "
                              )}
                            </span>
                          </td>
                          <td>
                            <span className="text-capitalize">
                              {(income.paymentType || "cash").replace("_", " ")}
                            </span>
                          </td>
                          <td className="text-end">
                            UGX {(income.totalAmount / 100).toLocaleString()}
                          </td>
                          <td>{income.notes || "-"}</td>
                          {hasRole("manager") && (
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleOpenIncomeModal(income)}
                                className="me-1"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteIncome(income._id)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={hasRole("manager") ? 7 : 6}
                          className="text-center"
                        >
                          No income records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>
            <Tab eventKey="expenses" title="Expenses">
              <div className="table-responsive">
                <Table hover bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Babysitter</th>
                      <th>Amount</th>
                      <th>Notes</th>
                      {hasRole("manager") && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((expense) => (
                        <tr key={expense._id}>
                          <td>{new Date(expense.date).toLocaleDateString()}</td>
                          <td>{expense.description}</td>
                          <td>
                            <span
                              className={`badge ${
                                expense.category === "salary"
                                  ? "bg-primary"
                                  : expense.category === "toys"
                                  ? "bg-success"
                                  : expense.category === "maintenance"
                                  ? "bg-warning"
                                  : expense.category === "utilities"
                                  ? "bg-info"
                                  : "bg-secondary"
                              }`}
                            >
                              {expense.category.charAt(0).toUpperCase() +
                                expense.category.slice(1).replace("_", " ")}
                            </span>
                          </td>
                          <td>
                            {expense.babysitter
                              ? `${expense.babysitter.firstName} ${expense.babysitter.lastName}`
                              : "-"}
                          </td>
                          <td className="text-end">
                            UGX {(expense.amount / 100).toLocaleString()}
                          </td>
                          <td>{expense.notes || "-"}</td>
                          {hasRole("manager") && (
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleOpenExpenseModal(expense)}
                                className="me-1"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteExpense(expense._id)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={hasRole("manager") ? 7 : 6}
                          className="text-center"
                        >
                          No expense records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Add/Edit Income Modal */}
      <Modal show={showIncomeModal} onHide={handleCloseIncomeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentIncome ? "Edit Income Record" : "Add Income Record"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleIncomeSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="required-field">Source</Form.Label>
              <Form.Select
                name="source"
                value={incomeFormData.source}
                onChange={handleIncomeChange}
                required
              >
                <option value="parent_payment">Parent Payment</option>
                <option value="donation">Donation</option>
                <option value="grant">Grant</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="required-field">Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={incomeFormData.description}
                onChange={handleIncomeChange}
                placeholder="Brief description of the income"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">
                    Amount (UGX)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="amount"
                    value={incomeFormData.amount}
                    onChange={handleIncomeChange}
                    placeholder="0.00"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={incomeFormData.date}
                    onChange={handleIncomeChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="required-field">Babysitter</Form.Label>
              <Form.Select
                name="babysitterId"
                value={incomeFormData.babysitterId}
                onChange={handleIncomeChange}
                required
              >
                <option value="">Select Babysitter</option>
                {babysitters.map((babysitter) => (
                  <option key={babysitter._id} value={babysitter._id}>
                    {`${babysitter.firstName} ${babysitter.lastName}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">
                    Half-Day Children
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="childrenCountHalfDay"
                    value={incomeFormData.childrenCountHalfDay}
                    onChange={handleIncomeChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">
                    Full-Day Children
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="childrenCountFullDay"
                    value={incomeFormData.childrenCountFullDay}
                    onChange={handleIncomeChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="required-field">Payment Type</Form.Label>
              <Form.Select
                name="paymentType"
                value={incomeFormData.paymentType}
                onChange={handleIncomeChange}
                required
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="check">Check</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={incomeFormData.notes}
                onChange={handleIncomeChange}
                placeholder="Additional information (optional)"
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="secondary"
                onClick={handleCloseIncomeModal}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentIncome ? "Update" : "Save"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Add/Edit Expense Modal */}
      <Modal show={showExpenseModal} onHide={handleCloseExpenseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentExpense ? "Edit Expense Record" : "Add Expense Record"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleExpenseSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="required-field">Category</Form.Label>
              <Form.Select
                name="category"
                value={expenseFormData.category}
                onChange={handleExpenseChange}
                required
              >
                <option value="salary">Salary</option>
                <option value="toys">Toys & Play Materials</option>
                <option value="maintenance">Maintenance & Repairs</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="required-field">Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={expenseFormData.description}
                onChange={handleExpenseChange}
                placeholder="Brief description of the expense"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">
                    Amount (UGX)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="amount"
                    value={expenseFormData.amount}
                    onChange={handleExpenseChange}
                    placeholder="0.00"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="required-field">Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={expenseFormData.date}
                    onChange={handleExpenseChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {expenseFormData.category === "salary" && (
              <Form.Group className="mb-3">
                <Form.Label className="required-field">Babysitter</Form.Label>
                <Form.Select
                  name="babysitterId"
                  value={expenseFormData.babysitterId}
                  onChange={handleExpenseChange}
                  required={expenseFormData.category === "salary"}
                >
                  <option value="">Select Babysitter</option>
                  {babysitters.map((babysitter) => (
                    <option key={babysitter._id} value={babysitter._id}>
                      {`${babysitter.firstName} ${babysitter.lastName}`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={expenseFormData.notes}
                onChange={handleExpenseChange}
                placeholder="Additional information (optional)"
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="secondary"
                onClick={handleCloseExpenseModal}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentExpense ? "Update" : "Save"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FinancialManagement;
