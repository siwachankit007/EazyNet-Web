'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThankYouPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        {/* Main Content */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Thank You!
        </h1>
        
        <p className="text-lg text-gray-200 mb-6">
          Your submission has been received successfully. We appreciate your time!
        </p>

        {/* Countdown Message */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-6">
          <p className="text-white font-medium">
            Redirecting to EazyNet in{' '}
            <span className="text-2xl font-bold text-yellow-300">{countdown}</span>
            {countdown === 1 ? ' second' : ' seconds'}
          </p>
        </div>

        {/* Single Home Button */}
        <Button 
          onClick={handleGoHome}
          className="w-full bg-white text-blue-600 rounded-lg font-semibold py-3 px-6 hover:bg-gray-100 transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Go to Home
        </Button>
      </div>
    </div>
  );
}
