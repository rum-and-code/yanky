const fs = require("fs");

const openPRsList = document.getElementById("open");
const approvedPRsList = document.getElementById("approved");
const draftPRsList = document.getElementById("draft");

const REFRESH_INTERVAL_SECONDS = 5;

function appendPRs(prs, list) {
  list.innerHTML = "";
  prs.forEach((pr) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = pr.html_url;
    a.innerText = pr.title;
    li.appendChild(a);
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
