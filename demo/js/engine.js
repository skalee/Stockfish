/*
 * – should be run as web worker
 * – contains Stockfish engine instance
 */

importScripts('lib/require.js');

require(['stockfish'], function() {

  Module.emit = handleUciResponse;
  self.addEventListener('message', incomming, false);

  function sendToUci(command, fen) {
    Module.uci("position fen " + fen);
    Module.uci(command);
  }

  function handleUciResponse(response) {
    var matches;
    if (matches = response.match(/^bestmove ([a-h0-8]+)/)) {
      self.postMessage(matches[1]);
    }
  }

  function incomming(e) {
    var separatorIndex = e.data.indexOf(':');
    var command = e.data.slice(0, separatorIndex);
    var fen = e.data.slice(separatorIndex + 1);
    sendToUci(command, fen);
  }

});
