$(document).ready(function () {
  // Getting references to our form and input fields
  const changePwdForm = $("form.change-pwd");
  const oldPwdInput = $("input#old-pwd-input");
  const newPwdInput = $("input#new-pwd-input");
  const confirmNewPwdInput = $("input#confirm-new-pwd-input");

  // Getting references to our input validation messages
  const oldPwdFeedback = $("small#old-pwd-validation");
  const newPwdFeedback = $("small#new-pwd-validation");
  const confirmNewPwdFeedback = $("small#confirm-new-pwd-validation");

  // Getting references to our error alert section
  const errorBox = $("#alert");
  const errorMsg = $("#alert .msg");

  // Buttons
  const clearFormBtn = $(".clear-form");
  const goBackBtn = $(".go-back");

  // Element to toggle between password visibility
  const pwdVisibilityToggle = $("#pwd-visibility");

  // When the form is submitted, we validate there's an valid password entered
  changePwdForm.on("submit", (event) => {
    event.preventDefault();

    const updatedPwd = {
      currentPassword: oldPwdInput.val(),
      newPassword: newPwdInput.val(),
    };

    if (
      checkPwdMatch(updatedPwd.newPassword, confirmNewPwdInput.val()) &&
      checkPwd(updatedPwd.newPassword)
    ) {
      // If we have all required inputs, run the updatePwd function
      updatePwd(updatedPwd);
    } else {
      showError(
        errorBox,
        errorMsg,
        "You must fix all errors before you can proceed"
      );
      return;
    }
  });

  // Add event listener to clear form button
  clearFormBtn.click(function () {
    oldPwdInput.val("");
    newPwdInput.val("");
    confirmNewPwdInput.val("");
  });

  // Add event listener to go back button
  goBackBtn.click(function () {
    window.location.replace("/user-dashboard");
  });

  // When pwdVisibilityToggle is clicked, toggle between password visibility
  pwdVisibilityToggle.click(function () {
    showPassword(oldPwdInput);
    showPassword(newPwdInput);
    showPassword(confirmNewPwdInput);
  });

  // This function does an API call to update user
  const updatePwd = (updatedPwd) => {
    $.ajax({
      url: "/api/change_password",
      type: "PUT",
      data: updatedPwd,
    })
      .then((res) => {
        validInput(oldPwdInput, oldPwdFeedback, "Looks Good!");
        console.log(res);
        successAlert("Your password has been changed", "/user-dashboard");
      })
      .catch((error) => {
        console.log(error);
        const msg = error.responseJSON.msg;
        handleUpdateErr(msg);
      });
  };

  function handleUpdateErr(msg) {
    console.log("Error message: " + msg);

    showError(errorBox, errorMsg, msg);
    invalidInput(oldPwdInput, oldPwdFeedback, msg);
  }

  // Validate password meets requirements and is strong
  newPwdInput.on("input", function () {
    const pwd = $(this).val();

    if (checkPwd(pwd)) {
      // is true
      validInput(
        newPwdInput,
        newPwdFeedback,
        "Password meets all requirements!"
      );
    } else {
      invalidInput(
        newPwdInput,
        newPwdFeedback,
        "Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces."
      );
    }
  });

  $("#new-pwd-input, #confirm-new-pwd-input").on("keyup", function () {
    const pwd1 = newPwdInput.val();
    const pwd2 = confirmNewPwdInput.val();

    if (checkPwdMatch(pwd1, pwd2)) {
      // is true
      validInput(confirmNewPwdInput, confirmNewPwdFeedback, "Passwords Match.");
    } else {
      invalidInput(
        confirmNewPwdInput,
        confirmNewPwdFeedback,
        "Passwords don't match."
      );
    }
  });
});
