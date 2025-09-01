'use client';

import { AuthState } from '@/hooks/use-auth';

interface LoginStatusBannerProps {
    auth: AuthState;
}

export function LoginStatusBanner({ auth }: LoginStatusBannerProps) {
    if (!auth.isLoggedIn) {
        return (
            <div
                style={{
                    background: '#fff3cd',
                    border: '1px solid #ffeeba',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                }}
            >
                You are not logged in. Please log in to continue.
            </div>
        );
    }

    return (
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
            <div><strong>User:</strong> {auth.userId}</div>
            <div><strong>Project:</strong> {auth.projectId}</div>
            {auth.isAdmin && (
                <div style={{
                    marginTop: 8,
                    padding: 4,
                    background: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: 4,
                    color: '#155724',
                    fontWeight: 'bold'
                }}>
                    You are an admin
                </div>
            )}
            {auth.isAdminLoading && (
                <div style={{
                    marginTop: 8,
                    padding: 4,
                    background: '#fff3cd',
                    border: '1px solid #ffeeba',
                    borderRadius: 4,
                    color: '#856404',
                    fontStyle: 'italic'
                }}>
                    Checking admin status...
                </div>
            )}
        </div>
    );
}
