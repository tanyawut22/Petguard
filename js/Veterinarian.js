
//---------------------------------------------------------
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
    
    
    // ADD EMPLOYEE
    $("#add-employee-form").submit(function (event) {
        event.preventDefault();
        db.collection('vet').add({
                vtImage: $('#customFile').val(),
                vtFName: $('#employee-name').val(),
                vtLName: $('#employee-email').val(),
                vtBDate: $('#employee-address').val(),
                vtEmail: $('#employee-Email').val(),
                vtLicense: $('#employee-License').val(),
                vtPhone: $('#employee-Phone').val(),
                vtEducation: $('#employee-Education').val(),
                vtCitizenId: $('#employee-Citizen').val(),
                vtPassword: $('#employee-Password').val(),
                vtBalance: "0",
                vtWorkStatus: "offline",
                vtHospital: $('#VHosbox').val()
            }).then(function () {
                console.log("Document successfully written!");
                $("#addEmployeeModal").modal('hide');
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    });

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
                $('#edit-employee-form #customFile').val(document.data().vtImage);
                $('#edit-employee-form #employee-name').val(document.data().vtFName);
                $('#edit-employee-form #employee-email').val(document.data().vtLName);
                $('#edit-employee-form #employee-address').val(document.data().vtBDate);
                $('#edit-employee-form #employee-Email').val(document.data().vtEmail);
                $('#edit-employee-form #employee-License').val(document.data().vtLicense);
                $('#edit-employee-form #employee-Phone').val(document.data().vtPhone);
                $('#edit-employee-form #employee-Education').val(document.data().vtEducation);
                $('#edit-employee-form #employee-Citizen').val(document.data().vtCitizenId);
                $('#edit-employee-form #employee-Password').val(document.data().vtPassword);
                $('#edit-employee-form #VHosbox').val(document.data().vtHospital);
                
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
            vtImage: $('#edit-employee-form #customFile').val(),
            vtFName: $('#edit-employee-form #employee-name').val(),
            vtLName: $('#edit-employee-form #employee-email').val(),
            vtBDate: $('#edit-employee-form #employee-address').val(),
            vtEmail: $('#edit-employee-form #employee-Email').val(),
            vtLicense: $('#edit-employee-form #employee-License').val(),
            vtPhone: $('#edit-employee-form #employee-Phone').val(),
            vtEducation: $('#edit-employee-form #employee-Education').val(),
            vtCitizenId: $('#edit-employee-form #employee-Citizen').val(),
            vtPassword: $('#edit-employee-form #employee-Password').val(),
            vtHospital: $('#edit-employee-form #VHosbox').val()
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