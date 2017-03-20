if (document.readyState != 'loading') {
    onDocumentReady();
} else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function onDocumentReady() {
  // Document ready
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    // User is signed in.
  } else {
    // No user is signed in.
  }
});
}
