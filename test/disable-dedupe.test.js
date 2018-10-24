'use strict';

const assert = require('assert');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const coffee = require('coffee');
const npminstall = path.join(__dirname, '..', 'bin', 'install.js');

describe('test/disable-dedupe.test.js', () => {
  const root = path.join(__dirname, 'fixtures', 'disable-dedupe');
  const root2 = path.join(__dirname, 'fixtures', 'disable-dedupe-config');

  function cleanup() {
    rimraf.sync(path.join(root, 'node_modules'));
    rimraf.sync(path.join(root2, 'node_modules'));
  }

  beforeEach(cleanup);
  afterEach(cleanup);

  it('should install --disable-dedupe work', function* () {
    yield coffee.fork(npminstall, [ '--disable-dedupe' ], { cwd: root })
      .debug()
      .expect('code', 0)
      .expect('stderr', /disable dedupe mode/)
      .end();
    const names = fs.readdirSync(path.join(root, 'node_modules'))
      .filter(n => !/^[\.\_]/.test(n));
    assert(names.length === 1);
    assert(names[0] === 'koa');
  });

  it('should install config.npminstall.disableDedupe=true work', function* () {
    yield coffee.fork(npminstall, { cwd: root2 })
      .debug()
      .expect('code', 0)
      .expect('stderr', /disable dedupe mode/)
      .end();
    const names = fs.readdirSync(path.join(root2, 'node_modules'))
      .filter(n => !/^[\.\_]/.test(n));
    assert(names.length === 1);
    assert(names[0] === 'koa');
  });
});
