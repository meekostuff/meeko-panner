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
	
		if (window.frames['classFrame']) {
			alert('This looks like the FRAMES view of a javadoc site. Please switch to the NO FRAMES view and restart javadoc-panner');
			return;
		}
	
		var overviewLI = DOM.find('div.topNav > ul.navList[title=Navigation] > li', doc);
		var noframesLI = DOM.find('div.subNav > ul.navList + ul.navList > li + li', doc);
	
		if (!(overviewLI && /Overview/.test(overviewLI.textContent) && noframesLI && /No\s*Frames/.test(noframesLI.textContent))) {
			alert("This doesn't look like a supported javadoc site. Sorry");
			return;
		}
	
		var overviewHyperlink = DOM.find('a[href]', overviewLI) || DOM.find('a[href]', noframesLI);
		var overviewHref = baseURL.resolve(overviewHyperlink.getAttribute('href'));	
		scope = URL(overviewHref).base; // NOTE `basedir` needed for decor rebase()

		return this.lookup(document.URL);
	}

});

})();
