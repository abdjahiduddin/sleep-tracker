window.onload = (event) => {
  const div_failed = document.getElementById("login-failed");
  div_failed.style.display = "none";
};

document.getElementById("login").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const payload = {
    email: email,
    password: password,
  };

  fetch(HOST_BACKEND + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  })
    .then((respon) => {
      if (respon.status === 200) {
        window.location.href = HOST_FRONTEND + "/dashboard";
      }
      const div_failed = document.getElementById("login-failed");
      div_failed.style.display = "block";
    })
    .catch((error) => {
      console.log(error);
      const div_failed = document.getElementById("login-failed");
      div_failed.style.display = "block";
    });
});
