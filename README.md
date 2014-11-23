BBIS Developer Documentation
=======================

Hello fellow developer.  Thank you for looking at our source.  Unfortunately there's not much to see here.
This is a prototype project for a new breed of documentation for the Blackbaud Community.  Many thanks to the countless Blackbaud
developers and clients that helped contribute to the site.

If you're a passionate and knowledgable developer who cares about giving back to non-profits, consider joining the Blackbaud Team.
https://www.blackbaud.com/careers

### Setup Instructions

After successfully cloning this repo (and branch), please follow the steps to setup jekyll from https://help.github.com/articles/using-jekyll-with-pages#installing-jekyll.

The config file structure is slightly more complicated than a normal jekyll project - the reason being is we're attempting to support three build environments.  One of the major differences between these three environments is the <code>baseurl</code> necessary to function properly.

### Building for GitHub Pages

There is no work to be done for this environment.  Their build automatically looks at the _config.yml file.

### Building for Development Environment

<code>jekyll serve --config _config.yml,_config.dev.yml</code>

You will now be able to visit <a href="http://localhost:4000">http://localhost:4000</a> in your browser to view the site.  You should also notice that the site is being stored and served from the _site directory.  This directory is set to be ignored.

** Please note: ** The BBNCExtensions Assembly documention produces approximately 1,700 files.  Building this in jekyll can take up to a few minutes.  In an effort to work more efficiently, the _config.dev.yml file sets the bbncextensions/ directory to be excluded.  If you are interested in building these locally, simply remove this from the config file.

## Building for the Production Environment

<code>jekyll build --config _config.yml,_config.prod.yml</code>


###Contributing###

If you would like to contribute to this code sample, please carefully read the [contributing documentation](https://github.com/blackbaud-community/Blackbaud-CRM/blob/master/CONTRIBUTING.md), which details the necessary workflow.  Included in those requirements is [signing the Contributor License Agreement](http://developer.blackbaud.com/cla).