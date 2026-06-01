import { db } from "../db.js";

// Calcula o status de um paciente baseado nos horários e se tomou
// ok       = todos tomaram
// late     = algum não tomou e passou mais de 1h
// urgent   = algum não tomou e passou mais de 3h
// partial  = não tomou mas ainda não está atrasado
function calcStatus(row) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const doses = [
    { horario: row.Horario1, tomou: row.Tomou1 },
    { horario: row.Horario2, tomou: row.Tomou2 },
    { horario: row.Horario3, tomou: row.Tomou3 },
  ].filter((d) => d.horario); // ignora horários nulos/vazios

  if (doses.length === 0) return "ok";

  let maxDelay = -1; // em minutos, -1 = nenhuma dose perdida

  for (const dose of doses) {
    if (dose.tomou) continue; // tomou → tudo bem

    // Converte "HH:MM:SS" ou "HH:MM" para minutos
    const [h, m] = dose.horario.split(":").map(Number);
    const doseMinutes = h * 60 + m;
    const diff = nowMinutes - doseMinutes;

    if (diff > maxDelay) maxDelay = diff;
  }

  if (maxDelay < 0)   return "ok";      // todas tomadas
  if (maxDelay < 60)  return "partial"; // ainda dentro do prazo
  if (maxDelay < 180) return "late";    // passou 1h → atrasado
  return "urgent";                       // passou 3h → urgente
}

export const getControles = (_, res) => {
  const q = "SELECT * FROM controlepacientes";
  db.query(q, (err, data) => {
    if (err) return res.json(err);

    const result = data.map((row) => ({
      ...row,
      status: calcStatus(row),
    }));

    return res.status(200).json(result);
  });
};

export const searchControles = (req, res) => {
  const { term } = req.params;
  const q = `
    SELECT * FROM controlepacientes
    WHERE Pacientes LIKE ? OR Medicamentos LIKE ?
  `;
  const like = `%${term}%`;
  db.query(q, [like, like], (err, data) => {
    if (err) return res.json(err);

    const result = data.map((row) => ({
      ...row,
      status: calcStatus(row),
    }));

    return res.status(200).json(result);
  });
};

export const addControle = (req, res) => {
  const q = `
    INSERT INTO controlepacientes
    (
      Pacientes,
      Medicamentos,
      Horario1,
      Tomou1,
      Horario2,
      Tomou2,
      Horario3,
      Tomou3
    )
    VALUES(?)
  `;
  const values = [
    req.body.Pacientes,
    req.body.Medicamentos,
    req.body.Horario1,
    req.body.Tomou1,
    req.body.Horario2,
    req.body.Tomou2,
    req.body.Horario3,
    req.body.Tomou3,
  ];
  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.status(200).json("Controle cadastrado com sucesso.");
  });
};

export const updateControle = (req, res) => {
  const q = `
    UPDATE controlepacientes SET
    Pacientes = ?,
    Medicamentos = ?,
    Horario1 = ?,
    Tomou1 = ?,
    Horario2 = ?,
    Tomou2 = ?,
    Horario3 = ?,
    Tomou3 = ?
    WHERE idControlePacientes = ?
  `;
  const values = [
    req.body.Pacientes,
    req.body.Medicamentos,
    req.body.Horario1,
    req.body.Tomou1,
    req.body.Horario2,
    req.body.Tomou2,
    req.body.Horario3,
    req.body.Tomou3,
  ];
  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.status(200).json("Controle atualizado com sucesso.");
  });
};

export const deleteControle = (req, res) => {
  const q = "DELETE FROM controlepacientes WHERE idControlePacientes = ?";
  db.query(q, [req.params.id], (err) => {
    if (err) return res.json(err);
    return res.status(200).json("Controle removido com sucesso.");
  });
};
