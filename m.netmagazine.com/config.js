(function() {

var DOM = Meeko.DOM, $ = DOM.$, $$ = DOM.$$;

Meeko.stuff.extend(Meeko.panner.options, {
	detectView: function(path) {
		return "default";
	},
	views: {
		"default": {
			decor: "decor.html",
			preprocess: function(doc, path) {
				$$('link[rel=stylesheet]', doc).forEach(function(node) { node.parentNode.removeChild(node); })
				$$('script', doc).forEach(function(node) { node.parentNode.removeChild(node); });
				$$('a[href]', doc).forEach(function(node) { if (node.hostname == 'www.netmagazine.com') node.setAttribute('href', node.pathname + node.hash); });
				$$('.bodyCopy', doc).forEach(function(node) { node.className = 'copy'; });
				$$('.synopsis', doc).forEach(function(node) { node.className = 'strapline'; });
				$$('article', doc).forEach(function(node) { node.className = 'node'; });
				$$('.listingResultsWrapper > h2', doc).forEach(function(node) { node.parentNode.removeChild(node); });
				$$('.listingResultsWrapper > a.viewMore', doc).forEach(function(node) { node.parentNode.removeChild(node); });
				var content = $("#content", doc);
				content.parentNode.removeChild(content);
				doc.body.innerHTML = "";
				doc.body.appendChild(content);
			}
		}
	}
});

	
})();