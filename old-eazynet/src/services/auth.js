import { supabase } from '../config/supabase.js';

// -------------------- Constants & Utilities --------------------
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_]).{8,}$/;

function showLoader() {
  const loader = document.getElementById("loader-overlay");
  if (loader) {
    loader.style.display = "flex";
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.3s ease-in-out";
    
    // Trigger fade-in animation
    setTimeout(() => {
      loader.style.opacity = "1";
    }, 10);
  }
}

function hideLoader() {
  const loader = document.getElementById("loader-overlay");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 300);
  }
}

// -------------------- Form Validation --------------------
class FormValidator {
  constructor(formId, validations, onSubmit) {
    this.formId = formId;
    this.form = document.querySelector(`#${formId} form`);
    this.validations = validations;
    this.onSubmit = onSubmit;
    this.isInitialized = false;
    this.fields = {};
  }

  validateField(input, validation, showMessage = true) {
    if (!input) return false;
    
    const value = input.value.trim();
    const messageEl = document.getElementById(`${input.id}-msg`);
    if (!messageEl) return false;
    
    // Reset validation state
    input.classList.remove('border-red-400', 'border-green-400', 'shake');
    messageEl.classList.add('hidden');
    
    if (!value) {
      if (showMessage) {
        messageEl.textContent = validation.errorMsg;
        messageEl.className = "text-sm mt-1 text-red-300";
        messageEl.classList.remove('hidden');
        input.classList.add('border-red-400', 'shake');
        // Remove shake class after animation completes
        setTimeout(() => input.classList.remove('shake'), 400);
      }
      return false;
    }

    const isValid = validation.validator(value);
    
    // Update UI
    if (isValid) {
      messageEl.textContent = validation.successMsg;
      messageEl.className = "text-sm mt-1 text-green-400";
      input.classList.add('border-green-400');
    } else {
      messageEl.textContent = validation.errorMsg;
      messageEl.className = "text-sm mt-1 text-red-300";
      input.classList.add('border-red-400');
      if (showMessage) {
        input.classList.add('shake');
        // Remove shake class after animation completes
        setTimeout(() => input.classList.remove('shake'), 400);
      }
    }
    if (showMessage) {
      messageEl.classList.remove('hidden');
    }
    
    return isValid;
  }

  validateAllFields() {
    return Object.entries(this.validations).every(([inputId, validation]) => {
      const input = document.getElementById(inputId);
      return this.validateField(input, validation, true);
    });
  }

  checkForAutoFill() {
    Object.entries(this.validations).forEach(([inputId, validation]) => {
      const input = document.getElementById(inputId);
      if (input?.value) {
        this.validateField(input, validation, true);
      }
    });
  }

  setupFieldValidation(inputId, validation) {
    const input = document.getElementById(inputId);
    if (!input) return;

    // Store field reference
    this.fields[inputId] = input;

    // Remove any existing listeners
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    
    // Live validation on input
    newInput.addEventListener('input', () => {
      this.validateField(newInput, validation, true);
    });

    // Validate on blur
    newInput.addEventListener('blur', () => {
      if (newInput.value) {
        this.validateField(newInput, validation, true);
      }
    });

    // Validate on change (helps with auto-fill)
    newInput.addEventListener('change', () => {
      if (newInput.value) {
        this.validateField(newInput, validation, true);
      }
    });

    // Initial validation if has value
    if (newInput.value) {
      this.validateField(newInput, validation, true);
    }

    // Watch for auto-fill using animation
    newInput.addEventListener('animationstart', (e) => {
      if (e.animationName === 'onAutoFillStart') {
        this.validateField(newInput, validation, true);
      }
    });
  }

  initialize() {
    if (this.isInitialized || !this.form) return;

    // Add auto-fill detection styles if not already present
    if (!document.getElementById('autofill-styles')) {
      const style = document.createElement('style');
      style.id = 'autofill-styles';
      style.textContent = `
        @keyframes onAutoFillStart { from {} to {} }
        input:-webkit-autofill {
          animation-name: onAutoFillStart;
        }
      `;
      document.head.appendChild(style);
    }

    // Set up field validations
    Object.entries(this.validations).forEach(([inputId, validation]) => {
      this.setupFieldValidation(inputId, validation);
    });

    // Handle form submission
    const newForm = this.form.cloneNode(true);
    this.form.parentNode.replaceChild(newForm, this.form);
    this.form = newForm;
    
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Check for auto-filled values before submission
      this.checkForAutoFill();
      
      if (this.validateAllFields()) {
        await this.onSubmit();
      }
    });

    // Check for auto-fill after a short delay
    setTimeout(() => this.checkForAutoFill(), 100);

    this.isInitialized = true;
  }
}

// -------------------- Form Configurations --------------------
const loginValidations = {
  'loginEmail': {
    validator: value => emailRegex.test(value),
    successMsg: 'Valid email',
    errorMsg: 'Enter a valid email'
  },
  'loginPassword': {
    validator: value => value.length >= 6,
    successMsg: 'Looks good',
    errorMsg: 'Password must be 6+ characters'
  }
};

const signupValidations = {
  'name': {
    validator: value => value.trim().length >= 2,
    successMsg: 'Looks good',
    errorMsg: 'Name must be at least 2 characters'
  },
  'signupEmail': {
    validator: value => emailRegex.test(value),
    successMsg: 'Valid email',
    errorMsg: 'Enter a valid email'
  },
  'signupPassword': {
    validator: value => passwordRegex.test(value),
    successMsg: 'Strong password ✔',
    errorMsg: 'Min 8 chars, A-Z, a-z, 0-9, and a symbol'
  }
};

// -------------------- Form Initialization --------------------
let loginValidator;
let signupValidator;

function switchToLogin() {
  const flipCheckbox = document.getElementById("flip");
  if (flipCheckbox) {
    flipCheckbox.checked = false;
  }
}

function initializeForms() {
  // Initialize login form
  loginValidator = new FormValidator('login-form', loginValidations, async () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    showLoader();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    hideLoader();
    
    if (error) {
      const msgEl = document.getElementById('loginPassword-msg');
      msgEl.textContent = error.message;
      msgEl.className = "text-sm mt-1 text-red-300";
      msgEl.classList.remove('hidden');
    } else {
      EazyNavigation.authRedirect('../pages/dashboard.html');
    }
  });

  // Initialize signup form
  signupValidator = new FormValidator('signup-form', signupValidations, async () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    // Validate all fields before proceeding
    if (!signupValidator.validateAllFields()) {
      return;
    }

    showLoader();
    
    // Check if user exists using Supabase RPC
    const { data: exists, error: checkError } = await supabase
      .rpc('check_user_exists', { email_to_check: email });

    if (checkError) {
      hideLoader();
      const msgEl = document.getElementById('signupPassword-msg');
      msgEl.textContent = "An error occurred. Please try again.";
      msgEl.className = "text-sm mt-1 text-red-300";
      msgEl.classList.remove('hidden');
      return;
    }

    // If user exists, show login option
    if (exists) {
      hideLoader();
      const msgEl = document.getElementById('signupPassword-msg');
      msgEl.innerHTML = 'This email is already registered. <button type="button" class="text-blue-500 hover:underline" id="switch-to-login">Login instead?</button>';
      msgEl.className = "text-sm mt-1 text-red-300";
      msgEl.classList.remove('hidden');
      
      // Add click handler for the "Login instead?" button
      const switchButton = document.getElementById('switch-to-login');
      if (switchButton) {
        switchButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Pre-fill the login email
          const loginEmail = document.getElementById('loginEmail');
          if (loginEmail) {
            loginEmail.value = email;
            // Trigger validation
            loginValidator.validateField(loginEmail, loginValidations.loginEmail, true);
          }
          switchToLogin();
        });
      }
      return;
    }

    // If user doesn't exist, proceed with signup
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          isPro: false,
          isTrial: false,
          trialstartedat: null,
          trialendsat: null
        }
      }
    });
    hideLoader();

    const msgEl = document.getElementById('signupPassword-msg');
    if (error) {
      console.log(error);
      msgEl.textContent = error.message;
      msgEl.className = "text-sm mt-1 text-red-300";
    } else {
      msgEl.textContent = "Signup successful! Check your email.";
      msgEl.className = "text-sm mt-1 text-green-400";
    }
    msgEl.classList.remove('hidden');
  });

  // Initialize both forms
  loginValidator.initialize();
  signupValidator.initialize();

  // Re-setup toggle buttons after form initialization
  setTimeout(() => {
    setupFormToggleButtons();
    loginValidator.checkForAutoFill();
    signupValidator.checkForAutoFill();
  }, 100);
}

// -------------------- Toggle Button Setup --------------------
function setupFormToggleButtons() {
  const flipCheckbox = document.getElementById("flip");
  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");

  // Remove existing listeners by cloning buttons
  if (showSignup) {
    const newShowSignup = showSignup.cloneNode(true);
    showSignup.parentNode.replaceChild(newShowSignup, showSignup);
    newShowSignup.addEventListener("click", (e) => {
      e.preventDefault();
      flipCheckbox.checked = true;
    });
  }

  if (showLogin) {
    const newShowLogin = showLogin.cloneNode(true);
    showLogin.parentNode.replaceChild(newShowLogin, showLogin);
    newShowLogin.addEventListener("click", (e) => {
      e.preventDefault();
      flipCheckbox.checked = false;
    });
  }
}

// -------------------- Event Listeners --------------------
document.addEventListener('DOMContentLoaded', () => {
  // Initialize forms first
  initializeForms();
  
  // Setup toggle buttons after form initialization
  setupFormToggleButtons();
  
  // Setup Google OAuth buttons
  setupGoogleOAuth();

  // Handle initial form flip based on URL hash
  const flipCheckbox = document.getElementById("flip");
  flipCheckbox.checked = location.hash === "#signup";
});

// Re-initialize forms when the page becomes visible (but not too often)
let lastVisibilityChange = 0;
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    const now = Date.now();
    // Only re-initialize if it's been more than 2 seconds since last time
    if (now - lastVisibilityChange > 2000) {
      lastVisibilityChange = now;
      initializeForms();
      setupFormToggleButtons();
    }
  }
});

// -------------------- Google OAuth --------------------
function handleGoogleOAuth(e) {
  e.preventDefault();
  
  showLoader();
  
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: { access_type: 'offline', prompt: 'consent' },
      redirectTo: `${window.location.origin}/src/pages/dashboard.html`
    }
  }).then(() => {
    console.log('OAuth initiated');
  }).catch(error => {
    console.error('OAuth error:', error);
    hideLoader();
  });
}

function setupGoogleOAuth() {
  const googleLoginBtn = document.getElementById('google-login');
  const googleSignupBtn = document.getElementById('google-signup');
  
 

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', handleGoogleOAuth);
  }
  
  if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', handleGoogleOAuth);
  }
}
