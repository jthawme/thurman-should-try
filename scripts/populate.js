const { infoValue, saveInfoValue } = require("../api/utilities");
const {
  scanTable,
  saveDbItem,
  saveMultipleItems,
} = require("../api/common/db");
const { Data } = require("./data");

const main = async () => {
  const existing = await scanTable();
  let totalOptions = (await infoValue("total", 0)) || existing.length;

  const alreadyExists = ({ type, text }) => {
    return !!existing.find((row) => row.text === text);
  };

  const uploadRow = async ({ type, text }) => {
    if (!alreadyExists({ type, text })) {
      await saveDbItem({
        id: (totalOptions + 1).toString(),
        type,
        text,
      });
      totalOptions++;
    }
  };

  const rows = Object.entries(Data)
    .reduce((prev, curr) => {
      return [
        ...prev,
        ...curr[1].map((text) => ({
          type: curr[0],
          text,
        })),
      ];
    }, [])
    .filter((row) => !alreadyExists(row))
    .map((row, idx) => ({
      ...row,
      id: (totalOptions + idx + 1).toString(),
    }));

  return saveMultipleItems(rows).then(() => {
    return rows.length + totalOptions;
  });

  // return new Promise((resolve) => {
  //   const upload = async (idx) => {
  //     if (idx >= rows.length) {
  //       resolve();
  //       return;
  //     }

  //     await uploadRow(rows[idx]);
  //     upload(idx + 1);
  //   };

  //   upload(0);
  // });
};

main().then(async (total) => {
  await saveInfoValue("total", total);
  console.log("Done");
});
