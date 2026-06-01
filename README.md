<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge"/>
</p>

# 🏥 Brasil-Longevo

<p align="center">
  Plataforma para gerenciamento de pacientes e medicamentos para cuidados com idosos
</p>

## 🙏 Agradecimentos

Dedico este projeto aos meus amigos, professores e familiares que me ajudaram e apoiaram na realização deste trabalho.

Agradeço a Deus por ter colocado essas pessoas no meu caminho, sempre me guiando e ajudando nos meus passos futuros. Também sou grato pela saúde, bênçãos e proteção concedidas ao longo dessa jornada.

---

## 📌 Sobre o Projeto

O **Brasil-Longevo** é uma aplicação desenvolvida em **React** com **TypeScript** no frontend e **Node.js** no backend, integrada ao **MySQL**, criada para facilitar o gerenciamento de pacientes e o controle de medicamentos em ambientes de cuidados com idosos.

A plataforma permite cadastrar pacientes, controlar medicamentos, receber notificações de horários e gerenciar informações de forma simples, rápida e eficiente.

---

## 🎯 Objetivo

- Facilitar o controle de medicamentos por horário
- Otimizar o gerenciamento de pacientes
- Melhorar a comunicação entre cuidadores
- Oferecer uma experiência prática e intuitiva

---

## ⚙️ Funcionalidades

- Cadastro e gerenciamento de pacientes
- Controle de medicamentos com horários
- Sistema de notificações (urgente, atrasado, tomado)
- Listagem de dados em tabelas
- Edição e exclusão de registros
- Paginação e filtros de busca

---

## 🧑‍💻 Tecnologias Utilizadas

**Frontend**
- React + TypeScript
- Vite
- CSS Modules

**Backend**
- Node.js
- Express
- MySQL

---

## 🗄️ Banco de Dados

O sistema utiliza **MySQL** para armazenar:
- Pacientes
- Medicamentos

---

### 💊 Medicamento
- Nome, dosagem, horário, status
- Regras de notificação: **ok** (tomado), **late** (até 1h de atraso), **urgent** (mais de 3h de atraso)

---

## 📋 Gerenciamento

### 📊 Listagem
- Visualização em tabela com paginação
- Busca por dados específicos

### ✏️ Edição
- Atualização de informações de pacientes e medicamentos

### ❌ Exclusão
- Remoção completa de registros

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado
- MySQL instalado e configurado

### Frontend

```bash
# Acesse a pasta do frontend
cd BrasilLongevo/longevo

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

### Backend

```bash
# Acesse a pasta da api
cd Brasil-Longevo/api

# Instale as dependências
yarn install

# Execute o servidor
yarn start
```

---

## 🚀 Melhorias Futuras

- Sistema de relatórios por paciente
- Integração com prontuário eletrônico
- Notificações via WhatsApp ou SMS
- Versão mobile

---

## 👨‍💻 Equipe

- Luis Henrique Gianeti
- Gabriel Evangelista Demarchi
- Gustavo Henrique Ferreira dos Santos
- Vinicius Pedroso Garcias

---

## 🏫 Instituição

UNIFIO — Centro Universitário das Faculdades Integradas de Ourinhos

---

### 📂 Documentação do Projeto

O projeto conta com uma documentação completa contendo:

- 📄 Levantamento de requisitos
- 📊 Diagramas (classes, atividades e banco de dados)
- 🧠 Regras de negócio
- 🖥️ Protótipos de telas
- ⚙️ Descrição das funcionalidades

---

### 🛠️ Processo de Desenvolvimento

O projeto foi desenvolvido seguindo etapas organizadas:

1. Levantamento de requisitos
2. Pesquisa de mercado e análise de problemas reais
3. Prototipação de telas (UI/UX)
4. Desenvolvimento em React + Node.js
5. Integração com banco de dados MySQL em maquina fisica 
6. Testes e validação do sistema

---

### 🧪 Controle de Versão

O código do projeto foi versionado utilizando:

- Git
- GitHub

Permitindo:

- Controle de alterações
- Histórico de desenvolvimento
- Trabalho em equipe
