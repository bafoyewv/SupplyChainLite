
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Package, ShieldCheck, TrendingUp, User, Eye, EyeOff, Key } from 'lucide-react';
import { LoginRequest } from '../../types/auth';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data);
      login(response.token, response.user);
      
      // Navigate based on user role
      const rolePath = response.user.role.toLowerCase();
      navigate(`/${rolePath}/dashboard`);
      
      toast({
        title: 'Welcome back!',
        description: `You're logged in as ${response.user.fullName}`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Info Section */}
      <div className="md:w-1/2 bg-gradient-to-br from-purple-600 to-blue-700 text-white p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8 flex items-center">
            <Package className="h-10 w-10 mr-4" />
            <h1 className="text-3xl font-bold">SupplyChainLite</h1>
          </div>

          <h2 className="text-2xl font-semibold mb-6">Streamline Your Supply Chain Operations</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Real-time Analytics</h3>
                <p className="text-white/80">Get insights into your inventory, sales, and orders with powerful dashboards.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Secure Operations</h3>
                <p className="text-white/80">Role-based access ensures data security and proper workflow management.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Complete Inventory Control</h3>
                <p className="text-white/80">Track stock levels, manage products, and automate reordering.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="md:w-1/2 p-8 flex items-center justify-center relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg animate-fade-in">
            <CardContent className="pt-6 pb-4">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold">Sign In</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your credentials to access your account
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      className="pr-10"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Please enter a valid email',
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Key className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      className="pr-10"
                      {...register('password', {
                        required: 'Password is required',
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? 'Hide password' : 'Show password'}
                      </span>
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-sm">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center pt-0 pb-6">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-purple-600 hover:underline font-medium"
                >
                  Register
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
