$(document).ready(function () {
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;
  var current = 1;
  var steps = $("fieldset").length;

  setProgressBar(current);

  $(".next").click(function () {
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    if (!validateFields()) return;

    //Add Class Active
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          next_fs.css({ opacity: opacity });
        },
        duration: 500,
      }
    );
    setProgressBar(++current);
  });

  $(".previous").click(function () {
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //Remove class active
    $("#progressbar li")
      .eq($("fieldset").index(current_fs))
      .removeClass("active");

    //show the previous fieldset
    previous_fs.show();

    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          previous_fs.css({ opacity: opacity });
        },
        duration: 500,
      }
    );
    setProgressBar(--current);
  });

  function validateFields() {
    let isValid = true;

    current_fs.find("input, select").each(function () {
      const fieldId = $(this).attr("id");
      const label = $(this).attr("aria-labelledby")
        ? $("#" + $(this).attr("aria-labelledby"))
        : $(this).prev("label").length
        ? $(this).prev("label")
        : current_fs.find("label[for='" + fieldId + "']");

      if (
        $(this).is("select") &&
        ($(this).val() === "" || $(this).val() === null)
      ) {
        isValid = false;
        toastr.error("Please select a " + label.text());
      } else if (!$(this).val() && fieldId !== "school_website") {
        isValid = false;
        toastr.error(label.text() + " is required!");
      }
    });

    return isValid;
  }

  function setProgressBar(curStep) {
    var percent = parseFloat(100 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar").css("width", percent + "%");
  }

  toggleSubmitButton();

  $(".otp-input").keyup(function (e) {
    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      // If the key is a number, move to the next input
      $(this).next(".otp-input").focus();
    } else if (e.keyCode == 8) {
      // On pressing backspace, move to the previous input
      $(this).prev(".otp-input").focus();
    }

    // Check to enable/disable the submit button
    toggleSubmitButton();
  });

  function toggleSubmitButton() {
    let isAllFilled = true;

    $(".otp-input").each(function () {
      if ($(this).val() === "") {
        isAllFilled = false;
        return false;
      }
    });

    if (isAllFilled) {
      $(".submit").removeAttr("disabled");
    } else {
      $(".submit").attr("disabled", "disabled");
    }
  }

  $("#school_name").on("keyup", function () {
    var school_name = $(this).val().toLowerCase().trim(); // trim() will remove leading/trailing spaces

    if (!school_name) {
      $("#handle").attr("placeholder", "Handle (school abbreviation)");
      return; // Exit the function if school_name is empty
    }

    let acronym = school_name
      .split(/\s+/)
      .reduce((response, word) => (response += word.slice(0, 1)), "");

    $("#message").text("Handle Suggestion : " + acronym);
    $("#handle").attr("placeholder", acronym + " (Please type your handle)");
    $("#username").val("admin@" + acronym);
    $("#message_container").show();
  });

  $("#email").on("blur", function () {
    var email = $(this).val();
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var school_name = $("#school_name").val();

    $.ajax({
      type: "POST",
      url: "{{ route('sendOtp') }}",
      headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        email: email,
        firstname: firstname,
        lastname: lastname,
        school_name: school_name,
      },
      success: function (response) {
        // Store the OTP in local storage
        toastr.success("An OTP has been sent to your email.");
        localStorage.setItem("otp", response.otp);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error: " + errorThrown);
      },
    });
  });

  $(".btn-last-step").on("click", function () {
    var email = $("email").val();
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var school_name = $("#school_name").val();

    $.ajax({
      type: "POST",
      url: "{{ route('sendOtp') }}",
      headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
      },
      data: {
        email: email,
        firstname: firstname,
        lastname: lastname,
        school_name: school_name,
      },
      success: function (response) {
        // Store the OTP in local storage
        toastr.success("An OTP has been sent to your email.");
        localStorage.setItem("otp", response.otp);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error: " + errorThrown);
      },
    });
  });

  $(".submit").on("click", function (e) {
    e.preventDefault();

    var school_name = $("#school_name").val();
    var handle = $("#handle").val();
    var country = $("#country").val();
    var school_website = $("#school_website").val();
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var gender = $("#gender").val();
    var email = $("#email").val();
    var school_phone = $("#school_phone").val();
    var username = $("#username").val();
    var password = $("#password").val();
    var role_in_school = "admin";
    var otp =
      $(".otp-input:eq(0)").val() +
      $(".otp-input:eq(1)").val() +
      $(".otp-input:eq(2)").val() +
      $(".otp-input:eq(3)").val() +
      $(".otp-input:eq(4)").val();

    // Get the OTP value entered by the user
    let userEnteredOtp =
      $(".otp-input:eq(0)").val() +
      $(".otp-input:eq(1)").val() +
      $(".otp-input:eq(2)").val() +
      $(".otp-input:eq(3)").val() +
      $(".otp-input:eq(4)").val();

    // Compare with stored OTP
    let storedOtp = localStorage.getItem("otp");

    if (userEnteredOtp === storedOtp) {
      $.ajax({
        type: "POST",
        url: "{{ route('sign_up.store') }}",
        data: {
          school_name: school_name,
          handle: handle,
          country: country,
          school_website: school_website,
          first_name: firstname,
          last_name: lastname,
          gender: gender,
          email: email,
          mobile_number: school_phone,
          username: username,
          password: password,
          role_in_school: role_in_school,
          otp: otp,
        },

        headers: {
          "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (response) {
          if (response.message === "success") {
            toastr.success(
              "Your account was created successfully! Redirecting to login..."
            );

            // Redirects after 3 seconds (3000 milliseconds)
            setTimeout(function () {
              window.location.href = "/onboarding-success";
            }, 3000);
          } else {
            toastr.error(
              "Error. Something went wrong, unable to create account."
            );
          }
        },

        error: function (jqXHR, textStatus, errorThrown) {
          toastr.error(
            "Error. Something went wrong, unable to create account. Try again or contact system administrator."
          );
        },
      });
    } else {
      toastr.error("Incorrect OTP. Please try again.");
    }
  });
});
