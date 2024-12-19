// password togle
const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#password');

togglePassword.addEventListener('click', function () {
    // Toggle the type attribute
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle the eye / eye-slash icon
    this.classList.toggle('fa-eye-slash');
});


// Sign in
function login() {
    // >>>>>>>>> validation
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let emailError = document.getElementById('emailError');
    let passwordError = document.getElementById('passwordError');

    emailError.style.display = 'none';
    passwordError.style.display = 'none';

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    let validEmail = emailPattern.test(email);

    if (!validEmail) {
        emailError.innerText = 'Please enter a valid email address.';
        emailError.style.display = 'block';
        return;
    }

    if (password.trim() === '') {
        passwordError.innerText = 'Password cannot be empty.';
        passwordError.style.display = 'block';
        return;
    } else if (password.length < 7) {
        passwordError.innerText = 'Password must be at least 8 characters long.';
        passwordError.style.display = 'block';
        return;
    } else {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                console.log('Login successful:', user);
                // window.location.href = "../pages/home.html";
            })
            .catch((error) => {
                var errorMessage = error.message;
                console.log('Login error:', errorMessage);
                if (errorMessage === '{"error":{"code":400,"message":"INVALID_LOGIN_CREDENTIALS","errors":[{"message":"INVALID_LOGIN_CREDENTIALS","domain":"global","reason":"invalid"}]}}') {
                    passwordError.innerText = 'passwords do not match. please try again';
                    passwordError.style.display = 'block';
                } else {
                    passwordError.style.display = 'block';
                }
            });
    }
}

// continue with google account
const CuntinueWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // IdP data available in result.additionalUserInfo.profile.
            // console.log(user)
            window.location.href = '../pages/home.html'
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log(error)
        });
}


// continue with facebook account
const continueWithFacebook = () => {
    // alert('')
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // The signed-in user info.
            var user = result.user;
            // IdP data available in result.additionalUserInfo.profile.
            // ...

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var accessToken = credential.accessToken;
            // console.log(user)
            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;

            // ...
        });
}