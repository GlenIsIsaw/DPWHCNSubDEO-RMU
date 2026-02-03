import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import AddRecordModal from "./AddRecordModal";
import FilePreviewModal from "./FilePreviewModal";
import ConfirmActionModal from "./ConfirmActionModal";
import Spinner from "react-bootstrap/Spinner";

// Backend API base URL
const API_BASE = "http://localhost:5000";

function RecordTable() {
  const [previewRecord, setPreviewRecord] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [downloadRecord, setDownloadRecord] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const [showModal, setShowModal] = useState(false);

  // ======================
  // Load records from backend
  // ======================
  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true); // start loading
        const res = await fetch(`${API_BASE}/records`);
        let data = await res.json();

        // Map backend fields to frontend fields
        data = data.map((r) => ({
          ...r,
          from: r.fromOffice,
          to: r.toOffice,
        }));

        setRecords(data);
      } catch (err) {
        console.error("Failed to load records:", err);
      } finally {
        setLoading(false); // finish loading
      }
    };
    loadRecords();
  }, []);

  // ======================
  // Save new record
  // ======================
  const handleSaveRecord = async (newRecord) => {
    const formData = new FormData();
    formData.append("recordNo", newRecord.recordNo);
    formData.append("dateReceived", newRecord.dateReceived);
    formData.append("from", newRecord.from);
    formData.append("to", newRecord.to);
    formData.append("subject", newRecord.subject);
    formData.append("route", newRecord.route);
    formData.append("file", newRecord.file);

    await fetch(`${API_BASE}/records`, {
      method: "POST",
      body: formData,
    });

    // Reload records after adding
    const res = await fetch(`${API_BASE}/records`);
    let updatedRecords = await res.json();
    updatedRecords = updatedRecords.map((r) => ({
      ...r,
      from: r.fromOffice,
      to: r.toOffice,
    }));
    setRecords(updatedRecords);
    setCurrentPage(1);
  };

  // ======================
  // Download record file
  // ======================
  const handleDownload = (record) => {
    if (!record.fileName) return;
    const url = `http://localhost:5000/uploads/${record.fileName}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = record.fileName;
    a.click();
  };

  // ======================
  // Delete record
  // ======================
  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/records/${id}`, { method: "DELETE" });
    const res = await fetch(`${API_BASE}/records`);
    let updatedRecords = await res.json();
    updatedRecords = updatedRecords.map((r) => ({
      ...r,
      from: r.fromOffice,
      to: r.toOffice,
    }));
    setRecords(updatedRecords);
  };

  // ======================
  // Filters
  // ======================
  const [search, setSearch] = useState("");
  const [routeFilter, setRouteFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // ======================
  // Pagination
  // ======================
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredRecords = [...records]
    .sort((a, b) => b.createdAt - a.createdAt)
    .filter((record) => {
      const searchMatch =
        record.recordNo.toLowerCase().includes(search.toLowerCase()) ||
        record.subject.toLowerCase().includes(search.toLowerCase()) ||
        record.from.toLowerCase().includes(search.toLowerCase()) ||
        record.to.toLowerCase().includes(search.toLowerCase());

      const routeMatch = routeFilter ? record.route === routeFilter : true;
      const dateMatch = dateFilter ? record.dateReceived === dateFilter : true;

      return searchMatch && routeMatch && dateMatch;
    });

  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);
  const handlePageChange = (page) => setCurrentPage(page);
  const clearFilters = () => {
    setSearch("");
    setRouteFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  // ======================
  // Render
  // ======================
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
    <div
      className="bg-white p-4 rounded shadow-sm"
      style={{ fontFamily: "'Inter', sans-serif", color: "#212529" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold" style={{ color: "#0B3D91" }}>
          <i className="bi bi-folder2-open me-2"></i>
          Archived Records
        </h5>

        <Button
          variant="primary"
          className="fw-semibold btn-glow-blue"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg me-1"></i>
          Add Record
        </Button>
      </div>

      {/* Filters */}
      <Form className="mb-3">
        <Row className="g-2 align-items-end">
          <Col md={5}>
            <Form.Label className="fw-medium">Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search Record no., Subject, From, To..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={{ borderRadius: "0.35rem" }}
            />
          </Col>

          <Col md={3}>
            <Form.Label className="fw-medium">Route Office</Form.Label>
            <Form.Select
              value={routeFilter}
              onChange={(e) => {
                setRouteFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ borderRadius: "0.35rem" }}
            >
              <option value="">All Routes</option>
              <option value="All Section/Offices">All Section/Offices</option>
              <option value="Administrative Section - HR">
                Administrative Section - HR
              </option>
              <option value="Construction Section">Construction Section</option>
              <option value="Finance Section">Finance Section</option>
              <option value="Maintenance Section">Maintenance Section</option>
              <option value="Quality and Assurance Section">
                Quality and Assurance Section
              </option>
              <option value="Planning and Design Section">
                Planning and Design Section
              </option>
              <option value="Procurement (BAC)">Procurement</option>
              <option value="Office of the ADE">
                Office of the Assistant District Engineer
              </option>
              <option value="Office of the DE">
                Office of the District Engineer
              </option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label className="fw-medium">Date Received</Form.Label>
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ borderRadius: "0.35rem" }}
            />
          </Col>

          <Col md={1} className="d-grid">
            <Button variant="outline-secondary" onClick={clearFilters}>
              <i className="bi bi-x-circle"></i>
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      <Table
        hover
        responsive
        borderless
        className="align-middle"
        style={{ fontSize: "0.95rem" }}
      >
        <thead className="table-light">
          <tr>
            <th className="text-dark fw-semibold">Record Number</th>
            <th className="text-dark fw-semibold">Date Received</th>
            <th className="text-dark fw-semibold">From</th>
            <th className="text-dark fw-semibold">To</th>
            <th className="text-dark fw-semibold">Subject</th>
            <th className="text-dark fw-semibold">Route Office</th>
            <th className="text-center text-dark fw-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRecords.length > 0 ? (
            paginatedRecords.map((record) => (
              <tr key={record.id}>
                <td className="fw-medium">{record.recordNo}</td>
                <td>{record.dateReceived}</td>
                <td>{record.from}</td>
                <td>{record.to}</td>
                <td
                  style={{
                    maxWidth: "150px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={record.subject}
                >
                  {record.subject}
                </td>
                <td>
                  <Badge bg="secondary" style={{ fontWeight: "500" }}>
                    {record.route}
                  </Badge>
                </td>
                <td className="text-center">
                  {/* Preview */}
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-preview-${record.id}`}>
                        Preview
                      </Tooltip>
                    }
                  >
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => {
                        setPreviewRecord(record);
                        setShowPreview(true);
                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                  </OverlayTrigger>

                  {/* Download */}
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-download-${record.id}`}>
                        Download
                      </Tooltip>
                    }
                  >
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="me-1"
                      onClick={() => {
                        setDownloadRecord(record);
                        setShowDownloadModal(true);
                      }}
                    >
                      <i className="bi bi-download"></i>
                    </Button>
                  </OverlayTrigger>

                  {/* Delete */}
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-delete-${record.id}`}>
                        Delete
                      </Tooltip>
                    }
                  >
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setDeleteRecordId(record.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted py-4">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination Footer */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted" style={{ fontSize: "0.9rem" }}>
          Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of{" "}
          {totalItems} records
        </div>
        <div className="d-flex align-items-center gap-3">
          <Form.Select
            size="sm"
            style={{ width: "80px" }}
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </Form.Select>

          <Pagination size="sm" className="mb-0">
            <Pagination.First
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
            />
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
            <Pagination.Last
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            />
          </Pagination>
        </div>
      </div>

      {/* Modals */}
      <AddRecordModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={handleSaveRecord}
      />
      <FilePreviewModal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        record={previewRecord}
      />

      <ConfirmActionModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={async () => {
          if (deleteRecordId) {
            await handleDelete(deleteRecordId);
            setShowDeleteModal(false);
            setDeleteRecordId(null);
          }
        }}
      />

      <ConfirmActionModal
        show={showDownloadModal}
        onHide={() => setShowDownloadModal(false)}
        title="Download File"
        message="Do you want to download this file?"
        confirmText="Download"
        variant="success"
        onConfirm={async () => {
          if (downloadRecord) {
            try {
              // 1. Construct the file URL from backend
              const url = `http://localhost:5000/uploads/${downloadRecord.fileName}`;

              // 2. Fetch the file as blob
              const response = await fetch(url);
              if (!response.ok) throw new Error("Failed to fetch file");

              const blob = await response.blob();

              // 3. Trigger download
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = downloadRecord.fileName; // use actual file name
              a.click();

              // 4. Clean up
              URL.revokeObjectURL(a.href);

              setShowDownloadModal(false);
              setDownloadRecord(null);
            } catch (err) {
              console.error(err);
              alert("Failed to download file.");
            }
          }
        }}
      />
    </div>
  );
}

export default RecordTable;
