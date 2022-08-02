import { execSync } from 'child_process';

export const call = (cmd, silence = false) => {
  if (!silence) console.log('@@ Calling cmd: ', cmd);
  const res = execSync(cmd, { encoding: 'utf8' });
  if (!silence && res) console.log('---> Response:\n', res);
  return res;
};

