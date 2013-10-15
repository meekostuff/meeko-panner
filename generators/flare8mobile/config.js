(function() {

var DOM = Meeko.DOM, $ = DOM.$, $$ = DOM.$$, $id = DOM.$id;
var URL = DOM.URL;

var decorURL = "decor.html"; // relative to config.js
var flareBase;

Meeko.decor.config({
	lookup: function(url) {
		if (!flareBase) return; // first time

		// FIXME better notification for leaving doc-set
		if (url.indexOf(flareBase) !== 0) return; 
		return decorURL;
	},
	
	detect: function(doc) {
		if (flareBase) return; // shouldn't be needed. lookup() will be valid
	
		var homeButton = $('div#header > div#navigationContainer a.button');
	
		if (!(homeButton && /Home/.test(homeButton.textContent))) {
			alert("This doesn't look like a supported Flare Mobile WebHelp site. Sorry");
			return;
		}
	
		var homeURL = URL(homeButton.href);
		flareBase = homeURL.base;
	
		return decorURL;
	},
	
	normalize: function(doc) {
		Meeko.decor.rebase(doc, flareBase);
	}

});

Meeko.panner.config({
	normalize: function(doc, details) {
		var oURL = URL(details.url);
		var path = oURL.pathname;
		$$("script", doc).forEach(function(el) { el.parentNode.removeChild(el); })
		$$("link", doc).forEach(function(el) { if (/stylesheet/i.test(el.rel)) el.parentNode.removeChild(el); })

		var html = $('html', doc); html.className = "left-layout";
		
		var breadcrumbs = $('.MCBreadcrumbsBox_Mobile_0', doc); if (breadcrumbs) breadcrumbs.className = "MCBreadcrumbsBox_0";

		var content = doc.createElement('div');
		content.id = "topic";
		content.className = 'content';
		
		var node, topicBody = $('.MCTopicBody', doc);
		while (node = topicBody.firstChild) content.appendChild(node);
		doc.body.innerHTML = '';
		doc.body.appendChild(content);
	}
});

	
})();
