/*
 * – holds the game state
 * – communicates with the engine to obtain AI moves
 */

define(['lib/chess'], function() {

  var engine = new Worker('js/engine.js');
  var game = new Chess();
  var white = null, black = null;

  engine.addEventListener('message', workerResponded, false);

  return {
    game: game,
    start: start,
    playersTurn: function() {
      return (currentPlayerType() === 'player');
    },
    move: move
  };

  function start(white_, black_) {
    game.reset();
    white = white_;
    black = black_;
    postUpdate();
    thinkIfCpu();
  }

  function workerResponded(e) {
    move(e.data);
  }

  // It's most convenient to pass moves in UCI-compatible format
  function move(move_str) {
    var legal = !!game.move({
      from: move_str.substr(0, 2),
      to: move_str.substr(2, 2),
      promotion: move_str.substr(4, 1)
    });

    if (legal) {
      postUpdate();
      thinkIfCpu();
    }

    return legal;
  }

  function thinkIfCpu() {
    if (currentPlayerType() !== 'player') {
      engine.postMessage('go depth 3:' + game.fen());
    }
  }

  function currentPlayerType() {
    return (game.turn() === 'w' ? white : black);
  }

  function postUpdate() {
    console.log("Current FEN: " + game.fen());
    $(window).trigger('gameUpdate', {
      fen: game.fen(),
      status: status(),
      game_over: game.game_over()
    });
  }

  function status() {
    var side_to_move = (game.turn() == "w") ? "White" : "Black";
    var side_moved = (game.turn() == "b") ? "White" : "Black";

    if (game.in_checkmate()) {
      return "Checkmate! " + side_moved + " wins.";
    } else if (game.in_stalemate()) {
      return "Stalemate!";
    } else if (game.in_threefold_repetition()) {
      return "It's a draw! 3x repetition.";
    } else if (game.insufficient_material()) {
      return "It's a draw! Insufficient material.";
    } else if (game.in_draw()) { // 50-moves rule
      return "It's a draw!";
    } else {
      return (game.in_check() ? "Check! " : "") + side_to_move + " to move…";
    };
  }

});
