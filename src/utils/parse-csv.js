import { parse } from "csv-parse";
import fs from "node:fs/promises";

(async () => {
  const parser = parse({
    delimiter: ",",
    columns: true,
  });

  const dataPath = new URL("../../data.csv", import.meta.url);

  const csvData = await fs.readFile(dataPath);

  parser.write(csvData);

  for await (const row of parser) {
    fetch("http://localhost:59876/tasks", {
      method: "POST",
      body: JSON.stringify(row),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
})();
