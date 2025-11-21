import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'

const sql = neon("postgresql://neondb_owner:npg_soPGU16JuBTq@ep-little-haze-a4mhg9wt-pooler.us-east-1.aws.neon.tech/expense?sslmode=require&channel_binding=require");
export const db = drizzle({ client: sql },{schema});
