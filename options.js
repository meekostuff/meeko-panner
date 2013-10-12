
(function() {

var Meeko = window.Meeko || (window.Meeko = {});

if (!history.pushState) {
	var msg = 'meeko-panner cannot run: \n\nThis browser doesn\'t support `history.pushState()`';
	alert(msg);
	throw msg;
}

// NOTE configDir = '{bootscriptdir}sites/{hostname}/config/';

/* now the patching to make HTMLDecor behave as we need */

function preconfig() { // this is called **before** the site-specific config.js

var _ = Meeko.stuff, extend = _.extend, each = _.each, forEach = _.forEach, words = _.words,
	decor = Meeko.decor, panner = Meeko.panner,
	DOM = Meeko.DOM;
	
var	$id = DOM.$id;
var $ = DOM.$ = function(selector, context) { if (!context) context = document; return context.querySelector(selector); }
var $$ = DOM.$$ = function(selector, context) { if (!context) context = document; return [].slice.call(context.querySelectorAll(selector), 0); }

function cloneDocument(doc) {
	var clone = document.implementation.createHTMLDocument("");
	clone.removeChild(clone.documentElement);
	clone.appendChild(doc.documentElement.cloneNode(true));
	return clone;
}

function setActiveStylesheet(title) { // see http://www.alistapart.com/articles/alternate/
	function able(node) {
		node.disabled = true;
		if (node.title == title) node.disabled = false;
	}
	forEach($$("link"), function(node) {
		if (!/\bstylesheet\b/.test(node.rel)) return;
		if (!node.title) return;
		able(node);
	});
	forEach($$("style"), function(node) {
		if (!node.title) return;
		able(node);
	});
}

function domReady(fn) {
	setTimeout(fn);
}

if (document.readyState === 'complete') DOM.ready = domReady;

extend(DOM, {

cloneDocument: cloneDocument

});

extend(decor, {

setActiveStylesheet: setActiveStylesheet

});


} // end preconfig


function postconfig() {

var _ = Meeko.stuff, extend = _.extend, each = _.each, forEach = _.forEach, words = _.words,
	decor = Meeko.decor, panner = Meeko.panner,
	DOM = Meeko.DOM, URL = DOM.URL;
	
var	$id = DOM.$id, $ = DOM.$, $$ = DOM.$$;

var configDir = Meeko.bootScript.src.replace(/\/[^\/]*$/, '/') + 'sites/' + location.hostname + '/';

/*
 Over-ride decor loader to rebase URIs:
	base-uri:{path}
 is rewritten with `path` being relative to the current `document.URL`.
 Usually `path` should be an absolute path, i.e. starts with `/`.
 */

var decor_normalize = decor.options.normalize;
decor.options.normalize = function(doc, settings) { // FIXME what about URI params!?
	rebase(doc);
	if (decor_normalize) decor_normalize(doc, settings);
}

function rebase(doc) {
	
	function normalize(tag, attrName) {
		forEach($$(tag, doc), function(el) {
			var relURL = el.getAttribute(attrName);
			if (relURL == null) return;
			var url = rebaseURL(relURL);
			if (url != relURL) el[attrName] = url;
		});
	}
	each(urlAttrs, normalize);

}

function rebaseURL(url) {
	var relURL = url.replace(/^base-ur[il]:/, '');
	if (relURL == url) return url;
	return URL(document.URL).resolve(relURL);
}

var urlAttrs = {};
forEach(words("link@href a@href script@src img@src iframe@src video@src audio@src source@src form@action input@formaction button@formaction"), function(text) {
	var m = text.split("@"), tag = m[0], attrName = m[1];
	urlAttrs[tag] = attrName;
});

/*
 Over-ride url loader to allow javascript caching of pages
*/

/*
var pageCache = {};

panner.options.request = function(method, url, data, details, cb) {
  var pathname = urlPath(url);
  var doc = pageCache[pathname];
  if (doc) return cloneDocument(doc);
  panner.options._httpGet(url, data, settings, function(doc) {
	preprocess(doc, pathname);
	pageCache[pathname] = cloneDocument(doc);
	cb.complete(doc);
  });
}
*/

var decor_lookup = decor.options.lookup;
decor.options.lookup = function(url) {
	var decorURL = decor_lookup(url);

/* FIXME
	if (!decorURL) {
		alert("The page you are navigating to does not have a corresponding decor in the panner configuration for this site.");
		return true;
	}
	if (decorURL != decor.current.url) {
		alert("The page you are navigating to has a different decor to that of the current page.\nYou will need to reactivate meeko-panner after the page has loaded.");
		return true;
	}
*/
	
	return configDir + decorURL;
}

var decor_detect = decor.options.detect;
decor.options.detect = function(doc) { // NOTE only called on landing page
	var decorURL = decor_detect(doc);
	return configDir + decorURL;
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
	forEach(form.elements, function(el) {
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

Meeko.options = {
	"htmldecor_script": '{bootscriptdir}HTMLDecor/HTMLDecor.js',
	"log_level": "warn",
	"hidden_timeout": 5000, // TODO for some reason this needs to be longer to avaid FOUC
	"polling_interval": 50, // TODO
	"config_script": [
		preconfig,
		'{bootscriptdir}sites/' + location.hostname + '/' + 'config.js',
		postconfig
	]
}

})();