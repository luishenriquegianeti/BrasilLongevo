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
  width: 180px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
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
`;

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;

      user.nome.value = onEdit.Nome;
      user.categoria.value = onEdit.Categoria;
      user.descricao.value = onEdit.Descricao;
      user.estoque.value = onEdit.Estoque;
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = ref.current;

    if (
      !user.nome.value ||
      !user.categoria.value ||
      !user.descricao.value ||
      !user.estoque.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    if (onEdit) {
      await axios
        .put(
          "http://localhost:8800/" + onEdit.idMedicamentos,
          {
            Nome: user.nome.value,
            Categoria: user.categoria.value,
            Descricao: user.descricao.value,
            Estoque: user.estoque.value,
          }
        )
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));

    } else {
      await axios
        .post("http://localhost:8800", {
          Nome: user.nome.value,
          Categoria: user.categoria.value,
          Descricao: user.descricao.value,
          Estoque: user.estoque.value,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    }

    user.nome.value = "";
    user.categoria.value = "";
    user.descricao.value = "";
    user.estoque.value = "";

    setOnEdit(null);
    getUsers();
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Nome</Label>
        <Input name="nome" />
      </InputArea>

      <InputArea>
        <Label>Categoria</Label>
        <Input name="categoria" />
      </InputArea>

      <InputArea>
        <Label>Descrição</Label>
        <Input name="descricao" />
      </InputArea>

      <InputArea>
        <Label>Estoque</Label>
        <Input name="estoque" type="number" />
      </InputArea>

      <Button type="submit">SALVAR</Button>
    </FormContainer>
  );
};

export default Form;