$(document).ready(function () {
  // Getting references to our form and input fields
  const resetPwdForm = $("form.reset-pwd");
  const pwdInput = $("input#pwd-input");
  const confirmPwdInput = $("input#confirm-pwd-input");

  // Getting references to our input validation messages

  const pwdFeedback = $("small#pwd-validation");
  const confirmPwdFeedback = $("small#confirm-pwd-validation");

  // Getting references to our error alert section
  const errorBox = $("#alert");
  const errorMsg = $("#alert .msg");

  // Buttons
  const cancelBtn = $(".cancel");

  const pathsArr = window.location.pathname.split("/");
  const resetPasswordToken = pathsArr[pathsArr.indexOf("reset") + 1];
  console.log("Password Reset Token: " + resetPasswordToken);

  // When the form is submitted, we validate there's an valid password entered
  resetPwdForm.on("submit", (event) => {
    event.preventDefault();

    const password = pwdInput.val();

    if (checkPwdMatch(password, confirmPwdInput.val()) && checkPwd(password)) {
      // If password meets all requirements, run the resetPwd function
      resetPwd(password, resetPasswordToken);
    } else {
      showError(
        errorBox,
        errorMsg,
        "You must fix all errors before you can proceed"
      );
      return;
    }
  });

  // Does a post to the signup route. If successful, we are redirected to the user-dashboard page. Otherwise we log any errors
  const resetPwd = (password, resetPasswordToken) => {
    $.ajax({
      type: "POST",
      url: `/api/reset/${resetPasswordToken}`,
      data: { password: password },
    })
      .then((res) => {
        console.log(res);

        successAlert("Your password is being reset, now try login", "/login");
      })
      .catch((error) => {
        console.log(error);
        const msg = error.responseJSON.message;
        console.log("Error: " + msg);
        handleExpiredLinkErr();
      });
  };

  // Add event listener to go back button
  cancelBtn.click(function () {
    window.location.replace("/login");
  });

  // Alerts user that their link to reset their password is expired or invalid
  function handleExpiredLinkErr() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-info m-2",
        cancelButton: "btn btn-secondary m-2",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Expired Link",
        text:
          "The link you are trying to access is no longer available. Please try resetting your password again.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Reset Password",
      })
      .then((result) => {
        if (result.isConfirmed) {
          window.location.replace("/forgot-password");
        }
        window.location.replace("/login");
      });
  }

  // Validate password meets requirements and is strong
  pwdInput.on("input", function () {
    const pwd = $(this).val();

    if (checkPwd(pwd)) {
      // is true
      validInput(pwdInput, pwdFeedback, "Password meets all requirements!");
    } else {
      invalidInput(
        pwdInput,
        pwdFeedback,
        "Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces."
      );
    }
  });

  // This is Making sure that the two password inputs match
  $("#pwd-input, #confirm-pwd-input").on("keyup", function () {
    const pwd1 = pwdInput.val();
    const pwd2 = confirmPwdInput.val();

    if (checkPwdMatch(pwd1, pwd2)) {
      // is true
      validInput(confirmPwdInput, confirmPwdFeedback, "Passwords Match.");
    } else {
      invalidInput(
        confirmPwdInput,
        confirmPwdFeedback,
        "Passwords don't match."
      );
    }
  });
});
