const filePath = "images/shivani.png";
const status = document.getElementById("download-status");
const manualLink = document.getElementById("direct-download");

function startDownload() {
  const link = document.createElement("a");
  link.href = filePath;
  link.download = "shivani.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

manualLink.href = filePath;
manualLink.download = "shivani.png";

window.addEventListener("load", () => {
  setTimeout(() => {
    startDownload();
    status.textContent = "Download started. If blocked, tap 'Download Again'.";
  }, 350);
});
