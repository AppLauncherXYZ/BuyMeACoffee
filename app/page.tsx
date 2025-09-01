'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LoginStatusBanner } from '@/components/login-status-banner';
import { PopupBlockedDialog } from '@/components/popup-blocked-dialog';

export default function Page() {
  const auth = useAuth();
  const [loading, setLoading] = React.useState<string | null>(null);
  const [showPopupDialog, setShowPopupDialog] = React.useState(false);
  const [blockedPaymentUrl, setBlockedPaymentUrl] = React.useState<string | null>(null);

  // BUY: body-first; local proxy handles parent call
  const handlePayment = async (amount: number, type: 'subscription' | 'one-time', tier?: string) => {
    const buttonId = tier || `${type}-${amount}`;
    setLoading(buttonId);
    try {
      if (!auth.isLoggedIn) {
        alert('You are not logged in. Please log in to continue.');
        return;
      }

      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          type,
          tier,
          user_id: auth.userId,
          project_id: auth.projectId,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success && data?.url) {
        const popup = window.open(data.url as string, '_blank'); // Open in new tab
        if (!popup) {
          // Popup was blocked, show dialog
          setBlockedPaymentUrl(data.url as string);
          setShowPopupDialog(true);
        }
      } else {
        console.error('Payment error:', data);
        alert('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('[create-payment] error', err);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // CTA spend: call local proxy (body-first) to avoid CORS; send both key styles
  const spendCredits = async (cost: number) => {
    setLoading(`cta-${cost}`);
    try {
      if (!auth.isLoggedIn) {
        alert('You are not logged in. Please log in to continue.');
        return;
      }

      const resp = await fetch('/api/credits/check-and-debit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // send both snake_case and camelCase for maximum compatibility
          user_id: auth.userId,
          userId: auth.userId,
          project_id: auth.projectId,
          projectId: auth.projectId,
          cost,
          metadata: { cta: 'example' },
        }),
      });

      const data = await resp.json();
      if (resp.ok && data?.ok) {
        alert(`CTA succeeded. Remaining credits: ${data.creditsRemaining}`);
      } else {
        alert(`Not enough credits. Remaining: ${data?.creditsRemaining ?? 0}`);
      }
    } catch (err) {
      console.error('[check-and-debit] error', err);
      alert('CTA failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleOpenPaymentLink = () => {
    if (blockedPaymentUrl) {
      window.open(blockedPaymentUrl, '_blank');
      setShowPopupDialog(false);
      setBlockedPaymentUrl(null);
    }
  };

  const handleCloseDialog = () => {
    setShowPopupDialog(false);
    setBlockedPaymentUrl(null);
  };

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Support this App</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Buy credits to unlock actions. 1 USD cent = 1 AppDollar.
      </p>

      <LoginStatusBanner auth={auth} />

      <section style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <button
          disabled={loading !== null}
          onClick={() => handlePayment(3, 'one-time')}
          style={btnStyle(loading === 'one-time-3')}
        >
          {loading === 'one-time-3' ? 'Processing…' : 'Buy $3 (300)'}
        </button>
        <button
          disabled={loading !== null}
          onClick={() => handlePayment(5, 'one-time')}
          style={btnStyle(loading === 'one-time-5')}
        >
          {loading === 'one-time-5' ? 'Processing…' : 'Buy $5 (500)'}
        </button>
        <button
          disabled={loading !== null}
          onClick={() => handlePayment(10, 'one-time')}
          style={btnStyle(loading === 'one-time-10')}
        >
          {loading === 'one-time-10' ? 'Processing…' : 'Buy $10 (1000)'}
        </button>
      </section>

      <hr style={{ margin: '24px 0', border: 0, borderTop: '1px solid #eee' }} />

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          disabled={loading !== null}
          onClick={() => spendCredits(25)}
          style={btnOutline(loading === 'cta-25')}
        >
          {loading === 'cta-25' ? 'Debiting…' : 'Use 25 credits'}
        </button>
        <button
          disabled={loading !== null}
          onClick={() => spendCredits(100)}
          style={btnOutline(loading === 'cta-100')}
        >
          {loading === 'cta-100' ? 'Debiting…' : 'Use 100 credits'}
        </button>
      </section>

      <PopupBlockedDialog
        isOpen={showPopupDialog}
        onOpenPayment={handleOpenPaymentLink}
        onClose={handleCloseDialog}
      />
    </main>
  );
}

function btnStyle(loading: boolean): React.CSSProperties {
  return {
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid #111',
    background: loading ? '#ccc' : '#111',
    color: '#fff',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontWeight: 600,
  };
}

function btnOutline(loading: boolean): React.CSSProperties {
  return {
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid #111',
    background: loading ? '#f1f3f5' : '#fff',
    color: '#111',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontWeight: 600,
  };
}

