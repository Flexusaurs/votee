import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "./redis.module";


export const redisModule = RedisModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        const logger = new Logger('RedisModule');

        return{
            connectionOptions: {
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
            },
            onClientReady: (client)=> {
                logger.log('Redis client ready!');

                client.on('error', (err)=> {
                    logger.error("REDIS CLIENT ERR!!!", err);
                });

                client.on('connect', ()=> {
                    logger.log(
                        `CONNECTED TO REDIS ON ${client.options.host}:${client.options.port}`,
                    );
                });

                client.on('close', ()=> {
                    logger.log("CONNECTION CLOSED");
                });
            },
        };
    },
    inject: [ConfigService],
});