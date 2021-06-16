$(document).ready(function () {
    const Hospital = db.collection("vet");
    let deleteIDs = [];
    let lastVisibleEmployeeSnapShot = {};

    // GET TOTAL SIZE
    Hospital.onSnapshot(snapshot => {
        let size = snapshot.size;
        $('.count').text(size);
        if (size == 0) {
            $('#selectAll').attr('disabled', true);
        } else {
            $('#selectAll').attr('disabled', false);
        }
    });


    // REAL TIME LISTENER
    Hospital.limit(10).onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if (change.type == 'added') {
                renderHospital(change.doc);
            } else if (change.type == 'modified') {
                $('tr[data-id=' + change.doc.id + ']').remove();
                renderHospital(change.doc);
            } else if (change.type == 'removed') {
                $('tr[data-id=' + change.doc.id + ']').remove();
            }
        });
        lastVisibleEmployeeSnapShot = snapshot.docs[snapshot.docs.length - 1];
    });

    // db.collection('employees').startAt("abc").endAt("abc\uf8ff").get()
    // .then(function (documentSnapshots) {
    //     documentSnapshots.docs.forEach(doc => {
    //         renderEmployee(doc);
    //     });
    // });

    // db.collection('employees').startAt('bos').endAt('bos\uf8ff').on("value", function(snapshot) {
    //     console.log(snapshot);
    // });

    // var first = db.collection("employees")
    //     .limit(3);

    // first.get().then(function (documentSnapshots) {
    //     documentSnapshots.docs.forEach(doc => {
    //         renderEmployee(doc);
    //     });
    //     lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    // });

    // DISPLAY
    function renderHospital(document) {
        let item = `<tr data-id="${document.id}">
        <td>
            <span class="custom-checkbox">
                <input type="checkbox" id="${document.id}" name="options[]" value="${document.id}">
                <label for="${document.id}"></label>
            </span>
        </td>
        <td>${document.data().vtFName}</td>
        <td>${document.data().vtLName}</td>
        <td>${document.data().vtLicense}</td>
        <td>
            <a href="#" id="${document.id}" class="edit js-edit-employee"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
            </a>
            <a href="#" id="${document.id}" class="delete js-delete-employee"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
            </a>
        </td>
    </tr>`;
        $('#employee-table').append(item);
        // Activate tooltip
        $('[data-toggle="tooltip"]').tooltip();
        // Select/Deselect checkboxes
        var checkbox = $('table tbody input[type="checkbox"]');
        $("#selectAll").click(function () {
            if (this.checked) {
                checkbox.each(function () {
                    console.log(this.id);
                    deleteIDs.push(this.id);
                    this.checked = true;
                });
            } else {
                checkbox.each(function () {
                    this.checked = false;
                });
            }
        });
        checkbox.click(function () {
            if (!this.checked) {
                $("#selectAll").prop("checked", false);
            }
        });
    }
    
    
    // // ADD EMPLOYEE
    // $("#add-employee-form").submit(function (event) {
    //     event.preventDefault();
    //     db.collection('vet').add({
    //             vtImage: $('#customFile').val(),
    //             vtFName: $('#employee-name').val(),
    //             vtLName: $('#employee-email').val(),
    //             vtBDate: $('#employee-address').val(),
    //             vtEmail: $('#employee-Email').val(),
    //             vtLicense: $('#employee-License').val(),
    //             vtPhone: $('#employee-Phone').val(),
    //             vtEducation: $('#employee-Education').val(),
    //             vtCitizenId: $('#employee-Citizen').val(),
    //             vtPassword: $('#employee-Password').val(),
    //             vtBalance: "0",
    //             vtWorkStatus: "offline",
    //             vtHospital: $('#VHosbox').val()
    //         }).then(function () {
    //             console.log("Document successfully written!");
    //             $("#addEmployeeModal").modal('hide');
    //         })
    //         .catch(function (error) {
    //             console.error("Error writing document: ", error);
    //         });
    // });

    // DELETE EMPLOYEE
    $(document).on('click', '.js-delete-employee', function () {
        let id = $(this).attr('id');
        $('#delete-employee-form').attr('delete-id', id);
        $('#deleteEmployeeModal').modal('show');
    });

    $("#delete-employee-form").submit(function (event) {
        event.preventDefault();
        let id = $(this).attr('delete-id');
        if (id != undefined) {
            db.collection('vet').doc(id).delete()
                .then(function () {
                    console.log("Document successfully delete!");
                    $("#deleteEmployeeModal").modal('hide');
                })
                .catch(function (error) {
                    console.error("Error deleting document: ", error);
                });
        } else {
            let checkbox = $('table tbody input:checked');
            checkbox.each(function () {
                db.collection('vet').doc(this.value).delete()
                    .then(function () {
                        console.log("Document successfully delete!");
                    })
                    .catch(function (error) {
                        console.error("Error deleting document: ", error);
                    });
            });
            $("#deleteEmployeeModal").modal('hide');
        }
    });

    // UPDATE EMPLOYEE
    $(document).on('click', '.js-edit-employee', function () {
      let id = $(this).attr('id');
      $('#edit-employee-form').attr('edit-id', id);
      db.collection('vet').doc(id).get().then(function (document) {
        if (document.exists) {
            // $('#edit-employee-form #fileUploader').val(document.data().vtImage);
            $('#edit-employee-form #firstname').val(document.data().vtFName);
            $('#edit-employee-form #lastname').val(document.data().vtLName);
            $('#edit-employee-form #birthday').val(document.data().vtBDate);
            $('#edit-employee-form #license').val(document.data().vtLicense);
            $('#edit-employee-form #phone').val(document.data().vtPhone);
            $('#edit-employee-form #education').val(document.data().vtEducation);
            $('#edit-employee-form #citizen').val(document.data().vtCitizenId);
            $('#edit-employee-form #email').val(document.data().vtEmail);
            $('#edit-employee-form #pword').val(document.data().vtPassword);
            $('#edit-employee-form #HospitalEdit').val(document.data().vtHospital);
            
            $('#editEmployeeModal').modal('show');
          } else {
              console.log("No such document!");
          }
      }).catch(function (error) {
          console.log("Error getting document:", error);
      });
  });

  $("#edit-employee-form").submit(function (event) {
      event.preventDefault();
      let id = $(this).attr('edit-id');
      db.collection('vet').doc(id).update({
        // vtImage: $('#edit-employee-form #fileUploader').val(),
        vtFName: $('#edit-employee-form #firstname').val(),
        vtLName: $('#edit-employee-form #lastname').val(),
        vtBDate: $('#edit-employee-form #birthday').val(),
        vtLicense: $('#edit-employee-form #license').val(),
        vtPhone: $('#edit-employee-form #phone').val(),
        vtEducation: $('#edit-employee-form #education').val(),
        vtCitizenId: $('#edit-employee-form #citizen').val(),
        vtEmail: $('#edit-employee-form #email').val(),
        vtPassword: $('#edit-employee-form #pword').val(),
        vtHospital: $('#edit-employee-form #HospitalEdit').val()
      });
      $('#editEmployeeModal').modal('hide');
  });

  $("#addEmployeeModal").on('hidden.bs.modal', function () {
      $('#add-employee-form .form-control').val('');
  });

  $("#editEmployeeModal").on('hidden.bs.modal', function () {
      $('#edit-employee-form .form-control').val('');
  });

    // PAGINATION
    $("#js-previous").on('click', function (e) {
        e.preventDefault();
        $('#employee-table tbody').html('');
        const queryPrevious = Hospital
            .endBefore(lastVisibleEmployeeSnapShot)
            .limit(10);

        queryPrevious.get().then(snap => {
            snap.forEach(doc => {
                renderHospital(doc);
            });
            lastVisibleEmployeeSnapShot = snap.docs[snap.docs.length - 1];
        });
    });

    $('#js-next').on('click', function (e) {
        e.preventDefault();
        if ($(this).closest('.page-item').hasClass('disabled')) {
            return false;
        }
        $('#employee-table tbody').html('');
        const queryNext = Hospital
            .startAfter(lastVisibleEmployeeSnapShot)
            .limit(10);

        queryNext.get().then(snap => {
            snap.forEach(doc => {
                renderHospital(doc);
            });
            lastVisibleEmployeeSnapShot = snap.docs[snap.docs.length - 1];
        });
    });

    // SEARCH
    $("#search-name").keyup(function () {
        $('#employee-table tbody').html('');
        let nameKeyword = $("#search-name").val();
        console.log(nameKeyword);
        Hospital.orderBy("vtFName").startAt(nameKeyword).endAt(nameKeyword+"\uf8ff").get()
            .then(function (documentSnapshots) {
                documentSnapshots.docs.forEach(doc => {
                    renderHospital(doc);
                });
            });
    });
});

// CENTER MODAL
(function ($) {
    "use strict";

    function centerModal() {
        $(this).css('display', 'block');
        var $dialog = $(this).find(".modal-dialog"),
            offset = ($(window).height() - $dialog.height()) / 2,
            bottomMargin = parseInt($dialog.css('marginBottom'), 10);

        // Make sure you don't hide the top part of the modal w/ a negative margin if it's longer than the screen height, and keep the margin equal to the bottom margin of the modal
        if (offset < bottomMargin) offset = bottomMargin;
        $dialog.css("margin-top", offset);
    }

    $(document).on('show.bs.modal', '.modal', centerModal);
    $(window).on("resize", function () {
        $('.modal:visible').each(centerModal);
    });
}(jQuery));


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
  HospitalEdit = document.getElementById("HospitalEdit"),
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
  renderOptionEdit(Exx);
});


function renderOption(params) {
  params.forEach((element, index) => {
    var option = document.createElement("option");
    option.text = element;
    option.value = index + 1;
    Hospital.append(option);
  });
}

function renderOptionEdit(params) {
  params.forEach((element, index) => {
    var option = document.createElement("option");
    option.text = element;
    option.value = index + 1;
    HospitalEdit.append(option);
  });
}
// var isRun = false;

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
                    vtHospital: $("#Hospital option:selected").text(),
                  })
                  .then(function () {
                    console.log("Document successfully written!");
                    // $("#addEmployeeModal").modal('hide');
                  })
                  .catch(function (error) {
                    console.error("Error writing document: ", error);
                  });
                console.log(firstname);
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

// function EditData() {
//     firebase
//       .auth()
//       .onAuthStateChanged(user => {
//         if (user) {
//             firebase
//               .storage()
//               .ref("vets")
//               .child("vets/"+ user.uid + "/profile.jpg")
//               .getDownloadURL()
//               .then(imgUrl => {
//                 fileUploader = imgUrl;
//               });
//             console.log(user);
//             console.log(imgUrl);
//           }
//         })
//       .then((auth) => {
//         firebase
//           .storage()
//           .ref("vets/" + auth.user.uid + "/profile.jpg")
//           .put(file)
//           .then(function () {
//             console.log("successfully uploded");

//             firebase
//               .storage()
//               .ref("vets/" + auth.user.uid + "/profile.jpg")
//               .getDownloadURL()
//               .then((url) => {
//                 db.collection("vet")
//                   .doc(auth.user.uid)
//                   .update({
//                     vtFName: $("#firstname").val(),
//                     vtLName: $("#lastname").val(),
//                     vtBDate: $("#birthday").val(),
//                     vtLicense: $("#license").val(),
//                     vtPhone: $("#phone").val(),
//                     vtEducation: $("#education").val(),
//                     vtCitizenId: $("#citizen").val(),
//                     vtEmail: $("#email").val(),
//                     vtPassword: $("#pword").val(),
//                     vtImage: url,
//                     vtHospital: $("#Hospital option:selected").text(),
//                   })
//                   .then(function () {
//                     console.log("Document successfully written!");
//                     // $("#addEmployeeModal").modal('hide');
//                   })
//                   .catch(function (error) {
//                     console.error("Error writing document: ", error);
//                   });
//                 console.log(firstname);
//               });
//           })
//           .catch((error) => {
//             console.log(error.message);
//           });
//       })
//       .catch((error) => {
//         console.log(error.message);
//       });
//   //----------------------------------------
// }
