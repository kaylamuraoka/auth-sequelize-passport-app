$(document).ready(function () {
  // Getting references to our form and input fields
  const loginForm = $("form.login");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");

  // Getting references to our input validation messages
  const emailFeedback = $("small#email-validation");
  const passwordFeedback = $("small#pwd-validation");

  // Getting references to our error alert section
  const errorBox = $("#alert");
  const errorMsg = $("#alert .msg");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", (event) => {
    event.preventDefault();

    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val(),
    };

    // Validate that input fields meet all specified requirements
    if (checkEmail(userData.email)) {
      // If we have an email and password we run the loginUser function and clear the form
      loginUser(userData);
    } else {
      showError(
        errorBox,
        errorMsg,
        "You must fix all errors before you can proceed"
      );
      return;
    }
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the user-dashboard page
  const loginUser = (userData) => {
    $.ajax({
      type: "POST",
      url: "/api/login",
      data: userData,
    })
      .then(() => {
        succcessRedirectAlert("Logging you in", "/user-dashboard");
      })
      .catch((error) => {
        const msg = error.responseJSON.message;
        handleLoginErr(msg);
      });
  };

  function handleLoginErr(msg) {
    console.log("Error message: " + msg);
    passwordInput.val("");
    switch (msg) {
      case "The password you entered is incorrect. Please try again.":
        showError(errorBox, errorMsg, msg);
        invalidInput(passwordInput, passwordFeedback, msg);
        break;
      case "No account found with that email address.":
        invalidInput(emailInput, emailFeedback, msg);
        invalidInput(passwordInput, passwordFeedback, msg);
        authErrorAlert(msg, "Please create an account.", "Sign Up", "/signup");
        break;
      default:
        msg = "Invalid login credentials. Please try again.";
        showError(errorBox, errorMsg, msg);
        invalidInput(emailInput, emailFeedback, msg);
        invalidInput(passwordInput, passwordFeedback, msg);
    }
  }

  emailInput.on("input", function () {
    let email = $(this).val().trim();

    if (checkEmail(email)) {
      // is true
      validInput($(this), emailFeedback, "Looks Good!");
    } else {
      invalidInput(
        $(this),
        emailFeedback,
        "Enter the email address associated with your account."
      );
    }
  });

  // Validate password
  passwordInput.on("input", function () {
    const pwd = $(this).val();

    if (checkPwd(pwd)) {
      // is true
      validInput(passwordInput, passwordFeedback, "Looks Good!");
    } else {
      invalidInput(
        passwordInput,
        passwordFeedback,
        "Enter the password associated with your account."
      );
    }
  });
});
