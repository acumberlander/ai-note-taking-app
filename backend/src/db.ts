import { Pool } from "pg";
import dotenv from "dotenv";

// Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

dotenv.config();

export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.DATABASE_URL,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
  ssl: true,
});

// Table Schema currently
// CREATE TABLE notes (
//   id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   title VARCHAR(255),
//   content VARCHAR(65535)
// );
