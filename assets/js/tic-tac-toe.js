/*
	This code badly needs to be refactored and DRY'ed out.
	To do:
	- Clean up logic for finding game end/win.
	- Logic for finding best move needs to be prioritized towards a win.
	- Better logic for early moves.

*/


var tic_tac_toe = (function(){
	var methods = {},
		gameOver = false;

	var getRandomInt = function(min, max){
    	return Math.floor(Math.random() * (max - min)) + min;
	}

	var transposeArray = function(tttMap){
		return tttMap[0].map(function(col, i){ 
			return tttMap.map(function(row) { 
				return row[i] 
			})
		});
	}

	var checkForWin = function(tttMap){
		var isWin = false;

		var checkRows = function(tttMap){
			var winningSquares = [];
			$.each(tttMap, function(index, row){
				var mark = row[0];
				if (!mark) return true;
				winningSquares = [index.toString() + 0];
				for(var i = 1; i < row.length; i++){
					if (row[i] != mark) return true;
					winningSquares.push(index.toString() + i.toString())
				}
				return false;
			});
			if (winningSquares.length == tttMap.length){
				return winningSquares;
			} else {
				return false;
			}
		}

		//rows
		var winningSquares = checkRows(tttMap);
		if (winningSquares) {
			isWin = true;
		}

		//columns
		if (!isWin) {
			var transposeTttMap = transposeArray(tttMap);
			var winningSquares = checkRows(transposeTttMap);
			if (winningSquares) {
				var transposeCoord = function(x) {
					return x.split('').reverse().join('');
				}
				winningSquares = winningSquares.map(transposeCoord);
				isWin = true;
			}
		}

		//diags
		if (!isWin) {
			var mark = tttMap[0][0];
			if (mark) {
				var winningSquares = ['00'];
				isWin = true;
				for(var i = 1; i < tttMap.length; i++) {
					if (tttMap[i][i] != mark) {
						isWin = false;
						break;
					}
					winningSquares.push(i.toString() + i);
				}
			}
		}
		if (!isWin) {
			var maxIndex = tttMap.length - 1, 
				mark = tttMap[maxIndex][0];
			if (mark) {
				var winningSquares = [maxIndex.toString() + 0];
				isWin = true;
				for(var i = 1; i < tttMap.length; i++) {
					if (tttMap[maxIndex - i][i] != mark) {
						isWin = false;
						break;
					}
					winningSquares.push((maxIndex - i).toString() + i);
				}
			}
		}

		if (isWin) {
			animateWin(winningSquares);
			gameOver = true;
			return true;
		}
		return false;
	}

	var animateWin = function(winningSquares) {
		$.each(winningSquares, function(i, winningSquare){
			var numberOfFlash = 3*2;
			var animateSquares = setInterval(function() {
				$('.tic-tac-toe [data-ttt-loc=\'' + winningSquare + '\'').toggleClass('ttt-marked');
				if (--numberOfFlash == 0) window.clearInterval(animateSquares);
			}, 300);
		})
	}

	var checkForBlockOrWinningMove = function(tttMap) {
		var move,
			almostWinLength = tttMap.length-1;

		var checkRowsForMove = function(tttMap){
			var move,
				isMove = false;
			$.each(tttMap, function(row, tttRow){
				var xCount = 0,
					oCount = 0;
				$.each(tttRow, function(column, square){
					if (square == 'X') {
						xCount++;
					} else if (square == 'O') {
						oCount++;
					} else {
						move = row.toString() + column;
					}
				});
				if (move && (xCount == almostWinLength || oCount == almostWinLength)) {
					isMove = true;
					return false;
				}
			});
			if (isMove) return move;
			return null;
		}

		//row
		move = checkRowsForMove(tttMap);
		
		//column
		if (!move) {
			var transposeTttMap = transposeArray(tttMap);		
			move = checkRowsForMove(transposeTttMap);
			if (move) move = move.split('').reverse().join('');
		}

		//diag
		if (!move) {
			var xCount = 0,
				oCount = 0;
			$.each(tttMap, function(index, row){
				var square = tttMap[index][index];
				if (square == 'X') {
					xCount++;
				} else if (square == 'O') {
					oCount++;
				} else {
					move = index.toString() + index;
				}
			});
			if (xCount != almostWinLength && oCount != almostWinLength) {
				move = null;
			}
		}

		if (!move) {
			var xCount = 0,
				oCount = 0,
				maxIndex = tttMap.length - 1;
			$.each(tttMap, function(index, row){
				var square = tttMap[maxIndex - index][index];
				if (square == 'X') {
					xCount++;
				} else if (square == 'O') {
					oCount++;
				} else {
					move = (maxIndex - index).toString() + index;
				}
			});
			if (xCount != almostWinLength && oCount != almostWinLength) {
				move = null;
			}
		}

		console.log(move);

		if (move) return move;
		return false;
	}

	methods.init = function(tttSelector, size){
		var tttMap = [], row = [];
		for(var i = 1, j = 0; j < size; ){
			row.push(null);
			if (i < size) {
				i++;
			} else {
				tttMap.push(row);
				row = [];
				i = 1;
				j++;
			}
		}
		$(tttSelector).click(function(e){
			if (gameOver) return false;
			var target = $(e.target),
				tttLoc = target.data('ttt-loc');
			if (!(tttLoc)) return false;
			loc = tttLoc.toString().split('');
			if (target.prop('class').indexOf('ttt-marked-') > -1) return;
			var square = tttMap, lastCoord;
			$.each(loc, function(i, coord) {
				if (square[coord]) square = square[coord];
				lastCoord = coord;
			});
			square[lastCoord] = 'X';
			target.addClass('ttt-marked-X');

			if (checkForWin(tttMap)){
				return false;
			}


			move = checkForBlockOrWinningMove(tttMap);

			if (!move) {
				moves = ['11', '00', '22', '21', '10']
				$.each(moves, function(index, _move){
					var coord = _move.split('');
					if (!tttMap[coord[0]][coord[1]]) {
						move = _move;
						return false;
					}
				});
			}

			if (!move) {
				gameOver = true;
				return false;
			}

			coord = move.split('');
			tttMap[coord[0]][coord[1]] = 'O';
			$('.tic-tac-toe [data-ttt-loc=' + move + ']').addClass('ttt-marked-O');

			if (checkForWin(tttMap)){
				return false;
			}
		});

	}

	return methods;
})();

$( document ).ready(function(){ 
	tic_tac_toe.init('.tic-tac-toe', 3);
});