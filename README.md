meeko-panner
=============

**meeko-panner** is a javascript bookmarklet that can enhance a site with 
support for `pushState`-assisted-navigation (panning)
and, optionally, a richer UI. 

The intention is to demonstrate the simplicity and flexibility of
a [content first](http://adactio.com/journal/4523/) approach for web-sites.

**meeko-panner** extracts only the essential content of each page and 
uses [HTMLDecor](http://github.com/shogun70/HTMLDecor) to 
decorate it with shared site decor -
banner, navigation, auxilliary content, styles and layout.
In general this is used to emulate the original appearance and behavior of the site,
except with panning support. 
Another scenario is that a mobile site is enhanced with the appearance of the standard site. 
I consider it obvious that this approach would have better performance and flexibility
if integrated into a site rather than being implemented as a JS bookmarklet. 


Requirements
------------

You need a browser with javascript support enabled. <script type="text/javascript">document.write("Your browser DOES")</script><noscript>Your browser DOES NOT</noscript>  

You need a browser that implements `history.pushState()`. <script type="text/javascript">document.write("Your browser ", !!history.pushState ? "DOES" : "DOES NOT")</script><br />

<b>NOTE:</b> HTMLDecor doesn't require `pushState` if integrated into a site,
but to use it in a bookmarklet would require the bookmarklet to be run on every page. 

The following browsers have been tested:

- Chrome 23
- Safari 5.1 / Webkit nightlies
- Firefox 17

IE10 supports `pushState` but has not been tested.


Installation
------------

*Be sure to read the **Notes and Warnings** section*

1. Drag the
<a title="meeko-panner" href="javascript:var decorBase = (location.protocol == 'https:') ? 'https://d3g4qkktqnw71.cloudfront.net/meeko-panner/' : 'http://dist.meekostuff.net/meeko-panner/'; var script=document.createElement('script'); script.src=decorBase + 'loader.js'; document.getElementsByTagName('head')[0].appendChild(script); void(0);">
meeko-panner</a> bookmarklet to your bookmark bar.

2. Go to a supported site. 

3. Click on the meeko-panner bookmarklet you just installed. 


Supported sites
---------------

*Not every site listed here is fully supported. You should read the **details** for each site before using the bookmarklet*

### Frameset sites

- [docs.oracle.com](http://docs.oracle.com) (<small>[details](docs.oracle.com/)</small>)

These sites typically have primary content in a frame, with banner, navigation, etc
in the top window or in other frames of a frameset.

This site design is actually a good indication that the desire for
a content-first approach has been around for a long time.
The downfall of doing this with framesets is the lack of flexibility
with regards to layout and, especially, the inability to easily bookmark individual pages. 

**meeko-panner** allows these sites to be bookmarkable by assuming the
primary content is in the top window and adding the banner and navigation
into the same window with AJAX. 

<b>ASIDE:</b> [@westonruter](http://twitter.com/westonruter) [tweeted](https://twitter.com/westonruter/status/197650657501659137)
the idea of making frameset style sites bookmarkable with HTML5 `pushState`,
which was (one of) the seeds for meeko-panner.  


### Mobile sites

- [m.netmagazine.com](http://m.netmagazine.com) (<small>[details](m.netmagazine.com/)</small>)

Many web-sites have a alternate domain for mobile users.
This allows users to have a light-weight or rich experience of the site,
but at the cost of maintaining an extra site plus 
the inelegance of redirecting users to the appropriate site. 

**meeko-panner** enhances these mobile sites with the decor of the normal site. 
This demonstrates that with a content-first approach
(or as some have called it, a [mobile-first](http://www.lukew.com/ff/entry.asp?933) approach)
it can be trivial to have one site providing both the light-weight and rich experience. 

<b>ASIDE:</b> the prototype for **meeko-panner** was the
[meeko-twitter](http://dist.meekostuff.net/meeko-twitter/) project,  
which is a bookmarklet to enhance [mobile.twitter.com](http://mobile.twitter.com) with `pushState` support and a UI more like [twitter.com](http://twitter.com). 
It was created to be a demo of progressive enhancement done well when it became clear that twitter's
[migration from hashbangs to plain-old-URLs](http://engineering.twitter.com/2012/05/improving-performance-on-twittercom.html)
wasn't going to address the [extraordinarily](http://mike.teczno.com/notes/bandwidth.html)
[bloated](http://www.meekostuff.net/blog/Twitter-without-Hashbangs/) Javascript and HTML.


### General sites

- [api.jquery.com](http://api.jquery.com) (<small>[details](api.jquery.com/)</small>)
- [mootools.net](http://mootools.net) (<small>[details](mootools.net/)</small>)
- [adactio.com](http://adactio.com) (<small>[details](adactio.com/)</small>)
- [www.quirksmode.org](http://www.quirksmode.org) (<small>[details](www.quirksmode.org/)</small>)

Most (multi-page) sites consists of pages that share site decor - layout, styles, navigation and other auxiliary content.
Typically the pages are constructed on the server, either once for static HTML files,
or on each request for the page. 
In the former case pages are regenerated when the primary content changes and also when the site decor changes.
In the latter case the server is continuously generating the same pages. 

Imagine the improvements in performance and server efficiency if resources were only regenerated when necessary. 
**meeko-panner** demonstrates how trivial it is to combine primary content with 
site decor from within the browser.
(You will need to look at the project source-code to accept this -
otherwise it will just look like the site is working normally.)


Notes and Warnings
------------------

- This is a minimally tested and unsupported project. Use at your own risk.

- Features may not work or break without warning. 

- Some sites send different markup to different users, depending on device, region, etc.
So this may not work at all for you even with the browsers I have tested. 

- Having said that, if something fails you can usually just refresh the page (and run meeko-panner again).

- The speed of **meeko-panner** is limited primarily by the site it is running on. 


TODO
----

- separate XBL into its own project


Contact
-------

If you do find problems, or if you would like to know more, you can contact me at [twitter](https://twitter.com/Meekostuff)
or on [my web-site](http://meekostuff.net).
