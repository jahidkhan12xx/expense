import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./utils/schema.jsx",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_soPGU16JuBTq@ep-little-haze-a4mhg9wt-pooler.us-east-1.aws.neon.tech/expense?sslmode=require&channel_binding=require",
  },
  migrations: {
    table: "__drizzle_migrations__",
    schema: "public",
  },
  verbose: true,
});
