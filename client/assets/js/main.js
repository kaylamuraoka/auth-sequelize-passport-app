// JavaScript file with the functions that will be included on every page
// DECLARATION OF GLOBAL VARIABLES HERE
let timerInterval;
const today = new Date();
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

function showPassword(inputEl) {
  if (inputEl.type === "password") {
    inputEl.type = "text";
  } else {
    inputEl.type = "password";
  }
}

// Function that formats a user's input with title case while typing
function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

// -------------------------------------------------------------------------------------
// FUNCTIONS FOR GETTING THE GREETING FOR THE HOMEPAGE/DASHBOARD
function getGreeting() {
  const curHr = today.getHours();
  if (curHr < 12) {
    return "Good Morning";
  } else if (curHr < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
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
function checkRole(role) {
  if (role === "none-selected") {
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

// Function for changing the profile image placeholder upon image being uploaded
function uploadImagePreview(inputFile, uploadPlaceholderEl, feedbackTextEl) {
  if (inputFile.files && inputFile.files[0]) {
    const fileName = inputFile.files[0].name;
    const fileType = inputFile.files[0].type;
    console.log("File Name: " + fileName + "\nFile Type: " + fileType);
    if (
      inputFile.files[0].type === "image/png" ||
      inputFile.files[0].type === "image/jpeg"
    ) {
      uploadPlaceholderEl.attr(
        "src",
        window.URL.createObjectURL(inputFile.files[0])
      );
      feedbackTextEl
        .html("Looks Good!")
        .removeClass("text-muted text-danger")
        .addClass("text-success");
    } else {
      feedbackTextEl
        .html("Please upload a profile picture")
        .removeClass("text-muted text-success")
        .addClass("text-danger");
    }
  }
}

// -------------------------------------------------------------------------------------
// FUNCTIONS FOR ALERT POPUPS
function authErrorAlert(
  title,
  subtext,
  confirmButtonText,
  destination,
  footerText
) {
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
      footer: `<a href='/forgot-password'>${footerText}</a>`,
    })
    .then((result) => {
      if (result.isConfirmed) {
        window.location.replace(destination);
      }
    });
}

// Function that alerts the user that their credentials is correct and they are being redirected to their dashboard
function succcessRedirectAlert(title, destination) {
  Swal.fire({
    title: title,
    icon: "success",
    html: "<b></b> milliseconds left.",
    timer: 1200,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        const content = Swal.getContent();
        if (content) {
          const b = content.querySelector("b");
          if (b) {
            b.textContent = Swal.getTimerLeft();
          }
        }
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
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

function confirmDeleteAlert(
  title,
  deleteMsg,
  cancelMsg,
  deleteFunction,
  cancelDestination
) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success m-2",
      cancelButton: "btn btn-danger m-2",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: title,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons
          .fire("Deleted!", deleteMsg, "success")
          .then(() => {
            deleteFunction();
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons
          .fire("Cancelled", cancelMsg, "error")
          .then(() => {
            window.location.replace(cancelDestination);
          });
      }
    });
}

function succcessEmailAlert(title, renderContentFunction) {
  Swal.fire({
    title: title,
    icon: "success",
    html: "<b></b> milliseconds left.",
    timer: 6000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        const content = Swal.getContent();
        if (content) {
          const b = content.querySelector("b");
          if (b) {
            b.textContent = Swal.getTimerLeft();
          }
        }
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      renderContentFunction();
    }
  });
}

// -------------------------------------------------------------------------------------
// FUNCTIONS FOR AUTH API CALLS
