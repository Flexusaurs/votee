import { Controller, Post, Logger } from '@nestjs/common';

@Controller('polls')
export class PollsController{

    @Post()
    async create(){
        Logger.log('in creation');
    }

    
    @Post('/join')
    async join(){
        Logger.log('joining');
    }

    @Post('/rejoin')
    async rejoin(){
        Logger.log('rejoining');
    }
    

}
