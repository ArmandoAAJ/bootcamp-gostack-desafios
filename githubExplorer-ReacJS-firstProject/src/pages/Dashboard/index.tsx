import React, { useState, FormEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

import { Title, Form, Repositories, Error } from "./styles";
import Logo from "../../assets/logo.svg";

import api from "../../services/api";

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem(
      "@GithubExplorer:repositories"
    );
    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    } else {
      return [];
    }
  });
  const [inputError, setInputError] = useState("");
  const [newRepo, setNewRepo] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "@GithubExplorer:repositories",
      JSON.stringify(repositories)
    );
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    if (!newRepo) {
      setInputError("Digite o autor/nome do repositório.");
      return;
    }
    //Opcional tipar get
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);

      setNewRepo("");
      setInputError("");
    } catch (err) {
      setInputError("Repositório não encontrado.");
    }
  }

  return (
    <>
      <img src={Logo} alt="Github Explorer" />
      <Title>Explore Repositórios no Github</Title>
      {/* em vez de usar Bollean(variavel) pode ser usado !!variavel mesmo efeito */}
      <Form hasError={Boolean(inputError)} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button>Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((r) => (
          <Link key={r.full_name} to={`/repository/${r.full_name}`}>
            <img src={r.owner.avatar_url} alt={r.owner.login} />
            <div>
              <strong>{r.full_name}</strong>
              <p>{r.description}</p>
            </div>
            <FiChevronRight color="#C9C9D4" size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
