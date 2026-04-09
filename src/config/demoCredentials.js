// src/config/demoCredentials.js

/**
 * Demo Credentials for ServiceConnect Application
 * Use these credentials to access different dashboard roles
 */

export const DEMO_CREDENTIALS = {
    admin: {
        role: 'admin',
        email: 'admin@demo.com',
        password: 'admin123',
        name: 'Admin User',
        description: 'Full access to all administrative features'
    },
    professional: {
        role: 'professional',
        email: 'pro@demo.com',
        password: 'pro123',
        name: 'Professional User',
        description: 'Manage your professional profile and requests'
    },
    user: {
        role: 'user',
        email: 'user@demo.com',
        password: 'user123',
        name: 'Regular User',
        description: 'Find and hire professionals'
    },
    support: {
        role: 'support',
        email: 'support@demo.com',
        password: 'support123',
        name: 'Support Agent',
        description: 'Manage customer support tickets'
    }
};

export const initializeDemoUsers = () => {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if demo users already exist
    if (existingUsers.length > 0) {
        return;
    }

    // Initialize demo users in localStorage
    const demoUsers = [
        {
            name: DEMO_CREDENTIALS.admin.name,
            email: DEMO_CREDENTIALS.admin.email,
            password: DEMO_CREDENTIALS.admin.password,
            role: DEMO_CREDENTIALS.admin.role
        },
        {
            name: DEMO_CREDENTIALS.professional.name,
            email: DEMO_CREDENTIALS.professional.email,
            password: DEMO_CREDENTIALS.professional.password,
            role: DEMO_CREDENTIALS.professional.role,
            professionalId: 1,
            userId: 5001
        },
        {
            name: DEMO_CREDENTIALS.user.name,
            email: DEMO_CREDENTIALS.user.email,
            password: DEMO_CREDENTIALS.user.password,
            role: DEMO_CREDENTIALS.user.role,
            userId: 5002
        },
        {
            name: DEMO_CREDENTIALS.support.name,
            email: DEMO_CREDENTIALS.support.email,
            password: DEMO_CREDENTIALS.support.password,
            role: DEMO_CREDENTIALS.support.role
        }
    ];

    localStorage.setItem('users', JSON.stringify(demoUsers));
};
