# 🧩 Desafio Técnico: Custom Node n8n - Random

[![Node.js](https://img.shields.io/badge/Node.js-v22-brightgreen)](https://nodejs.org/)
[![n8n](https://img.shields.io/badge/n8n-1.85.4-blue)](https://n8n.io/)
[![Docker](https://img.shields.io/badge/Docker-Docker%20Compose-blue)](https://www.docker.com/)

---

## 📌 Sumário

* [Descrição](#-descrição)
* [Estrutura do Projeto](#-estrutura-do-projeto)
* [Pré-requisitos](#-pré-requisitos)
* [Infraestrutura n8n + Postgres](#-infraestrutura-n8n--postgres)
* [Instalando Dependências](#-instalando-dependências)
* [Compilando o Node](#-compilando-o-node)
* [Configurando Variáveis de Ambiente](#-configurando-variáveis-de-ambiente)
* [Executando n8n com Docker](#-executando-n8n-com-docker)
* [Utilizando o Node Random](#-utilizando-o-node-random)
* [Testes Unitários](#-testes-unitários)
* [Boas Práticas Implementadas](#-boas-práticas-implementadas)
* [Entrega](#-entrega)

---

## 📝 Descrição

Este projeto é um **conector personalizado para o n8n**, chamado **Random**, que gera números aleatórios utilizando a API do [Random.org](https://www.random.org).

O node recebe dois inputs (`Min` e `Max`) e retorna um único número aleatório dentro do intervalo especificado.

O projeto faz parte de um **teste técnico da empresa OnFly**.

---

## 📂 Estrutura do Projeto

```
onfly-random-node/
├─ node-package/                
│  ├─ src/
│  │  └─ Random.ts              
│  ├─ __test__/
│  │  └─ Random.test.ts        
│  ├─ package.json
│  ├─ jetconfig.json              
│  └─ tsconfig.json             
│
└─ n8n_custom/                  
   └─ nodes/
      └─ Random/
         ├─ dist/               
         │  ├─ Random.node.js
         │  ├─ Random.node.d.ts
         │  └─ Random.node.js.map
         └─ icons/
            └─ random-icon.svg  
```

---

## ⚙️ Pré-requisitos

* Node.js v22 LTS
* npm
* Docker e Docker Compose

---

## 🏗️ Infraestrutura n8n + Postgres

O projeto inclui um `docker-compose.yml` que sobe:

* **n8n** (versão 1.85.4)
* **Postgres** para persistência

> O bind mount carrega os nodes customizados para n8n:

```yaml
volumes:
  - ./n8n_custom/nodes:/home/node/.n8n/nodes:ro
```

---

## 🛠️ Instalando Dependências

Dentro de `node-package/`:

```bash
npm install
```

Dependências:

* `n8n-workflow`
* `typescript`
* `@types/node`

Dependências de desenvolvimento para testes:

* `jest`, `ts-jest`, `@types/jest`

---

## ⚡ Compilando o Node

```bash
npm run build
```

* O output será gerado em: `n8n_custom/nodes/Random/dist/`

---

## 🌐 Configurando Variáveis de Ambiente

O `docker-compose.yml` já define:

```env
N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/nodes
N8N_USER_FOLDER=/home/node/.n8n
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=postgres
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=n8n
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin
```

---

## 🚀 Executando n8n com Docker

Dentro de `node-package/`:

```bash
docker compose up -d
```

* Acesse o editor: [http://localhost:5678](http://localhost:5678)
* O node **Random** estará disponível na categoria `Transform`.

---

## 🎯 Utilizando o Node Random

**Parâmetros do Node:**

| Campo | Descrição                |
| ----- | ------------------------ |
| Min   | Valor mínimo (inclusivo) |
| Max   | Valor máximo (inclusivo) |

* Requisição feita para:

```
GET https://www.random.org/integers/?num=1&min={min}&max={max}&col=1&base=10&format=plain&rnd=new
```

* Retorno:

```json
{
  "random_number": 42,
  "min": 1,
  "max": 100
}
```

---

## 🧪 Testes Unitários

* Local: `src/Random.test.ts`
* Framework: **Jest**
* Para rodar:

```bash
npm test
```

**Testes cobertos:**

* Número aleatório dentro do intervalo
* Erro quando `min > max`
* Erro quando fetch retorna status não ok
* Erro quando o valor retornado não é número

> Mock de `fetch` e `IExecuteFunctions` do n8n é utilizado.

---

## ✅ Boas Práticas Implementadas

* Uso de **TypeScript** com tipos do n8n (`INodeType`, `IExecuteFunctions`)
* Parametrização amigável (`displayName`, `description`)
* Ícone SVG customizado
* Estrutura de arquivos organizada (`src`, `dist`, `icons`)
* `try/catch` e validações de parâmetros
* Testes unitários completos

---

## 📦 Entrega

* Repositório público no GitHub
* Contém `docker-compose.yml`, `n8n_custom/`, node compilado e testes
* README detalhado para instalação, execução e testes
