// FIXME a lot of this code is copied from HTMLDecor/boot.js. Can we just source that instead??

(function() {

var defaults = { // NOTE defaults also define the type of the associated config option
//	"htmldecor_script": '{bootscriptdir}HTMLDecor.js', FIXME
	"log_level": "warn",
	"hidden_timeout": 5000, // TODO for some reason this needs to be longer to avaid FOUC
	"polling_interval": 50, // TODO
//	"html5_block_elements": 'article aside figcaption figure footer header hgroup main nav section', NOT NEEDED
//	"html5_inline_elements": 'abbr mark', NOT NEEDED
//	"config_script": '' FIXME
}

if (!history.pushState) {
	alert('meeko-panner cannot run: \n\nThis browser doesn\'t support `history.pushState()`');
	return;
}

var decorBase = window.decorBase || 'https://d3g4qkktqnw71.cloudfront.net/meeko-panner/';
var sitesBase = decorBase + 'sites/';

var Meeko = window.Meeko || (window.Meeko = {});

/*
 ### JS utilities
 */
var some = function(a, fn, context) { // some() is forEach() if fn() always returns falsish
	for (var n=a.length, i=0; i<n; i++) {
		if (fn.call(context, a[i], i, a)) return true; 
	}
	return false;
}

var words = function(text) { return text.split(/\s+/); }

function urlPath(url) {
	var a = document.createElement("a");
	a.href = url;
	return (a.pathname + a.search);
}

/*
 ### logger defn and init
 */
var logger = Meeko.logger = new function() {

var levels = this.levels = words("none error warn info debug");

some(levels, function(name, num) {

levels[name] = num;
this[name] = function() { this._log({ level: num, message: arguments }); }

}, this);

this._log = function(data) { 
	if (data.level > this.LOG_LEVEL) return;
	data.timeStamp = +(new Date);
        data.message = [].join.call(data.message, " ");
        if (this.write) this.write(data);
}

this.startTime = +(new Date), padding = "      ";

this.write = (window.console) && function(data) { 
	var offset = padding + (data.timeStamp - this.startTime), 
		first = offset.length-padding.length-1,
		offset = offset.substring(first);
	console.log(offset+"ms " + levels[data.level]+": " + data.message); 
}

this.LOG_LEVEL = levels[defaults['log_level']]; // DEFAULT. Options are read later

} // end logger defn

/*
 ### async functions
 */

function delay(callback, timeout) {
	return window.setTimeout(callback, timeout);
}

var queue = (function() {

var head = document.head; // TODO is there always a <head>?
var marker = head.firstChild;

function prepareScript(url, onload, onerror) {
	var script = document.createElement('script');
	script.onerror = onerror;
	var loaded = false;
	if (script.readyState) script.onreadystatechange = function() {
		if (loaded) return;
		if (!script.parentNode) return; // onreadystatechange will always fire after insertion, but can fire before which messes up the queue
		if (script.readyState != "loaded" && script.readyState != "complete") return;
		loaded = true;
		onload();
	}
	else script.onload = onload;
	script.src = url;
	
	if (script.async == true) {
		script.async = false;
		marker.parentNode.insertBefore(script, marker);
	}
	return script;
}

function enableScript(script) {
	if (script.parentNode) return;
	marker.parentNode.insertBefore(script, marker);
}

function disableScript(script) {
	if (!script.parentNode) return;
	script.parentNode.removeChild(script);
}

function queue(fnList, oncomplete, onerror) {
	var list = [];
	some(fnList, function(fn) {
		switch(typeof fn) {
		case "string":
			list.push(prepareScript(fn, queueback, errorback));
			break;
		case "function":
			list.push(fn);
			break;
		default: // TODO
			break;
		}
	});
	queueback();

	function errorback(err) {
		logger.error(err);
		var fn;
		while (fn = list.shift()) {
			if (typeof fn == 'function') continue;
			// NOTE the only other option is a prepared script
			disableScript(fn);
		}
		if (onerror) onerror(err);
	}

	function queueback() {
		var fn;
		while (fn = list.shift()) {
			if (typeof fn == "function") {
				try { fn(); continue; }
				catch(err) { errorback(err); return; }
			}
			else { // NOTE the only other option is a prepared script
				enableScript(fn);
				return;
			}
		}
		if (oncomplete) oncomplete();
		return;
	}
}

return queue;

})();

/*
 ### Viewport hide / unhide
 */
var Viewport = (function() {

var head = document.head;
var fragment = document.createDocumentFragment();
var style = document.createElement("style");
fragment.appendChild(style); // NOTE on IE this realizes style.styleSheet 

// NOTE hide the page until the decor is ready
if (style.styleSheet) style.styleSheet.cssText = "body { visibility: hidden; }";
else style.textContent = "body { visibility: hidden; }";

function hide() {
	head.insertBefore(style, head.firstChild);
}

function unhide() {
	var pollingInterval = defaults['polling_interval'];
	if (style.parentNode != head) return;
	head.removeChild(style);
	// NOTE on IE sometimes content stays hidden although 
	// the stylesheet has been removed.
	// The following forces the content to be revealed
	document.body.style.visibility = "hidden";
	delay(function() { document.body.style.visibility = ""; }, pollingInterval);
}

return {
	hide: hide,
	unhide: unhide
}

})();

/* now the patching to make HTMLDecor behave as we need */

function preconfig() { // this is called **before** the site-specific config.js

var _ = Meeko.stuff, extend = _.extend, each = _.each, forEach = _.forEach, words = _.words,
	decor = Meeko.decor, panner = Meeko.panner,
	DOM = Meeko.DOM;
	
var	$id = DOM.$id;
var $ = DOM.$ = function(selector, context) { if (!context) context = document; return context.querySelector(selector); }
var $$ = DOM.$$ = function(selector, context) { if (!context) context = document; return [].slice.call(context.querySelectorAll(selector), 0); }

Meeko.Async.pollingInterval = defaults["polling_interval"];
decor.config({
	decorReady: Viewport.unhide,
});

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
	
var	$id = DOM.$id;
var $ = DOM.$ = function(selector, context) { if (!context) context = document; return context.querySelector(selector); }
var $$ = DOM.$$ = function(selector, context) { if (!context) context = document; return [].slice.call(context.querySelectorAll(selector), 0); }


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

var lookup = decor.options.lookup;
decor.options.lookup = function(url) {
	var decorURL = lookup(url);
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
	
	return sitesBase + location.hostname + '/' + decorURL;
}

/*
 Override form submission
 */
document.addEventListener("submit", onSubmit, false);
function onSubmit(e) {
	e.preventDefault();
	var form = e.target;
	var data = [];
	forEach(form.elements, function(el) {
		data.push(el.name + '=' + encodeURIComponent(el.value));
	});
	var msg = data.join('&');
	if (form.method == 'get') decor.navigate(form.action + '?' + msg);
	else {
		var rq = new XMLHttpRequest;
		rq.open(form.method, form.action, true);
		rq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		rq.send(msg);
	}
}

} // end postconfig()


function start() {
/* FIXME
	var options = Meeko.decor.options;
	if (!options.views) {
		alert("A valid panner configuration for this site could not be loaded.");
		return false;
	}
	if (!options.detectView || !options.detectView(urlPath(document.URL))) {
		alert("There is no decor for this page in the panner configuration for this site.");
		return false;
	}
*/
	document.body.style.visibility = "hidden";
	Meeko.decor.start();
	delay(function() {
		document.body.style.visibility = "";
	});
}

/*
 ## Startup
*/

var log_index = logger.levels[defaults["log_level"]];
if (log_index != null) logger.LOG_LEVEL = log_index;

var timeout = defaults["hidden_timeout"];
if (timeout > 0) {
	Viewport.hide();
	delay(Viewport.unhide, timeout);
}


queue([
	decorBase + 'HTMLDecor/HTMLDecor.js',
	preconfig,
	sitesBase + location.hostname + '/' + 'config.js',
	postconfig,
	start
]);


})();
