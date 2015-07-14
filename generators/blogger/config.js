(function() {

var _ = Meeko.stuff, forEach = _.forEach;
var DOM = Meeko.DOM;
var URL = Meeko.URL;

var framesetURL = 'frameset.html';
var scope;

Meeko.framer.config({
	lookup: function(url) {
		if (!scope) return; // first time

		// FIXME better notification for leaving doc-set
		if (url.indexOf(scope) !== 0) return; 
		return {
			framesetURL: framesetURL,
			scope: scope
		}
	},
	
	detect: function(doc) {
		if (scope) return this.lookup(document.URL); // shouldn't be needed. lookup() will be valid
	
		var home = DOM.find('header h1 a', doc);

		if (!(home)) {
				alert("This doesn't look like a supported Blogger site. Sorry");
				return;
		}
		
		var homeHref = URL(document.URL).resolve(home.getAttribute('href'));
		scope = URL(homeHref).base;
	
		return this.lookup(document.URL);
	}

});

	
})();
