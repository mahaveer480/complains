// toggle password

const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#password');

togglePassword.addEventListener('click', function () {
    // Toggle the type attribute
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle the eye / eye-slash icon
    this.classList.toggle('fa-eye-slash');
});

// signup system
const signup = () => {
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let usernameErr = document.getElementById('usernameErr');
    let emailErr = document.getElementById('emailErr');
    let passwordErr = document.getElementById('passwordErr');

    usernameErr.style.display = 'none';
    emailErr.style.display = 'none';
    passwordErr.style.display = 'none';

    let valid = true;

    if (username.trim() === '') {
        usernameErr.innerText = 'Username cannot be empty.';
        usernameErr.style.display = 'block';
        valid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        emailErr.innerText = 'Please enter a valid email address.';
        emailErr.style.display = 'block';
        valid = false;
    }

    if (password.length < 7) {
        passwordErr.innerText = 'Password must be at least 8 characters long.';
        passwordErr.style.display = 'block';
        valid = false;
    }

    // firebase
    if (valid) {
        // console.log('username -->' + username, 'password --> ' + password, 'email -->' + email)
        // alert('Signup successful!');
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                if (username) {
                    user.updateProfile({
                        displayName: username
                    }).then(() => {
                        // Successfully updated profile
                        console.log("Profile updated successfully");
                        // console.log(user)
                        window.location.href = "../pages/home.html";
                    }).catch((error) => {
                        // Handle updateProfile error
                        console.error("Error updating profile:", error.message);
                    });
                } else {
                    console.log('errors')
                }
            })
            .catch((error) => {
                // Handle createUserWithEmailAndPassword error
                console.error("Error during signup:", error.message);
                document.getElementById("errorMessage").innerText = "Error during signup: " + error.message;
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