$(document).ready(function () {
    const countUser = db.collection("users");


    // GET TOTAL SIZE
    countUser.onSnapshot(snapshot => {
        let size = snapshot.size;
        $('.count').text(size);
        if (size == 0) {
            $('#selectAll').attr('disabled', true);
        } else {
            $('#selectAll').attr('disabled', false);
        }
    });

    
});

$(document).ready(function () {
    const countCon = db.collection("consultHistory");


    // GET TOTAL SIZE
    countCon.onSnapshot(snapshot => {
        let size = snapshot.size;
        $('.countCon').text(size);
        if (size == 0) {
            $('#selectAll').attr('disabled', true);
        } else {
            $('#selectAll').attr('disabled', false);
        }
    });

    
});

$(document).ready(function () {
    const countVet = db.collection("vet");


    // GET TOTAL SIZE
    countVet.onSnapshot(snapshot => {
        let size = snapshot.size;
        $('.countVet').text(size);
        if (size == 0) {

            $('#selectAll').attr('disabled', true);
        } else {
            $('#selectAll').attr('disabled', false);
        }
    });

    
});

$(document).ready(function () {
    const countVet = db.collection("consultHistory");


    // GET TOTAL SIZE
    countVet.onSnapshot(snapshot => {
        let size = snapshot.size;
        $('.countEarnings').text(size*200);
        if (size == 0) {
            $('#selectAll').attr('disabled', true);
        } else {
            $('#selectAll').attr('disabled', false);
        }
    });

    
});


// function getData(callbackIN) {
//     var ref = db.ref("consultHistory");
//     ref.once('time').then(function (snapshot) {
//       callbackIN(snapshot.val())
//       console.log(time);
//     });
//   }

  $(document).on('click', '.logoutBtn', function () {
    // let id = $(this).attr('id');
    // $('#delete-employee-form').attr('delete-id', id);
    $('#logoutModal').modal('show');
    console.log("Check")
});

$("#modal-dialog").submit(function (event) {
    event.preventDefault();
    window.location = "login.html";
});


function logout() {
    alert();
    window.location = "login.html";
}
