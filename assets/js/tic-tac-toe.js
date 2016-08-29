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
			if (target.attr('class').indexOf('ttt-marked-') > -1) return;
			var square = tttMap, lastCoord;
			$.each(loc, function(i, coord) {
				if (square[coord]) square = square[coord];
				lastCoord = coord;
			});
			square[lastCoord] = 'X';
			target.addClass('ttt-marked-X');

			var square = tttMap, lastCoord, j = 9, dataLoc = '';
			while (j--) {
				var rand = getRandomInt(0, size);
				dataLoc += rand.toString();
				if (square[rand]) {
					square = square[rand];
					lastCoord = rand;
				} else {
					break;
				}
			}
			if (!(square[lastCoord])) {
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