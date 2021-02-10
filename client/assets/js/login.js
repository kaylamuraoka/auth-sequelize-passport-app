// JavaScript file with the functions that will be included on every page
// DECLARATION OF GLOBAL VARIABLES HERE
let timerInterval;

// -------------------------------------------------------------------------------------
// FUNCTIONS FOR PROVIDING FEEDBACK TO USER WHEN VALIDATING USER INPUT
function invalidInput(inputEl, feedbackEl, msg) {
  inputEl.removeClass("is-valid").addClass("is-invalid");
  feedbackEl
    .html(msg)
    .removeClass("text-muted text-success")
    .addClass("text-danger");
}

function validInput(inputEl, feedbackEl, msg) {
  inputEl.removeClass("is-invalid").addClass("is-valid");
  feedbackEl
    .html(msg)
    .removeClass("text-muted text-danger")
    .addClass("text-success");
}

function showError(alertEl, alertMsgEl, msg) {
  alertEl.fadeIn(500).delay(10000).fadeOut("slow");
  alertMsgEl.text(msg);
}

// -------------------------------------------------------------------------------------
// FUNCTIONS FOR GETTING THE GREETING FOR THE HOMEPAGE/DASHBOARD
function getGreeting() {
  const today = new Date();
  const curHr = today.getHours();
  if (curHr < 12) {
    return "Good Morning";
  } else if (curHr < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

// Helper function to hide items
function hide(el) {
  el.style.display = "none";
}
function show(el) {
  el.style.display = "inline";
}

// -------------------------------------------------------------------------------------
// FUNCTIONS FOR VALIDATING USER INPUT
function checkEmail(email) {
  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email || !email.match(mailformat)) {
    // Input field is empty or does not meet the general email format
    return false;
  } else {
    return true;
  }
}

function checkPhone(phone) {
  const phoneFormat = /^\d{10}$/;
  if (!phone || phone.length !== 10 || !phone.match(phoneFormat)) {
    // Input field is empty, less than or greater than 10 digits or doesn't follow the general format
    return false;
  } else {
    return true;
  }
}

function checkName(name) {
  const nameFormat = /^[A-Za-z- ]+$/;
  if (name.length < 2 || !name.match(nameFormat)) {
    // Input field is empty or less than 2 characters in length or contains invalid characters
    return false;
  } else {
    return true;
  }
}

function checkPwd(pwd) {
  if (
    pwd.length < 8 ||
    pwd.length > 20 ||
    pwd.indexOf(" ") >= 0 ||
    !pwd.match(/\d/)
  ) {
    // Validate the length, Check for spaces, Validate number
    return false;
  } else {
    return true;
  }
}

function checkPwdMatch(pwd1, pwd2) {
  if (pwd1 != pwd2) {
    return false;
  } else {
    return true;
  }
}

// -------------------------------------------------------------------------------------
// FUNCTIONS FOR ALERT POPUPS
function authErrorAlert(title, subtext, confirmButtonText, destination) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-info m-2",
      cancelButton: "btn btn-secondary m-2",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: title,
      text: subtext,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      footer: "<a href='/forgot-password'>Forgot your password?</a>",
    })
    .then((result) => {
      if (result.isConfirmed) {
        window.location.replace(destination);
      }
    });
}

function successAlert(title, destination) {
  Swal.fire({
    icon: "success",
    title: title,
    showConfirmButton: false,
    timer: 2000,
  }).then(() => {
    window.location.replace(destination);
  });
}

// -------------------------------------------------------------------------------------
// FUNCTIONS FOR AUTH API CALLS

// This function does an API call to delete user
const deleteProfile = () => {
  $.ajax({
    method: "DELETE",
    url: "/api/user_data",
  })
    .then(() => {
      window.location.replace("/logout");
    })
    .catch((error) => {
      console.log(error);
    });
};
