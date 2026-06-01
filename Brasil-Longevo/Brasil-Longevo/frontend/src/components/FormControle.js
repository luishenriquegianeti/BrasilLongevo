import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 520px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
  width: 1090px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  width: 97%;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const FormControle = ({ getControles, onEdit, setOnEdit, setControles }) => {
  const ref = useRef();

  useEffect(() => {
    if (onEdit) {
      const controle = ref.current;
      controle.Pacientes.value = onEdit.Pacientes;
      controle.Medicamentos.value = onEdit.Medicamentos;
      controle.Horario1.value = onEdit.Horario1;
      controle.Tomou1.checked = onEdit.Tomou1;
      controle.Horario2.value = onEdit.Horario2;
      controle.Tomou2.checked = onEdit.Tomou2;
      controle.Horario3.value = onEdit.Horario3;
      controle.Tomou3.checked = onEdit.Tomou3;
    }
  }, [onEdit]);

  const handleSearch = async (e) => {
    const term = e.target.value;
    if (!term) {
      getControles();
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:8800/controle/search/${term}`,
      );
      setControles(res.data);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const controle = ref.current;

    if (!controle.Pacientes.value || !controle.Medicamentos.value) {
      return toast.warn("Preencha todos os campos!");
    }

    const data = {
      Pacientes: controle.Pacientes.value,
      Medicamentos: controle.Medicamentos.value,
      Horario1: controle.Horario1.value || null,
      Tomou1: controle.Tomou1.checked ? 1 : 0,
      Horario2: controle.Horario2.value || null,
      Tomou2: controle.Tomou2.checked ? 1 : 0,
      Horario3: controle.Horario3.value || null,
      Tomou3: controle.Tomou3.checked ? 1 : 0,
    };

    if (onEdit) {
      await axios
        .put(
          "http://localhost:8800/controle/" + onEdit.idControlePacientes,
          data,
        )
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://localhost:8800/controle", data)
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    }

    controle.Pacientes.value = "";
    controle.Medicamentos.value = "";
    controle.Horario1.value = "";
    controle.Horario2.value = "";
    controle.Horario3.value = "";
    controle.Tomou1.checked = false;
    controle.Tomou2.checked = false;
    controle.Tomou3.checked = false;
    setOnEdit(null);

    getControles();
  };

  return (
    <>
 <SearchContainer>
        <InputArea style={{ flex: 1 }}>
          <Label>Pesquisar</Label>
          <SearchInput
            placeholder="Pesquisar por paciente"
            onChange={handleSearch}
          />
        </InputArea>
      </SearchContainer>

      <FormContainer ref={ref} onSubmit={handleSubmit}>
        <InputArea>
          <Label>Paciente</Label>
          <Input name="Pacientes" />
        </InputArea>

        <InputArea>
          <Label>Medicamento</Label>
          <Input name="Medicamentos" />
        </InputArea>

        <InputArea>
          <Label>Horário 1</Label>
          <Input name="Horario1" type="time" />
        </InputArea>

        <InputArea>
          <Label>Tomou 1</Label>
          <Checkbox name="Tomou1" type="checkbox" />
        </InputArea>

        <InputArea>
          <Label>Horário 2</Label>
          <Input name="Horario2" type="time" />
        </InputArea>

        <InputArea>
          <Label>Tomou 2</Label>
          <Checkbox name="Tomou2" type="checkbox" />
        </InputArea>

        <InputArea>
          <Label>Horário 3</Label>
          <Input name="Horario3" type="time" />
        </InputArea>

        <InputArea>
          <Label>Tomou 3</Label>
          <Checkbox name="Tomou3" type="checkbox" />
        </InputArea>

        <Button type="submit">SALVAR</Button>
      </FormContainer>

    </>
  );
};

export default FormControle;
