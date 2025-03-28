import { Test, TestingModule } from '@nestjs/testing';
import { ChannelStatsController } from './channel_stats.controller';

describe('ChannelStatsController', () => {
  let controller: ChannelStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelStatsController],
    }).compile();

    controller = module.get<ChannelStatsController>(ChannelStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
