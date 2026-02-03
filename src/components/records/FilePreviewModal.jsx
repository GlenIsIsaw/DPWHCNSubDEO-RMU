import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function FilePreviewModal({ show, onHide, record }) {
  if (!record) return null;

  // Construct the backend file URL
  const fileURL = record.fileName
    ? `http://localhost:5000/uploads/${record.fileName}`
    : null;

  // Determine file type by extension
  const isPDF = record.fileName?.toLowerCase().endsWith(".pdf");
  const isImage = record.fileName?.match(/\.(jpg|jpeg|png|gif)$/i);
  const isWord = record.fileName?.toLowerCase().endsWith(".docx");

  // For Word files using Office Online Viewer
  const officeViewerURL = isWord
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileURL)}`
    : null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      style={{ fontFamily: "'Inter', sans-serif", color: "#212529" }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold" style={{ color: "#0B3D91" }}>
          Preview: {record.recordNo}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "400px",
          maxHeight: "80vh",
          overflow: "auto",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        {isImage && (
          <img
            src={fileURL}
            alt={record.subject}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              display: "block",
              borderRadius: "5px",
            }}
          />
        )}

        {isPDF && (
          <iframe
            src={fileURL}
            title={record.subject}
            style={{
              width: "100%",
              height: "500px",
              border: "1px solid #dee2e6",
              borderRadius: "5px",
            }}
          />
        )}

        {isWord && (
          <iframe
            src={officeViewerURL}
            title={record.subject}
            style={{
              width: "100%",
              height: "500px",
              border: "1px solid #dee2e6",
              borderRadius: "5px",
            }}
          />
        )}

        {!fileURL && (
          <p className="text-muted text-center">
            No file available for preview.
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          className="fw-medium"
          style={{ minWidth: "100px" }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FilePreviewModal;
