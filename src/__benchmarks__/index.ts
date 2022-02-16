import { allBenchmark } from './all';
import { anyBenchmark } from './any';
import { whereBenchmark } from './where';
import { complexBenchmark } from './complex';
import { countBenchmark } from './count';
import { selectBenchmark } from './select';
import { sumBenchmark } from './sum';
import { listBenchmark } from './list';
import { queueBenchmark } from './queue';
import { xorBenchmark } from './xor';

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
  case 'count':
    countBenchmark();
    break;
  case 'select':
    selectBenchmark();
    break;
  case 'sum':
    sumBenchmark();
    break;
  case 'list':
    listBenchmark();
    break;
  case 'queue':
    queueBenchmark();
    break;
  case 'xor':
    xorBenchmark();
    break;
  default:
    throw new Error(`${benchmark} is not a valid benchmark name.`);
}
