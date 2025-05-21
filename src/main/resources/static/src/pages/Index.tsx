import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If authenticated, redirect to appropriate dashboard based on user role
    if (isAuthenticated && user) {
      const rolePath = user.role.toLowerCase().replace('_', '');
      navigate(`/${rolePath}/dashboard`);
    } else {
      // Otherwise redirect to login
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // This is just a fallback, the useEffect should handle the redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">SupplyChainLite</h1>
        <p className="text-muted-foreground">Redirecting to the appropriate page...</p>
      </div>
    </div>
  );
};

export default Index;
