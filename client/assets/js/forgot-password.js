$(document).ready(function () {
  // Getting references to our form and input fields
  const resetPwdForm = $("form.reset-pwd");
  const emailInput = $("input#email-input");

  // Getting references to our input validation messages
  const emailFeedback = $("small#email-validation");

  // Getting references to our error alert section
  const errorBox = $("#alert");
  const errorMsg = $("#alert .msg");

  // Buttons
  const cancelBtn = $(".cancel");

  // When the form is submitted, we validate there's an valid password entered
  resetPwdForm.on("submit", (event) => {
    event.preventDefault();
    const email = emailInput.val().trim();
    if (checkEmail(email)) {
      // If we have valid email input, run the sendEmail function
      succcessEmailAlert("Sending Password Reset Email", renderNewContent);
      sendEmail(email);
    } else {
      showError(
        errorBox,
        errorMsg,
        "You must fix all errors before you can proceed"
      );
      return;
    }
  });

  // This function does an API call to send email with link to reset password
  const sendEmail = (email) => {
    $.ajax({
      url: "/api/forgot_password",
      type: "POST",
      data: { email: email },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        const msg = error.responseText;
        console.log("Error message: " + msg);
        invalidInput(emailInput, emailFeedback, msg);
        authErrorAlert(
          msg,
          "Please create an account.",
          "Sign Up",
          "/signup",
          "Try Again"
        );
      });
  };

  function renderNewContent() {
    $(".container").empty();
    $(".container").addClass("text-center mt-4");
    $(".container").append(
      "<h2>Password Reset Email Sent</h2><hr /><p>An email has been sent to your email address. Follow the directions in the email to reset your password.</p><a class='btn btn-primary' href='/login'>Done</a>"
    );
  }

  emailInput.on("input", function () {
    const email = $(this).val().trim();

    if (checkEmail(email)) {
      // is true
      validInput($(this), emailFeedback, "Looks Good!");
    } else {
      invalidInput(
        $(this),
        emailFeedback,
        "You must provide a valid email address. For example johndoe@domain.com."
      );
    }
  });
});
