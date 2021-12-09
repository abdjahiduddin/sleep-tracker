window.onload = (event) => {
  const div_success = document.getElementById("verify-success");
  div_success.style.display = "none";

  const div_failed = document.getElementById("verify-failed");
  div_failed.style.display = "none";
};

document.getElementById("verify-button").addEventListener("click", (event) => {
  event.preventDefault();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get("verify");

  const data = {
    token: token,
  };

  fetch(HOST_BACKEND + "/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((result) => {
      const div_progress = document.getElementById("verify-onprogress");
      div_progress.style.display = "none";

      if (result.status === 200) {
        const div_success = document.getElementById("verify-success");
        div_success.style.display = "block";
      } else {
        const div_failed = document.getElementById("verify-failed");
        div_failed.style.display = "block";
      }

      return result.json();
    })
    .then((resData) => {
      console.log(resData);
    })
    .catch((error) => {
      console.log(error);
    });
});
