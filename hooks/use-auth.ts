'use client';

import { useState, useEffect } from 'react';

export interface AuthState {
    userId: string | null;
    projectId: string | null;
    isLoggedIn: boolean;
    isAdmin: boolean | null;
    isAdminLoading: boolean;
}

export function useAuth(): AuthState {
    const [userId, setUserId] = useState<string | null>(null);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [isAdminLoading, setIsAdminLoading] = useState<boolean>(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUserId(params.get('user_id') || params.get('userId') || params.get('uid'));
        setProjectId(params.get('project_id') || params.get('projectId'));
    }, []);

    useEffect(() => {
        if (userId && projectId) {
            checkAdminStatus();
        } else {
            setIsAdmin(null);
        }
    }, [userId, projectId]);

    const checkAdminStatus = async () => {
        if (!userId || !projectId) return;

        setIsAdminLoading(true);
        try {
            const response = await fetch('/api/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, projectId }),
            });

            if (response.ok) {
                const data = await response.json();
                setIsAdmin(data.isAdmin || false);
            } else {
                console.error('Failed to check admin status');
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
        } finally {
            setIsAdminLoading(false);
        }
    };

    const isLoggedIn = userId !== null && projectId !== null;

    return {
        userId,
        projectId,
        isLoggedIn,
        isAdmin,
        isAdminLoading,
    };
}
