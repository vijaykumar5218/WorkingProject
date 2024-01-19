import {CentPipePipe} from './cent-pipe.pipe';

describe('pipe test', () => {
  let pipes: CentPipePipe = null;

  beforeEach(() => {
    pipes = new CentPipePipe();
  });

  it('transform pipe', () => {
    expect(pipes.transform('0.02')).toBe('0');
  });
});
