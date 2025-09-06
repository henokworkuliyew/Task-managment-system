'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../redux/hooks';
import { verifyOtp } from '../../redux/slices/authSlice';

interface OtpVerificationFormProps {
  type?: 'email-verification' | 'password-reset';
  email?: string;
}

export default function OtpVerificationForm({ type = 'email-verification', email: propEmail }: OtpVerificationFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = propEmail || searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    if (el) inputRefs.current[index] = el;
  };

  useEffect(() => {
    // Focus the first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];
    
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus the appropriate input after paste
    if (digits.length < 6 && inputRefs.current[digits.length]) {
      inputRefs.current[digits.length]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(verifyOtp({
        email,
        otp: otpValue,
        type: type === 'email-verification' ? 'email_verification' : 'password_reset'
      }));
      
      if (verifyOtp.fulfilled.match(resultAction)) {
        toast.success(type === 'email-verification' 
          ? 'Email verified successfully!' 
          : 'OTP verified successfully!');
        
        if (type === 'email-verification') {
          router.push('/auth/login');
        } else {
          router.push(`/auth/reset-password?email=${email}&token=${resultAction.payload.token}`);
        }
      } else if (verifyOtp.rejected.match(resultAction)) {
        toast.error(resultAction.payload as string || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = () => {
    // Implement resend OTP functionality
    toast.info('A new OTP has been sent to your email.');
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
        {type === 'email-verification' ? 'Verify Your Email' : 'Verify OTP'}
      </h2>
      <p className="text-center text-gray-600 mb-6">
        {type === 'email-verification'
          ? 'We have sent a verification code to your email.'
          : 'Enter the 6-digit code sent to your email to reset your password.'}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Verification Code
          </label>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={setInputRef(index)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting || otp.join('').length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Resend OTP
            </button>
          </p>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="text-sm font-medium text-gray-600 hover:text-gray-500"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}