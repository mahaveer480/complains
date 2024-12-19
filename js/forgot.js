const sendButton = document.getElementById('sendButton');
const messageBox = document.getElementById('messageBox');
const emailInput = document.getElementById('emailInput');
const inputBox = document.getElementById('inputBox');
const backButton = document.getElementById('backButton');
const emailIcon = document.querySelector('.fa-envelope');
const emailLabel = document.querySelector('label[for="email"]');

// On Send button click
sendButton.addEventListener('click', function () {

    let email = document.getElementById('emailInput').value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        emailErr.innerText = 'Please enter a valid email address.';
        emailErr.style.display = 'block';
        valid = false;
    } else {
        // Call Firebase function to send password reset email
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                emailErr.style.display = 'none';
                emailInput.style.display = 'none';
                emailIcon.style.display = 'none';
                emailLabel.style.display = 'none';
                sendButton.style.display = 'none';

                messageBox.style.display = 'block';
            })
            .catch((error) => {
                // emailError.style.display = 'block';
                // emailError.textContent = error.message;
                console.log(error.message)
            });
    }
});

backButton.addEventListener('click', function () {
    window.location.href = '../index.html';
});