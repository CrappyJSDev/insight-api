var fs = require('fs');
var config = require('./config/config');
var PeerSync = require('./lib/PeerSync');
var HistoricSync = require('./lib/HistoricSync');

// p2pSync process
var peerSync = new PeerSync({
  shouldBroadcast: true
});

if (!config.disableP2pSync) {
  peerSync.run();
}

// historic_sync process
var historicSync = new HistoricSync({
  shouldBroadcastSync: true
});
peerSync.historicSync = historicSync;

if (!config.disableHistoricSync) {
  historicSync.start({}, function(err) {
    if (err) {
      var txt = 'ABORTED with error: ' + err.message;
      console.log('[historic_sync] ' + txt);
    }
    if (peerSync) peerSync.allowReorgs = true;
  });
} else
if (peerSync) peerSync.allowReorgs = true;
