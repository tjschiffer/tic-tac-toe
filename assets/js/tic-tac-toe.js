var tic_tac_toe = (function() {
	var methods = {},
		gameOver = false;

	var getRandomInt = function(min, max) {
    	return Math.floor(Math.random() * (max - min)) + min;
	}

	var checkForWin = function(tttMap) {
		var isWin = false;

		var checkRows = function(tttMap) {
			var winningSquares = [];
			$.each(tttMap, function(index, row) {
				var mark = row[0];
				if (!mark) return true;
				winningSquares = [index.toString() + 0];
				for(var i = 1; i < row.length; i++) {
					if (row[i] != mark) return true;
					winningSquares.push(index.toString() + i.toString())
				}
				return false;
			});
			if (winningSquares.length == tttMap.length) {
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
			var transposeTttMap = tttMap[0].map(function(col, i) { 
  				return tttMap.map(function(row) { 
    				return row[i] 
  				})
			});
			var winningSquares = checkRows(transposeTttMap);
			if (winningSquares) {
				var transposeCoord = function(x) {
					return x.split('').reverse().join('');
				}
				winningSquares - winningSquares.map(transposeCoord)
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
			console.log(winningSquares);
			gameOver = true;
			return true;
		}
		return false;
	}

	var animateWin = function(winningSquares) {

	}

	methods.init = function(tttSelector, size) {
		var tttMap = [], row = [];
		for(var i = 1, j = 0; j < size; ) {
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
		$(tttSelector).click(function(e) {
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

			if (checkForWin(tttMap)) {
				return false;
			}

			var j = 8;
			while (square[lastCoord] && j--) {
				var square = tttMap, lastCoord, dataLoc = '';
				while (true) {
					var rand = getRandomInt(0, size),
						lastCoord = rand;
					dataLoc += rand.toString();
					if (square[rand] && ['X', 'O'].indexOf(square[rand]) == -1) {
						square = square[rand];
					} else {
						break;
					}
				}
			}

			if (!(square[lastCoord])) {
				square[lastCoord] = "O";
				$('.tic-tac-toe [data-ttt-loc=' + dataLoc + ']').addClass('ttt-marked-O');
			}

			if (checkForWin(tttMap)) {
				return false;
			}
		});

		//console.log(tttMap);
	}

	return methods;
})();

$( document ).ready(function(){ 
	tic_tac_toe.init('.tic-tac-toe', 3);
});