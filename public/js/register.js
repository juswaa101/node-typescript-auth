$(document).ready(function () {
  // register button event handler
  $("#registerBtn").click(function (e) {
    e.preventDefault();

    // disable the button and display the loading spinner
    $("#registerBtn").prop("disabled", true);
    $("#registerBtn").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    $("#loginBack").prop("disabled", true);

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
            Swal.fire({
              title: "Email Exists",
              text: "User Email Already Exists!",
              icon: "error",
            });
          }

          // check if user input is not valid
          if (response.status === 422) {
            Swal.fire({
              title: "Validation Error",
              html: `<pre>${response.errors[0] ?? ""}\n${
                response.errors[1] ?? ""
              }\n${response.errors[2] ?? ""}</pre>`,
              icon: "error",
            });
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

  $("#loginBack").click(function (e) {
    e.preventDefault();

    $("#loginBack").prop("disabled", true);
    $("#loginBack").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    setTimeout(() => {
      $("#loginBack").prop("disabled", false);
      $("#loginBack").html("Login Here");

      location.href = "/login";
    }, 1000);
  });
});
