const email = document.getElementById("email"),
  password = document.getElementById("password");


  function loginAdmin() {
    //Sign In User with Email and Password
    console.log(email.value);
    console.log(password.value);
    firebase.auth().signInWithEmailAndPassword(email.value, password.value).then((auth) =>{
        console.log("Login success");
        alert("Login success");
        window.location = "index.html";
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        });
        
  }