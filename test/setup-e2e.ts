import { config } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { envSchema } from '@/infra/env/env';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);

const prismaConnection = new PrismaClient();
const redisConnection = new Redis({
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
	db: env.REDIS_DB,
	password: env.REDIS_PASSWORD,
});

function generateUniqueDatabaseURL(schemaId: string) {
    
	if (!env.DATABASE_URL) {
		throw new Error('Please provide a DATABASE_URL environment variable.');
	}

	const url = new URL(env.DATABASE_URL);
    
	url.searchParams.set('schema', schemaId);

	return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
	const databaseURL = generateUniqueDatabaseURL(schemaId);

	env.DATABASE_URL = databaseURL;

	await redisConnection.flushdb();

	execSync('npx prisma migrate deploy');
});

afterAll(async () => {
	await prismaConnection.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
	await prismaConnection.$disconnect;
});