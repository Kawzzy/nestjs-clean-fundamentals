import { Env } from 'src/env';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [PassportModule, JwtModule.registerAsync({
		inject: [ConfigService],
		useFactory(config: ConfigService<Env, true>) {
			const secret = config.get('JWT_SECRET', { infer: true });

			return {
				secret
			};
		},
	})]
})
export class AuthModule {}