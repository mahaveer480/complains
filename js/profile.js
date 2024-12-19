// Get current user information and populate the profile
const currentUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const uid = user.uid;
            document.getElementById('displayUsername').innerHTML = user.displayName || 'Guest User';
            document.getElementById('PfName').innerHTML = user.displayName || 'Guest User';
            document.getElementById('userNewName').innerHTML = user.displayName || 'Guest User';
            // Fetch existing data from Firestore for the user
            db.collection('users').doc(uid).onSnapshot((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('displayProfileImage').src = userData.profileImg || 'default_image_url.png';
                    document.getElementById('displayProfileImg').src = userData.profileImg || 'default_image_url.png';
                    document.getElementById('getUserName').innerHTML = userData.username || 'Guest';
                    document.getElementById('email').innerHTML = userData.email || 'Guest@gmail.com';
                    document.getElementById('pass').innerHTML = userData.password || '********';
                    document.getElementById('caste').innerHTML = userData.caste || 'Not provided';
                    document.getElementById('locat').innerHTML = userData.location || 'No location';
                    document.getElementById('gender').innerHTML = userData.gender || 'Not specified';
                }
            }, (error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            console.log("No user logged in, redirecting to login page.");
            window.location.href = "../index.html";
        }
    });
};

// Loader
window.onload = function () {
    document.getElementById('loader').classList.add('hidden');
    currentUser();
};

// Navigation toggle
const toggleBarNav = document.querySelector('#toggleNav');
const toggleBarIcon = document.querySelector('#toggleBarIcon');
let imageURL;

toggleBarNav.addEventListener('click', function () {
    toggleBarIcon.classList.toggle('show');
    this.classList.toggle('fa-bars');
    this.classList.toggle('fa-x');
});

// Modal open and close functionality
let openModal = document.getElementById('openModal');
let showModal = document.getElementById('showModal');
let EditPf = document.getElementById('uploadPf');

// Show modal when 'Edit Profile' is clicked
openModal.addEventListener('click', () => {
    showModal.style.display = 'block';
});

// Close modal when 'Close' button is clicked
const closeModal = document.getElementById('closeModal');
closeModal.addEventListener('click', () => {
    showModal.style.display = 'none';
});

// Image Upload and URL Handling
document.getElementById('url').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child('Profile images/' + file.name).put(file);

    uploadTask.on('state_changed',
        null,
        (error) => console.error(error),
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                imageURL = downloadURL;
                // Display image immediately after upload
                document.getElementById('displayProfileImage').src = imageURL;
                document.getElementById('displayProfileImg').src = imageURL;
            });
        }
    );
});

// Save updated profile data to Firestore
const updateProfile = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const uid = user.uid;
            const userName = document.getElementById('name').value;
            const location = document.getElementById('location').value;
            const userCaste = document.getElementById('casteuser').value;
            const gender = document.getElementById('select').value;

            db.collection('users').doc(uid).update({
                profileImg: imageURL,
                username: userName,
                location: location,
                caste: userCaste,
                gender: gender
            }).then(() => {
                console.log("Profile updated successfully");
                showModal.style.display = 'none';
                currentUser(); // Refresh profile data after update
            }).catch((error) => {
                console.error("Error updating profile: ", error);
            });
        }
    });
};

// Event listener for update profile button
EditPf.addEventListener('click', updateProfile);

// Logout function
const logout = () => {
    firebase.auth().signOut()
        .then(() => {
            console.log("Sign-out successful.");
            window.location.href = "../index.html";
        })
        .catch((error) => {
            console.log("Error signing out: ", error);
        });
};