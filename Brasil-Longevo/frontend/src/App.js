import GlobalStyle from "./styles/global";
import styled from "styled-components";
import Form from "./components/Form";
import Grid from "./components/Grid";
import FormControle from "./components/FormControle";
import GridControle from "./components/GridControle";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2``;

const Menu = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const ButtonLink = styled(Link)`
  padding: 10px 20px;
  background-color: #2c73d2;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
`;

function Medicamentos() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8800");
      setUsers(res.data.sort((a, b) => (a.Nome > b.Nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container>
      <Menu>
        <ButtonLink to="/">Medicamentos</ButtonLink>
        <ButtonLink to="/controle">Controle Pacientes</ButtonLink>
      </Menu>

      <Title>Medicamentos</Title>

      <Form
        onEdit={onEdit}
        setOnEdit={setOnEdit}
        getUsers={getUsers}
        setUsers={setUsers}
      />

      <Grid setOnEdit={setOnEdit} users={users} setUsers={setUsers} />
    </Container>
  );
}

function ControlePacientes() {
  const [controles, setControles] = useState([]);
  const [onEdit, setOnEdit] = useState(null);

  const getControles = async () => {
    try {
      const res = await axios.get("http://localhost:8800/controle");
      setControles(res.data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getControles();
  }, []);

  return (
    <Container>
      <Menu>
        <ButtonLink to="/">Medicamentos</ButtonLink>
        <ButtonLink to="/controle">Controle Pacientes</ButtonLink>
      </Menu>

      <Title>Controle de Pacientes</Title>

      <FormControle
        onEdit={onEdit}
        setOnEdit={setOnEdit}
        getControles={getControles}
        setControles={setControles}
      />

      <GridControle
        setOnEdit={setOnEdit}
        controles={controles}
        setControles={setControles}
      />
    </Container>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Medicamentos />} />
          <Route path="/controle" element={<ControlePacientes />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer autoClose={3000} position="bottom-left" />

      <GlobalStyle />
    </>
  );
}

export default App;
