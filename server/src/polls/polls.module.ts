import {Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { PollsRepository } from './polls.repository';
import { redisModule } from 'src/modules.config';


@Module({
    imports: [ConfigModule, redisModule],
    controllers: [PollsController],
    providers: [PollsService, PollsRepository]
})

export class PollsModule{}