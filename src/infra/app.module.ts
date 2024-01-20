import { envSchema } from './env/env';
import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from './http/http.module';
import { EventsModule } from './events/events.module';

@Module({
	imports: [
		EnvModule,
		AuthModule,
		HttpModule,
		EventsModule,
		ConfigModule.forRoot({
			validate: env => envSchema.parse(env),
			isGlobal: true
		})
	]
})
export class AppModule {}
