(function() {

var _ = Meeko.stuff;
var DOM = Meeko.DOM;
var URL = Meeko.URL;

var framesetURL = "frameset.html"; // relative to config.js
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
	
		var homeButton = DOM.find('div#header > div#navigationContainer a.button', doc);
	
		if (!(homeButton && /Home/.test(homeButton.textContent || homeButton.innerText))) {
			alert("This doesn't look like a supported Flare Mobile WebHelp site. Sorry");
			return;
		}
	
		var docURL = URL(document.URL);
		var homeHref = docURL.resolve(homeButton.getAttribute('href'));
		scope = URL(homeHref).base;
	
		return this.lookup(document.URL);
	}

});
	
})();
