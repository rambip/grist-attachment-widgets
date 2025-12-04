grist.ready({
  requiredAccess: "full",
  columns: [
    { name: "Attachment", title: "Attachment source" },
    { name: "Url", title: "Generated URL target" },
  ],
});

function generateUrl({ record, mappings, tokenInfo }) {
  if (record[mappings.Attachment === null]) {
    return "";
  }
  const att_id = record[mappings.Attachment][0];
  return `${tokenInfo.baseUrl}/attachments/${att_id}/download?auth=${tokenInfo.token}`;
}

grist.onRecords(async (records, mappings) => {
  const tokenInfo = await grist.docApi.getAccessToken({
    readOnly: true,
  });
  var actions = [];
  const table = await grist.getTable();
  const tableId = await table.getTableId();
  for (const record of records) {
    const id = record.id;
    const src = generateUrl({ record, mappings, tokenInfo });
    const fields = { [mappings.Url]: src };
    actions.push(["UpdateRecord", tableId, id, fields]);
  }
  grist.docApi.applyUserActions(actions);
});
