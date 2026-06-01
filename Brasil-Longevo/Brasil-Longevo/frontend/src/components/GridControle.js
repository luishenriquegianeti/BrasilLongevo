import React from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  max-width: 100%;
  margin: 10 auto;
  word-break: break-all;
`;

export const Thead = styled.thead``;
export const Tbody = styled.tbody``;
export const Tr = styled.tr``;

export const Th = styled.th`
  text-align: center;
  border-bottom: inset;
  padding-bottom: 5px;
`;

export const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};
`;

const GridControle = ({ controles, setControles, setOnEdit }) => {
  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (id) => {
    await axios
      .delete("http://localhost:8800/controle/" + id)
      .then(({ data }) => {
        const newArray = controles.filter(
          (controle) => controle.idControlePacientes !== id,
        );
        setControles(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));
    setOnEdit(null);
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Paciente</Th>
          <Th>Medicamento</Th>
          <Th>Horário 1</Th>
          <Th>Tomou 1</Th>
          <Th>Horário 2</Th>
          <Th>Tomou 2</Th>
          <Th>Horário 3</Th>
          <Th>Tomou 3</Th>
          <Th></Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {controles.map((item, i) => (
          <Tr key={i}>
            <Td width="15%">{item.Pacientes}</Td>
            <Td width="15%">{item.Medicamentos}</Td>
            <Td alignCenter width="10%">
              {item.Horario1}
            </Td>
            <Td alignCenter width="10%">
              {item.Tomou1 ? "Sim" : "Não"}
            </Td>
            <Td alignCenter width="10%">
              {item.Horario2}
            </Td>
            <Td alignCenter width="10%">
              {item.Tomou2 ? "Sim" : "Não"}
            </Td>
            <Td alignCenter width="10%">
              {item.Horario3}
            </Td>
            <Td alignCenter width="10%">
              {item.Tomou3 ? "Sim" : "Não"}
            </Td>
            <Td alignCenter width="5%">
              <FaEdit onClick={() => handleEdit(item)} />
            </Td>
            <Td alignCenter width="5%">
              <FaTrash onClick={() => handleDelete(item.idControlePacientes)} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default GridControle;
