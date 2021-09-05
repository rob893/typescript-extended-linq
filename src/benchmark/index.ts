import { allBenchmark } from './all';
import { anyBenchmark } from './any';
import { whereBenchmark } from './where';
import { complexBenchmark } from './complex';

const args = process.argv.slice(2);

if (args.length === 0) {
  throw new Error('Benchmark name must be passed.');
}

const benchmark = args[0];

switch (benchmark.toLowerCase()) {
  case 'any':
    anyBenchmark();
    break;
  case 'all':
    allBenchmark();
    break;
  case 'where':
    whereBenchmark();
    break;
  case 'complex':
    complexBenchmark();
    break;
  default:
    throw new Error(`${benchmark} is not a valid benchmark name.`);
}
