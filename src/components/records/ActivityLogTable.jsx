import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import Spinner from "react-bootstrap/Spinner";

// Backend API base URL
const API_BASE = "http://localhost:5000";

function ActivityLogTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch logs
  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/activity-logs`);
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to load activity logs:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  // Filtered logs
  const filteredLogs = logs
    .sort((a, b) => b.createdAt - a.createdAt)
    .filter((log) => {
      const username = log.username || "";
      const action = log.action || "";
      const details = log.details || "";
      return (
        username.toLowerCase().includes(search.toLowerCase()) ||
        action.toLowerCase().includes(search.toLowerCase()) ||
        details.toLowerCase().includes(search.toLowerCase())
      );
    });

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);

  const clearFilters = () => {
    setSearch("");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold text-primary">
          <i className="bi bi-clipboard-check me-2"></i>
          Activity Logs
        </h5>
      </div>

      {/* Search */}
      <Form className="mb-3">
        <Row className="g-2 align-items-end">
          <Col md={4}>
            <Form.Label className="fw-medium">Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by Username, Action, Details..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>
          <Col md={1} className="d-grid">
            <Button variant="outline-secondary" onClick={clearFilters}>
              Clear Search
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      <Table hover responsive borderless className="align-middle" style={{ fontSize: "0.95rem" }}>
        <thead className="table-light">
          <tr>
            <th className="fw-semibold">Username</th>
            <th className="fw-semibold">Action</th>
            <th className="fw-semibold">Details</th>
            <th className="fw-semibold">Date/Time</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLogs.length > 0 ? (
            paginatedLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.username || "-"}</td>
                <td className="fw-bold">{log.action || "-"}</td>
                <td>{log.details || "-"}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                No activity logs found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted" style={{ fontSize: "0.9rem" }}>
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} logs
        </div>
        <Pagination size="sm">
          <Pagination.First disabled={currentPage === 1} onClick={() => handlePageChange(1)} />
          <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
          <Pagination.Last disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)} />
        </Pagination>
      </div>
    </div>
  );
}

export default ActivityLogTable;
