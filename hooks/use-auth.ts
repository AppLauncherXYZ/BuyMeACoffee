'use client';

import { useState, useEffect } from 'react';

export interface AuthState {
    userId: string | null;
    projectId: string | null;
    isLoggedIn: boolean;
}

export function useAuth(): AuthState {
    const [userId, setUserId] = useState<string | null>(null);
    const [projectId, setProjectId] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUserId(params.get('user_id') || params.get('userId') || params.get('uid'));
        setProjectId(params.get('project_id') || params.get('projectId'));
    }, []);

    const isLoggedIn = userId !== null && projectId !== null;

    return {
        userId,
        projectId,
        isLoggedIn,
    };
}
