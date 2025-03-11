/*import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
*/


import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.DATABASE_URL,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

// Table Schema currently
// CREATE TABLE notes (
//   id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   title VARCHAR(255),
//   content VARCHAR(65535)
// );
