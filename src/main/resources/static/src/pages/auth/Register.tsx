
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Package } from 'lucide-react';
import { RegisterRequest, UserRole } from '../../types/auth';
import { authApi } from '../../api/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [registrationData, setRegistrationData] = useState<RegisterRequest | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({
    defaultValues: {
      role: 'USER',
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      // First, send verification code
      await authApi.sendVerificationCode(data.email);
      setRegistrationData(data);
      setIsVerifying(true);
      
      toast({
        title: 'Verification code sent',
        description: 'Please check your email for the verification code',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to send verification code',
        description: error.response?.data?.message || 'An error occurred while sending verification code',
      });
    }
  };

  const verifyAndRegister = async () => {
    try {
      if (!registrationData) return;
      
      // First verify the code
      await authApi.verify({
        email: registrationData.email,
        code: verificationCode
      });
      
      // If verification successful, proceed with registration
      await authApi.register(registrationData);
      
      toast({
        title: 'Registration successful',
        description: 'You can now login with your credentials',
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.response?.data?.message || 'An error occurred during registration',
      });
    }
  };

  // Handle select change since React Hook Form doesn't naturally work with shadcn Select
  const handleRoleChange = (value: string) => {
    setValue('role', value as UserRole, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md overflow-hidden animate-fade-in shadow-lg">
        <CardHeader className="space-y-1 items-center text-center pb-4">
          <div className="flex items-center justify-center p-2 bg-purple-100 rounded-full mb-4">
            <Package className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            {isVerifying 
              ? 'Enter the verification code sent to your email' 
              : 'Enter your information to create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerifying ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-muted-foreground">
                  For demo purposes, enter "123456" as the verification code
                </p>
              </div>
              <Button
                onClick={verifyAndRegister}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Verify and Create Account
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsVerifying(false)}
              >
                Back to Registration
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Full Name"
                  {...register('fullName', {
                    required: 'Full name is required',
                  })}
                  className="focus:ring-2 focus:ring-purple-500"
                />
                {errors.fullName && (
                  <p className="text-destructive text-sm">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email',
                    },
                  })}
                  className="focus:ring-2 focus:ring-purple-500"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="focus:ring-2 focus:ring-purple-500"
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  onValueChange={handleRoleChange} 
                  defaultValue="USER"
                >
                  <SelectTrigger id="role" className="focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="SUPPLIER">Supplier</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('role')} />
                {errors.role && (
                  <p className="text-destructive text-sm">{errors.role.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Continue'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
