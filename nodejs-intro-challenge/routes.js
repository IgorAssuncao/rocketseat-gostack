const express = require("express");

const routes = express.Router();

const projects = [];

function checkProjectExists(request, response, next) {
  const id = request.params.id;

  const project = projects.find(project => project.id == id);

  if (!project)
    return response.status(400).json({ error: "Project not found." });

  return next();
}

routes.get("/", (request, response) => {
  response.json({ message: "API Working" });
});

routes.get("/projects", (request, response) => {
  response.json(projects);
});

routes.post("/projects", (request, response) => {
  if (!request.body.id || !request.body.title)
    response.status(400).json({ error: "API needs more data." });

  projects.push({
    id: request.body.id,
    title: request.body.title,
    tasks: []
  });

  response.status(201).json({ message: "Project created." });
});

routes.post("/projects/:id/tasks", checkProjectExists, (request, response) => {
  if (!request.body.tasks) response.json({ error: "API needs more data." });

  const project = projects.find(project => project.id == request.params.id);

  project.tasks.push(request.body.tasks);

  response.status(201).json({ message: "Tasks for this project created." });
});

routes.put("/projects/:id", checkProjectExists, (request, response) => {
  const project = projects.find(project => project.id == request.params.id);

  project.title = request.body.title;

  response.status(200).json({ message: "Project updated" });
});

routes.delete("/projects/:id", checkProjectExists, (request, response) => {
  const projectIndex = projects.findIndex(
    project => project.id == request.params.id
  );

  projects.splice(projectIndex, 1);

  response.status(200).json({ message: "Project deleted" });
});

module.exports = routes;
