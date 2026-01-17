import pg from "pg";

export const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  password: "2005",
  database: "sonidostock",
  port: 5432,
  client_encoding: "utf8",
});

