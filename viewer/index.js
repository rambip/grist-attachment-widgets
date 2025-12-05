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
  const attId = Array.isArray(list) && list.length ? list[0] : null;

  if (!attId) {
    showMessage("X"); //whatever you want to show if nothing
    return;
  }

  try {
    const url = await buildAttachmentUrl(attId);
    img.src = url;
    img.alt = `Attachment ${attId}`;
    img.style.display = "block";
    msg.textContent = "";
  } catch (err) {
    console.error("Attachment load error:", err);
    showMessage("Unable to load image (check access or file type).");
  }
}

// Update when the selected record changes.
grist.onRecord(render);
