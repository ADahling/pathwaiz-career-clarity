import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import './SavedPaymentMethods.css';

interface SavedPaymentMethodsProps {
  userId: string;
  onSelect?: (methodId: string) => void;
}

const SavedPaymentMethods: React.FC<SavedPaymentMethodsProps> = ({ userId, onSelect }) => {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, [userId]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError('');

      // In a real implementation, this would fetch from Supabase
      // For demo purposes, we're using mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockMethods = [
        {
          id: 'pm_1',
          type: 'card',
          card_brand: 'visa',
          card_last4: '4242',
          card_exp_month: 12,
          card_exp_year: 2025,
          is_default: true
        },
        {
          id: 'pm_2',
          type: 'card',
          card_brand: 'mastercard',
          card_last4: '5555',
          card_exp_month: 10,
          card_exp_year: 2024,
          is_default: false
        }
      ];
      
      setPaymentMethods(mockMethods);
      
      // Set default selected method
      const defaultMethod = mockMethods.find(method => method.is_default);
      if (defaultMethod) {
        setSelectedMethod(defaultMethod.id);
        if (onSelect) {
          onSelect(defaultMethod.id);
        }
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Failed to load saved payment methods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    if (onSelect) {
      onSelect(methodId);
    }
  };

  const handleDeleteMethod = async (methodId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      setLoading(true);
      
      // In a real implementation, this would delete from Stripe and Supabase
      // For demo purposes, we're just updating the state
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPaymentMethods(prevMethods => prevMethods.filter(method => method.id !== methodId));
      
      if (selectedMethod === methodId) {
        const nextMethod = paymentMethods.find(method => method.id !== methodId);
        if (nextMethod) {
          setSelectedMethod(nextMethod.id);
          if (onSelect) {
            onSelect(nextMethod.id);
          }
        } else {
          setSelectedMethod(null);
          if (onSelect) {
            onSelect('');
          }
        }
      }
    } catch (err) {
      console.error('Error deleting payment method:', err);
      setError('Failed to delete payment method. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return (
          <svg className="card-icon visa" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102h2.037zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.603.725-1.16.734-.975.016-1.541-.263-1.99-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.375-2.564zm5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488l.233 1.12zm-2.163-2.656l1.02-2.815.588 2.815h-1.608zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496h1.938z" />
          </svg>
        );
      case 'mastercard':
        return (
          <svg className="card-icon mastercard" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.242-4.107 1.242C3.32 19.419 0 16.099 0 12.001 0 7.904 3.32 4.582 7.417 4.582c1.518 0 2.931.458 4.108 1.242a5.112 5.112 0 00-.181.146c-.06.049-.116.1-.173.152a7.451 7.451 0 00-3.754-1.021c-4.107 0-7.418 3.312-7.418 7.418s3.311 7.418 7.418 7.418c1.424 0 2.748-.404 3.874-1.102.057.052.114.102.172.151l-.12.045zm1.315-1.107c.056-.049.107-.1.161-.151a7.419 7.419 0 001.153-8.507 7.36 7.36 0 00-1.153-1.76c-.054-.051-.105-.102-.161-.151-.058-.051-.118-.1-.177-.149a7.424 7.424 0 00-4.786-1.75c-1.485 0-2.886.435-4.054 1.185C2.929 6.602 2.52 7.621 2.229 8.72a7.424 7.424 0 2.229 6.281c1.168.75 2.569 1.185 4.054 1.185a7.417 7.417 0 004.786-1.75c.059-.049.119-.099.177-.15l-.12.045zm-.177-12.124c-1.177-.783-2.59-1.242-4.107-1.242C4.32.558 1 3.878 1 7.976c0 4.098 3.32 7.418 7.417 7.418 1.518 0 2.931-.458 4.108-1.242a7.355 7.355 0 001.315-1.107c.056-.049.107-.1.161-.151a7.419 7.419 0 001.153-8.507 7.36 7.36 0 00-1.153-1.76c-.054-.051-.105-.102-.161-.151-.058-.051-.118-.1-.177-.149L12.658 2.3l-.177.5zm1.315 1.107c.058.049.12.098.181.146 2.286 2.133 2.824 5.557.879 8.3a6.019 6.019 0 01-.879 1.039 5.147 5.147 0 01-.181.146c-.06.049-.116.1-.173.152.058-.051.113-.103.166-.156a7.424 7.424 0 001.587-2.425c.309-1.099.384-2.236.233-3.352a7.424 7.424 0 00-1.82-4.281c-.053-.053-.108-.105-.166-.156.057.052.114.102.173.151l-.12.045z" />
          </svg>
        );
      case 'amex':
        return (
          <svg className="card-icon amex" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.588 10.81h-1.17v-3.7l-2.16 3.7h-1.69V4.63h1.54v3.79l2.17-3.79h1.3v6.18zm-5.93-2.55c0 .3-.05.59-.17.84-.11.25-.27.47-.48.65-.21.18-.47.32-.77.42-.3.1-.64.15-1.02.15h-1.63V4.63h1.7c.36 0 .69.05.97.15.28.1.52.24.72.42.2.18.35.39.46.64.11.25.16.52.16.83v1.59h.06zm-1.35-.03c0-.17-.03-.32-.08-.45-.05-.13-.13-.24-.23-.33-.1-.09-.22-.15-.36-.2-.14-.04-.3-.07-.48-.07h-.44v2.19h.35c.2 0 .38-.02.53-.07.15-.05.28-.12.38-.21.1-.09.18-.2.23-.34.05-.14.08-.3.08-.49v-.03h.02zm-4.49 2.58H9.24L7.79 8.8l-1.44 2.01h-1.6l2.24-3.13-2.08-3.05h1.7l1.28 1.92L9.14 4.6h1.48l-2.07 3.02 2.24 3.16zm14.2 3.71h-1.42v-.43h-.02c-.1.17-.24.3-.42.4-.18.1-.38.15-.6.15-.49 0-.84-.12-1.06-.38-.22-.25-.33-.65-.33-1.22V9.12h1.47v3.61c0 .2.03.34.1.42.07.08.18.12.33.12.18 0 .32-.06.41-.17.09-.11.14-.29.14-.53V9.12h1.47v5.4h-.07zm-4.44-4.17c-.09-.11-.2-.2-.32-.26-.12-.06-.27-.09-.44-.09-.16 0-.31.03-.44.09-.13.06-.24.15-.33.26-.09.11-.16.25-.21.4-.05.16-.07.33-.07.52 0 .19.02.37.07.52.05.15.12.29.21.4.09.11.2.2.33.26.13.06.28.09.44.09.17 0 .32-.03.44-.09.12-.06.23-.15.32-.26.09-.11.16-.25.21-.4.05-.15.07-.33.07-.52 0-.19-.02-.36-.07-.52-.05-.15-.12-.29-.21-.4zm.59 2.61c-.14.26-.34.47-.59.62-.25.15-.55.22-.9.22-.35 0-.65-.07-.9-.22-.25-.15-.45-.36-.59-.62-.14-.26-.21-.57-.21-.92 0-.35.07-.66.21-.92.14-.26.34-.47.59-.62.25-.15.55-.22.9-.22.35 0 .65.07.9.22.25.15.45.36.59.62.14.26.21.57.21.92 0 .35-.07.66-.21.92zm-3.9 1.56h-1.47V9.12h1.47v5.4zM17.3 8.38c-.5 0-.75-.28-.75-.84s.25-.84.75-.84.75.28.75.84-.25.84-.75.84zM15.22 14h-1.47v-3.6c0-.2-.03-.34-.1-.42-.07-.08-.18-.12-.33-.12-.18 0-.32.06-.41.17-.09.11-.14.29-.14.53v3.44H11.3V9.12h1.42v.43h.02c.1-.17.24-.3.42-.4.18-.1.38-.15.6-.15.49 0 .84.12 1.06.38.22.25.33.65.33 1.22V14h.07zm-6.99.52h-1.5v-.74h-.03c-.23.56-.69.84-1.38.84-.27 0-.51-.04-.72-.12-.21-.08-.39-.2-.53-.36-.14-.16-.25-.36-.32-.6-.07-.24-.11-.52-.11-.84V9.12h1.47v3.61c0 .2.03.34.1.42.07.08.18.12.33.12.18 0 .32-.06.41-.17.09-.11.14-.29.14-.53V9.12h1.47v5.4h.67zm-5.5-2.93c0-.17-.03-.32-.08-.45-.05-.13-.13-.24-.23-.33-.1-.09-.22-.15-.36-.2-.14-.04-.3-.07-.48-.07h-.44v2.19h.35c.2 0 .38-.02.53-.07.15-.05.28-.12.38-.21.1-.09.18-.2.23-.34.05-.14.08-.3.08-.49v-.03h.02zm-1.59 2.93H0V4.63h1.7c.36 0 .69.05.97.15.28.1.52.24.72.42.2.18.35.39.46.64.11.25.16.52.16.83v1.59c0 .3-.05.59-.17.84-.11.25-.27.47-.48.65-.21.18-.47.32-.77.42-.3.1-.64.15-1.02.15h-.44v3.68h.01z" />
          </svg>
        );
      default:
        return (
          <svg className="card-icon generic" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
          </svg>
        );
    }
  };

  return (
    <div className="saved-payment-methods">
      <h3 className="saved-payment-methods-title">Saved Payment Methods</h3>
      
      {loading && paymentMethods.length === 0 ? (
        <div className="saved-payment-methods-loading">
          <div className="spinner"></div>
          <p>Loading saved payment methods...</p>
        </div>
      ) : error ? (
        <div className="saved-payment-methods-error">
          <p>{error}</p>
          <button 
            className="saved-payment-methods-retry"
            onClick={fetchPaymentMethods}
          >
            Try Again
          </button>
        </div>
      ) : paymentMethods.length === 0 ? (
        <div className="saved-payment-methods-empty">
          <p>You don't have any saved payment methods.</p>
        </div>
      ) : (
        <div className="saved-payment-methods-list">
          {paymentMethods.map(method => (
            <div 
              key={method.id}
              className={`saved-payment-method ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => handleSelectMethod(method.id)}
            >
              <div className="saved-payment-method-radio">
                <div className="radio-outer">
                  {selectedMethod === method.id && <div className="radio-inner"></div>}
                </div>
              </div>
              
              <div className="saved-payment-method-icon">
                {getCardIcon(method.card_brand)}
              </div>
              
              <div className="saved-payment-method-details">
                <div className="saved-payment-method-name">
                  {method.card_brand.charAt(0).toUpperCase() + method.card_brand.slice(1)} •••• {method.card_last4}
                </div>
                <div className="saved-payment-method-expiry">
                  Expires {method.card_exp_month}/{method.card_exp_year}
                </div>
              </div>
              
              {method.is_default && (
                <div className="saved-payment-method-default">
                  Default
                </div>
              )}
              
              <button 
                className="saved-payment-method-delete"
                onClick={(e) => handleDeleteMethod(method.id, e)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button className="saved-payment-methods-add">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="add-icon">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add New Payment Method
      </button>
    </div>
  );
};

export default SavedPaymentMethods;
