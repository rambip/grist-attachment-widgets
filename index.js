grist.ready({
  requiredAccess: "full",
  columns: [
    { name: "Attachment", title: "Attachment source" },
    { name: "Url", title: "Generated URL target" },
  ],
});
grist.onRecords(async (records, mappings) => {
  const tokenInfo = await grist.docApi.getAccessToken({
    readOnly: true,
  });
  var actions = [];
  const table = await grist.getTable();
  const tableId = await table.getTableId();
  for (const record of records) {
    const att_id = record[mappings.Attachment][0];
    const id = record.id;

    const src = `${tokenInfo.baseUrl}/attachments/${att_id}/download?auth=${tokenInfo.token}`;
    const fields = { [mappings.Url]: src };
    actions.push(["UpdateRecord", tableId, id, fields]);
  }
  grist.docApi.applyUserActions(actions);
});
