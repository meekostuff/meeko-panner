(function() {

var _ = Meeko.stuff;
var DOM = Meeko.DOM;
var URL = Meeko.URL, baseURL = URL(document.URL);

var framesetURL = 'frameset.html'; // relative to config.js
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

		var topicHeader = DOM.find('#topic_header', doc);
		var topicContent = DOM.find('#topic_content', doc);

		if (!(topicHeader && topicContent)) {
			alert("This doesn't look like a supported HelpNDoc site. Sorry");
			return;
		}
	
		scope = baseURL.base;

		return this.lookup(document.URL);
	}

});

})();
