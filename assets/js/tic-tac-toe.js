var tic_tac_toe = (function() {
	var methods = {};

	var getRandomInt = function(min, max) {
    	return Math.floor(Math.random() * (max - min)) + min;
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
			var target = $(e.target);
				loc = target.data('ttt-loc').toString().split('');
			if (target.prop('class').indexOf('ttt-marked-') > -1) return;
			var square = tttMap, lastCoord;
			$.each(loc, function(i, coord) {
				if (square[coord]) square = square[coord];
				lastCoord = coord;
			});
			square[lastCoord] = 'X';
			target.addClass('ttt-marked-X');

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
		});

		//console.log(tttMap);
	}

	return methods;
})();

$( document ).ready(function(){ 
	tic_tac_toe.init('.tic-tac-toe', 3);
});