import { build } from 'velite';

const args = new Set(process.argv.slice(2));
const watch = args.has('--watch');

await build({
  watch,
  clean: !watch,
});
