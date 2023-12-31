$(document).ready(function () {
  NProgress.configure({ showSpinner: false });

  NProgress.start();
  NProgress.done();

  // Submit button event handler
  $("#changePasswordBtn").click(function (e) {
    e.preventDefault();

    NProgress.start();

    // disable the button and display the loader
    $("#changePasswordBtn").prop("disabled", true);
    $("#changePasswordBtn").html(
      "<i class='fa fa-spinner fa-spin'></i> Loading"
    );

    $("#new_password_error").html("");
    $("#confirm_password_error").html("");

    let emailForgotPasswordForm = $("#emailResetPasswordForm")[0];
    let emailForgotPasswordFormData = new FormData(emailForgotPasswordForm);

    // call ajax request to change password
    setTimeout(() => {
      $.ajax({
        type: "post",
        url: "/api/reset-password",
        data: emailForgotPasswordFormData,
        dataType: "json",
        processData: false,
        contentType: false,
        cache: false,
        success: function (response) {
          NProgress.done();

          // enable button and stop loading
          $("#changePasswordBtn").prop("disabled", false);
          $("#changePasswordBtn").html("Send Request");

          // if changing of password is successful
          if (response.status === 200) {
            Swal.fire({
              title: "Success",
              text: "Password changed!",
              icon: "success",
            }).then(() => {
              location.href = "/login";
            });
          }

          // if verify token isnt existing
          if (response.status === 404) {
            Swal.fire({
              title: "Error",
              text: "Verify Token is not existing anymore",
              icon: "error",
              allowEscapeKey: false,
              allowOutsideClick: false,
            }).then(() => {
              location.href = "/login";
            });
          }

          // if validation fails
          if (response.status === 422) {
            $("#new_password_error").html(response.errors[0] ?? "");
          }

          // if password is not successfully updated
          if (response.status === 500) {
            Swal.fire({
              title: "Error",
              text: "Password is not successfully updated!",
              icon: "error",
            });
          }
        },
        error: function (err) {
          NProgress.done();

          // enable button and stop loading
          $("#changePasswordBtn").prop("disabled", false);
          $("#changePasswordBtn").html("Send Request");

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
