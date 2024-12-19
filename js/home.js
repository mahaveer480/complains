// current user
const currentUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const uid = user.uid;
            document.getElementById('displayUsername').innerHTML = user.displayName || 'Guest User';
            renderComplaints(uid);
            // console.log(user.displayName)
            // Save user data in Firestore if not already saved
            saveUserData(uid, user.displayName);
        } else {
            // User is signed out or not logged in
            console.log("No user logged in, redirecting to login page.");
            window.location.href = "../index.html";
        }
    });
};

// >>>> Modal
window.onload = function () {
    document.getElementById('loader').classList.add('hidden');
    currentUser()
};

// >>>> Navbar
const toggleBarNav = document.querySelector('#toggleNav');
const toggleBarIcon = document.querySelector('#toggleBarIcon');
toggleBarNav.addEventListener('click', function () {

    if (toggleBarIcon.classList.contains('hide')) {
        toggleBarIcon.classList.remove('hide');
        toggleBarIcon.classList.add('show');
    } else {
        toggleBarIcon.classList.remove('show');
        toggleBarIcon.classList.add('hide');
    }

    this.classList.toggle('fa-bars');
    this.classList.toggle('fa-x');
});

// >>>>> Modal
const openModal = document.getElementById('openModal')
const closeModal = document.getElementById('closeModal');
let isEditing = false;
let editingComplaintId = null;
let imageURL;


openModal.addEventListener('click', () => {
    alert("cvxvx")
    const complaintModal = document.getElementById('complaintModal');
    clearModalFields();
    isEditing = false;

    let modal = document.getElementById('modal');
    let showModal = modal.style.display = 'none'
    if (showModal) {
        modal.style.display = 'block'
    } else {
        modal.style.display = 'none'
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none'
    })

})


// Save user data in Firestore
const saveUserData = (userId, displayName) => {
    const userRef = firebase.firestore().collection("users").doc(userId);
    userRef.get().then((doc) => {
        if (!doc.exists) {
            userRef.set({
                displayName: displayName
            })
                .then(() => {
                    console.log("User data saved successfully!");
                })
                .catch((error) => {
                    console.error("Error saving user data: ", error);
                });
        }
    });
};


// Clear modal input fields
const clearModalFields = () => {
    document.getElementById('url').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
};


// >>>>>>>>>>>>>>>>>>>> upload image
// Image Upload and URL Handling
document.getElementById('url').addEventListener('change', (e) => {
    const file = e.target.files[0];
    document.getElementById('changePath').innerHTML = file.name || 'Upload file...';

    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child('Complaint images/' + file.name).put(file);

    uploadTask.on('state_changed', null, (error) => console.error(error), () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            imageURL = downloadURL;
        });
    });
});

// submit complaint
submitBtn.addEventListener('click', (e) => {
    // picture
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    if (!title || !description || !date) {
        alert('Please fill all fields.');
        e.preventDefault();
    } else {
        if (isEditing && editingComplaintId) {
            firebase.firestore().collection("complaints").doc(editingComplaintId).update({
                url: imageURL,
                title: title,
                description: description,
                date: date
            }).then(() => {
                alert('Complaint updated successfully!');
                window.location.href = './home.html';
            }).catch((error) => {
                console.error('Error updating complaint: ', error);
            });
        } else {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    const userId = user.uid;
                    const userName = user.displayName || 'Unknown User';
                    let defaultUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjagoqfvnijbjw_2VP13dJyhb57Wq99DZcMg&s';

                    firebase.firestore().collection("complaints").add({
                        url: imageURL || defaultUrl,
                        title: title,
                        description: description,
                        date: date,
                        userId: userId,
                        username: userName,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        alert('Complaint Submitted!');
                        window.location.href = './home.html';
                    }).catch((error) => {
                        console.error('Error adding complaint: ', error);
                    });
                }
            });
        }
    }
});


// Pre-fill the modal with existing data for editing
const editComplaint = (complaintId) => {
    // Fetch the complaint details from Firestore
    firebase.firestore().collection("complaints").doc(complaintId).get()
        .then((doc) => {
            // if (doc.exists) {
            const complaintData = doc.data();
            // modal
            let modal = document.getElementById('modal');
            let showModal = modal.style.display = 'none'

            // Populate the modal fields with current complaint data
            // picture
            document.getElementById('title').value = complaintData.title || '';
            document.getElementById('description').value = complaintData.description || '';
            document.getElementById('date').value = complaintData.date || '';

            if (showModal) {
                modal.style.display = 'block'
            } else {
                modal.style.display = 'none'
            }

            // Set editing state
            isEditing = true;
            editingComplaintId = complaintId;

            console.error("No such document found!");

            closeModal.addEventListener('click', () => {
                modal.style.display = 'none'
            })
        })
        .catch((error) => {
            console.error("Error fetching complaint data for editing: ", error);
        });
};

// Add complaint
const renderComplaints = (currentUserId) => {
    firebase.firestore().collection("complaints").orderBy("createdAt", "desc").limit(100).get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                console.log("No complaints found.");
            } else {

                // DOM Manipulation 
                querySnapshot.forEach((doc) => {
                    const currentData = doc.data();

                    const complaintCard = document.createElement('section');
                    complaintCard.className = 'complaint_card';

                    const containerComplaints = document.createElement('div');
                    containerComplaints.className = 'containerComplaints';
                    complaintCard.appendChild(containerComplaints);

                    const rowCon = document.createElement('div');
                    rowCon.className = 'rowCon';
                    containerComplaints.appendChild(rowCon);

                    const leftDiv = document.createElement('div');
                    leftDiv.className = 'left';
                    rowCon.appendChild(leftDiv);

                    const img = document.createElement('img');
                    img.src = currentData.url || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHwAyAMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAAABQQCAwcB/8QAKxABAAMAAgECBAQHAAAAAAAAAAECAwQREiHBEyIxUSNhcYEFFDI0UqHR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APogAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMW/Grrtrpyp/BrWPD5uuvvINol0tpvx+Fjra34vc3nv1mI/76PzW08H+ZyxmYr8OL0jv+mZnr0BVE6cK8Lbj3ym3z28NO5mfLuPq1czW+GUa0rFq1n549/H8ge4z8beeRfS1evgxPjWfe0+8/o55PH+PvX439vWkz15dd2/MGoTM9rZfwze1LTNa3muVpn276h1OFeFtx75Tb57eGnczPl3H1BREmMvjcO/Nm1vj/Netu/6Yifp/pTyv8TOl/w/KsSDsAAAAAAAAAAAAABN5VptzJjbDfTGkR41pSZi0/eVIBi3m944/Kzy0/Dme85jq3U+k+jytjpzI5Ok0tn5UimcX9J9PX1/dSAYItrytsIthpnGU+V5vHUd9e33e/NnScfh5VmbaT49xHpWPeZaAGTg1vhN+NaLTSk95369Jifb9Xl/ELWttTO2W18OvK0ZVmfKftKgAx3r/ADfB0zzyvl6dVrevj9PWP2cRbXlbYRbDTOMp8rzeOo769vu3gJcxtnxr8KuF5mZmK36+XxmfeVKlYpStY+lY6dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z';
                    img.className = 'imgURL';
                    img.alt = 'Complaint Image';
                    leftDiv.appendChild(img);

                    const rightDiv = document.createElement('div');
                    rightDiv.className = 'right';
                    rowCon.appendChild(rightDiv);

                    const title = document.createElement('h4');
                    title.innerHTML = `Title: <span id="titleComplain">${currentData.title}</span>`;
                    rightDiv.appendChild(title);

                    const complainBy = document.createElement('h6');
                    complainBy.innerHTML = `Complain By: <span id="usernameComplain">${currentData.username}</span>`;
                    rightDiv.appendChild(complainBy);

                    const date = document.createElement('h6');
                    date.innerHTML = `Date: <span id="dateComplain"> ${currentData.date} </span>`;
                    rightDiv.appendChild(date);

                    const status = document.createElement('h6');
                    status.textContent = 'Status: Active';
                    rightDiv.appendChild(status);

                    const descCon = document.createElement('div');
                    descCon.className = 'DescCon';
                    containerComplaints.appendChild(descCon);

                    const descText = document.createElement('h6');
                    descText.id = 'desc';
                    descText.textContent = currentData.description || 'Your Complaint Description Here';
                    descCon.appendChild(descText);

                    const btnCon = document.createElement('div');
                    btnCon.className = 'btnCon';
                    containerComplaints.appendChild(btnCon);

                    if (currentData.userId === currentUserId) {
                        const btnCon = document.createElement('div');
                        btnCon.className = 'btnCon';
                        containerComplaints.appendChild(btnCon);

                        const buttonEdit = document.createElement('button');
                        buttonEdit.setAttribute('class', 'editBtn');
                        buttonEdit.id = 'buttonEdit';
                        buttonEdit.textContent = 'Edit';
                        buttonEdit.addEventListener('click', () => {
                            editComplaint(doc.id);
                        });
                        btnCon.appendChild(buttonEdit);

                        const deleteBtn = document.createElement('button');
                        deleteBtn.id = 'deleteBtn';
                        deleteBtn.textContent = 'Delete';
                        deleteBtn.addEventListener('click', () => {
                            if (confirm('Are you sure you want to delete this complaint?')) {
                                deleteComplaint(doc.id);
                            }
                        });
                        btnCon.appendChild(deleteBtn);
                    }

                    document.getElementById('renderComplains').appendChild(complaintCard);

                });
            }
        });
};

// Delete complaint from Firestore
const deleteComplaint = (complaintId) => {
    firebase.firestore().collection("complaints").doc(complaintId).delete()
        .then(() => {
            alert("Complaint deleted successfully.");
            window.location.href = './home.html';
        })
        .catch((error) => {
            console.error("Error deleting complaint: ", error);
        });
};


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