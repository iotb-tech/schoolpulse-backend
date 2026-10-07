import "dotenv/config";

const PORT = Number(process.env.PORT) || 5000;

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/schoolpulse";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

const env = {PORT, DATABASE_URL};


export { env };