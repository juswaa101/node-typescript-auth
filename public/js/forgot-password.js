$(document).ready(function () {
  NProgress.configure({ showSpinner: false });

  NProgress.start();
  NProgress.done();

  // Send email request button event handler
  $("#sendRequestBtn").click(function (e) {
    e.preventDefault();

    NProgress.start();

    // disable the button and display the loader
    $("#sendRequestBtn").prop("disabled", true);
    $("#sendRequestBtn").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    $("#email-error").html("");

    let emailForgotPasswordForm = $("#emailForgotPasswordForm")[0];
    let emailForgotPasswordFormData = new FormData(emailForgotPasswordForm);

    // call ajax request to send email password reset
    setTimeout(() => {
      $.ajax({
        type: "post",
        url: "/api/send-email-password-reset",
        data: emailForgotPasswordFormData,
        dataType: "json",
        processData: false,
        contentType: false,
        cache: false,
        success: function (response) {
          NProgress.done();

          // enable button and stop loading
          $("#sendRequestBtn").prop("disabled", false);
          $("#sendRequestBtn").html("Send Request");

          // if user is not verified or found
          if (response.status === 404) {
            $("#email-error").html(response.message ?? "");
          }

          if (response.status === 422) {
            $("#email-error").html(response.errors[0] ?? "");
          }

          // if email is found and verified, then send email
          if (response.status === 200) {
            Swal.fire({
              title: "Success",
              text: "Password reset was sent to your email, please check your inbox!",
              icon: "success",
            });
          }

          // if sending of email fails
          if (response.status === 500) {
            Swal.fire({
              title: "Verification Error",
              text: "Sending of Password Reset Fails!",
              icon: "error",
            });
          }
        },
        error: function (err) {
          NProgress.done();

          // enable button and stop loading
          $("#sendRequestBtn").prop("disabled", false);
          $("#sendRequestBtn").html("Send Request");

          Swal.fire({
            title: "Error",
            text: "Something went wrong!",
            icon: "error",
          });
        },
      });
    }, 1000);
  });

  // login link button event handler
  $("#loginBack").click(function (e) {
    e.preventDefault();

    // disable button and load the spinner
    $("#loginBack").prop("disabled", true);
    $("#loginBack").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    // delay the request by 1 second
    setTimeout(() => {
      // enable button and disable the spinner
      $("#loginBack").prop("disabled", false);
      $("#loginBack").html("Login Here");

      // go to register form
      location.href = "/login";
    }, 1000);
  });
});
