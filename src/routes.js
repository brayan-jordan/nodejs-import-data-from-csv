import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end("Missing required fields");
      }

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        created_at: new Date(),
        updated_at: new Date(),
        completed_at: null,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const taskIndex = database.findById("tasks", id);

      if (taskIndex === -1) {
        return res.writeHead(404).end("Task not found");
      }

      database.update("tasks", taskIndex, { title, description });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const taskIndex = database.findById("tasks", id);

      if (taskIndex === -1) {
        return res.writeHead(404).end("Task not found");
      }

      database.delete("tasks", taskIndex);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const taskIndex = database.findById("tasks", id);

      if (taskIndex === -1) {
        return res.writeHead(404).end("Task not found");
      }

      database.complete("tasks", taskIndex);

      return res.writeHead(204).end();
    },
  },
];
