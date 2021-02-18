$(document).ready(function () {
  // Getting references to our form and input
  const updateUserForm = $("form.update-user");
  const firstNameInput = $("input#firstName-input");
  const lastNameInput = $("input#lastName-input");
  const phoneInput = $("input#phone-input");
  const emailInput = $("input#email-input");

  // Getting references to our input validation messages
  const firstNameFeedback = $("small#first-name-validation");
  const lastNameFeedback = $("small#last-name-validation");
  const emailFeedback = $("small#email-validation");
  const phoneFeedback = $("small#phone-validation");

  // Buttons
  const deleteUserBtn = $(".delete-user");

  // Getting references to our error alert section
  const errorBox = $("#alert");
  const errorMsg = $("#alert .msg");

  // This file just does a GET request to figure out which user is logged in and updates the HTML on the page
  $.get("/api/user_data").then((data) => {
    console.log(data);
    emailInput.val(data.email);
    phoneInput.val(data.phone);
    firstNameInput.val(data.firstName);
    lastNameInput.val(data.lastName);
    $("#lastUpdate").text(data.updatedAt);
    $("#assignedRole").text(data.role);
  });

  // Happens when updateUserForm is submitted
  updateUserForm.on("submit", (event) => {
    event.preventDefault();

    const updatedUser = {
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim(),
      email: emailInput.val().trim(),
      phone: phoneInput.val().trim(),
    };

    if (
      checkName(updatedUser.firstName) &&
      checkName(updatedUser.lastName) &&
      checkEmail(updatedUser.email) &&
      checkPhone(updatedUser.phone)
    ) {
      // Send the POST request
      updateUser(updatedUser);
    } else {
      showError(
        errorBox,
        errorMsg,
        "You must fix all errors before you can proceed"
      );
      return;
    }
  });

  deleteUserBtn.on("click", (event) => {
    event.preventDefault();

    confirmDeleteAlert(
      "Are you sure you want to delete your account?",
      "Your account has been deleted successfully.",
      "Your account is safe :)",
      deleteUser,
      "/user-dashboard"
    );
  });

  // This function does an API call to delete user
  const deleteUser = () => {
    $.ajax({
      method: "DELETE",
      url: "/api/user_data",
    })
      .then(() => {
        window.location.replace("/logout");
      })
      .catch((error) => {
        console.log(error);
        showError(
          errorBox,
          errorMsg,
          "A problem occured when trying to delete your account."
        );
      });
  };

  // This function does an API call to update user
  const updateUser = (updatedUser) => {
    $.ajax({
      url: "/api/user_data",
      type: "PUT",
      data: updatedUser,
    })
      .then(() => {
        successAlert("Your profile has been updated", "/user-dashboard");
      })
      .catch((error) => {
        const msg = error.responseJSON.errors[0].message;
        handleUpdateErr(msg);
      });
  };

  function handleUpdateErr(msg) {
    console.log("Error message: " + msg);
    switch (msg) {
      case "users.email must be unique":
        showError(
          errorBox,
          errorMsg,
          "That email address already in use with another account."
        );
        invalidInput(
          emailInput,
          emailFeedback,
          "Email address already in use with another account."
        );
        break;
      case "users.phone must be unique":
        showError(
          errorBox,
          errorMsg,
          "That phone number already in use with another account."
        );
        invalidInput(
          phoneInput,
          phoneFeedback,
          "Phone number already in use with another account."
        );

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
        showError(
          errorBox,
          errorMsg,
          "Something went wrong while trying to udpate your profile."
        );
    }
  }

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
});
