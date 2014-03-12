(function() {

var DOM = Meeko.DOM, $ = DOM.$, $$ = DOM.$$, $id = DOM.$id;
var URL = DOM.URL;

var decorURL = 'decor.html';
var baseURL;

Meeko.decor.config({
	lookup: function(url) {
		if (!baseURL) return; // first time

		// FIXME better notification for leaving doc-set
		if (url.indexOf(baseURL) !== 0) return; 
		return decorURL;
	},
	
	detect: function(doc) {
		if (baseURL) return; // shouldn't be needed. lookup() will be valid
	
		var homeButton = $('span#sync-toc > a', doc);
	
		if (!homeButton) {
			alert("This doesn't look like a supported Help And Manual site. Sorry");
			return;
		}
	
		var docURL = URL(document.URL);
		var homeHref = docURL.resolve(homeButton.getAttribute('href'));
		baseURL = URL(homeHref).base;
	
		return decorURL;
	},
	
	normalize: function(doc) {
		Meeko.decor.rebase(doc, baseURL);
	}

});

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

	
})();
