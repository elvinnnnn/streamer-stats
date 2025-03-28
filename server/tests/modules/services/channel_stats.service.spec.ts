import { Test, TestingModule } from '@nestjs/testing';
import { ChannelStatsService } from '../../../src/modules/channel_stats/channel_stats.service';

describe('ChannelStatsService', () => {
  let service: ChannelStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelStatsService],
    }).compile();

    service = module.get<ChannelStatsService>(ChannelStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
