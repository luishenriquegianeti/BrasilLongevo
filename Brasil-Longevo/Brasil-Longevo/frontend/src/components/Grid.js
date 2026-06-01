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

 
  }
`;

const Grid = ({ users, setUsers, setOnEdit }) => {
  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (idMedicamentos) => {
    await axios
      .delete("http://localhost:8800/" + idMedicamentos)
      .then(({ data }) => {
        const newArray = users.filter(
          (user) => user.idMedicamentos !== idMedicamentos,
        );

        setUsers(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));

    setOnEdit(null);
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Nome</Th>
          <Th>Categoria</Th>
          <Th>Descricão</Th>
          <Th>Estoque</Th>
          <Th></Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {users.map((item, i) => (
          <Tr key={i}>
            <Td width="20%">{item.Nome}</Td>
            <Td width="20%">{item.Categoria}</Td>
            <Td width="20%">{item.Descricao}</Td>
            <Td alignCenter width="20%">
              {item.Estoque}
            </Td>
            <Td alignCenter width="10%">
              <FaEdit onClick={() => handleEdit(item)} />
            </Td>
            <Td alignCenter width="10%">
              <FaTrash onClick={() => handleDelete(item.idMedicamentos)} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Grid;
