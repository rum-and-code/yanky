const fs = require("fs");

const openPRsList = document.getElementById("open");
const approvedPRsList = document.getElementById("approved");
const draftPRsList = document.getElementById("draft");

const REFRESH_INTERVAL_SECONDS = 5;

function appendPRs(prs, list) {
  const data = localStorage.getItem("checkedPRs");
  let checkedPRs = [];
  if (data != null || data != undefined) {
    const parsedData = data.split(",");
    const parsedDataInt = parsedData.map((id) => parseInt(id));
    checkedPRs = [...parsedDataInt];
  }

  list.innerHTML = "";
  prs.forEach((pr) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");
    checkedPRs.includes(pr.id) ? li.classList.add("checked") : null;
    label.htmlFor = pr.id;
    checkbox.type = "checkbox";
    checkbox.id = pr.id;
    checkbox.name = pr.id;
    checkbox.checked = checkedPRs.includes(pr.id);
    checkbox.addEventListener("change", (event) => {
      if (event.target.checked) {
        checkedPRs.push(pr.id);
        li.classList.add("checked");
        localStorage.setItem("checkedPRs", checkedPRs);
      } else {
        const update = checkedPRs.filter((id) => id !== pr.id);
        li.classList.remove("checked");
        localStorage.setItem("checkedPRs", update);
      }
    });
    a.href = pr.html_url;
    a.innerText = pr.title;
    label.appendChild(checkbox);
    label.appendChild(a);
    li.appendChild(label);
    list.appendChild(li);
  });
}

function tryReadingData() {
  try {
    const data = fs.readFileSync("./data.json");
    const dataJson = JSON.parse(data);
    const draftPRs = dataJson.draftPRs;
    const approvedPRs = dataJson.approvedPRs;
    const openPRs = dataJson.openPRs;
    return { read: true, data: { draftPRs, approvedPRs, openPRs } };
  } catch (error) {
    console.error(error);
    return {
      read: false,
      data: { draftPRs: [], approvedPRs: [], openPRs: [] },
    };
  }
}

function main() {
  const { read, data } = tryReadingData();
  if (!read) {
    return;
  }
  appendPRs(data.openPRs, openPRsList);
  appendPRs(data.approvedPRs, approvedPRsList);
  appendPRs(data.draftPRs, draftPRsList);
}
main();
setInterval(main, REFRESH_INTERVAL_SECONDS * 1000);
