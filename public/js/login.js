$(document).ready(function () {
  NProgress.configure({ showSpinner: false });

  NProgress.start();
  NProgress.done();

  // check if email is remembered
  if (localStorage.getItem("email") !== null) {
    $("#email").val(localStorage.getItem("email"));
    $("#remember").prop("checked", true);
  }

  // login button event handler
  $("#loginBtn").click(function (e) {
    e.preventDefault();

    NProgress.start();

    // disable the button and display the loading spinner
    $("#loginBtn").prop("disabled", true);
    $("#loginBtn").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    $("#registerBack").prop("disabled", true);

    $("#email-error").html("");
    $("#password-error").html("");
    $("#auth-error").html("");

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
          NProgress.done();

          // if request is success, stop loading and enable the button again
          $("#loginBtn").prop("disabled", false);
          $("#loginBtn").html("Login");

          $("#registerBack").prop("disabled", false);

          // check if user login succeed
          if (response.status === 200 && response.data[0].login) {
            location.href = "/welcome";
          }

          // check if user is not authenticated
          if (response.status === 401) {
            $("#auth-error").html(response.message ?? "");
          }

          // check if user input is not valid
          if (response.status === 422) {
            $("#email-error").html(response.errors[0] ?? "");
            $("#password-error").html(response.errors[1] ?? "");
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

  // register link button event handler
  $("#registerBack").click(function (e) {
    e.preventDefault();

    NProgress.start();

    // disable button and load the spinner
    $("#registerBack").prop("disabled", true);
    $("#registerBack").html("<i class='fa fa-spinner fa-spin'></i> Loading");

    // delay the request by 1 second
    setTimeout(() => {
      NProgress.done();

      // enable button and disable the spinner
      $("#registerBack").prop("disabled", false);
      $("#registerBack").html("Login Here");

      // go to register form
      location.href = "/register";
    }, 1000);
  });

  // remember me button event handler
  $("#remember").change(function (e) {
    NProgress.start();

    if ($(this).is(":checked") && $("#email").val().length > 0) {
      localStorage.setItem("email", $("#email").val() ?? "");
    } else {
      localStorage.removeItem("email");
      $('#email').val("");
    }
    NProgress.done();
  });
});
