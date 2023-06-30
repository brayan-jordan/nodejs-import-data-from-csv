import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data.toString());
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile("db.json", JSON.stringify(this.#database));
  }

  findById(table, id) {
    return this.#database[table].findIndex((row) => row.id === id);
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, index, data) {
    let item = this.#database[table][index];

    if (item) {
      item = {
        ...item,
        description: data.description ? data.description : item.description,
        title: data.title ? data.title : item.title,
        updated_at: new Date(),
      };

      this.#database[table][index] = item;

      this.#persist();
    }
  }

  complete(table, index) {
    let item = this.#database[table][index];

    if (item) {
      item = {
        ...item,
        completed_at: item.completed_at ? null : new Date(),
        updated_at: new Date(),
      };

      this.#database[table][index] = item;

      this.#persist();
    }
  }

  delete(table, index) {
    this.#database[table].splice(index, 1);
    this.#persist();
  }
}
