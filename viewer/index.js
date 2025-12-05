// Request mapping for one Attachments-type column.
grist.ready({
  requiredAccess: "full",
  columns: [
    {
      name: "Attachment", // logical name used inside the widget
      title: "Attachment column", // label shown in the mapping UI
      type: "Attachments",
      optional: false,
    },
  ],
});

const img = document.getElementById("img");
const msg = document.getElementById("msg");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

alert(img);

async function buildAttachmentUrl(attId) {
  // Short-lived, safe URL parts for the current document
  const { token, baseUrl } = await grist.docApi.getAccessToken({
    readOnly: true,
  });
  return `${baseUrl}/attachments/${attId}/download?auth=${token}`;
}

function showMessage(text) {
  img.style.display = "none";
  msg.textContent = text;
}

async function render(record) {
  const mapped = grist.mapColumnNames(record) || {};
  const list = mapped.Attachment;

  // Attachment cells are arrays of IDs; show the first if present.
  currentIndex = 0;
  if (Array.isArray(list) && list.length) {
    try {
      const url = await buildAttachmentUrl(list[currentIndex]);
      img.src = url;
      img.alt = `Attachment ${list[currentIndex]}`;
      img.style.display = "block";
      msg.textContent = "";
      updateButtons(list);
    } catch (err) {
      console.error("Attachment load error:", err);
      showMessage("Unable to load image (check access or file type).");
    }
  } else {
    showMessage("X"); //whatever you want to show if nothing
  }
}

function updateButtons(list) {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === list.length - 1;
}

async function changeAttachment(direction) {
  const list = grist.getRecord()
    ? grist.mapColumnNames(grist.getRecord()).Attachment
    : [];
  if (Array.isArray(list) && list.length) {
    currentIndex += direction;
    if (currentIndex >= 0 && currentIndex < list.length) {
      try {
        const url = await buildAttachmentUrl(list[currentIndex]);
        img.src = url;
        img.alt = `Attachment ${list[currentIndex]}`;
        img.style.display = "block";
        msg.textContent = "";
        updateButtons(list);
      } catch (err) {
        console.error("Attachment load error:", err);
        showMessage("Unable to load image (check access or file type).");
      }
    }
  }
}

prevBtn.addEventListener("click", () => changeAttachment(-1));
nextBtn.addEventListener("click", () => changeAttachment(1));

// Update when the selected record changes.
grist.onRecord(render);
