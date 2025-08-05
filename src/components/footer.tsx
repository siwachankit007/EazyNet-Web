import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// Privacy Policy Component
function PrivacyPolicy() {
  return (
    <div className="prose prose-sm max-w-none">
      <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
      <p className="mb-4">Last updated: January 2025</p>
      
      <h3 className="text-lg font-semibold mb-2">Information We Collect</h3>
      <p className="mb-4">EazyNet collects minimal information necessary to provide our tab management service. This includes:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Browser tab information (URLs, titles) for grouping and organization</li>
        <li>User preferences and settings for the extension</li>
        <li>Account information when you sign up (email, name)</li>
      </ul>
      
      <h3 className="text-lg font-semibold mb-2">How We Use Your Information</h3>
      <p className="mb-4">We use the collected information to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide tab management and grouping functionality</li>
        <li>Improve our extension features and user experience</li>
        <li>Send important updates about our service</li>
        <li>Provide customer support</li>
      </ul>
      
      <h3 className="text-lg font-semibold mb-2">Data Security</h3>
      <p className="mb-4">We implement industry-standard security measures to protect your data. Your tab information is processed locally in your browser and is not stored on our servers unless you explicitly choose to sync your settings.</p>
      
      <h3 className="text-lg font-semibold mb-2">Third-Party Services</h3>
      <p className="mb-4">We use trusted third-party services for authentication (Google) and analytics. These services have their own privacy policies.</p>
      
      <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
      <p className="mb-4">If you have questions about this privacy policy, please contact us at <a href="mailto:eazynettabmanager@gmail.com" className="text-blue-600 underline">eazynettabmanager@gmail.com</a></p>
    </div>
  );
}

// Terms & Conditions Component
function TermsAndConditions() {
  return (
    <div className="prose prose-sm max-w-none">
      <h2 className="text-2xl font-bold mb-4">Terms &amp; Conditions</h2>
      <p className="mb-4">Last updated: January 2025</p>
      
      <h3 className="text-lg font-semibold mb-2">Acceptance of Terms</h3>
      <p className="mb-4">By using EazyNet, you agree to be bound by these terms and conditions. If you do not agree to these terms, please do not use our service.</p>
      
      <h3 className="text-lg font-semibold mb-2">Service Description</h3>
      <p className="mb-4">EazyNet is a Chrome extension that helps users organize and manage browser tabs. Our service includes:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Automatic tab grouping by domain</li>
        <li>Search functionality for tabs</li>
        <li>Tab organization and management tools</li>
        <li>Settings synchronization (Pro users)</li>
      </ul>
      
      <h3 className="text-lg font-semibold mb-2">User Responsibilities</h3>
      <p className="mb-4">As a user of EazyNet, you agree to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Use the service in compliance with applicable laws</li>
        <li>Not attempt to reverse engineer or modify the extension</li>
        <li>Not use the service for malicious purposes</li>
        <li>Respect intellectual property rights</li>
      </ul>
      
      <h3 className="text-lg font-semibold mb-2">Limitation of Liability</h3>
      <p className="mb-4">EazyNet is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from the use of our service.</p>
      
      <h3 className="text-lg font-semibold mb-2">Changes to Terms</h3>
      <p className="mb-4">We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
      
      <h3 className="text-lg font-semibold mb-2">Contact</h3>
      <p className="mb-4">For questions about these terms, contact us at <a href="mailto:eazynettabmanager@gmail.com" className="text-blue-600 underline">eazynettabmanager@gmail.com</a></p>
    </div>
  );
}

// Policy Modal Component
function PolicyModal({ isOpen, onClose, type }: { 
  isOpen: boolean; 
  onClose: () => void; 
  type: 'privacy' | 'terms' | null;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !type) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white max-w-3xl mx-auto rounded-xl shadow-lg p-8 relative overflow-y-auto max-h-[80vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-3xl leading-none"
          aria-label="Close modal"
        >
          &times;
        </button>
        
        {/* Modal Content */}
        {type === 'privacy' && <PrivacyPolicy />}
        {type === 'terms' && <TermsAndConditions />}
      </div>
    </div>
  );
}

export function Footer() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'privacy' | 'terms' | null;
  }>({
    isOpen: false,
    type: null
  });

  const openModal = (type: 'privacy' | 'terms') => {
    setModalState({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Three Columns: Brand+Quick Links, Contact Info, Follow Us */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 h-full">
            {/* Brand + Quick Links (left-aligned, top) */}
            <div className="flex flex-col items-start h-full">
              <div className="mb-4">
                <Link href="/" className="flex items-center space-x-3">
                  <Image src="/images/Logo.png" alt="EazyNet Logo" width={32} height={32} className="h-8 w-auto mr-3" />
                  <h3 className="text-2xl font-semibold">EazyNet</h3>
                </Link>
              </div>
              <h4 className="font-semibold text-lg text-gray-300 mb-2">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link href="/#features" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><Link href="/#contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            {/* Contact Info (left-aligned, full height) */}
            <div className="flex flex-col items-start h-full">
              <h4 className="font-semibold text-lg text-gray-300 mb-4">Contact Info</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="mailto:eazynettabmanager@gmail.com" className="hover:text-blue-400 transition-colors">
                    eazynettabmanager@gmail.com
                  </a>
                </li>
              </ul>
            </div>
            {/* Follow Us (left-aligned, full height) */}
            <div className="flex flex-col items-start h-full">
              <h4 className="font-semibold text-lg text-gray-300 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://x.com/eazynetmanager" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@EazyNetTabManager" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/eazynetapp" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://www.reddit.com/user/These-Street-6034/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Legal and Copyright Info */}
          <div className="border-t border-gray-700 pt-6 mt-6 text-center text-sm text-gray-400" >
            <p>&copy; 2025 EazyNet. All Rights Reserved.</p>
            <button 
              onClick={() => openModal('privacy')}
              className="policy-link hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1"
            >
              Privacy Policy
            </button>
            {" | "}
            <button 
              onClick={() => openModal('terms')}
              className="policy-link hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </footer>
      <footer className="bg-slate-100 py-4 text-center text-sm text-gray-600">
        🙋 Got ideas or feedback? <a href="https://tally.so/r/3XkNpg" target="_blank" className="text-blue-600 underline hover:text-blue-800">Tell us here</a>
      </footer>

      {/* Policy Modal */}
      <PolicyModal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        type={modalState.type}
      />
    </>
  )
}