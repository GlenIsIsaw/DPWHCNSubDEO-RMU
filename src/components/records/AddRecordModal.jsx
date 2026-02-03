import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function AddRecordModal({ show, handleClose, onSave }) {
  const [formData, setFormData] = useState({
    recordNo: "",
    dateReceived: "",
    from: "",
    to: "",
    subject: "",
    route: "",
    file: null,
  });

  useEffect(() => {
    if (show) {
      // Reset form data whenever the modal opens
      setFormData({
        recordNo: "",
        dateReceived: "",
        from: "",
        to: "",
        subject: "",
        route: "",
        file: null,
      });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert("Please upload a file.");
      return;
    }

    onSave({
      ...formData,
      createdAt: Date.now(),
    });

    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      style={{ fontFamily: "'Inter', sans-serif", color: "#212529" }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold" style={{ color: "#0B3D91" }}>
          <i className="bi bi-plus-circle me-2"></i>
          Add New Record
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label className="fw-medium">
                Record Number <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="recordNo"
                placeholder="REC-2026-0001"
                value={formData.recordNo}
                onChange={handleChange}
                required
                style={{ borderRadius: "0.35rem" }}
              />
            </Col>

            <Col md={6}>
              <Form.Label className="fw-medium">
                Date Received <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="dateReceived"
                value={formData.dateReceived}
                onChange={handleChange}
                required
                style={{ borderRadius: "0.35rem" }}
              />
            </Col>

            <Col md={6}>
              <Form.Label className="fw-medium">
                From <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                required
                style={{ borderRadius: "0.35rem" }}
              />
            </Col>

            <Col md={6}>
              <Form.Label className="fw-medium">
                To <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                required
                style={{ borderRadius: "0.35rem" }}
              />
            </Col>

            <Col md={12}>
              <Form.Label className="fw-medium">
                Subject <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{ borderRadius: "0.35rem" }}
              />
            </Col>

            <Col md={6}>
              <Form.Label className="fw-medium">
                Route Office <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="route"
                value={formData.route}
                onChange={handleChange}
                required
                style={{ borderRadius: "0.35rem" }}
              >
                <option value="">Select Route</option>
                <option value="All Section/Offices">
                  All Section/Offices
                </option>
                <option value="Administrative Section">
                  Administrative Section
                </option>
                <option value="Administrative Section - HR">
                  Administrative Section - HR
                </option>
                <option value="Construction Section">
                  Construction Section
                </option>
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

            <Col md={6}>
              <Form.Label className="fw-medium">
                Upload File <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.docx,.jpg,.png,.xlsx,.pptx"
                onChange={handleFileChange}
                required
                style={{ borderRadius: "0.35rem" }}
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            className="fw-medium"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="fw-semibold btn-glow-blue">
            <i className="bi bi-upload me-1"></i>
            Save Record
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddRecordModal;
