import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { RedisService } from './redis/redis.service';

@Module({
	imports: [EnvModule],
	providers: [RedisService, EnvService],
	exports: [RedisService, EnvService]
})
export class CacheModule {}