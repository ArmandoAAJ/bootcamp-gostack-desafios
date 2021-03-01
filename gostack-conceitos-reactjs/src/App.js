import React, { useState, useEffect } from "react";

import api from "./services/api";
import "./styles.css";

function App() {
  const [repositorie, setRepositorie] = useState([]);

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: 'teste4',
      url: 'https://github.com/armandoaaj',
      techs: ['NodeJS', 'ReactJS']
    });
    setRepositorie([...repositorie, response.data]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);
    const repositoryIndex = repositorie.findIndex(repository => repository.id === id);
    repositorie.splice(repositoryIndex, 1);
    setRepositorie([...repositorie]);
  }


  useEffect(() => {
    async function loadRepo() {
      const response = await api.get('/repositories');
      setRepositorie(response.data);
    }
    loadRepo();
  }, []);

  return (
    <div>
      <button onClick={handleAddRepository}>Adicionar</button>
      <ul data-testid="repository-list">
        {repositorie.map(r => (
          <li key={r.id}>
            {r.title}
            <button className="remove" onClick={() => handleRemoveRepository(r.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;