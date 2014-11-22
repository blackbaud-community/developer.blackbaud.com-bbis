/*globals easyXDM */

var BLACKBAUD = BLACKBAUD || {};
BLACKBAUD.api = {};

(function () {
    "use strict";

    /// Query String
    BLACKBAUD.api.querystring = {

        getQueryStringValue: function (key, querystring) {
            var re,
                matches;

            if (!querystring) {
                querystring = window.location.search;
            }
            querystring = querystring.toLowerCase();
            re = new RegExp("[?|&]" + key + "=(.*?)&");
            matches = re.exec(querystring + "&");
            if (!matches || matches.length < 2) {
                return "";
            }
            return decodeURIComponent(matches[1].replace("+", " "));
        }

    };

    /// Page Information
    BLACKBAUD.api.pageInformation = {
        rootPath: "",
        pageId: ""
    };

    ///////////////////////////////////////////////////
    //Common functions used by service wrappers below//
    ///////////////////////////////////////////////////
    var rpcHash = [];
    function getRPC(baseURL) {
        if (!rpcHash[baseURL]) {
            rpcHash[baseURL] = new easyXDM.Rpc({
				remote: baseURL + "client/scripts/easyXDM/cors/index.html"
			}, {
				remote: {
					ajax: {}
				}
			});
        }

        return rpcHash[baseURL];
    }

    function handleResponse(jqXHR, textStatus, onSuccess, onFail) {
        if (textStatus === "success") {
			if (onSuccess) {
				onSuccess($.parseJSON(jqXHR.responseText));
			}
		} else {			
			if (jqXHR.status === 400) {
				if (onFail) {
					onFail($.parseJSON(jqXHR.responseText));
				}
			} else {
				if (onFail) {
					onFail();
				}
			}
		}
    }
    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////

    function ajax(config, rpc, onSuccess, onFail) {
        if (rpc) {
            rpc.ajax(config, function (d) { handleResponse(d.jqXHR, d.textStatus, onSuccess, onFail); }, function () { onFail(); });
        } else {
			config.complete = function (jqXHR, textStatus) {                        
				handleResponse(jqXHR, textStatus, onSuccess, onFail);
            };
            $.ajax(config);
        }
    }

    /// BLACKBAUD.api.CountryService
    (function () {

        /**
         * @class BLACKBAUD.api.CountryService Provides methods for getting state and country information from the CRM using calls to the BBIS REST services.
         * @param {Object} options An object literal containing one or more of the following optional properties:
         * <ul>
         * <li><tt>url</tt> : The URL of the BBIS site from which the data will be retrieved. This value is optional when accessed from a BBIS page. The default value will be the BBIS URL of the current page.</li>
         * <li><tt>crossDomain</tt> : Indicates the BBIS url specified is from a separate domain than the current page. When True, the class will handle the complexities of making cross domain requests to retrieve data. The default value is False.</li>
         * </ul>
        */
        BLACKBAUD.api.CountryService = function (options) {
            var crossDomain,
                url;

            if (typeof options === "string") {
                url = options;
            } else if (typeof options === "object") {
                url = options.url;
                crossDomain = options.crossDomain;
            }
            if (!url) {
                url = BLACKBAUD.api.pageInformation.rootPath;
            }
            if (crossDomain) {
                this._rpc = getRPC(url);
            }
            this.baseUrl = url + "WebApi";
        };

        BLACKBAUD.api.CountryService.prototype = {

            /**
             * Returns a list of all active countries alphabetized by their description.
             * @param {Function} successCallback The function to call if the request succeeds. The
             * function will be passed an array of objects with the following properties:
             * <ul>
             * <li><tt>Id</tt> : The Id of a country.</li>
             * <li><tt>Abbreviation</tt> : The abbreviation of a country.</li>
             * <li><tt>Description</tt> : The description of a country.</li>
             * </ul>
             * @param {Function} failureCallback The function to call if the request fails.
             */
            getCountries: function (successCallback, failureCallback) {
                var url = this.baseUrl + "/Country";
                
                ajax({
                    url: url,
                    type: 'GET'
                }, this._rpc, successCallback, failureCallback);
            },

            /**
             * Returns a list of states associated with a specified country, alphabetized by their description.
             * @param {String} countryId The Id of a country whose states should be returned.
             * @param {Function} successCallback The function to call if the request succeeds. The
             * function will be passed an array of objects with the following properties:
             * <ul>
             * <li><tt>Id</tt> : The Id of a state.</li>
             * <li><tt>Abbreviation</tt> : The abbreviation of a state.</li>
             * <li><tt>Description</tt> : The description of a state.</li>
             * </ul>
             * @param {Function} failureCallback The function to call if the request fails.
             */
            getStates: function (countryId, successCallback, failureCallback) {
                var url = this.baseUrl + "/Country/" + countryId + "/State";

                ajax({
                    url: url,
                    type: 'GET'
                }, this._rpc, successCallback, failureCallback);
            },

            /**
             * Returns the internationalized address captions associated with a specified country.
             * @param {String} countryId The Id of a country whose address captions should be returned.
             * @param {Function} successCallback The function to call if the request succeeds. The
             * function will be passed an object with the following properties:
             * <ul>
             * <li><tt>AddressLines</tt> : The caption for the address lines.</li>
             * <li><tt>City</tt> : The caption for the city.</li>
             * <li><tt>State</tt> : The caption for the state.</li>
             * <li><tt>PostCode</tt> : The caption for the postal code.</li>
             * </ul>
             * @param {Function} failureCallback The function to call if the request fails.
             */
            getAddressCaptions: function (countryId, successCallback, failureCallback) {
                var url = this.baseUrl + "/Country/" + countryId + "/AddressCaptions";

                ajax({
                    url: url,
                    type: 'GET'
                }, this._rpc, successCallback, failureCallback);
            }
        };

    }());

    /// BLACKBAUD.api.CodeTableService
    (function () {
        
        /**
         * @class BLACKBAUD.api.CodeTableService Provides methods for retrieving code table entries from the CRM using calls to the BBIS REST services.
         * @param {Object} options An object literal containing one or more of the following optional properties:
         * <ul>
         * <li><tt>url</tt> : The URL of the BBIS site from which the data will be retrieved. This value is optional when accessed from a BBIS page. The default value will be the BBIS URL of the current page.</li>
         * <li><tt>crossDomain</tt> : Indicates the BBIS url specified is from a separate domain than the current page. When True, the class will handle the complexities of making cross domain requests to retrieve data. The default value is False.</li>
         * </ul>
        */
        BLACKBAUD.api.CodeTableService = function (options) {
            var crossDomain,
                url;
            
            if (typeof options === "string") {
                url = options;
            } else if (typeof options === "object") {
                url = options.url;
                crossDomain = options.crossDomain;
            }
            if (!url) {
                url = BLACKBAUD.api.pageInformation.rootPath;
            }
            if (crossDomain) {
                this._rpc = getRPC(url);
            }
            this.baseUrl = url + "WebApi";
        };

        BLACKBAUD.api.CodeTableService.prototype = {
            
            /**
             * Returns the active code table entries for the specified code table Id ordered as configured in the CRM.
             * @param {Function} successCallback The function to call if the request succeeds. The function
             * will be passed an array of objects with the following properties:
             * <ul>
             * <li><tt>Id</tt> : The Id of a code table entry.</li>
             * <li><tt>Description</tt> : The description of a code table entry.</li>
             * </ul>
             * @param {Function} failureCallback The function to call if the request fails.
             */
            getEntries: function (codeTableId, successCallback, failureCallback) {
                var url = this.baseUrl + "/CodeTable/" + codeTableId;
                
                ajax({
                    url: url,
                    type: 'GET'
                }, this._rpc, successCallback, failureCallback);
            } 

        };

    }());

    /// BLACKBAUD.api.QueryService
    (function () {
        
        /**
         * @class BLACKBAUD.api.QueryService Provides methods for retrieving query execution results from the CRM using calls to the BBIS REST services.
         * @param {Object} options An object literal containing one or more of the following optional properties:
         * <ul>
         * <li><tt>url</tt> : The URL of the BBIS site from which the data will be retrieved. This value is optional when accessed from a BBIS page. The default value will be the BBIS URL of the current page.</li>
         * <li><tt>crossDomain</tt> : Indicates the BBIS url specified is from a separate domain than the current page. When True, the class will handle the complexities of making cross domain requests to retrieve data. The default value is False.</li>
         * </ul>
        */        
        BLACKBAUD.api.QueryService = function (options) {
            var crossDomain,
                url;
            
            if (typeof options === "string") {
                url = options;
            } else if (typeof options === "object") {
                url = options.url;
                crossDomain = options.crossDomain;
            }
            if (!url) {
                url = BLACKBAUD.api.pageInformation.rootPath;
            }
            if (crossDomain) {
                this._rpc = getRPC(url);
            }
            this.baseUrl = url + "WebApi";
        };

        BLACKBAUD.api.QueryService.prototype = {
            
            /**
             * Returns the result of executing the specified, published query. The query is executed as
             * the last user to save the query. The results are cached and may be up to 10 minutes old. The
             * results are limited to 5000 rows.
             * @param {String} queryId The Id of a query whose results should be returned.
             * @param {Function} successCallback The function to call if the request succeeds. The function
             * will be passed an object with the following properties:
             * <ul>
             * <li><tt>Fields</tt> : An array of objects describing the fields returned from the query. The objects
             * have have the following properties:
             * <ul>
             * <li><tt>Name</tt> : The name of the column in the query.</li>
             * <li><tt>Caption</tt> : The caption of the column defined in the query.</li>
             * </ul>
             * </li>
             * <li><tt>Rows</tt> : An array of objects describing the rows returned from the query. The objects
             * have have the following properties:
             * <ul>
             * <li><tt>Values</tt> : An array of the values returned for the row. The values are in the same order as the array of fields.</li>
             * </ul>
             * </li>
             * </ul>
             * @param {Function} failureCallback The function to call if the request fails.
             * @param {Array} filters An array of the filters to filter the results to rows that contain the
             * specified value in the specified column. When specifying a column, use the name that is found
             * in the query response. Depending on the type of column being filtered, the results may filter to rows
             * that exactly match the specified value instead of those that contain the specified value. Summary
             * columns such as MAX, MIN, and COUNT cannot be used as filters and will be ignored. The array should
             * contain objects with the following properties:
             * <ul>
             * <li><tt>columnName</tt> : The name of the column that should be used to filter the results.</li>
             * <li><tt>value</tt> : The value that the specified column should be filtered by.</li>
             * </ul>
             */
            getResults: function (queryId, successCallback, failureCallback, filters) {
                var columnName,
                    i,
                    filter,
                    value,
                    queryString,
                    url = this.baseUrl + "/Query/" + queryId;
                    
                if (filters) {
                    queryString = '';
                    for (i = 0; i < filters.length; i++) {
                        filter = filters[i];
                        columnName = filter.columnName;
                        value = filter.value;

                        if (columnName && value) {
                            if (queryString.length > 0) {
                                queryString += '&';
                            }
                            queryString += encodeURIComponent(columnName) + "=" + encodeURIComponent(value);
                        }
                    }

                    if (queryString.length > 0) {
                        url += '?' + queryString;
                    }
                }

                ajax({
                    url: url,
                    type: 'GET'
                }, this._rpc, successCallback, failureCallback);
            } 

        };

    }());
    
    /// BLACKBAUD.api.UserService
    (function () {
        
        /**
         * @class BLACKBAUD.api.UserService Provides methods for retrieving information about the currently logged in BBIS user from the CRM using calls to the BBIS REST services.
         * @param {Object} options An object literal containing one or more of the following optional properties:
         * <ul>
         * <li><tt>url</tt> : The URL of the BBIS site from which the data will be retrieved. This value is optional when accessed from a BBIS page. The default value will be the BBIS URL of the current page.</li>
         * <li><tt>crossDomain</tt> : Indicates the BBIS url specified is from a separate domain than the current page. When True, the class will handle the complexities of making cross domain requests to retrieve data. The default value is False.</li>
         * </ul>
        */           
        BLACKBAUD.api.UserService = function (options) {
            var crossDomain,
                url;
            
            if (typeof options === "string") {
                url = options;
            } else if (typeof options === "object") {
                url = options.url;
                crossDomain = options.crossDomain;
            }
            if (!url) {
                url = BLACKBAUD.api.pageInformation.rootPath;
            }
            if (crossDomain) {
                this._rpc = getRPC(url);
            }
            this.baseUrl = url + "WebApi";
        };

        BLACKBAUD.api.UserService.prototype = {
            
            /**
             * Returns profile information for the current user. If the user is not logged in,
             * then it may be populated based on the current email-recipient information.
             * @param {Function} successCallback The function to call if the request succeeds. The
             * function will be passed an object with the following properties:
             * <ul>
             * <li><tt>Addresses</tt> : An array of objects describing the addresses of the
             * current user.  The objects have have the following properties:
             * <ul>
             * <li><tt>City</tt> : The address's city.</li>
             * <li><tt>Country</tt> : The address's country.</li>
             * <li><tt>Id</tt> : The Id of the address.</li>
             * <li><tt>IsPrimary</tt> : Boolean indicating if the address is the user's primary address.</li>
             * <li><tt>PostalCode</tt> : The address's postal code.</li>
             * <li><tt>State</tt> : The address's state.</li>
             * <li><tt>StreedAddress</tt> : The address's street address.</li>
             * <li><tt>Type</tt> : The Id of the type of the address.</li>
             * </ul>
             * </li>
             * <li><tt>EmailAddresses</tt> : An array of objects describing the email addresses of the
             * current user.  The objects have have the following properties:
             * <ul>
             * <li><tt>EmailAddress</tt> : The email address.</li>
             * <li><tt>Id</tt> : The Id of the email address.</li>
             * <li><tt>IsPrimary</tt> : Boolean indicating if the email address is the user's primary email address.</li>
             * <li><tt>Type</tt> : The Id of the type of the email address.</li>
             * </ul>
             * </li>
             * <li><tt>FirstName</tt> : The first name of the current user.</li>
             * <li><tt>LastName</tt> : The last name of the current user.</li>
             * <li><tt>Phone</tt> : The phone number of the current user.</li>
             * <li><tt>Title</tt> : The title of the current user.</li>
             * </ul>
             * @param {Function} failureCallback The function to call if the request fails.
             */
            getProfile: function (successCallback, failureCallback) {
                var url = this.baseUrl + "/User";
                
                ajax({
                    url: url,
                    type: 'GET'
                }, this._rpc, successCallback, failureCallback);
            } 

        };

    }());

    /// BLACKBAUD.api.ImageService
    (function () {

        /**
         * @class BLACKBAUD.api.ImageService Provides methods for getting information about images in the image gallery
         * @param {Object} options An object literal containing one or more of the following optional properties:
         * <ul>
         * <li><tt>url</tt> : The URL of the BBIS site from which the data will be retrieved. This value is optional when accessed from a BBIS page. The default value will be the BBIS URL of the current page.</li>
         * <li><tt>crossDomain</tt> : Indicates the BBIS url specified is from a separate domain than the current page. When True, the class will handle the complexities of making cross domain requests to retrieve data. The default value is False.</li>
         * </ul>
        */
        BLACKBAUD.api.ImageService = function (options) {
            var crossDomain,
                url;

            if (typeof options === "string") {
                url = options;
            } else if (typeof options === "object") {
                url = options.url;
                crossDomain = options.crossDomain;
            }
            if (!url) {
                url = BLACKBAUD.api.pageInformation.rootPath;
            }
            if (crossDomain) {
                this._rpc = getRPC(url);
            }
            this.baseUrl = url + "WebApi";
        };

        BLACKBAUD.api.ImageService.prototype = {

            /**
             * Returns a list of images in the specified folder.  Only approved images that the user has rights
             * to view will be returned.
             * @param {String} folderGUID The GUID of an image folder whose images should be returned.
             * @param {Function} successCallback The function to call if the request succeeds. The
             * function will be passed an array of objects with the following properties:
             * <ul>
             * <li><tt>Url</tt> : The Url of the image.</li>
             * <li><tt>Caption</tt> : The caption of the image.</li>
             * </ul>
             * @param {Function} failureCallback The function to call if the request fails.
             */
            getImagesByFolderGUID: function (folderGUID, successCallback, failureCallback) {
                var url = this.baseUrl + "/Images?FolderGUID=" + encodeURIComponent(folderGUID);
                
                ajax({
                    url: url,
                    type: 'GET'
                }, this._rpc, successCallback, failureCallback);
            },

            /**
             * Returns a list of images with the specified tag.  Only approved images that the user has rights
             * to view will be returned.
             * @param {String} tag The tag whose images should be returned.
             * @param {Function} successCallback The function to call if the request succeeds. The
             * function will be passed an array of objects with the following properties:
             * <ul>
             * <li><tt>Url</tt> : The Url of the image.</li>
             * <li><tt>Caption</tt> : The caption of the image.</li>
             * </ul>
             * @param {Function} failureCallback The function to call if the request fails.
             */
            getImagesByTag: function (tag, successCallback, failureCallback) {
                var url = this.baseUrl + "/Images?Tag=" + encodeURIComponent(tag);
                
                ajax({
                    url: url,
                    type: 'GET'
                }, this._rpc, successCallback, failureCallback);
            },

            /**
             * Returns a list of images in the specified folder.  Only approved images that the user has rights
             * to view will be returned.
             * @param {String} folderPath The path of an image folder whose images should be returned.  Example: Folder1/SubFolder1/SubFolder2
             * @param {Function} successCallback The function to call if the request succeeds. The
             * function will be passed an array of objects with the following properties:
             * <ul>
             * <li><tt>Url</tt> : The Url of the image.</li>
             * <li><tt>Caption</tt> : The caption of the image.</li>
             * </ul>
             * @param {Function} failureCallback The function to call if the request fails.
             */
            getImagesByFolder: function (folderPath, successCallback, failureCallback) {
                var url = this.baseUrl + "/Images/" + encodeURIComponent(folderPath);
                
                ajax({
                    url: url,
                    type: 'GET'
                }, this._rpc, successCallback, failureCallback);
            }
        };

    }());

}());
