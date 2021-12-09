let jwt;
let userId;
let count = 0;
let expiresIn;

window.onload = async (event) => {
  await silentRefresh();
  initiatePage()
};

const silentRefresh = async () => {
  try {
    const addNew = document.getElementById("add-new");
    const showEntry = document.getElementById("navbarDropdown");

    refreshOnProgress(addNew, showEntry);
    await refreshToken();
    refreshDone(addNew, showEntry);
    
    setTimeout(async () => {
      await silentRefresh();
    }, expiresIn);
  } catch (error) {
    console.log(error);
  }
};

const refreshToken = async () => {
  try {
    const respon = await fetch(HOST_BACKEND + "/auth/refresh-token", {
      method: "GET",
      credentials: "include",
    });

    if (respon.status !== 200) {
      window.location.href = HOST_FRONTEND + "/login";
    }

    const jsonData = await respon.json();

    jwt = jsonData.token;
    userId = jsonData.userId;
    expiresIn = jsonData.expiresIn;
    count++;
  } catch (error) {
    console.log(error);
  }
};

const refreshOnProgress = (addNew, showEntry) => {
  addNew.classList.add("disabled");
  addNew.classList.add("placeholder");

  showEntry.classList.add("disabled");
  showEntry.classList.add("placeholder");
};

const refreshDone = (addNew, showEntry) => {
  addNew.classList.remove("disabled");
  addNew.classList.remove("placeholder");

  showEntry.classList.remove("disabled");
  showEntry.classList.remove("placeholder");
};
