require(['core', 'board', 'lib/jquery', 'lib/domReady'], function(core, board) {

  $(window).on('gameUpdate', gameUpdated);

  $('#pick-side a').click(function(ev) {
    if (ev.target.id.split('-')[1] === 'white') {
      core.start('player', 'stockfish');
      board.orientation('white');
    } else {
      core.start('stockfish', 'player');
      board.orientation('black');
    }
  });

  function gameUpdated(e, details) {
    $('#status').text(details.status);
    writeLog(core.game.history());
  }

  function writeLog(history) {
    var i, lineNum, log = "";
    for (i = 0; i < history.length; i++) {
      var move = history[i];
      if (i % 2 === 0) {
        lineNum = i / 2 + 1;
        if (lineNum !== 1) log += "\n";
        if (lineNum < 10) log += "  ";
        if (lineNum >= 10 && i < 100) log += " ";
        log += lineNum;
        log += ".";
      }
      log += "\t";
      log += move;
    }

    $('#log').html(log);
  }

});
