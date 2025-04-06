import { Test, TestingModule } from '@nestjs/testing';
import { StreamStatsService } from '../../../src/modules/stream_stats/stream_stats.service';

describe('StreamStatsService', () => {
  let service: StreamStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamStatsService],
    }).compile();

    service = module.get<StreamStatsService>(StreamStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
