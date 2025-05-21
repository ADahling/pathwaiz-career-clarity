import React, { useState } from 'react';
import './PromoCodeInput.css';

interface PromoCodeInputProps {
  onApply: (code: string) => Promise<boolean>;
  onRemove: () => void;
  disabled?: boolean;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ 
  onApply, 
  onRemove, 
  disabled = false 
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [appliedCode, setAppliedCode] = useState('');

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a promo code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Call the onApply function to validate the code
      const success = await onApply(code);
      
      if (success) {
        setApplied(true);
        setAppliedCode(code);
        setCode('');
      } else {
        setError('Invalid or expired promo code');
      }
    } catch (err) {
      setError('Failed to apply promo code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setApplied(false);
    setAppliedCode('');
    onRemove();
  };

  return (
    <div className="promo-code-container">
      {!applied ? (
        <>
          <div className="promo-code-input-group">
            <input
              type="text"
              className="promo-code-input"
              placeholder="Enter promo code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={disabled || loading}
            />
            <button
              className="promo-code-apply-button"
              onClick={handleApply}
              disabled={disabled || loading || !code.trim()}
            >
              {loading ? (
                <>
                  <span className="promo-spinner"></span>
                  Applying...
                </>
              ) : (
                'Apply'
              )}
            </button>
          </div>
          {error && <div className="promo-code-error">{error}</div>}
        </>
      ) : (
        <div className="promo-code-applied">
          <div className="promo-code-applied-info">
            <svg className="promo-code-success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="promo-code-applied-text">
              Promo code <strong>{appliedCode}</strong> applied
            </span>
          </div>
          <button
            className="promo-code-remove-button"
            onClick={handleRemove}
            disabled={disabled}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default PromoCodeInput;
