$(document).ready(function () {
  NProgress.configure({ showSpinner: false });

  NProgress.start();
  NProgress.done();

  // register button event handler
  $("#registerBtn").click(function (e) {
    e.preventDefault();

    NProgress.start();

    // disable the button and display the loading spinner
    $("#registerBtn").prop("disabled", true);
    $("#registerBtn").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    $("#loginBack").prop("disabled", true);

    $("#name-error").html("");
    $("#email-error").html("");
    $("#password-error").html("");

    // get all the data in the form
    let registerForm = $("#registerForm")[0];
    let registerFormData = new FormData(registerForm);

    // call ajax request to register
    setTimeout(() => {
      $.ajax({
        type: "post",
        url: "/api/register-auth",
        data: registerFormData,
        processData: false,
        contentType: false,
        cache: false,
        dataType: "json",
        success: function (response) {
          NProgress.done();

          // if request is success, stop loading and enable the button again
          $("#registerBtn").prop("disabled", false);
          $("#registerBtn").html("Register");

          $("#loginBack").prop("disabled", false);

          // check if user registration is success
          if (response.status === 200) {
            Swal.fire({
              title: "Success",
              text: "Registered Successfully!",
              icon: "success",
            });
            registerForm.reset();
          }

          // check if user email is already existing
          if (response.status === 409) {
            $("#email").val("");
            $("#email-error").html(response.message ?? "");
          }

          // check if user input is not valid
          if (response.status === 422) {
            $("#name-error").html(response.errors[0] ?? "");
            $("#email-error").html(response.errors[1] ?? "");
            $("#password-error").html(response.errors[2] ?? "");
          }

          // check if something went wrong while submitting the request
          if (response.status === 500) {
            Swal.fire({
              title: "Error",
              text: "Something went wrong",
              icon: "error",
            });
          }
        },
        error: function (err) {
          NProgress.done();

          // if request has error, stop loading and enable the button again
          $("#registerBtn").prop("disabled", false);
          $("#registerBtn").html("Register");

          $("#loginBack").prop("disabled", false);

          Swal.fire({
            title: "Error",
            text: "Something went wrong",
            icon: "error",
          });
        },
      });
    }, 1000);
  });

  // login link button event handler
  $("#loginBack").click(function (e) {
    e.preventDefault();

    NProgress.start();

    // disable button and load the spinner
    $("#loginBack").prop("disabled", true);
    $("#loginBack").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    // delay the request by 1 second
    setTimeout(() => {
      NProgress.done();

      // enable button and disable the spinner
      $("#loginBack").prop("disabled", false);
      $("#loginBack").html("Login Here");

      // go to register form
      location.href = "/login";
    }, 1000);
  });
});
