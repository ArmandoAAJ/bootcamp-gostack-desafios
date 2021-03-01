const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400)
      .json({ error: 'Invalid project ID.' })
  }
  next();
}

app.get("/repositories", (request, response) => {
  if (!repositories) {
    return response.status(204).json([]);
  }
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 }

  const urlConfirm = url.split('/');

  if (urlConfirm[2] !== 'github.com') {
    return response.status(400)
      .json({ error: 'URL must be from a valid github repository.' })
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: 'Project not found.'
    });
  }

  const { likes } = repositories.find(repository => repository.id === id);

  const repository = { id, title, url, techs, likes };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: 'Project not found.'
    });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json([]);

});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: 'Project not found.'
    });
  }

  let { title, url, techs, likes } = repositories.find(repository => repository.id === id);

  likes ++;
  const repository = { id, title, url, techs, likes };
  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

module.exports = app;
