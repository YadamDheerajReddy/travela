import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app';
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          profileCompleted: false
        });
        navigate('/complete-profile');
      } else {
        navigate(from, { replace: true });
      }

      toast.success('Welcome!');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Sign in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-montserrat font-bold text-accent-night">
            TRAVELA
          </h1>
          <p className="mt-4 text-accent-night/80">
            Your personal travel companion
          </p>
          <div className="h-px w-12 mx-auto mt-6 bg-accent-night/20" />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-soft">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-accent-night mb-2">Welcome Back!</h2>
            <p className="text-sm text-gray-600">Sign in to plan your next adventure</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-accent-sunset hover:bg-accent-sunset/90 text-white py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium tracking-wide">Continue with Google</span>
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>By signing in, you agree to our</p>
            <p className="mt-1">
              <button onClick={() => setShowTermsModal(true)} className="text-accent-forest hover:underline">Terms of Service</button>
              {' & '}
              <button onClick={() => setShowPrivacyModal(true)} className="text-accent-forest hover:underline">Privacy Policy</button>
            </p>
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-accent-night mb-4">Terms of Service</h3>
            <div className="prose prose-sm">
              <h4 className="font-semibold">1. Acceptance of Terms</h4>
              <p>By accessing and using Travela's services, you agree to be bound by these Terms of Service.</p>
              
              <h4 className="font-semibold mt-4">2. User Accounts</h4>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
              
              <h4 className="font-semibold mt-4">3. User Content</h4>
              <p>You retain ownership of content you submit but grant Travela a license to use, store, and share this content.</p>
              
              <h4 className="font-semibold mt-4">4. Prohibited Activities</h4>
              <p>Users may not engage in illegal activities, harassment, or actions that interfere with the service's operation.</p>
              
              <h4 className="font-semibold mt-4">5. Service Modifications</h4>
              <p>Travela reserves the right to modify or discontinue services with reasonable notice to users.</p>
              
              <h4 className="font-semibold mt-4">6. Limitation of Liability</h4>
              <p>Travela is not liable for indirect, incidental, or consequential damages arising from use of the service.</p>
            </div>
            <button 
              onClick={() => setShowTermsModal(false)}
              className="mt-6 w-full bg-accent-sunset text-white py-2 rounded-xl hover:bg-accent-sunset/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-accent-night mb-4">Privacy Policy</h3>
            <div className="prose prose-sm">
              <h4 className="font-semibold">1. Information We Collect</h4>
              <p>We collect information you provide directly, including account details and travel preferences. We also collect usage data and device information.</p>
              
              <h4 className="font-semibold mt-4">2. How We Use Your Information</h4>
              <p>We use your information to provide and improve our services, personalize your experience, and communicate with you about updates and offers.</p>
              
              <h4 className="font-semibold mt-4">3. Information Sharing</h4>
              <p>We do not sell your personal information. We share information with service providers and partners only as necessary to provide our services.</p>
              
              <h4 className="font-semibold mt-4">4. Data Security</h4>
              <p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>
              
              <h4 className="font-semibold mt-4">5. Your Rights</h4>
              <p>You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications.</p>
              
              <h4 className="font-semibold mt-4">6. Cookies and Tracking</h4>
              <p>We use cookies and similar technologies to improve user experience and analyze service usage.</p>
              
              <h4 className="font-semibold mt-4">7. Updates to Policy</h4>
              <p>We may update this policy periodically. We will notify you of significant changes via email or service notifications.</p>
            </div>
            <button 
              onClick={() => setShowPrivacyModal(false)}
              className="mt-6 w-full bg-accent-sunset text-white py-2 rounded-xl hover:bg-accent-sunset/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;