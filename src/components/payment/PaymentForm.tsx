import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the form schema
const paymentFormSchema = z.object({
  cardNumber: z.string()
    .min(16, { message: 'Card number must be at least 16 digits' })
    .max(19, { message: 'Card number must be less than 19 digits' })
    .regex(/^[0-9\s-]+$/, { message: 'Card number must contain only digits, spaces, or hyphens' }),
  cardName: z.string().min(3, { message: 'Cardholder name is required' }),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: 'Expiry date must be in MM/YY format' }),
  cvv: z.string()
    .min(3, { message: 'CVV must be at least 3 digits' })
    .max(4, { message: 'CVV must be less than 5 digits' })
    .regex(/^[0-9]+$/, { message: 'CVV must contain only digits' }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  mentorName?: string;
  sessionDate?: string;
  sessionTime?: string;
  onSuccess?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingId,
  amount,
  mentorName = 'your mentor',
  sessionDate = 'the scheduled date',
  sessionTime = 'the scheduled time',
  onSuccess,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Handle form submission
  const onSubmit = async (values: PaymentFormValues) => {
    setIsSubmitting(true);
    
    try {
      // This is a placeholder implementation
      // In a real implementation, we would integrate with Stripe or another payment processor
      
      console.log('Payment submitted:', {
        bookingId,
        amount,
        ...values,
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success state
      setIsSuccess(true);
      
      toast({
        title: 'Payment Successful',
        description: `Your session with ${mentorName} has been confirmed.`,
      });
      
      // Wait a moment before redirecting
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-center mb-2">Payment Successful!</h2>
            <p className="text-center text-muted-foreground mb-6">
              Your session with {mentorName} on {sessionDate} at {sessionTime} has been confirmed.
            </p>
            <p className="text-center font-medium mb-6">
              Amount paid: ${amount.toFixed(2)}
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Secure payment for your session with {mentorName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Session Details:</span>
            <span className="text-sm font-medium">{sessionDate} at {sessionTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Amount:</span>
            <span className="text-lg font-bold">${amount.toFixed(2)}</span>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="1234 5678 9012 3456" 
                        {...field} 
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        className="pl-10"
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/YY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="password" 
                          placeholder="123" 
                          {...field} 
                          className="pl-10"
                          maxLength={4}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay ${amount.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col space-y-4">
        <div className="flex items-center justify-center w-full">
          <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Your payment information is secure and encrypted
          </p>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Note: This is a placeholder payment form. In a real implementation, this would be integrated with Stripe or another payment processor.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
