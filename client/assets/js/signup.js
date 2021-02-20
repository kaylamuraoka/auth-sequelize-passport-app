$(document).ready(function () {
  // Getting references to our form and input fields
  const signUpForm = $("form.signup");
  const firstNameInput = $("input#firstName-input");
  const lastNameInput = $("input#lastName-input");
  const emailInput = $("input#email-input");
  const phoneInput = $("input#phone-input");
  const profileImgInput = $("input#profile-img-input");
  const roleSelect = $("select#role-input");
  const passwordInput = $("input#password-input");
  const confirmPasswordInput = $("input#confirm-password-input");

  // Getting references to our input validation messages
  const firstNameFeedback = $("small#first-name-validation");
  const lastNameFeedback = $("small#last-name-validation");
  const emailFeedback = $("small#email-validation");
  const phoneFeedback = $("small#phone-validation");
  const roleFeedback = $("small#role-validation");
  const passwordFeedback = $("small#pwd-validation");
  const confirmPasswordFeedback = $("small#confirm-pwd-validation");
  const profileImgFeedback = $("small#profile-img-validation");

  // Getting references to our error alert section
  const errorBox = $("#alert");
  const errorMsg = $("#alert .msg");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", (event) => {
    event.preventDefault();

    const userData = {
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim(),
      email: emailInput.val().trim(),
      phone: phoneInput.val().trim(),
      role: $("#role-input option:selected").val(),
      password: passwordInput.val(),
    };
    const confirmPwd = confirmPasswordInput.val();

    // Validate that input fields meet all specified requirements
    if (
      checkName(userData.firstName) &&
      checkName(userData.lastName) &&
      checkEmail(userData.email) &&
      checkPhone(userData.phone) &&
      checkRole(userData.role) &&
      checkPwdMatch(userData.password, confirmPwd) &&
      checkPwd(userData.password)
    ) {
      // If we have all required inputs, run the signUpUser function
      signUpUser(userData);
    } else {
      showError(
        errorBox,
        errorMsg,
        "Please make sure you fill in all required fields and fix all errors before proceeding"
      );
      return;
    }
  });

  // Does a post to the signup route. If successful, we are redirected to the user-dashboard page. Otherwise we log any errors
  const signUpUser = (userData) => {
    $.ajax({
      type: "POST",
      url: "/api/signup",
      data: userData,
    })
      .then((response) => {
        console.log(response);
        succcessRedirectAlert("Creating your account", "/user-dashboard");
      })
      .catch((error) => {
        console.log(error);
        const msg = error.responseJSON.errors[0].message;
        handleSignupErr(msg);
      });
  };

  firstNameInput.on("input", function () {
    const firstName = $(this).val().trim();

    if (checkName(firstName)) {
      // is true
      validInput($(this), firstNameFeedback, "Looks Good!");
    } else {
      invalidInput(
        $(this),
        firstNameFeedback,
        "First name must be at least 2 characters in length and contain alphabetical characters, hyphens, and spaces."
      );
    }
  });

  lastNameInput.on("input", function () {
    const lastName = $(this).val().trim();

    if (checkName(lastName)) {
      // is true
      validInput($(this), lastNameFeedback, "Looks Good!");
    } else {
      invalidInput(
        $(this),
        lastNameFeedback,
        "Last name must be at least 2 characters in length and contain alphabetical characters, hyphens, and spaces."
      );
    }
  });

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

  phoneInput.on("input", function () {
    const phone = $(this).val().trim();

    if (checkPhone(phone)) {
      // is true
      validInput($(this), phoneFeedback, "Looks Good!");
    } else {
      invalidInput(
        $(this),
        phoneFeedback,
        "You must provide a valid phone number. For example: 8081234567"
      );
    }
  });

  // Validate that a role is selected
  roleSelect.change(function () {
    const selectedRole = $("#role-input option:selected").val();

    if (checkRole(selectedRole)) {
      // is true
      validInput($(this), roleFeedback, "Looks Good!");
    } else {
      invalidInput($(this), roleFeedback, "You must select a role.");
    }
  });

  // Validate password meets requirements and is strong
  passwordInput.on("input", function () {
    const pwd = $(this).val();

    if (checkPwd(pwd)) {
      // is true
      validInput(
        passwordInput,
        passwordFeedback,
        "Password meets all requirements!"
      );
    } else {
      invalidInput(
        passwordInput,
        passwordFeedback,
        "Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces."
      );
    }
  });

  $("#password-input, #confirm-password-input").on("keyup", function () {
    const pwd1 = passwordInput.val();
    const pwd2 = confirmPasswordInput.val();

    if (checkPwdMatch(pwd1, pwd2)) {
      // is true
      validInput(
        confirmPasswordInput,
        confirmPasswordFeedback,
        "Passwords Match."
      );
    } else {
      invalidInput(
        confirmPasswordInput,
        confirmPasswordFeedback,
        "Passwords don't match."
      );
    }
  });
  const uploadImgPlaceholder = $("#profileImage");
  // Functions for uploading profile image
  $("#profileImage").click(function (e) {
    profileImgInput.click();
  });

  $(".icon-container").click(function (e) {
    profileImgInput.click();
  });

  profileImgInput.change(function () {
    uploadImagePreview(this, uploadImgPlaceholder, profileImgFeedback);
  });

  function handleSignupErr(msg) {
    console.log("Error message: " + msg);
    switch (msg) {
      case "users.email must be unique":
        emailInUseErr();
        break;
      case "users.phone must be unique":
        phoneInUseErr();
        break;
      case "The email address you entered is invalid":
        showError(errorBox, errorMsg, msg);
        invalidInput(
          emailInput,
          emailFeedback,
          "You must provide a valid email address. For example johndoe@domain.com."
        );
        break;
      default:
        showError(errorBox, errorMsg, msg);
    }
  }

  function emailInUseErr() {
    // Label email input as invalid
    invalidInput(
      emailInput,
      emailFeedback,
      "Email address already in use with another account."
    );
    // display error
    authErrorAlert(
      "Oops... Looks like you already have an account with this email address.",
      "Please try to login.",
      "Login",
      "/login",
      "Forgot your password?"
    );
  }

  function phoneInUseErr() {
    // Label phone input as invalid
    invalidInput(
      phoneInput,
      phoneFeedback,
      "Phone number already in use with another account."
    );
    // display error
    authErrorAlert(
      "Oops... Looks like you already have an account with this phone number.",
      "Please try to login.",
      "Login",
      "/login",
      "Forgot your password?"
    );
  }
});
