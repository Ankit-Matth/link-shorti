'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Send, 
  Loader2,
  ShieldCheck,
  Zap,
  UserCheck
} from 'lucide-react';

const FeatureHighlight = ({ icon: Icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
      <Icon className="h-6 w-6" aria-hidden="true" />
    </div>
    <div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{children}</p>
    </div>
  </div>
);

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { data: session } = useSession();

  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(!!token);

  const handleSendEmail = async () => {
    if (!session?.user?.email) return;

    setIsLoading(true);
    setNotification({ message: '', type: '' });

    try {
      const res = await axios.post('/api/verify', { email: session.user.email });
      if (res.data.success) {
        setNotification({ 
          message: 'A new verification link has been sent. Please check your inbox.', 
          type: 'success' 
        });
      } else {
        setNotification({ 
          message: res.data.message || 'Failed to send verification email.', 
          type: 'error' 
        });
      }
    } catch (err) {
      setNotification({ 
        message: 'An unexpected error occurred. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async () => {
      if (!token) return;

      setIsLoading(true);
      setNotification({ message: '', type: '' });
      try {
        const res = await axios.get(`/api/verify?token=${token}`);
        if (res.data.success) {
          await signIn('credentials', { user: res.data.user, redirect: true, callbackUrl: '/dashboard' });

          setNotification({ 
            message: 'Email verified successfully! Redirecting you...', 
            type: 'success' 
          });

          setTimeout(() => {
            router.push('/dashboard');
          }, 2500);

        } else {
          setNotification({ 
            message: 'Verification link is invalid or has expired. Please request a new one.', 
            type: 'error' 
          });
        }
      } catch (err) {
        setNotification({ 
          message: 'Verification failed. The link may be invalid or expired.', 
          type: 'error' 
        });
      } finally {
        setIsLoading(false);
      }
    };

  const VerificationStatus = () => {
    if (isLoading && token) {
      return (
        <div className="text-center space-y-3">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-400" />
          <p className="font-semibold text-slate-700">Verifying your email...</p>
          <p className="text-sm text-slate-500">This will only take a moment.</p>
          <button onClick={()=>{verifyToken()}} className='bg-green-400 px-3 py-1 rounded-md text-white'>Click Here</button>
        </div>
      );
    }

    if (notification.message) {
      const isError = notification.type === 'error';
      return (
        <div className="text-center space-y-4">
          {isError ? (
            <XCircle className="mx-auto h-10 w-10 text-red-500" />
          ) : (
            <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
          )}
          <p className={`text-base font-medium ${isError ? 'text-red-700' : 'text-green-700'}`}>
            {notification.message}
          </p>
          {isError && (
             <button
                onClick={handleSendEmail}
                disabled={isLoading || !session?.user}
                className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                Resend Verification Link
              </button>
          )}
        </div>
      );
    }
    
    if (session?.user && !session.user.isEmailVerified) {
        return (
            <div className="space-y-4 text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
              <p className="text-lg font-semibold text-slate-800">Please verify your email</p>
              <p className="text-sm text-slate-500">
                  To complete your setup, we need to confirm your email address. Click the button below to send a verification link.
              </p>
              <button
                onClick={handleSendEmail}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                Send Verification Link
              </button>
            </div>
        )
    }

    return null;
  };

  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-2">
      <div className="hidden bg-slate-50 p-10 lg:flex lg:flex-col lg:justify-center">
        <div className="space-y-6">
          <FeatureHighlight icon={ShieldCheck} title="Enhanced Security">
            Verifying your email adds an essential layer of security to your account, protecting your data.
          </FeatureHighlight>
          <FeatureHighlight icon={Zap} title="Instant Access">
            Unlock all features and capabilities of our platform immediately after successful verification.
          </FeatureHighlight>
          <FeatureHighlight icon={UserCheck} title="Personalized Experience">
            A verified account allows us to provide you with better support and a more tailored experience.
          </FeatureHighlight>
        </div>
      </div>

      <main className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Account Verification
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        {session?.user ? `Welcome, ${session.user.fullName}!` : 'Secure your account.'}
                    </p>
                </div>
                
                <div className="min-h-[160px] flex items-center justify-center">
                    <VerificationStatus />
                </div>
            </div>
            <p className="mt-8 text-center text-sm text-slate-500">
                Need help?{' '}
                <a href="/contact" className="font-medium text-indigo-600 hover:underline">
                    Contact Support
                </a>
            </p>
          </div>
      </main>
    </div>
  );
}