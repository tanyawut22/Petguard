var firebaseConfig = {
  apiKey: "AIzaSyA24KvjvgiTM1lZPsaX_mXEF7DwBFDq7W4",
  authDomain: "petguard-4c133.firebaseapp.com",
  databaseURL: "https://petguard-4c133.firebaseio.com",
  projectId: "petguard-4c133",
  storageBucket: "petguard-4c133.appspot.com",
  messagingSenderId: "128324258475",
  appId: "1:128324258475:web:f537da1717941b9b4a45ee",
  measurementId: "G-FX60H53NGG",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const firstname = document.getElementById("firstname"),
  lastname = document.getElementById("lastname"),
  birthday = document.getElementById("birthday"),
  license = document.getElementById("license"),
  phone = document.getElementById("phone"),
  education = document.getElementById("education"),
  citizen = document.getElementById("citizen"),
  email = document.getElementById("email"),
  pword = document.getElementById("pword"),
  Hospital = document.getElementById("Hospital"),
  fileUploader = document.getElementById("fileUploader");

let file = {};

fileUploader.addEventListener("change", function (e) {
  file = e.target.files[0];
});

function chooseFile(e) {
  file = e.target.files[0];
}

var Exx = [];
var docRef = db.collection("hospital");
docRef.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    Exx.push(doc.data().hsName);
    // document.getElementById("Hospital").innerHTML = Exx.toString();
    console.log(doc.id, " => ", doc.data().hsName);
  });
  renderOption(Exx);
});

function solo() {
  alert("sake");
}
function renderOption(params) {
  params.forEach((element, index) => {
    var option = document.createElement("option");
    option.text = element;
    option.value = index + 1;
    Hospital.append(option);
  });
}

Hospital.addEventListener('change', onChangeOption);

function onChangeOption(val) {
    let index = val.target.options.selectedIndex;

    alert(val.target[index].innerText)
}

var isRun = false;

// var hahah = localStorage.getItem(isRun);
// console.log(hahah);
// if (localStorage.getItem(isRun) == true) {
//   alert("wow");
// }
// console.log("after", hahah);
// for (so in option) {
//   s.add(new Option(option[so]));
//   localStorage.setItem(isRun, true);
// }

function saveData() {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email.value, pword.value)
    .then((auth) => {
      firebase
        .storage()
        .ref("vets/" + auth.user.uid + "/profile.jpg")
        .put(file)
        .then(function () {
          console.log("successfully uploded");

          firebase
            .storage()
            .ref("vets/" + auth.user.uid + "/profile.jpg")
            .getDownloadURL()
            .then((url) => {
              db.collection("vet")
                .doc(auth.user.uid)
                .set({
                  vtFName: $("#firstname").val(),
                  vtLName: $("#lastname").val(),
                  vtBDate: $("#birthday").val(),
                  vtLicense: $("#license").val(),
                  vtPhone: $("#phone").val(),
                  vtEducation: $("#education").val(),
                  vtCitizenId: $("#citizen").val(),
                  vtEmail: $("#email").val(),
                  vtPassword: $("#pword").val(),
                  vtImage: url,
                  vtBalance: "0",
                  vtWorkStatus: "offline",
                  vtHospital: $("#Hospital").val(),
                })
                .then(function () {
                  console.log("Document successfully written!");
                  // $("#addEmployeeModal").modal('hide');
                })
                .catch(function (error) {
                  console.error("Error writing document: ", error);
                });
            });
        })
        .catch((error) => {
          console.log(error.message);
        });
    })
    .catch((error) => {
      console.log(error.message);
    });
  //----------------------------------------
}
