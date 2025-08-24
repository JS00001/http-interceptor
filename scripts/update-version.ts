import fs from 'fs';

import { FgGreen } from './util';

async function main() {
  const tauriConf = JSON.parse(fs.readFileSync('./bridge/tauri.conf.json', 'utf-8'));
  const version = tauriConf.version;
  const parts = version.split('.');
  parts[2] = (Number(parts[2]) + 1).toString();
  tauriConf.version = parts.join('.');
  fs.writeFileSync('./bridge/tauri.conf.json', JSON.stringify(tauriConf, null, 2));
  console.log(`${FgGreen}Updated version to ${tauriConf.version}`);
}

main();
