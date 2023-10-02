$(document).ready(function () {
  // login button event handler
  $("#loginBtn").click(function (e) {
    e.preventDefault();

    // disable the button and display the loading spinner
    $("#loginBtn").prop("disabled", true);
    $("#loginBtn").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    $("#registerBack").prop("disabled", true);

    // get all the data in the form
    let loginForm = $("#loginForm")[0];
    let loginFormData = new FormData(loginForm);

    // call ajax request to login
    setTimeout(() => {
      $.ajax({
        type: "post",
        url: "/api/login-auth",
        data: loginFormData,
        processData: false,
        contentType: false,
        cache: false,
        dataType: "json",
        success: function (response) {
          // if request is success, stop loading and enable the button again
          $("#loginBtn").prop("disabled", false);
          $("#loginBtn").html("Login");

          $("#registerBack").prop("disabled", false);

          // check if user login succeed
          if (response.status === 200) {
            location.href = "/welcome";
          }

          // check if user is not authenticated
          if (response.status === 401) {
            Swal.fire({
              title: "Authentication Error",
              text: response.message ?? "",
              icon: "error",
            });
          }

          // check if user input is not valid
          if (response.status === 422) {
            Swal.fire({
              title: "Validation Error",
              html: `<pre>${response.errors[0] ?? ""}\n${
                response.errors[1] ?? ""
              }</pre>`,
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
          $("#loginBtn").prop("disabled", false);
          $("#loginBtn").html("Login");

          $("#registerBack").prop("disabled", false);

          Swal.fire({
            title: "Error",
            text: "Something went wrong",
            icon: "error",
          });
        },
      });
    }, 1000);
  });

  $("#registerBack").click(function (e) {
    e.preventDefault();

    $("#registerBack").prop("disabled", true);
    $("#registerBack").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    setTimeout(() => {
      $("#registerBack").prop("disabled", false);
      $("#registerBack").html("Login Here");

      location.href = "/register";
    }, 1000);
  });
});
