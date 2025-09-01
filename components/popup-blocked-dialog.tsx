'use client';

interface PopupBlockedDialogProps {
    isOpen: boolean;
    onOpenPayment: () => void;
    onClose: () => void;
    id?: string;
}

export function PopupBlockedDialog({ isOpen, onOpenPayment, onClose, id }: PopupBlockedDialogProps) {
    if (!isOpen) return null;

    return (
        <div
            id={id || "popup-blocked-dialog"}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                id="payment-dialog-container"
                style={{
                    background: 'white',
                    padding: 24,
                    borderRadius: 12,
                    maxWidth: 400,
                    width: '90%',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="payment-dialog-title" style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>
                    Payment Link Ready
                </h3>
                <p id="payment-dialog-description" style={{ margin: '0 0 20px 0', color: '#555', lineHeight: 1.5 }}>
                    Your browser blocked the automatic popup. Click the button below to open your payment page.
                </p>
                <div id="payment-dialog-actions" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button
                        id="open-payment-button"
                        onClick={onOpenPayment}
                        style={{
                            padding: '12px 24px',
                            borderRadius: 8,
                            border: '1px solid #111',
                            background: '#111',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Open Payment Page
                    </button>
                    <button
                        id="cancel-payment-button"
                        onClick={onClose}
                        style={{
                            padding: '12px 24px',
                            borderRadius: 8,
                            border: '1px solid #ddd',
                            background: 'white',
                            color: '#666',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
