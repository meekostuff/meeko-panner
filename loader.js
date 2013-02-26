
(function() {

if (!history.pushState) {
	alert('meeko-panner cannot run: \n\nThis browser doesn\'t support `history.pushState()`');
	return;
}

var decorBase = window.decorBase || 'https://d3g4qkktqnw71.cloudfront.net/meeko-panner/';

var Meeko = window.Meeko || (window.Meeko = {});
Meeko.config = {
	"decor-autostart": false
}

/* some functions for scheduling / loading scripts */
function urlPath(url) {
	var a = document.createElement("a");
	a.href = url;
	return (a.pathname + a.search);
}

function loadScript(url, onload, onerror) {
	var script = document.createElement('script');
	script.src = url;
	script.onload = onload;
	script.onerror = onerror;
	document.body.appendChild(script);
}

function queue(fnList, callback) {
	var list = [].concat(fnList);
	var queueback = function() {
		var fn = list.shift();
		if (fn) fn(queueback);
		else if (callback) callback();
	}
	queueback();
}

function delay(callback, timeout) {
	window.setTimeout(callback, timeout);
}

/* now do start-up */

queue([
	function(oncomplete, onerror) { loadScript(decorBase + 'HTMLDecor/HTMLDecor.js', oncomplete, oncomplete); }, // FIXME onerror handling
	init,
	function(oncomplete, onerror) { loadScript(decorBase + 'sites/' + location.hostname + '/' + 'config.js', oncomplete, oncomplete); },
	start
]);

function init(callback) {

var decor = Meeko.decor, stuff = Meeko.stuff, DOM = Meeko.DOM, 
	extend = stuff.extend, each = stuff.each, forEach = stuff.forEach, words = stuff.words, 
	Callback = Meeko.Callback, async = Callback.async;
	
var	$id = DOM.$id;
var $ = DOM.$ = function(selector, context) { if (!context) context = document; return context.querySelector(selector); }
var $$ = DOM.$$ = function(selector, context) { if (!context) context = document; return [].slice.call(context.querySelectorAll(selector), 0); }

var panner = Meeko.panner = {}
var options = Meeko.panner.options = {}
var pageCache = {};


function getView(path) {
	return options.views[options.detectView(path)];
}

function preprocess(doc, path) {
	var view = getView(path);
	view.preprocess(doc, path);
	setDecor(doc, decorBase + 'sites/' + location.hostname + '/' + view.decor);
	return doc;
}

function setDecor(doc, url) {
	var link = doc.createElement("link");
	link.rel = "meeko-decor";
	link.type = "text/html";
	link.href =  url;
	doc.head.appendChild(link);	
}

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


extend(panner, {

getView: getView,
preprocess: preprocess,
setDecor: setDecor,
cloneDocument: cloneDocument,
setActiveStylesheet: setActiveStylesheet,

});

/*
 Over-ride decor loader to rebase URIs:
	base-uri:{path}
 is rewritten with `path` being relative to the current `document.URL`.
 Usually `path` should be an absolute path, i.e. starts with `/`.
 */
	
decor.load = async(function(url, cb) {
	DOM.loadHTML(url, function(doc) {
		rebase(doc);
		cb.complete(doc);
	});
});

function rebase(doc) {
	
	function normalize(tag, attrName) {
		forEach($$(tag, doc), function(el) {
			var relURI = el.getAttribute(attrName);
			if (relURI == null) return;
			var uri = rebaseURI(relURI);
			if (uri != relURI) el[attrName] = uri;
		});
	}
	each(uriAttrs, normalize);

}

function rebaseURI(uri) {
	var pathname = uri.replace(/^base-uri:/, '');
	if (pathname == uri) return uri;
	var link = document.createElement("a");
	link.href = pathname;
	return link.pathname;
}

var uriAttrs = {};
forEach(words("link@href a@href script@src img@src iframe@src video@src audio@src source@src form@action input@formaction button@formaction"), function(text) {
	var m = text.split("@"), tag = m[0], attrName = m[1];
	uriAttrs[tag] = attrName;
});

/*
 Over-ride url loader to allow javascript caching of pages
*/

decor.options.load = async(function(url, cb) {
  var pathname = urlPath(url);
  var doc = pageCache[pathname];
  if (doc) return cloneDocument(doc);
  DOM.loadHTML(url, function(doc) {
	preprocess(doc, pathname);
	pageCache[pathname] = cloneDocument(doc);
	cb.complete(doc);
  });
});


var oldURL = '';

// Override default HTMLDecor page nav to implement newURL, oldURL
// FIXME pageIn handlers should already receive these
decor.onSiteLink = function(url) {
	var oldURL = document.URL;
	if (url == oldURL) return false;
	var oldView = options.detectView(urlPath(oldURL));
	var view = options.detectView(urlPath(url));
	if (!view) {
		alert("The page you are navigating to does not have a corresponding decor in the panner configuration for this site.");
		return true;
	}
	if (view != oldView) {
		alert("The page you are navigating to has a different decor to that of the current page.\nYou will need to reactivate meeko-panner after the page has loaded.");
		return true;
	}
	decor.navigate(url);
	return false;
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

callback();
} // end init()


function start(callback) {
	var options = Meeko.panner.options;
	if (!options.views) {
		alert("A valid panner configuration for this site could not be loaded.");
		return false;
	}
	if (!options.detectView || !options.detectView(urlPath(document.URL))) {
		alert("There is no decor for this page in the panner configuration for this site.");
		return false;
	}
	document.body.style.visibility = "hidden";
	Meeko.panner.preprocess(document, urlPath(document.URL));
	Meeko.decor.start();
	delay(function() {
		document.body.style.visibility = "";
		callback();
	}, 0);
}

})();
