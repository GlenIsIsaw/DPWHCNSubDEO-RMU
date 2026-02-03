import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ConfirmActionModal({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmText,
  variant,
}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      style={{ fontFamily: "'Inter', sans-serif", color: "#212529" }}
    >
      <Modal.Header closeButton>
        <Modal.Title
          className="fw-bold text-uppercase"
          style={{ color: "#0B3D91" }}
        >
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{ fontSize: "0.95rem", lineHeight: "1.5", color: "#343a40" }}
      >
        {message}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          className="fw-medium"
          style={{ minWidth: "100px" }}
        >
          Cancel
        </Button>

        <Button
          variant={variant || "primary"}
          onClick={onConfirm}
          className="fw-semibold"
          style={{ minWidth: "100px" }}
        >
          {confirmText || "Confirm"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmActionModal;
