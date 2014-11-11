BBIS
=======================

### Setup Instructions

After successfully cloning this repo (and branch), please follow the steps to setup jekyll from https://help.github.com/articles/using-jekyll-with-pages#installing-jekyll.

### Working Locally

When working locally, you can either "build" or "serve."  Anything that's built is stored in the _site folder, which Github is setup to ignore.  The serve command works really well to test things without having to commit.

When serving locally, be certain to pass in the <code>--baseurl</code> flag, followed by an empy string <code>''</code>.  For example, I typically run the following:

<pre>jekyll serve --baseurl ''</pre>

You will now be able to visit http://localhost:4000 in your browser to view the site.

### Publishing

At present time, we deploy by uploading the contents of the _site directory directly to developer.blackbaud.com/bbis.  Please be aware this configuration may change the future.  For example, with some project restructuring and DNS changes, we could utilize gh-pages free hosting for all our documentation.
