const email = document.getElementById("email"),
  password = document.getElementById("password");

  function loginAdmin() {
    //Sign In User with Email and Password
    console.log(email,password);
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    });
        
  }