mobile.twitter.com
------------------

You need a twitter account AND you need to be signed in.

Due to twitter's "Content-Security-Policy" settings 
this currently only works on Internet Explorer.

**meeko-panner** is configured for the [whole site](https://mobile.twitter.com/)


### Rationale

In May 2012, Twitter began migrating its twitter.com site from hashbangs to plain-old-URLs.
This was done for
[a number of reasons](http://danwebb.net/2011/5/28/it-is-about-the-hashbangs),
but one of the higher priorities was
[improving performance](http://engineering.twitter.com/2012/05/improving-performance-on-twittercom.html),
most notably "reducing the time to first tweet". 

The smooth page navigation user-experience that was facilitated by using hashbangs is (will be)
replicated by using `history.pushState()` on platforms that support it -
`pushState` updates the URL while <abbr title="Asynchronous Javascript and JSON requests">AJAJ</abbr> is used to update the view. 

Funnily enough, twitter already has a site that
uses plain-old-URLs and
provides optimal time to first tweet - 
mobile.twitter.com. 
This site is also: 
low bandwidth;
doesn't require javascript; and
is usable on small screens (such as ... mobiles). 

What if Twitter had applied a [mobile first](http://www.lukew.com/ff/entry.asp?933) strategy
(also known as [content first](http://adactio.com/journal/4523/)) to the twitter.com upgrade,
using mobile.twitter.com as the starting point and relying on progressive enhancement in the browser
to provide a richer UI?

I consider it obvious that this approach would have better performance and flexibility
if integrated into the site rather than being implemented as a js bookmarklet. 

For more details see the **Implementation** section below.


### Notes and Warnings

- This is a minimally tested and unsupported project. Use at your own risk.

- **Content is NOT UPDATED, so you won't see newer tweets or older tweets. This might be the first thing to add.**

- I have no idea what this looks like on mobile devices.
It also seems that twitter sends different markup to different users, depending on device, region, and who knows what else.
So this may not work at all for you even with the browsers I have tested. 

- Having said that, if something fails you can usually just refresh the page (and run **meeko-panner** again).

- The script and content for **meeko-panner** needs to be loaded via HTTPS.
The easiest way for me to achieve this was to make them available from Amazon's Cloudfront CDN.
Unfortunately, the files probably won't be in the cache of your nearest Cloudfront proxy 
so the first time you execute the bookmarklet the UI will load slowly. 
To get a better idea of the performance you could refresh the page and execute the bookmarklet again. 

- The pages at mobile.twitter.com use a lot of HTML tables for layout.
I'm not suggesting that is a good idea, and it is also irrelevant to **meeko-panner**. 

- The speed and functionality of **meeko-panner** will be limited primarily by mobile.twitter.com


### Implementation

The design and implementation are very simple:

Although the twitter.com UI consists of several views,
they are all similar enough they can be implemented with one document
with non-applicable **panels** on the page hidden.
This is the **frameset** document for **meeko-panner**. 

The initialization process for **meeko-panner** is more-or-less the following steps: 

1. when the js bookmarklet is run, the **frameset** is loaded and 
its HTML content is inserted into the page,
replacing the initial content of the current document.

2. the initial content of the document is scraped to
remove the navigation bar (which is common to every page) and
leave only the the *real content* of the page. 

3. the real content of the document is placed into a page-cache,
referenced by the pathname of the document

4. the real content is inserted into the page as the **main** content.

5. depending on the URL of the current document
different panels are either hidden or
populated and revealed.
Populating a panel may require loading a document from mobile.twitter.com.

When a hyperlink on the page is clicked it is handled in a `@href` dependent manner:

- if the link is for composing a tweet (or replying to one) then popup a dialog
that contains a form for that purpose 

- otherwise perform a `pushState` assisted navigation to the requested URL.
This involves loading the document and repeating steps 2 to 5 of the initialization process.

When loading of a URL is requested it is handled in the following way:

- if the page-cache contains a document referenced by the URL then just use that.
(No updating of the cache is implemented yet)

- otherwise use XMLHttpRequest to fetch the URL and repeat steps 2 and 3 of the initialization process.

When form submission is requested it is handled using
an XMLHttpRequest POST where the request content is constructed from the form's form-elements.
(Currently the form submission is assumed to be successful and the response is ignored)



