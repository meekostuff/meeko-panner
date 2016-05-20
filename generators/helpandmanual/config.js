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
	
		var homeButton = DOM.find('p.sync-toc > a', doc);
	
		if (!homeButton) {
			alert("This doesn't look like a supported Help And Manual site. Sorry");
			return;
		}
	
		var docURL = URL(document.URL);
		var homeHref = docURL.resolve(homeButton.getAttribute('href'));
		scope = URL(homeHref).base;

		return this.lookup(document.URL);
	}

});

/*

Meeko.panner.config({
	normalize: function(doc, details) {
		var oURL = URL(details.url);
		var path = oURL.pathname;
		$$("script", doc).forEach(function(el) { el.parentNode.removeChild(el); })
		$$("link", doc).forEach(function(el) { if (/stylesheet/i.test(el.rel)) el.parentNode.removeChild(el); })
		$$("style", doc).forEach(function(el) { if (/screen/i.test(el.media)) el.parentNode.removeChild(el); })
		var el = $id("printheader", doc); el.parentNode.removeChild(el);
		var el = $id("sync-toc", doc); el.parentNode.removeChild(el);

		var content = doc.createElement('div');
		content.id = "hmcontent";
		var node;
		while (node = doc.body.firstChild) content.appendChild(node);
		doc.body.appendChild(content);
	}
});

*/

})();
