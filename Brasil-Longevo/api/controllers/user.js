import { db } from "../db.js";

export const getUsers = (_, res) => {
  const q = "SELECT * FROM medicamentos";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const searchUsers = (req, res) => {
  const { term } = req.params;
  const q = `
    SELECT * FROM medicamentos
    WHERE Nome LIKE ? OR Categoria LIKE ?
  `;
  const like = `%${term}%`;
  db.query(q, [like, like], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const addUser = (req, res) => {
  const q =
    "INSERT INTO medicamentos(`Nome`, `Categoria`, `Descricao`, `Estoque`) VALUES(?)";
  const values = [
    req.body.Nome,
    req.body.Categoria,
    req.body.Descricao,
    req.body.Estoque,
  ];
  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.status(200).json("Medicamento criado com sucesso.");
  });
};

export const updateUser = (req, res) => {
  const q =
    "UPDATE medicamentos SET `Nome` = ?, `Categoria` = ?, `Descricao` = ?, `Estoque` = ? WHERE `idMedicamentos` = ?";
  const values = [
    req.body.Nome,
    req.body.Categoria,
    req.body.Descricao,
    req.body.Estoque,
  ];
  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.status(200).json("Medicamento atualizado com sucesso.");
  });
};

export const deleteUser = (req, res) => {
  const q = "DELETE FROM medicamentos WHERE `idMedicamentos` = ?";
  db.query(q, [req.params.id], (err) => {
    if (err) return res.json(err);
    return res.status(200).json("Medicamento deletado com sucesso.");
  });
};
