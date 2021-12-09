let state = "LATEST";
let monthState = 1;

const initiatePage = async () => {
  const monthSearch = document.getElementById("search-by-months");
  monthSearch.style.display = "none";

  getLatest();
  showProfile();
};

window.addEventListener("storage", (event) => {
  if (event.key === "logout") {
    console.log("Redirect to login page")
    window.location.href = "/login"
  }
})

document
  .getElementById("form-new-entry")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const sleepInput = document.getElementById("sleep");
    const wakeupInput = document.getElementById("wakeUp");

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const sleepTime = new Date(sleepInput.value);
    const wakeUpTime = new Date(wakeupInput.value);

    const payload = {
      sleep: sleepTime,
      wakeUp: wakeUpTime,
      tz: timezone,
    };

    try {
      const respon = await fetch(HOST_BACKEND + "/sleep/entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify(payload),
      });

      const result = await respon.json();

      sleepInput.value = "";
      wakeupInput.value = "";

      document.getElementById("closeAddNewEntry").click();

      if (respon.status === 200) {
        showInfoModal("Success", result.message);
        // const monthSearch = document.getElementById("search-by-months");
        // monthSearch.style.display = "none";

        // const searchDropDown = document.getElementById("navbarDropdown");
        // searchDropDown.innerHTML = "Show by: Last 7 Days";
        await refreshPage();
      } else if (respon.status !== 200) {
        showInfoModal("Error", result.message);
      }
    } catch (error) {
      console.log(error);
    }
  });

document
  .getElementById("form-edit-entry")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const sleepInput = document.getElementById("sleep-edit-input");
    const wakeupInput = document.getElementById("wakeUp-edit-input");
    const editId = document.getElementById("input-id-edit-entry");

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const sleepTime = new Date(sleepInput.value);
    const wakeUpTime = new Date(wakeupInput.value);

    const payload = {
      sleep: sleepTime,
      wakeUp: wakeUpTime,
      tz: timezone,
      entryId: editId.value,
    };

    // try {
      const respon = await fetch(HOST_BACKEND + "/sleep/entry", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify(payload),
      });

      const result = await respon.json();

      sleepInput.value = "";
      wakeupInput.value = "";

      document.getElementById("closeEditEntry").click();

      if (respon.status === 200) {
        showInfoModal("Success", result.message);
        // const monthSearch = document.getElementById("search-by-months");
        // monthSearch.style.display = "none";

        // const searchDropDown = document.getElementById("navbarDropdown");
        // searchDropDown.innerHTML = "Show by: Last 7 Days";
        await refreshPage();
      } else if (respon.status !== 200) {
        showInfoModal("Error", result.message);
      }
    // } catch (error) {
    //   console.log(error);
    // }
  });

document.getElementById("latest").addEventListener("click", async (event) => {
  const monthSearch = document.getElementById("search-by-months");
  monthSearch.style.display = "none";

  const searchDropDown = document.getElementById("navbarDropdown");
  searchDropDown.innerHTML = "Show by: Last 7 Days";
  await getLatest();
});

document.getElementById("months").addEventListener("click", async (event) => {
  const monthSearch = document.getElementById("search-by-months");
  monthSearch.style.display = "block";

  const searchDropDown = document.getElementById("navbarDropdown");
  searchDropDown.innerHTML = "Show by: Months";
});

document.getElementById("history").addEventListener("click", async (event) => {
  const monthSearch = document.getElementById("search-by-months");
  monthSearch.style.display = "none";

  const searchDropDown = document.getElementById("navbarDropdown");
  searchDropDown.innerHTML = "Show by: All data";
  await allData();
});

document.getElementById("logout").addEventListener("click", async (event) => {
  try {
    const respon = await fetch(HOST_BACKEND + "/auth/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await respon.json();

    jwt = "";
    userId = "";
    expiresIn = Date.now();
    showInfoModal("Success", result.message + ". Redirect to login page");

    window.localStorage.setItem("logout", Date.now())
    
    setTimeout(() => {
      window.location.href = "/login"
    }, 5000)
  } catch (error) {
    console.log(error);
  }
});

const findMonth = async (month) => {
  const monthDropDown = document.getElementById("monthsList");
  monthDropDown.innerHTML = "Select month: " + month;
  await getMonths(month);
};

const getLatest = async () => {
  state = "LATEST";
  try {
    const respon = await fetch(HOST_BACKEND + "/sleep/last", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    });

    const result = await respon.json();

    if (result.data.length <= 0) {
      showInfoModal(
        "No data found",
        "Successful process request but no data found"
      );
    }

    if (respon.status === 200) {
      generateChart(result.data);
      generateTable(result.lists);
      showSummary(result);
    } else if (respon.status === 401) {
      showInfoModal("Not Authorized", result.message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
    } else if (respon.status !== 200) {
      showInfoModal("Something wrong", result.message);
    }
  } catch (error) {
    console.log(error);
  }
};

const getMonths = async (month) => {
  state = "MONTHS";
  monthState = month;
  try {
    const respon = await fetch(HOST_BACKEND + "/sleep/months/" + month, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    });

    const result = await respon.json();

    if (result.data.length <= 0) {
      showInfoModal(
        "No data found",
        "Successful process request but no data found"
      );
    }

    if (respon.status === 200) {
      generateChart(result.data);
      generateTable(result.lists);
      showSummary(result);
    } else if (respon.status === 401) {
      showInfoModal("Not Authorized", result.message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
    } else if (respon.status !== 200) {
      showInfoModal("Something wrong", result.message);
    }
  } catch (error) {
    console.log(error);
  }
};

const allData = async () => {
  state = "HISTORY";
  try {
    const respon = await fetch(HOST_BACKEND + "/sleep/history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    });

    const result = await respon.json();

    if (result.data.length <= 0) {
      showInfoModal(
        "No data found",
        "Successful process request but no data found"
      );
    }

    if (respon.status === 200) {
      generateChart(result.data);
      generateTable(result.lists);
      showSummary(result);
    } else if (respon.status === 401) {
      showInfoModal("Not Authorized", result.message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
    } else if (respon.status !== 200) {
      showInfoModal("Something wrong", result.message);
    }
  } catch (error) {
    console.log(error);
  }
};

const showProfile = async () => {
  try {
    const respon = await fetch(HOST_BACKEND + "/sleep/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    });

    const result = await respon.json();
    if (respon.status === 200) {
      document.getElementById("userName").innerHTML = result.username;
    } else {
      document.getElementById("userName").innerHTML = "Username";
    }
  } catch (error) {
    console.log(error);
  }
};

const generateChart = (data) => {
  chart.updateSeries([
    {
      data: data,
    },
  ]);
};

const generateTable = (lists) => {
  const newTbody = document.createElement("tbody");
  newTbody.setAttribute("id", "table-body");

  const dataTable = document.getElementById("datatablesSimple");

  const oldTbody = document.getElementById("table-body");

  for (const list of lists) {
    const tr = document.createElement("tr");
    tr.classList.add("border-bottom");

    // Date element declaration
    const spanDivTdDate = document.createElement("span");
    spanDivTdDate.textContent = list.date;

    const divTdDate = document.createElement("div");
    divTdDate.classList.add("p-2");
    divTdDate.appendChild(spanDivTdDate);

    const tdDate = document.createElement("td");
    tdDate.appendChild(divTdDate);

    // Sleep element declaration
    const spanDivTdSleep = document.createElement("span");
    spanDivTdSleep.textContent = list.sleep;

    const divTdSleep = document.createElement("div");
    divTdSleep.classList.add("p-2");
    divTdSleep.appendChild(spanDivTdSleep);

    const tdSleep = document.createElement("td");
    tdSleep.appendChild(divTdSleep);

    // Wake Up element declaration
    const spanDivTdWakeUp = document.createElement("span");
    spanDivTdWakeUp.textContent = list.wakeUp;

    const divTdWakeUp = document.createElement("div");
    divTdWakeUp.classList.add("p-2");
    divTdWakeUp.appendChild(spanDivTdWakeUp);

    const tdWakeUp = document.createElement("td");
    tdWakeUp.appendChild(divTdWakeUp);

    // Duration element declaration
    const spanDivTdDuration = document.createElement("span");
    spanDivTdDuration.textContent = list.duration;

    const divTdDuration = document.createElement("div");
    divTdDuration.classList.add("p-2");
    divTdDuration.appendChild(spanDivTdDuration);

    const tdDuration = document.createElement("td");
    tdDuration.appendChild(divTdDuration);

    // Action edit element declaration
    const iADivTdActionEdit = document.createElement("i");
    iADivTdActionEdit.classList.add("fas", "fa-edit", "text-info");

    const spanADivTdActionEdit = document.createElement("span");
    spanADivTdActionEdit.textContent = " Edit";

    const aDivTdActionEdit = document.createElement("a");
    aDivTdActionEdit.classList.add("btn");
    aDivTdActionEdit.setAttribute("onclick", 'editRow("' + list.dataId + '")');
    aDivTdActionEdit.setAttribute("data-bs-toggle", "tooltip");
    aDivTdActionEdit.setAttribute("data-bs-placement", "top");
    aDivTdActionEdit.setAttribute("title", "Edit");
    aDivTdActionEdit.appendChild(iADivTdActionEdit);
    aDivTdActionEdit.appendChild(spanADivTdActionEdit);

    // Action Delete element declaration
    const iADivTdAction = document.createElement("i");
    iADivTdAction.classList.add("fas", "fa-minus-square", "text-danger");

    const spanADivTdAction = document.createElement("span");
    spanADivTdAction.textContent = " Delete";

    const aDivTdAction = document.createElement("a");
    aDivTdAction.classList.add("btn");
    aDivTdAction.setAttribute("onclick", 'deleteRow("' + list.dataId + '")');
    aDivTdAction.setAttribute("data-bs-toggle", "tooltip");
    aDivTdAction.setAttribute("data-bs-placement", "top");
    aDivTdAction.setAttribute("title", "Delete");
    aDivTdAction.appendChild(iADivTdAction);
    aDivTdAction.appendChild(spanADivTdAction);

    const divTdAction = document.createElement("div");
    divTdAction.classList.add("p-2", "d-flex", "justify-content-start");
    divTdAction.appendChild(aDivTdActionEdit);
    divTdAction.appendChild(aDivTdAction);

    const tdAction = document.createElement("td");
    tdAction.appendChild(divTdAction);

    tr.appendChild(tdDate);
    tr.appendChild(tdSleep);
    tr.appendChild(tdWakeUp);
    tr.appendChild(tdDuration);
    tr.appendChild(divTdAction);

    tr.setAttribute("id", list.dataId);

    newTbody.append(tr);
  }
  dataTable.replaceChild(newTbody, oldTbody);

  // const datatablesSimple = document.getElementById("datatablesSimple");
  // if (datatablesSimple) {
  //   new simpleDatatables.DataTable(datatablesSimple);
  // }
};

const showInfoModal = (info, message) => {
  const infoHeader = document.getElementById("info-modal-header");
  const infoBody = document.getElementById("info-modal-body");

  infoHeader.innerHTML = info;
  infoBody.innerHTML = message;

  const infoModal = new bootstrap.Modal(document.getElementById("info-modal"));
  infoModal.show();
  setTimeout(() => {
    infoModal.hide();
  }, 5000);
};

const showSummary = (responData) => {
  const avgSleepElement = document.getElementById("avgSleep");
  const avgWakeUpElement = document.getElementById("avgWakeUp");
  const avgDurationElement = document.getElementById("avgDuration");
  const lessSixElement = document.getElementById("lessSix");
  const moreEightElement = document.getElementById("moreEight");

  avgSleepElement.innerHTML = responData.avgSleep;
  avgWakeUpElement.innerHTML = responData.avgWakeUp;
  avgDurationElement.innerHTML = responData.avgDuration;
  lessSixElement.innerHTML = responData.sleepLessSix;
  moreEightElement.innerHTML = responData.sleepMoreEight;
};

const deleteRow = async (dataId) => {
  try {
    const respon = await fetch(HOST_BACKEND + "/sleep/entry/" + dataId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    });

    if (respon.status === 403) {
      return showInfoModal(
        "Edited failed",
        "You do not have access rights to the content"
      );
    }

    const result = await respon.json();

    if (respon.status === 200) {
      showInfoModal("Success", result.message);
      // const monthSearch = document.getElementById("search-by-months");
      // monthSearch.style.display = "none";

      // const searchDropDown = document.getElementById("navbarDropdown");
      // searchDropDown.innerHTML = "Show by: Last 7 Days";
      await refreshPage();
    } else if (respon.status !== 200) {
      showInfoModal("Error", result.message);
    }
  } catch (error) {
    console.log(error);
  }
};

const editRow = (dataId) => {
  const tr = document.getElementById(dataId);
  const inputEdit = document.getElementById("input-id-edit-entry");
  const dateInfo = document.getElementById("date-edit");
  const wakeUpInfo = document.getElementById("wakeup-edit");
  const sleepInfo = document.getElementById("sleep-edit");

  inputEdit.setAttribute("value", dataId);
  dateInfo.innerText = "Date: " + tr.childNodes[0].innerText;
  sleepInfo.innerText = "Sleep: " + tr.childNodes[1].innerText;
  wakeUpInfo.innerText = "Wake Up: " + tr.childNodes[2].innerText;

  const editModal = new bootstrap.Modal(document.getElementById("editEntry"));
  editModal.show();
};

const refreshPage = async () => {
  console.log(state);
  if (state === "LATEST") {
    await getLatest();
  } else if (state === "MONTHS") {
    const monthSearch = document.getElementById("search-by-months");
    monthSearch.style.display = "block";

    const searchDropDown = document.getElementById("navbarDropdown");
    searchDropDown.innerHTML = "Show by: Months";
    await findMonth(monthState);
  } else if (state === "HISTORY") {
    await allData();
  }
};
