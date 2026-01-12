import pg from 'pg';

export const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    password: "2005",
    database: "postgres",
    port: 5432,
})