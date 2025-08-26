'use client';

import * as React from 'react';

export default function Page() {
  const [loading, setLoading] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [projectId, setProjectId] = React.useState<string | null>(null);

  // Read user_id & project_id from URL once on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get('user_id'));
    setProjectId(params.get('project_id'));
  }, []);

  const handlePayment = async (amount: number, type: 'subscription' | 'one-time', tier?: string) => {
    const buttonId = tier || `${type}-${amount}`;
    setLoading(buttonId);
    try {
      if (!userId || !projectId) {
        alert('Missing user_id or project_id in URL. Expected ?user_id=USER_ID&project_id=PROJECT_ID');
        return;
      }

      const res = await fetch(
        `/api/create-payment?user_id=${encodeURIComponent(userId)}&project_id=${encodeURIComponent(projectId)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, type, tier, project_id: projectId, user_id: userId }),
        }
      );

      const data = await res.json();
      if (res.ok && data?.success && data?.url) {
        window.location.href = data.url as string; // Redirect to Stripe
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

  // Optional: example CTA that spends credits
  const spendCredits = async (cost: number) => {
    setLoading(`cta-${cost}`);
    try {
      if (!userId || !projectId) {
        alert('Missing user_id or project_id in URL.');
        return;
      }

      // If you added the proxy route shown earlier:
      const res = await fetch(
        `/api/credits/check-and-debit?user_id=${encodeURIComponent(userId)}&project_id=${encodeURIComponent(projectId)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cost, project_id: projectId, metadata: { cta: 'example' } }),
        }
      );

      const data = await res.json();
      if (res.ok && data?.ok) {
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

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Support this App</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Buy credits to unlock actions. 1 USD cent = 1 appdollar.
      </p>

      {!userId || !projectId ? (
        <div
          style={{
            background: '#fff3cd',
            border: '1px solid #ffeeba',
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          Missing <code>user_id</code> and/or <code>project_id</code> in the URL. Expected
          {' '}<code>?user_id=USER_ID&project_id=PROJECT_ID</code>.
        </div>
      ) : (
        <div
          style={{
            background: '#e7f5ff',
            border: '1px solid #a5d8ff',
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          <div><strong>User:</strong> {userId}</div>
          <div><strong>Project:</strong> {projectId}</div>
        </div>
      )}

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

