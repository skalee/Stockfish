define(['core', 'lib/jquery', 'lib/chessboard', 'lib/domReady'], function(core) {

  $(window).on('gameUpdate', gameUpdated);

  return board = new ChessBoard('board', {
    pieceTheme: 'images/chesspieces/wikipedia/{piece}.png',
    position: 'start',
    draggable: true,
    onDragStart: dragStart,
    onDrop: drop
  });

  function dragStart(source, piece, position, orientation) {
    if (!core.playersTurn() ||
        core.game.game_over() === true ||
        (core.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (core.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  };

  function drop(source, target) {
    var legal = core.move(source + target + 'q');
    if (!legal) return 'snapback';
  };

  function gameUpdated(e, details) {
    board.position(details.fen);
  };

})
