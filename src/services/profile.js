import { supabase } from '../config/supabase.js';
import { generateUserAvatar } from '../utils/common.js';

// -------------------- Constants & Utilities --------------------
const AVATAR_BUCKET = 'profile_pictures';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function showLoader() {
    const loader = document.getElementById("loader-overlay");
    if (loader) loader.style.display = "flex";
  }
  
  function hideLoader() {
    const loader = document.getElementById("loader-overlay");
    if (loader) loader.style.display = "none";
  }

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    toastMessage.textContent = message;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// -------------------- Form Validation --------------------
const validators = {
    name: {
        validate: value => value.trim().length >= 2,
        message: 'Name must be at least 2 characters long'
    },
    phone: {
        validate: value => !value || /^\+?[\d\s-()]{10,}$/.test(value),
        message: 'Please enter a valid phone number'
    },
    bio: {
        validate: value => !value || value.trim().length <= 500,
        message: 'Bio must not exceed 500 characters'
    },
    currentPassword: {
        validate: value => !value || value.length >= 6,
        message: 'Current password must be at least 6 characters'
    },
    newPassword: {
        validate: value => !value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_]).{8,}$/.test(value),
        message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
    }
};

function validateField(field, value) {
    const validator = validators[field];
    if (!validator) return true;

    const isValid = validator.validate(value);
    const messageEl = document.getElementById(`${field}-msg`);
    const inputEl = document.getElementById(field);

    if (messageEl && inputEl) {
        if (!isValid) {
            messageEl.textContent = validator.message;
            messageEl.className = 'text-sm mt-1 text-red-500';
            inputEl.classList.add('border-red-500', 'shake');
            setTimeout(() => inputEl.classList.remove('shake'), 400);
        } else {
            messageEl.className = 'hidden';
            inputEl.classList.remove('border-red-500');
        }
    }

    return isValid;
}

// -------------------- Profile Management --------------------
let selectedAvatarFile = null;
let avatarRemoveFlag = false;
let currentAvatarUrl = null;

async function loadUserProfile() {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
            EazyNavigation.authRedirect('../pages/auth.html');
            return;
        }

        const { user } = session;
        const { user_metadata, email } = user;

        // Load session data immediately for instant display
        document.getElementById('profile-email').textContent = email;
        
        // Use name from metadata for instant display
        const displayName = user_metadata?.name || 'No name set';
        document.getElementById('profile-name').textContent = displayName;
        document.getElementById('name').value = displayName !== 'No name set' ? displayName : '';

        // Set initial avatar using session data immediately
        const avatarPreview = document.getElementById('avatar-preview');
        currentAvatarUrl = user_metadata.avatar_url || null;
        const avatarUrl = generateUserAvatar(email, currentAvatarUrl);
        avatarPreview.src = avatarUrl;
        
        // Update avatar UI immediately
        if (currentAvatarUrl) {
            avatarPreview.classList.remove('p-4');
            document.getElementById('remove-avatar-btn').classList.remove('hidden');
            document.getElementById('remove-avatar-btn').classList.add('show');
        } else {
            avatarPreview.classList.add('p-4');
            document.getElementById('remove-avatar-btn').classList.add('hidden');
            document.getElementById('remove-avatar-btn').classList.remove('show');
        }
        document.getElementById('avatar-remove-flag').value = 'false';
        selectedAvatarFile = null;
        avatarRemoveFlag = false;

        // Update subscription status using session data
        updateSubscriptionUI(user_metadata);

        // Now fetch only phone and bio from database
        showLoader();
        try {
            const { data: profile, error } = await supabase
                .from('users')
                .select('phone, bio')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            // Update form fields that aren't in session
            document.getElementById('phone').value = profile.phone || '';
            document.getElementById('bio').value = profile.bio || '';

        } catch (error) {
            console.error('Error loading additional profile data:', error);
            // Don't show error toast for this - user can still use the form
        } finally {
            hideLoader();
        }

        // Show content after everything is loaded
        showContent();

    } catch (error) {
        console.error('Error loading profile:', error);
        showToast('Failed to load profile', 'error');
        hideLoader();
    }
}

function showContent() {
    const profileContainer = document.getElementById('profile-container');
    if (profileContainer) {
        profileContainer.classList.remove('opacity-0');
    }
}

function updateSubscriptionUI(userMetadata) {
    const statusEl = document.getElementById('subscription-status');
    const trialInfoEl = document.getElementById('trial-info');
    
    if (userMetadata.isPro) {
        statusEl.textContent = 'Pro Subscription Active';
        trialInfoEl.textContent = 'You have full access to all features';
    } else if (userMetadata.isTrial) {
        const trialEnds = new Date(userMetadata.trialendsat);
        const daysLeft = Math.ceil((trialEnds - new Date()) / (1000 * 60 * 60 * 24));
        
        statusEl.textContent = 'Trial Active';
        trialInfoEl.textContent = `${daysLeft} days left in trial`;
    } else {
        statusEl.textContent = 'Free Plan';
        trialInfoEl.textContent = 'Upgrade to Pro for full access';
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const bio = document.getElementById('bio').value;
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate all fields
    const isNameValid = validateField('name', name);
    const isPhoneValid = validateField('phone', phone);
    const isBioValid = validateField('bio', bio);
    
    if (!isNameValid || !isPhoneValid || !isBioValid) {
        return;
    }

    // Handle password change if requested
    if (currentPassword || newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
            document.getElementById('confirm-password-msg').textContent = 'Passwords do not match';
            document.getElementById('confirm-password-msg').className = 'text-sm mt-1 text-red-500';
            return;
        }

        const isCurrentPasswordValid = validateField('currentPassword', currentPassword);
        const isNewPasswordValid = validateField('newPassword', newPassword);
        
        if (!isCurrentPasswordValid || !isNewPasswordValid) {
            return;
        }
    }

    showLoader();
    try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No session found');

        // --- Handle avatar upload/removal ---
        let avatarUrlToSave = currentAvatarUrl;
        if (avatarRemoveFlag) {
            // Remove avatar from storage and metadata
            if (currentAvatarUrl) {
                // Remove from storage (optional: only if using storage bucket)
                const filePath = `${session.user.id}/avatar.${currentAvatarUrl.split('.').pop()}`;
                await supabase.storage.from(AVATAR_BUCKET).remove([filePath]);
            }
            avatarUrlToSave = null;
            // Remove from auth metadata
            await supabase.auth.updateUser({ data: { avatar_url: null } });
        } else if (selectedAvatarFile) {
            // Upload new avatar
            const file = selectedAvatarFile;
            const fileExt = file.name.split('.').pop();
            const fileName = `${session.user.id}/avatar.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from(AVATAR_BUCKET)
                .upload(fileName, file, { upsert: true });
            if (uploadError) throw uploadError;
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(AVATAR_BUCKET)
                .getPublicUrl(fileName);
            avatarUrlToSave = publicUrl;
            // Update auth metadata
            await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
        }

        // Update auth metadata for name
        const { error: metadataError } = await supabase.auth.updateUser({ data: { name } });
        if (metadataError) throw metadataError;

        // Update profile data
        const { error: updateError } = await supabase
            .from('users')
            .update({
                name,
                phone,
                bio,
                avatar_url: avatarUrlToSave,
                updated_at: new Date().toISOString()
            })
            .eq('id', session.user.id);
        if (updateError) throw updateError;

        // Update password if provided
        if (currentPassword && newPassword) {
            const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
            if (passwordError) throw passwordError;
        }

        showToast('Profile updated successfully');
        // Clear password fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        // Reload profile data
        await loadUserProfile();
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast(error.message || 'Failed to update profile', 'error');
    } finally {
        hideLoader();
    }
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    // Validate file
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        showToast('Please upload a valid image file (JPEG, PNG, or WebP)', 'error');
        return;
    }
    if (file.size > MAX_FILE_SIZE) {
        showToast('File size must be less than 5MB', 'error');
        return;
    }
    // Show preview
    const reader = new FileReader();
    reader.onload = function (ev) {
        document.getElementById('avatar-preview').src = ev.target.result;
    };
    reader.readAsDataURL(file);
    selectedAvatarFile = file;
    avatarRemoveFlag = false;
    document.getElementById('avatar-remove-flag').value = 'false';
    document.getElementById('remove-avatar-btn').classList.remove('hidden');
    document.getElementById('remove-avatar-btn').classList.add('show');
}

function handleAvatarRemove() {
    // Show default avatar preview
    const email = document.getElementById('profile-email').textContent;
    document.getElementById('avatar-preview').src = generateUserAvatar(email, null);
    selectedAvatarFile = null;
    avatarRemoveFlag = true;
    document.getElementById('avatar-remove-flag').value = 'true';
    document.getElementById('remove-avatar-btn').classList.add('hidden');
    document.getElementById('remove-avatar-btn').classList.remove('show');
}

// -------------------- Event Listeners --------------------
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    // Set up form submission
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
    // Set up avatar upload
    document.getElementById('avatar-upload').addEventListener('change', handleAvatarUpload);
    // Set up avatar remove
    document.getElementById('remove-avatar-btn').addEventListener('click', handleAvatarRemove);
    // Set up field validation
    const fields = ['name', 'phone', 'bio', 'current-password', 'new-password'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('input', (e) => validateField(field, e.target.value));
            element.addEventListener('blur', (e) => validateField(field, e.target.value));
        }
    });

    // Handle password confirmation
    document.getElementById('confirm-password').addEventListener('input', (e) => {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = e.target.value;
        const messageEl = document.getElementById('confirm-password-msg');
        
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            messageEl.textContent = 'Passwords do not match';
            messageEl.className = 'text-sm mt-1 text-red-500';
        } else {
            messageEl.className = 'hidden';
        }
    });

    // Handle subscription management
    document.getElementById('manage-subscription').addEventListener('click', () => {
        // This will be implemented when we add Stripe integration
        showToast('Subscription management coming soon!');
    });

    // Setup password toggle functionality
    setupPasswordToggles();
}); 

// Password toggle functionality
function setupPasswordToggles() {
    const toggleButtons = [
        { buttonId: 'toggle-new-password', inputId: 'new-password' },
        { buttonId: 'toggle-confirm-password', inputId: 'confirm-password' }
    ];

    toggleButtons.forEach(({ buttonId, inputId }) => {
        const toggleButton = document.getElementById(buttonId);
        const passwordInput = document.getElementById(inputId);
        
        if (toggleButton && passwordInput) {
            toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                toggleButton.textContent = isPassword ? 'Hide' : 'Show';
            });
        }
    });
}