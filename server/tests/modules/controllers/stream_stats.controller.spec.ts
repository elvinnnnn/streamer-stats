import { Test, TestingModule } from '@nestjs/testing';
import { StreamStatsController } from '../../../src/modules/stream_stats/stream_stats.controller';

describe('StreamStatsController', () => {
  let controller: StreamStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamStatsController],
    }).compile();

    controller = module.get<StreamStatsController>(StreamStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
