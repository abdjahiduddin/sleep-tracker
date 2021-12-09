window.onload = (event) => {
  const div_info = document.getElementById("info-verify");
  div_info.style.display = "none";
  const div_failed = document.getElementById("failed-verify");
  div_failed.style.display = "none";
};

document
  .getElementById("signup")
  .addEventListener("submit", function name(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const age = document.getElementById("age").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById(
      "password-confirmation"
    ).value;

    const data = {
      email: email,
      username: username,
      age: age,
      password: password,
      "password-confirmation": confirmPassword,
    };
    fetch(HOST_BACKEND + "/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((result) => {
        const div_signup = document.getElementById("signup");
        div_signup.style.display = "none";
        if (result.status === 200) {
          const div_info = document.getElementById("info-verify");
          div_info.style.display = "block";
        } else {
          const div_failed = document.getElementById("failed-verify");
          div_failed.style.display = "block";
        }
        return result.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
