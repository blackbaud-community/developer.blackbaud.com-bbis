/*globals BLACKBAUD, easyXDM */

/// Donation Controller API
(function () {
    "use strict";

    function getBaseUrl(donationService) {
        return donationService.baseUrl + "WebApi/" + donationService.contextId + "/Donation";
    }

    var rpcHash = [];
    function getRPC(baseURL) {
        if (!rpcHash[baseURL]) {
            if (window.easyXDM) {
                rpcHash[baseURL] = new easyXDM.Rpc({
                    remote: baseURL + "client/scripts/easyXDM/cors/index.html"
                }, {
                    remote: {
                        ajax: {}
                    }
                });
            }
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

    function ajax(config, rpc, onSuccess, onFail) {
        function onFailInternal(d) {
            if (onFail) {
                if (d && d.data) {
                    onFail(d.data);
                } else {
                    onFail();
                }
            }
        }

        if (rpc) {
            rpc.ajax(config, function (d) { handleResponse(d.jqXHR, d.textStatus, onSuccess, onFailInternal); }, function () { onFail(); });
        } else {
            config.complete = function (jqXHR, textStatus) {
                handleResponse(jqXHR, textStatus, onSuccess, onFail);
            };
            $.ajax(config);
        }
    }

    /**
    * @class BLACKBAUD.api.DonationService Provides methods needed for taking donations and retrieving confirmation information.
    * @param {Integer} partId The Id of an Advanced Donation Form part that will be used as a context for all method calls.
    * @param {Object} options An object literal containing one or more of the following optional properties:
    * <ul>
    * <li><tt>url</tt> : The URL of the BBIS site from which the data will be retrieved.  This value is optional when accessed from a BBIS page.  The default value will be the BBIS URL of the current page.</li>
    * <li><tt>crossDomain</tt> : Indicates the BBIS url specified is from a separate domain than the current page.  When True, the class will handle the complexities of making cross domain requests to retrieve data.  The default value is False.</li>
    * </ul>
    */
    BLACKBAUD.api.DonationService = function (partId, options) {
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
        this.baseUrl = url;
        this.contextId = partId;
    };

    BLACKBAUD.api.DonationService.prototype = {

        /**
        * Validates the specified donation parameter. If valid, creates a donation transaction
        * and saves it to the database. Stores the Id of the new donation in session so the user
        * has permissions for the donation transaction. If the payment type is credit card, 
        * communicates with Blackbaud secured payment to set up a check out URI and adds that
        * URI to the return object. For credit card payment, the donation is saved in a Pending
        * state. For payments not using a credit card, the donation is saved in a Completed state
        * and an acknowledgement email is sent.
        * For credit card payments, the page is redirected to the Blackbaud secured payment checkout
        * page after calling the successCallback function.
        * @param {Object} donation An object describing the donation transaction to be created.
        * @param {Function} successCallback The function to call if the request succeeds. The
        * function will be passed an object describing the donation that was created.
        * @param {Function} failureCallback The function to call if the request fails.
        */
        createDonation: function (donation, successCallback, failureCallback) {
            var url = getBaseUrl(this) + "/Create";

            function onSuccessInternal(d) {
                if (onSuccessInternal) {
                    successCallback(d);
                }
                if (d.BBSPCheckoutUri) {
                    location.href = d.BBSPCheckoutUri;
                } else if (d.PaymentPageUri) {
                    location.href = d.PaymentPageUri;
                }
            }

            ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(donation),
                contentType: 'application/json'
            }, this._rpc, onSuccessInternal, failureCallback);
        },

        /**
        * Ensures the user has access to this donation by finding the Id in their session.
        * If so, returns information about the donation
        * @param {String} id The GUID id of the donation whose information should be returned.
        * @param {Function} successCallback The function to call if the request succeeds. The
        * function will be passed an object describing the donation with the specified Id.
        * @param {Function} failureCallback The function to call if the request fails.
        */
        getDonation: function (id, successCallback, failureCallback) {
            var url = getBaseUrl(this) + "/" + id;
            ajax({
                url: url,
                type: 'GET'
            }, this._rpc, successCallback, failureCallback);
        },

        /**
        * Signals the application to confirm that the credit card donation has been paid in Blackbaud secured
        * payment and to complete the creation of the donation. Updates the donation status and sends the acknowledgment email.
        * @param {String} id The GUID id of the donation that should be completed.
        * @param {Function} successCallback The function to call if the request succeeds. The
        * function will be passed an object describing the donation with the specified Id after its status
        * has been updated.
        * @param {Function} failureCallback The function to call if the request fails.
        */
        completeBBSPDonation: function (id, successCallback, failureCallback) {
            var url = getBaseUrl(this) + "/" + id + "/CompleteBBSPDonation";
            ajax({
                url: url,
                type: 'POST'
            }, this._rpc, successCallback, failureCallback);
        },

        /**
        * Gets HTML for a confirmation screen for the completed donation. Ensures the user has access to this
        * donation by finding the Id in their session. If so, loads the donation and merges the fields
        * into the part’s confirmation block
        * @param {String} id The GUID id of the donation that should be completed.
        * @param {Function} successCallback The function to call if the request succeeds. The
        * function will be passed a string containing the confirmation HTML from the part with details
        * from the specified donation merged in.
        * @param {Function} failureCallback The function to call if the request fails.
        */
        getDonationConfirmationHtml: function (id, successCallback, failureCallback) {
            var url = getBaseUrl(this) + "/" + id + "/ConfirmationHtml";
            ajax({
                url: url,
                type: 'GET'
            }, this._rpc, successCallback, failureCallback);
        }

    };

}());
