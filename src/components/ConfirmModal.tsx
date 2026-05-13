interface ConfirmModalProps {
  open: boolean;
  title: string;
  body: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  open,
  title,
  body,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white text-dark rounded-2xl max-w-[340px] w-full p-5 shadow-2xl">
        <h2 className="h1 mb-2">{title}</h2>
        <p className="text-[13px] text-gray leading-relaxed mb-5">{body}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-outline flex-1">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="btn-primary flex-1">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
