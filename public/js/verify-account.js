$(document).ready(function () {
  NProgress.configure({ showSpinner: false });

  NProgress.start();
  NProgress.done();

  $("#verifyBtn").click(function (e) {
    e.preventDefault();

    NProgress.start();

    // disable the button and display the loading spinner
    $("#verifyBtn").prop("disabled", true);
    $("#verifyBtn").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    // get id of user to update
    let id = $("#id").val() ?? "";

    // call ajax request to verify account
    setTimeout(() => {
      $.ajax({
        type: "post",
        url: "/api/verify-account/" + id,
        dataType: "json",
        success: function (response) {
          NProgress.done();

          // enable button and stop loading
          $("#verifyBtn").prop("disabled", false);
          $("#verifyBtn").html("Verify");

          // if verification is success
          if (response.status === 200) {
            Swal.fire({
              title: "Success",
              text: "Account Verification Success!",
              icon: "success",
              allowEscapeKey: false,
              allowOutsideClick: false,
            }).then(() => {
              location.href = "/login";
            });
          }

          if (response.status === 409) {
            Swal.fire({
              title: "Verification Error",
              text: "Account is already verified",
              icon: "error",
              allowEscapeKey: false,
              allowOutsideClick: false,
            }).then(() => {
              location.href = "/login";
            });
          }

          // if verification does not succeed
          if (response.status === 500) {
            Swal.fire({
              title: "Verification Error",
              text: "Account Verification Fails!",
              icon: "error",
            });
          }
        },
        error: function (err) {
          NProgress.done();

          $("#verifyBtn").prop("disabled", false);
          $("#verifyBtn").html("Verify");
          Swal.fire({
            title: "Error",
            text: "Something went wrong!",
            icon: "error",
          });
        },
      });
    }, 1000);
  });
});
