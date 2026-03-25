const envelope = document.getElementById("envelope");
const sealBtn = document.getElementById("seal-btn");
const downloadArea = document.getElementById("download-area");
const downloadHeartBtn = document.getElementById("download-heart-btn");
const downloadLink = document.getElementById("download-link");

function openEnvelope() {
  if (!envelope.classList.contains("close")) return;
  envelope.classList.add("open");
  envelope.classList.remove("close");

  setTimeout(() => {
    downloadArea.classList.add("show");
  }, 520);
}

sealBtn.addEventListener("click", openEnvelope);
sealBtn.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openEnvelope();
  }
});

downloadHeartBtn.addEventListener("click", () => {
  downloadLink.click();
});
