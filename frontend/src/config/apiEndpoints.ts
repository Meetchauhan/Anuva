type Env = 'sandbox' | 'production';

export const env: Env = (import.meta.env.VITE_API_ENV as 'sandbox' | 'production') || 'sandbox';

type EndpointConfig = {
    authService: string;
    userService: string;
    paymentService: string;
};

const config: Record<Env, EndpointConfig> = {
    sandbox: {
        authService: 'https://sandbox.api.example.com/auth',
        userService: 'https://sandbox.api.example.com/users',
        paymentService: 'https://sandbox.payments.example.com',
    },
    production: {
        authService: 'https://api.example.com/auth',
        userService: 'https://api.example.com/users',
        paymentService: 'https://payments.example.com',
    },
};

const apiEndpoints: EndpointConfig = config[env];

export default apiEndpoints;