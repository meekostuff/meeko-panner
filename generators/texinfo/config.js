(function() {

var _ = Meeko.stuff;
var DOM = Meeko.DOM;
var URL = Meeko.URL, baseURL = URL(document.URL);

var framesetURL = 'frameset.html'; // relative to config.js
var scope;

var genSigns = _.words('makeinfo texi2any');

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
	
		var genLink = DOM.find('meta[name$=enerator]', doc.head);
		var topLink = DOM.find('link[rel=start]', doc.head)
		if (!genLink || !_.some(genSigns, function(gen) { return genLink.content.indexOf(gen) === 0; }) || !topLink) {
			alert("This doesn't look like a supported TexInfo site. Sorry");
			return;
		}

		var topHref = baseURL.resolve(topLink.getAttribute('href'));	
		scope = URL(topHref).base; 

		return this.lookup(document.URL);
	}

});
	
})();
