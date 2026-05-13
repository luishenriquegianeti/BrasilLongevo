import { db } from "../db.js";
// execução das funcionalidades e coleta de dados
export const getUsers = (_, res) => {
    const q = "SELECT * From medicamentos";

    db.query(q, (err, data) => {
        if (err) return res.json(err);
        
        return res.status(200).json(data);
        //retorna a listagem de medicamentos
    });
};