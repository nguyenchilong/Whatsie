import manifest from '../../../../package.json';
import appleScript from 'applescript';
import async from 'async';
import path from 'path';
import app from 'app';

function doEnable(hidden, callback) {
  const props = {
    path: path.resolve(app.getPath('exe'), '..', '..', '..'),
    name: manifest.productName,
    hidden: hidden
  };

  const cmd = [
    'tell application "System Events" to',
    'make login item at end with properties',
    JSON.stringify(props)
  ].join(' ');

  log('making system login item with properties', props);
  appleScript.execString(cmd, callback);
}

export function enable(hidden = false, callback) {
  async.series([
    disable,
    async.apply(doEnable, hidden)
  ], callback);
}

export function disable(callback) {
  const name = '"' + manifest.productName + '"';
  const cmd = [
    'tell application "System Events" to',
    'delete login item',
    name
  ].join(' ');

  log('removing system login item', name);
  appleScript.execString(cmd, callback);
}

export function isEnabled(callback) {
  const cmd = [
    'tell application "System Events" to',
    'get the name of every login item'
  ].join(' ');

  log('querying system login items');
  appleScript.execString(cmd, function(err, items) {
    const enabled = Array.isArray(items) && items.includes(manifest.productName);
    callback(err, enabled);
  });
}
