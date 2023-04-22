import { Controller, Post, Logger, Body } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './dtos';

@Controller('polls')
export class PollsController{

    @Post()
    async create(@Body() createPollDto: CreatePollDto){
        Logger.log('in creation');
        return createPollDto;
    }

    
    @Post('/join')
    async join(@Body() joinPollDto: JoinPollDto){
        Logger.log('joining');
        return joinPollDto;
    }

    @Post('/rejoin')
    async rejoin(@Body() joinPollDto: JoinPollDto){
        Logger.log('rejoining');
        return joinPollDto;
    }
    
}
