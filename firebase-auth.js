// Firebase Authentication Client
const firebaseConfig = {
  apiKey: "AIzaSyD1wQrOUiUQWmFc3XNIgwEJOkp82NvHQhA",
  authDomain: "airbnb-clone-e6275.firebaseapp.com",
  projectId: "airbnb-clone-e6275",
  storageBucket: "airbnb-clone-e6275.firebasestorage.app",
  messagingSenderId: "711426320432",
  appId: "1:711426320432:web:c5e576e1543c74b18ee5f5",
  measurementId: "G-55LM2QH1FT"
};

// Initialize Firebase
function initializeFirebase() {
  if (!window.firebase) {
    // Load the Firebase JavaScript client if it's not already loaded
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
    script.onload = () => {
      // Load Firebase Auth after the main Firebase SDK loads
      const authScript = document.createElement('script');
      authScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
      authScript.onload = () => {
        window.firebase.initializeApp(firebaseConfig);
        console.log('Firebase client initialized');
        
        // After initialization, try to get current user
        getCurrentUser().then(({ success, user }) => {
          if (success && user) {
            updateUIForLoggedInUser(user);
          }
        });
      };
      document.head.appendChild(authScript);
    };
    document.head.appendChild(script);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeFirebase);

// Sign up user with email and password
async function signUp(email, password) {
  try {
    if (!window.firebase || !window.firebase.auth) {
      return { success: false, message: "Firebase Auth not initialized yet" };
    }
    
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log('Signup successful:', user);
    return { success: true, user };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { success: false, message: error.message };
  }
}

// Sign in user with email and password
async function signIn(email, password) {
  try {
    if (!window.firebase || !window.firebase.auth) {
      return { success: false, message: "Firebase Auth not initialized yet" };
    }
    
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log('Sign in successful:', user);
    return { success: true, user };
  } catch (error) {
    console.error('Error signing in:', error.message);
    return { success: false, message: error.message };
  }
}

// Sign out user
async function signOut() {
  try {
    if (!window.firebase || !window.firebase.auth) {
      return { success: false, message: "Firebase Auth not initialized yet" };
    }
    
    await firebase.auth().signOut();
    console.log('Sign out successful');
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error.message);
    return { success: false, message: error.message };
  }
}

// Check if user is already logged in
async function getCurrentUser() {
  return new Promise((resolve) => {
    if (!window.firebase || !window.firebase.auth) {
      resolve({ success: false, message: "Firebase Auth not initialized yet" });
      return;
    }
    
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        console.log('Current user:', user);
        resolve({ success: true, user });
      } else {
        console.log('No user currently logged in');
        resolve({ success: false, message: 'No user currently logged in' });
      }
    });
  });
}

// Social login with Google
async function signInWithGoogle() {
  try {
    if (!window.firebase || !window.firebase.auth) {
      return { success: false, message: "Firebase Auth not initialized yet" };
    }
    
    const provider = new firebase.auth.GoogleAuthProvider();
    const userCredential = await firebase.auth().signInWithPopup(provider);
    const user = userCredential.user;
    
    console.log('Google sign-in successful:', user);
    return { success: true, user };
  } catch (error) {
    console.error('Error signing in with Google:', error.message);
    return { success: false, message: error.message };
  }
}

// Social login with Facebook
async function signInWithFacebook() {
  try {
    if (!window.firebase || !window.firebase.auth) {
      return { success: false, message: "Firebase Auth not initialized yet" };
    }
    
    const provider = new firebase.auth.FacebookAuthProvider();
    const userCredential = await firebase.auth().signInWithPopup(provider);
    const user = userCredential.user;
    
    console.log('Facebook sign-in successful:', user);
    return { success: true, user };
  } catch (error) {
    console.error('Error signing in with Facebook:', error.message);
    return { success: false, message: error.message };
  }
}

// Social login with Apple
async function signInWithApple() {
  try {
    if (!window.firebase || !window.firebase.auth) {
      return { success: false, message: "Firebase Auth not initialized yet" };
    }
    
    const provider = new firebase.auth.OAuthProvider('apple.com');
    const userCredential = await firebase.auth().signInWithPopup(provider);
    const user = userCredential.user;
    
    console.log('Apple sign-in successful:', user);
    return { success: true, user };
  } catch (error) {
    console.error('Error signing in with Apple:', error.message);
    return { success: false, message: error.message };
  }
}

// Update the login modal to use Firebase
function updateAuthUI() {
  const loginModal = document.getElementById('loginModal');
  const continueBtn = document.querySelector('.continue-btn');
  const phoneInput = document.getElementById('phoneNumber');
  const googleBtn = document.querySelector('.google-btn');
  const facebookBtn = document.querySelector('.facebook-btn');
  const appleBtn = document.querySelector('.apple-btn');
  const emailBtn = document.querySelector('.email-btn');
  const userMenuIcon = document.querySelector('.user-icon');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  
  // Add email input for Firebase
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'emailInput';
  emailInput.placeholder = 'Email address';
  emailInput.className = 'auth-input';
  
  // Add password input for Firebase
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'passwordInput';
  passwordInput.placeholder = 'Password';
  passwordInput.className = 'auth-input';
  
  // Insert email and password inputs before phone input
  if (phoneInput && phoneInput.parentNode) {
    const phoneInputContainer = phoneInput.parentNode;
    phoneInputContainer.style.display = 'none'; // Hide phone input initially
    
    const authInputs = document.createElement('div');
    authInputs.className = 'auth-inputs';
    authInputs.appendChild(emailInput);
    authInputs.appendChild(passwordInput);
    
    phoneInputContainer.parentNode.insertBefore(authInputs, phoneInputContainer);
  }
  
  // Update continue button to work with Firebase
  if (continueBtn) {
    continueBtn.addEventListener('click', async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      
      if (!email || !password) {
        alert('Please enter both email and password');
        return;
      }
      
      // Try to sign in first
      const signInResult = await signIn(email, password);
      
      if (signInResult.success) {
        // Login successful
        loginModal.style.display = 'none';
        updateUIForLoggedInUser(signInResult.user);
      } else if (signInResult.message.includes('user-not-found') || signInResult.message.includes('invalid-email')) {
        // If login fails, try to sign up
        const confirmSignup = confirm('Account not found. Would you like to create a new account?');
        
        if (confirmSignup) {
          const signUpResult = await signUp(email, password);
          
          if (signUpResult.success) {
            alert('Account created successfully!');
            loginModal.style.display = 'none';
            updateUIForLoggedInUser(signUpResult.user);
          } else {
            alert('Error creating account: ' + signUpResult.message);
          }
        }
      } else {
        alert('Error signing in: ' + signInResult.message);
      }
    });
  }
  
  // Update social buttons to work with Firebase
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      const result = await signInWithGoogle();
      if (result.success) {
        loginModal.style.display = 'none';
        updateUIForLoggedInUser(result.user);
      } else {
        alert('Google sign-in failed: ' + result.message);
      }
    });
  }
  
  if (facebookBtn) {
    facebookBtn.addEventListener('click', async () => {
      const result = await signInWithFacebook();
      if (result.success) {
        loginModal.style.display = 'none';
        updateUIForLoggedInUser(result.user);
      } else {
        alert('Facebook sign-in failed: ' + result.message);
      }
    });
  }
  
  if (appleBtn) {
    appleBtn.addEventListener('click', async () => {
      const result = await signInWithApple();
      if (result.success) {
        loginModal.style.display = 'none';
        updateUIForLoggedInUser(result.user);
      } else {
        alert('Apple sign-in failed: ' + result.message);
      }
    });
  }
  
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      // Show email signup form
      const authInputs = document.querySelector('.auth-inputs');
      if (authInputs) {
        authInputs.style.display = 'block';
      }
    });
  }
  
  // Add logout button to dropdown menu
  if (dropdownMenu) {
    const logoutItem = document.createElement('div');
    logoutItem.className = 'dropdown-item logout-trigger';
    logoutItem.textContent = 'Log out';
    logoutItem.style.display = 'none'; // Hide initially
    
    // Add after the first dropdown section
    const firstDivider = dropdownMenu.querySelector('.dropdown-divider');
    if (firstDivider) {
      firstDivider.parentNode.insertBefore(logoutItem, firstDivider);
      
      // Add logout functionality
      logoutItem.addEventListener('click', async () => {
        const signOutResult = await signOut();
        
        if (signOutResult.success) {
          updateUIForLoggedOutUser();
          dropdownMenu.classList.remove('show');
        } else {
          alert('Error signing out: ' + signOutResult.message);
        }
      });
    }
  }
}

// Update UI when user is logged in
function updateUIForLoggedInUser(user) {
  // Update UI elements to show logged in state
  const loginTriggers = document.querySelectorAll('.login-trigger');
  const logoutTrigger = document.querySelector('.logout-trigger');
  const userIcon = document.querySelector('.user-icon');
  
  // Hide login options and show logout
  loginTriggers.forEach(trigger => {
    trigger.style.display = 'none';
  });
  
  if (logoutTrigger) {
    logoutTrigger.style.display = 'block';
  }
  
  // Display user initial in avatar if available
  if (userIcon) {
    if (user.email) {
      const initial = user.email.charAt(0).toUpperCase();
      userIcon.innerHTML = `<div style="width: 100%; height: 100%; border-radius: 50%; background-color: #ff385c; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">${initial}</div>`;
    }
  }
  
  // Update global state
  window.isLoggedIn = true;
  
  // Trigger any other UI updates needed
  const userLoginEvent = new CustomEvent('userLoggedIn', { detail: { user } });
  document.dispatchEvent(userLoginEvent);
}

// Update UI when user is logged out
function updateUIForLoggedOutUser() {
  // Reset UI elements to logged out state
  const loginTriggers = document.querySelectorAll('.login-trigger');
  const logoutTrigger = document.querySelector('.logout-trigger');
  const userIcon = document.querySelector('.user-icon');
  
  // Show login options and hide logout
  loginTriggers.forEach(trigger => {
    trigger.style.display = 'block';
  });
  
  if (logoutTrigger) {
    logoutTrigger.style.display = 'none';
  }
  
  // Reset user avatar
  if (userIcon) {
    userIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style="display: block; height: 100%; width: 100%; fill: currentcolor;"><path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.5 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"></path></svg>';
  }
  
  // Update global state
  window.isLoggedIn = false;
  
  // Trigger any other UI updates needed
  document.dispatchEvent(new Event('userLoggedOut'));
}

// Set up listener for Firebase auth state changes
function setupAuthStateListener() {
  if (window.firebase && window.firebase.auth) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        updateUIForLoggedInUser(user);
      } else {
        updateUIForLoggedOutUser();
      }
    });
  }
}

// Initialize auth UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeFirebase();
  setTimeout(updateAuthUI, 1000); // Give Firebase some time to initialize
});

// Export functions for external use
window.firebaseAuth = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple
}; 