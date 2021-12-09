function inputValidation(value, feedbackElement, flags) {
  const PASSWORD_MIN = 5;
  const NAME_MIN = 5;
  const element = document.getElementById(feedbackElement);
  if (flags === "password") {
    if (value.length < PASSWORD_MIN) {
      validationFailed(element, "Minimum 5 character");
      return;
    }
    validationSuccess(element);
    return;
  } else if (flags === "username") {
    if (value.length < NAME_MIN) {
      validationFailed(element, "Minimum 5 character");
      return;
    }
    validationSuccess(element);
    return;
  }
}

function inputRequired(value, feedbackElement) {
  const element = document.getElementById(feedbackElement);
  if (+value === 0) {
    validationFailed(element, "Input cannot empty");
    return;
  }
  if (element.classList.contains("text-danger")) {
    element.classList.remove("text-danger");
    element.innerHTML = ""
  }
  return;
}

function passwordConfirmation(value, feedbackElement) {
  const password = document.getElementById("password").value
  const feedback = document.getElementById(feedbackElement)
  if (value !== password) {
    validationFailed(feedback, "Password not match")
    return
  }
  validationSuccess(feedback);
}

function validationFailed(element, msg) {
  if (element.classList.contains("text-success")) {
    element.classList.remove("text-success");
  }
  element.classList.add("text-danger");
  element.innerHTML = msg;
}

function validationSuccess(element) {
  if (element.classList.contains("text-danger")) {
    element.classList.remove("text-danger");
  }
  element.classList.add("text-success");
  element.innerHTML = "Looks good!";
}
