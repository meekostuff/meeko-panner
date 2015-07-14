(function() {

var framesetURL = 'frameset.html';
var scope = Meeko.bootParams['bootscriptdir'];

Meeko.framer.config({
	lookup: function(url) {
		// FIXME better notification for leaving doc-set
		if (url.indexOf(scope) !== 0) return; 
		return {
			framesetURL: framesetURL,
			scope: scope
		}
	}
});

	
})();
