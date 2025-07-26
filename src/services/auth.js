import { supabase } from '../config/supabase.js';

// -------------------- Flip Form Logic --------------------
document.addEventListener("DOMContentLoaded", () => {
  const flipCheckbox = document.getElementById("flip");
  flipCheckbox.checked = location.hash === "#signup";

  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");
  const loginFormEl = document.querySelector("#login-form form");
  const signupFormEl = document.querySelector("#signup-form form");

  const clearValidationMessages = (formEl) => {
    const messages = formEl.querySelectorAll(".text-red-300, .text-red-500, .text-green-400");
    messages.forEach((msg) => msg.classList.add("hidden"));

    const inputs = formEl.querySelectorAll("input");
    inputs.forEach((input) => {
      input.classList.remove("shake", "border-red-400", "border-green-400");
      input.removeAttribute("data-touched");
    });
  };

  showSignup?.addEventListener("click", (e) => {
    e.preventDefault();
    setTimeout(() => {
      clearValidationMessages(loginFormEl);
      flipCheckbox.checked = true;
    }, 50);
  });

  showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    setTimeout(() => {
      clearValidationMessages(signupFormEl);
      flipCheckbox.checked = false;
    }, 50);
  });
});

// -------------------- Element Bindings --------------------
const loginForm = document.getElementById('login-form')?.querySelector('form');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginEmailMsg = document.getElementById('loginEmail-msg');
const loginPasswordMsg = document.getElementById('loginPassword-msg');

const signupForm = document.getElementById('signup-form')?.querySelector('form');
const signupName = document.getElementById('name');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupEmailMsg = document.getElementById('signupEmail-msg');
const signupPasswordMsg = document.getElementById('signupPassword-msg');

const googleLoginBtn = document.getElementById('google-login');
const googleSignupBtn = document.getElementById('google-signup');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_]).{8,}$/;

// -------------------- Validation --------------------
function validateInput(inputEl, msgEl, validator, successMsg, errorMsg) {
  const value = inputEl.value.trim();
  if (!inputEl.dataset.touched) return;

  if (!value) {
    msgEl.classList.add('hidden');
    inputEl.classList.remove('border-red-400', 'border-green-400');
    return;
  }

  if (validator(value)) {
    msgEl.textContent = successMsg;
    msgEl.className = "text-sm mt-1 text-green-400";
    inputEl.classList.add('border-green-400');
    inputEl.classList.remove('border-red-400');
  } else {
    msgEl.textContent = errorMsg;
    msgEl.className = "text-sm mt-1 text-red-300";
    inputEl.classList.add('border-red-400');
    inputEl.classList.remove('border-green-400');
  }
  msgEl.classList.remove('hidden');
}

function markTouched(inputEl) {
  inputEl.dataset.touched = true;
}

setTimeout(() => {
  loginEmail?.addEventListener('input', () => {
    markTouched(loginEmail);
    validateInput(loginEmail, loginEmailMsg, emailRegex.test.bind(emailRegex), 'Valid email', 'Enter a valid email');
  });

  loginPassword?.addEventListener('input', () => {
    markTouched(loginPassword);
    validateInput(loginPassword, loginPasswordMsg, val => val.length >= 6, 'Looks good', 'Password must be 6+ characters');
  });

  signupEmail?.addEventListener('input', () => {
    markTouched(signupEmail);
    validateInput(signupEmail, signupEmailMsg, emailRegex.test.bind(emailRegex), 'Valid email', 'Enter a valid email');
  });

  signupPassword?.addEventListener('input', () => {
    markTouched(signupPassword);
    validateInput(signupPassword, signupPasswordMsg, passwordRegex.test.bind(passwordRegex), 'Strong password ✔', 'Min 8 chars...');
  });
}, 100);

// -------------------- Auth Handlers --------------------
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  if (!emailRegex.test(email) || password.length < 6) return;
  showLoader();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  hideLoader();
  if (error) loginPasswordMsg.textContent = error.message;
  else window.location.href = '../pages/post-auth.html';
});

signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  [signupEmail, signupPassword, signupName].forEach(input => input.classList.remove('shake'));

  let isValid = true;
  if (!emailRegex.test(email)) {
    signupEmailMsg.textContent = "Please enter a valid email.";
    signupEmailMsg.className = "text-sm mt-1 text-red-300";
    signupEmail.classList.add('border-red-400', 'shake');
    isValid = false;
  }
  if (!passwordRegex.test(password)) {
    signupPasswordMsg.textContent = "Min 8 chars, A-Z, a-z, 0-9, and a symbol.";
    signupPasswordMsg.className = "text-sm mt-1 text-red-300";
    signupPassword.classList.add('border-red-400', 'shake');
    isValid = false;
  }
  if (!name) {
    signupName.classList.add('border-red-400', 'shake');
    isValid = false;
  }

  if (!isValid) {
    setTimeout(() => [signupEmail, signupPassword, signupName].forEach(i => i.classList.remove('shake')), 400);
    return;
  }

  showLoader();
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
  if (error) {
    signupPasswordMsg.textContent = error.message;
    signupPasswordMsg.className = "text-sm mt-1 text-red-300";
  } else {
    signupPasswordMsg.textContent = "Signup successful! Check your email.";
    signupPasswordMsg.className = "text-sm mt-1 text-green-400";
  }
});

// -------------------- Google OAuth --------------------
function handleGoogleOAuth() {
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: { access_type: 'offline', prompt: 'consent' },
      redirectTo: `${window.location.origin}/post-auth.html`
    }
  });
}
googleLoginBtn?.addEventListener('click', handleGoogleOAuth);
googleSignupBtn?.addEventListener('click', handleGoogleOAuth);

function showLoader() {
  document.getElementById("loader-overlay").style.display = "flex";
}
function hideLoader() {
  document.getElementById("loader-overlay").style.display = "none";
}
