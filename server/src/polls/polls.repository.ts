import { Inject, InternalServerErrorException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, Command } from 'ioredis';
import { IORedisKey } from 'src/redis.module';
import { AddParticipantRepositoryData, CreatePollRepositoryData } from './polls_types';
import { Poll } from 'shared';

@Injectable()
export class PollsRepository {
  private readonly ttl: string;
  private readonly logger = new Logger(PollsRepository.name);

  constructor(
    configService: ConfigService,
    @Inject(IORedisKey) private readonly redisClient: Redis,
  ) {
    this.ttl = configService.get('POLL_DURATION');
  }

  async createPoll({
    votesPerVoter,
    topic,
    pollID,
    userID,
  }: CreatePollRepositoryData): Promise<Poll> {
    const initialPoll = {
      id: pollID,
      topic,
      votesPerVoter,
      participants: {},
      adminID: userID,
    };

    this.logger.log(
      `Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${
        this.ttl
      }`,
    );

    const key = `polls:${pollID}`;

    try {
      await this.redisClient
        .multi([
            [new Command('JSON.SET', [key, '.', JSON.stringify(initialPoll)])],
            [new Command('EX', [key, this.ttl])]
        ])
      //new Command('JSON.SET', [key, '.', JSON.stringify(initialPoll)], 'EX', parseInt(this.ttl)))
           
        
        /* .pipeline()
        .set(key, JSON.stringify(initialPoll), 'EX', parseInt(this.ttl))
        .exec(); */
      
      return initialPoll;
    } catch (e) {
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll)}\n${e}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Attempting to get poll with: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      const currentPoll = await this.redisClient.get(key);

      this.logger.verbose(currentPoll);

      return JSON.parse(currentPoll as string);
    } catch (e) {
      this.logger.error(`Failed to get pollID ${pollID}`);
      throw e;
    }
  }

  async addParticipant({
    pollID,
    userID,
    name,
  }: AddParticipantRepositoryData): Promise<Poll> {
    this.logger.log(
      `Attempting to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.sendCommand(
        new Command('JSON.SET', [key, participantPath, JSON.stringify(name)])
      );

      const pollJSON = await this.redisClient.sendCommand(new Command('JSON.GET', [key, '.']))
      const poll = JSON.parse(pollJSON as string) as Poll;

      this.logger.debug(
        `Current Participants for pollID: ${pollID}:`,
        poll.participants,
      );

      return poll;
    } catch (e) {
      this.logger.error(
        `Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
      );
      throw e;
    }
  }
}
