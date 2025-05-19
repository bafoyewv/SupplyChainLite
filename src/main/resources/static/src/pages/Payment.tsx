
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Payment = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast.error('Please fill in all payment details');
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast.error('Payment service is currently unavailable. Please try again later.');
    }, 2000);
  };
  
  return (
    <div className="max-w-md mx-auto my-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Enter your payment information to complete your order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input 
                id="cardName" 
                placeholder="John Smith" 
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input 
                id="cardNumber" 
                placeholder="1234 5678 9012 3456" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  id="expiryDate" 
                  placeholder="MM/YY" 
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv" 
                  placeholder="123" 
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                  maxLength={3}
                  type="password"
                />
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 text-sm">
                  This is a demonstration payment form. No actual payment will be processed.
                </p>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                  Processing...
                </>
              ) : (
                <>Pay Now</>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payment;
