const { menubar } = require("menubar");
const { shell } = require("electron");
const spawn = require("child_process").spawn;

const POLLING_RATE_MINUTES = 10;

const options = {
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
  hiddenInMissionControl: true,
  vibrancy: "window",
  skipTaskbar: true,
  setTitle: "Yanky",
  title: "Yanky",
};

const mb = menubar({
  browserWindow: options,
  showDockIcon: false,
  icon: "./IconTemplate.png",
  title: "Yanky",
});

function handleRedirect(e, url) {
  if (url !== e.sender.getURL()) {
    e.preventDefault();
    shell.openExternal(url);
  }
}

function runYanky() {
  const zshFunction = `./yanky`;

  const yanky = spawn("zsh", ["-c", zshFunction]);

  yanky.stdout.on("data", (data) => {
    console.log(`${data}`);
  });

  yanky.stderr.on("data", (data) => {
    console.error(`error: ${data}`);
  });

  yanky.on("close", (code) => {
    console.log(`Yanky closed with code ${code}`);
  });
}

mb.on("ready", () => {
  runYanky();
  setInterval(runYanky, POLLING_RATE_MINUTES * 1000 * 60);
});

mb.on("after-create-window", () => {
  mb.window.setHiddenInMissionControl(true);
  mb.window.setSkipTaskbar(true);
  mb.window.webContents.on("will-navigate", handleRedirect);
});
