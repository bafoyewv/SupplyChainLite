import { useLogin } from '../hooks/useAuth';

const LoginForm = () => {
    const login = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login.mutateAsync({
                username: username,
                password: password
            });
            // Handle successful login
        } catch (error) {
            // Handle error
            console.error('Login failed:', error);
        }
    };

    // ... rest of your component code
};