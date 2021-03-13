import React, { useEffect, useState } from "react";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useRouteMatch, Link } from "react-router-dom";

import Logo from "../../assets/logo.svg";

import { Header, RepositoryInfo, Issues } from "./styles";

import api from "../../services/api";

interface ParamsRepository {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository = () => {
  const [repositories, setRepositories] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const { params } = useRouteMatch<ParamsRepository>();

  useEffect(() => {
    async function loadDataResponse() {
      const [repositorie, issue] = await Promise.all([
        api.get(`repos/${params.repository}`),
        api.get(`repos/${params.repository}/issues`),
      ]);

      setRepositories(repositorie.data);
      setIssues(issue.data);
    }

    loadDataResponse();
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={Logo} alt="Rocket Logo" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repositories && (
        <RepositoryInfo>
          <header>
            <img
              src={repositories.owner.avatar_url}
              alt={repositories.owner.login}
            />
            <div>
              <strong>{repositories.full_name}</strong>
              <p>{repositories.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repositories.stargazers_count}</strong>
              <span>Starts</span>
            </li>
            <li>
              <strong>{repositories.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repositories.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map((issue) => (
          <a key={issue.id} href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>

            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
