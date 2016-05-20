
(function() {

var Meeko = window.Meeko || (window.Meeko = {});

var isBookmarklet = !!document.body;

if (isBookmarklet && !history.pushState) {
	var msg = 'meeko-panner bookmarklet cannot run: \n\nThis browser doesn\'t support `history.pushState()`';
	alert(msg);
	throw msg;
}

/* now the patching to make HyperFrameset behave as we need */

Meeko.bootConfig = function() {
	var bootScript = Meeko.bootScript, bootParams = Meeko.bootParams;
	var generator = bootScript.getAttribute('data-generator');
	var configdir = 
		bootScript.getAttribute('data-configdir') ||
		generator && '{bootscriptdir}/generators/' + generator + '/' ||
		'{bootscriptdir}/sites/' + location.hostname + '/';
	bootParams['configdir'] = configdir.replace('{bootscriptdir}', bootParams['bootscriptdir']);
}

function preconfig() { // this is called **before** the site-specific config.js

var _ = Meeko.stuff,
	framer = Meeko.framer,
	DOM = Meeko.DOM;

function setActiveStylesheet(title) { // see http://www.alistapart.com/articles/alternate/
	function able(node) {
		node.disabled = true;
		if (node.title == title) node.disabled = false;
	}
	_.forEach(DOM.findAll("link"), function(node) {
		if (!/\bstylesheet\b/.test(node.rel)) return;
		if (!node.title) return;
		able(node);
	});
	_.forEach(DOM.findAll("style"), function(node) {
		if (!node.title) return;
		able(node);
	});
}

_.defaults(framer, {

setActiveStylesheet: setActiveStylesheet

});


} // end preconfig


function postconfig() {

var _ = Meeko.stuff,
	framer = Meeko.framer,
	DOM = Meeko.DOM, URL = Meeko.URL;
	
var configdir = Meeko.bootParams['configdir'];

framer.options._lookup = framer.options.lookup;
framer.options.lookup = function(url) {
	if (!framer.options._lookup) return;
	var result = framer.options._lookup(url);

/* FIXME
	if (!framesetURL) {
		alert("The page you are navigating to does not have a corresponding frameset in the panner configuration for this site.");
		return true;
	}
	if (framesetURL != framer.currentURL) {
		alert("The page you are navigating to has a different frameset to that of the current page.\nYou will need to reactivate meeko-panner after the page has loaded.");
		return true;
	}
*/
	
	if (!result) return;
	if (result.framesetURL.indexOf(configdir) !== 0) result.framesetURL = configdir + result.framesetURL;
	return result;
}

framer.options._detect = framer.options.detect;
framer.options.detect = function(doc) { // NOTE only called on landing page
	if (!framer.options._detect) return;
	var result = framer.options._detect(doc);
	if (!result) return;
	if (result.framesetURL.indexOf(configdir) !== 0) result.framesetURL = configdir + result.framesetURL;
	return result;
}

/*
 Override forms
 TODO currently only handles POST
 FIXME assumes success
 */
document.addEventListener("submit", onSubmit, false);
function onSubmit(e) {
	var form = e.target;
	var method = _.lc(form.method);
	if (method != 'post') return;
	e.preventDefault();
	var data = [];
	_.forEach(form.elements, function(el) {
		data.push(el.name + '=' + encodeURIComponent(el.value));
	});
	var msg = data.join('&');
	var rq = new XMLHttpRequest;
	rq.open(form.method, form.action, true);
	rq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	rq.send(msg);
}

} // end postconfig()


/*
 ## Startup
*/

/* START HyperFrameset boot options */

Meeko.options = {
	"main_script": '{bootscriptdir}HyperFrameset/HyperFrameset.js',
	"capturing": !isBookmarklet, // NOTE will break on IE <= 7
	"log_level": "warn",
	"hidden_timeout": 0, // TODO for some reason this needs to be longer to avaid FOUC
	"config_script": [
		preconfig,
		'{configdir}config.js',
		postconfig
	]
}

})();

/* END HyperFrameset boot options */
