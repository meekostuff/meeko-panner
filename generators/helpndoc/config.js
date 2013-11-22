(function() {

var _ = Meeko.stuff, forEach = _.forEach;
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
	
		if (document.readyState == "complete") { // if invoked as JS bookmarklet
			var topicHeader = $('#topic_header', doc);
			var topicContent = $('#topic_content', doc);

			if (!(topicHeader && topicContent)) {
				alert("This doesn't look like a supported HelpNDoc site. Sorry");
				return;
			}
		}
		
		baseURL = URL(document.URL).base;
	
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
		forEach($$("script", doc), function(el) { el.parentNode.removeChild(el); })
		forEach($$("link", doc), function(el) { if (/stylesheet/i.test(el.rel)) el.parentNode.removeChild(el); })
//		forEach($$("style", doc), function(el) { el.parentNode.removeChild(el); })

		var content = doc.createElement('div');
		content.id = "mk_topic";
		var node;
		while (node = doc.body.firstChild) content.appendChild(node);
		doc.body.appendChild(content);
	}
});

	
})();
