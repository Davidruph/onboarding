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

  $(".submit").click(function () {
    // return false;
    window.location.replace("3.html");
  });
});
