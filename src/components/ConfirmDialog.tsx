import { Modal } from './Modal'

type ConfirmDialogProps = {
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  title?: string
}

export function ConfirmDialog({
  message,
  confirmLabel = 'Delete',
  title = 'Confirmation',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="confirm-message">{message}</p>
      <div className="form-actions">
        <button
          type="button"
          className="neu-pill-btn secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="neu-pill-btn danger"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
