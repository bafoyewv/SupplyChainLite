
import React, { useState } from 'react';
import { PaymentInfo, Order } from '@/types/order';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface OrderPaymentProps {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

const OrderPayment: React.FC<OrderPaymentProps> = ({ order, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces after every 4 digits
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 2) {
        setPaymentInfo(prev => ({ ...prev, [name]: cleaned }));
      } else {
        const month = cleaned.substring(0, 2);
        const year = cleaned.substring(2, 4);
        setPaymentInfo(prev => ({ ...prev, [name]: `${month}/${year}` }));
      }
    } else {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Simulate payment failure for demo
      toast({
        variant: 'destructive',
        title: 'Payment failed',
        description: 'Payment system is currently under maintenance. Please try again later.',
      });
      
      // If you want to simulate success instead, uncomment the following and comment out the above:
      // toast({
      //   title: 'Payment successful',
      //   description: 'Your order has been paid successfully.',
      // });
      // onSuccess();
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Complete your payment for order #{order.id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChange={handleInputChange}
              maxLength={19}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardHolder">Card Holder Name</Label>
            <Input
              id="cardHolder"
              name="cardHolder"
              placeholder="John Doe"
              value={paymentInfo.cardHolder}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={handleInputChange}
                maxLength={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                placeholder="123"
                type="password"
                value={paymentInfo.cvv}
                onChange={handleInputChange}
                maxLength={3}
                required
              />
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">Order Summary</p>
            <div className="flex justify-between items-center font-semibold">
              <span>Total Amount:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleSubmit}
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay $${order.totalAmount.toFixed(2)}`}
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderPayment;
