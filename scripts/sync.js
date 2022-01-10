const { scanTable } = require("../api/common/db");
const { infoValue, saveInfoValue } = require("../api/utilities");

const main = async () => {
  // const remaining = await infoValue('remaining', [], val => JSON.parse(val));
  const existing = await scanTable();

  const ids = existing.filter((row) => !row.tweet).map((row) => row.id);

  await saveInfoValue("remaining", JSON.stringify(ids));
  console.log("sunc");
};

main();
