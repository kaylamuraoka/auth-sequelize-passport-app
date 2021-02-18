$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then((data) => {
    console.log(data);

    const greeting = getGreeting();
    $("#greeting").text(greeting + ", " + data.fullName);

    $(".user-email").text(data.email);
    $(".user-phone").text(data.phone);
  });
});
