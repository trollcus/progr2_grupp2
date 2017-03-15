if (document.readyState != 'loading') {
    onDocumentReady();
} else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function onDocumentReady() {
  // Document ready
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user.uid);
    // User is signed in.
  } else {
    // No user is signed in.
  }
});
}
