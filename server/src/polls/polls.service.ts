import { Injectable, Logger } from '@nestjs/common';
import { createPollID, createUserID } from 'src/ids';
import { CreatePollFields, JoinPollFields, RejoinPollFields } from './polls_types';
import { PollsRepository } from './polls.repository';

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);
  constructor(private readonly pollsRepository: PollsRepository) {}

  async createPoll(fields: CreatePollFields){
    const pollID = createPollID();
    const userID = createUserID();

    const createdPoll = await this.pollsRepository.createPoll({
      ...fields,
      pollID,
      userID,
    });

    return{
      poll: createdPoll,
    }
  }

  async joinPoll(fields: JoinPollFields){
    const userID = createUserID();

    this.logger.debug(
      `fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`
    );

    const joinedPoll = await this.pollsRepository.getPoll(fields.pollID);

    return{
      poll: joinedPoll,
    };
  }

  async rejoinPoll(fields: RejoinPollFields){
    this.logger.debug(`
      Rejoining poll with ID ${fields.pollID} for user with id ${fields.userID}
    `);

    const joinedPoll = await this.pollsRepository.addParticipant(fields);
    return joinedPoll;
  }
}