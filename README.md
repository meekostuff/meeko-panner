**meeko-panner** is a javascript bookmarklet that can enhance a site with 
support for `pushState`-assisted-navigation (panning)
and, optionally, a richer UI. 

The intention is to demonstrate the simplicity, efficiency and flexibility of
an API-first, HTML-payload approach for web-sites.

**meeko-panner** extracts only the essential content of each page and 
uses [HyperFrameset](http://github.com/meekostuff/HyperFrameset) to 
decorate it with shared site decor -
banner, navigation, auxilliary content, styles and layout.
In general this is used to emulate the original appearance and behavior of the site,
except with panning support. 
Another scenario is that a mobile site is enhanced with the appearance of the standard site. 
I consider it obvious that this approach would have better performance and flexibility
if integrated into a site rather than being implemented as a JS bookmarklet. 


Requirements
------------

You need a browser with javascript support enabled.

You need a browser that implements `history.pushState()`. 

Recent versions of the following browsers have been tested:

- Chrome
- Safari
- Firefox
- Opera
- Internet Explorer (IE10+)


Installation
------------

The easiest way to add the bookmarklet to your browser is to use the installation on the development server,
see <http://devel.meekostuff.net/meeko-panner/3.0-devel/>

Installation is typically just a drag-and-drop from the page to the browser's bookmark bar. 


Notes and Warnings
------------------

- This is a minimally tested and unsupported project. Use at your own risk.

- Features may not work or break without warning. 

- Some sites send different markup to different users, depending on device, region, etc.
So this may not work at all for you even with the browsers I have tested. 

- Having said that, if something fails you can usually just refresh the page (and run meeko-panner again).

- The speed of **meeko-panner** is limited primarily by the site it is running on. 


Contact
-------

If you do find problems, or if you would like to know more, you can contact me at [twitter](https://twitter.com/Meekostuff)
or on [my web-site](http://meekostuff.net).
