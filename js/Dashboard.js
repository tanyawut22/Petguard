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
    const countEarnings = db.doc("stats/earnings");


    // GET TOTAL SIZE
    countEarnings.onSnapshot(snapshot => {
        let size = snapshot.size;
        $('.countEarnings').text(size);
        if (size == 0) {
            $('#selectAll').attr('disabled', true);
        } else {
            $('#selectAll').attr('disabled', false);
        }
    });

    
});
