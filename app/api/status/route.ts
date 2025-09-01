import { NextRequest, NextResponse } from 'next/server';

// Prefer server env var; fall back to NEXT_PUBLIC or hardcoded domain
const PARENT_BASE =
    process.env.NEXT_PUBLIC_PARENT_API_BASE ||
    'https://applauncher.xyz';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { userId, user_id, projectId, project_id } = await req.json();

        const uid = userId ?? user_id;
        const pid = projectId ?? project_id;

        if (!uid || !pid) {
            return NextResponse.json(
                { error: 'Missing userId or projectId' },
                { status: 400 }
            );
        }

        const r = await fetch(`${PARENT_BASE}/api/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: uid,
                projectId: pid,
            }),
        });

        const text = await r.text();
        // Pass through JSON exactly
        return new NextResponse(text, {
            status: r.status,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        console.error('Status check error:', e);
        return NextResponse.json(
            { error: e?.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
