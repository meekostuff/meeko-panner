Supported sites
---------------

*Not every site listed here is fully supported. You should read the **details** for each site before using the bookmarklet*

### Frameset sites

<small>
These type of sites are typically the output of a documentation generator 
and thus one configuration can handle multiple sites.
See [generators](../generators/)
</small>

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

- [mobile.twitter.com](http://mobile.twitter.com) (<small>[details](mobile.twitter.com/)</small>)

Many web-sites have a alternate domain for mobile users.
This allows users to have a light-weight or rich experience of the site,
but at the cost of maintaining an extra site plus 
the inelegance of redirecting users to the appropriate site. 

**meeko-panner** enhances these mobile sites with the decor of the normal site. 
This demonstrates that with a content-first approach
(or as some have called it, a [mobile-first](http://www.lukew.com/ff/entry.asp?933) approach)
it can be trivial to have one site providing both the light-weight and rich experience. 

<b>ASIDE:</b> the prototype for **meeko-panner** was the
(now obsolete) [meeko-twitter](http://dist.meekostuff.net/meeko-twitter/) project,  
which is a bookmarklet to enhance [mobile.twitter.com](http://mobile.twitter.com) with `pushState` support and a UI more like [twitter.com](http://twitter.com). 
It was created to be a demo of progressive enhancement done well when it became clear that twitter's
[migration from hashbangs to plain-old-URLs](http://engineering.twitter.com/2012/05/improving-performance-on-twittercom.html)
wasn't going to address the [extraordinarily](http://mike.teczno.com/notes/bandwidth.html)
[bloated](http://www.meekostuff.net/blog/Twitter-without-Hashbangs/) Javascript and HTML.


### General sites

<script type="text/markdown">
- [api.jquery.com](http://api.jquery.com) (<small>[details](api.jquery.com/)</small>)
- [mootools.net](http://mootools.net) (<small>[details](mootools.net/)</small>)
- [adactio.com](http://adactio.com) (<small>[details](adactio.com/)</small>)
- [www.quirksmode.org](http://www.quirksmode.org) (<small>[details](www.quirksmode.org/)</small>)
</script>

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


