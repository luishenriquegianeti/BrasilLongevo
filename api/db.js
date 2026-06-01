// configuração do mysql e conexão

import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "8812",
  database: "brasil-longevo",
});
