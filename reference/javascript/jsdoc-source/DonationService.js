﻿/*globals BLACKBAUD, easyXDM */

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
		
		 /**
        * Calculates the price on each installment of a recurring gift based on how many installments
        * the client wants to pay. If empty, zero, or negative parameters are supplied, it returns 0.
        * @param {Decimal} totalGiftAmount The total amount of the gift that the client wishes to pay
        * @param {Integer} numberOfInstallments The number of installments that the client would like to pay the full price of the gift
        */
        getRecurringGiftInstallmentAmount: function (totalGiftAmount, numberOfInstallments) {
            // Format the parameters to be a decimal and integer
            var total = 0,
                installmentCount = 0,
                installmentAmount = 0;
            total = parseFloat(totalGiftAmount).toFixed(2);
            installmentCount = parseInt(numberOfInstallments, 10);

            // If any empty parameter is supplied, we return 0
            if (!total || !installmentCount || total <= 0 || installmentCount <= 0) {
                return 0;
            }
            // Calculate the installment amount by dividing the total by the number of installments (we floor it to a whole number just in case someone supplies a decimal)
            installmentAmount = total / Math.floor(installmentCount);
            // Return the calculated value as it is rounded to the 100th decimal place to match currency
            return installmentAmount.toFixed(2);
        },

        /**
        * Calculates the end date of a recurring installment payment based on the number the of installments desired to pay the recurring gift or pledge.
        * @param {integer} numberOfInstallments The number of installments the user wants to pay off their pledge or recurring gift in
        * @param {integer} frequencyCode The integer value representing the frequency of the user's installments (monthly: 2, quarterly: 3, annually: 4)
        * @param {date} installmentStartDate The date that the first installment will be paid on
        * @param {integer} installmentMonth The month that the installment payment will occur if it is an annual payment (January: 1, Febraury: 2, March: 3, etc.)
        * @param {integer} installmentDayOfMonth The date within a month that the installment payment will occur if it is a monthly or annual payment
        */
        getRecurringGiftLastPaymentDate: function (numberOfInstallments, frequencyCode, installmentStartDate, installmentMonth, installmentDayOfMonth) {
            // VARIABLE SET UP: Make the variables the types of objects that we want to use
            // NOTE: All of the vars are established here to meet JSLint standards
            var installmentCount = 0,
                frequency = 0,
                startDate,
                endDate,
                month = 0,
                dayOfMonth = 0,
                monthProvided = false,
                dayOfMonthProvided = false,
                startDateMonth = 0,
                startDateDayOfMonth = 0,
                startDateYear = 0,
                dateNotAvailableUntilNextYear = 0;
            // Because the first installment is on the start date, we subtract 1 installment from the number of installments lef ton the payment
            installmentCount = parseInt(numberOfInstallments, 10) - 1;
            // Cast the frequency as an integer in case they passed in as a string
            frequency = parseInt(frequencyCode, 10);
            // Grab the start date as date variable
            startDate = new Date(installmentStartDate);
            // Set the end date as the start date for now since that will be our starting point
            endDate = startDate;
            // Because Javascript zero-indexes months (January: 0, February: 1, etc.) but the Blackbaud donation processing API code does not, we tell the user to provide a non-zero-indexed month and we subtract 1 from it
            month = parseInt(installmentMonth, 10) - 1;
            // Cast the day of month as an integer in case they passed it in as a string
            dayOfMonth = parseInt(installmentDayOfMonth, 10);

            // VALIDATION: Validate everything possible before continuing because we never know what could happen with particular parameters
            // if the number of installments provided is undefined or 0, we exit the function
            if (!installmentCount || installmentCount <= 0) {
                return;
            }
            // if the frequency is undefined or outside of the expected range(2,3,4), we exit the function
            if (!frequency || 2 > frequency || frequency > 4) {
                return;
            }
            // if the start date is undefined, we exit the function
            // else validate that the start date we're about to calculate with is an actual date (for example: April 31st does not exist) and exit the function if necessary
            if (!startDate) {
                return;
            }

            // START DATE ADJUSTMENT: if the installment frequency does not coicinde with the start date, we need to adjust the start date before determing an end date
            // the month is considered "provided" if it is provided and is in the range of 1 to 12
            monthProvided = (month && 0 < month && month < 13);
            // the day of month is considered "provided" if it is provided and is in the range of 1 to 31
            dayOfMonthProvided = (dayOfMonth && 0 < dayOfMonth && dayOfMonth < 32);

            // if the month is provided without a day, we can't work with it so we exit the function
            // else if the month is provided then we're working with an annual date that we may need to adjust
            // else if just the day of month is provided then we're working with a monthly or quarterly date that we may need to adjust
            if (monthProvided && !dayOfMonthProvided) {
                return;
            } else if (monthProvided) {
                // get the start date's month, day, and year
                startDateMonth = startDate.getMonth();
                startDateDayOfMonth = startDate.getDate();
                startDateYear = startDate.getFullYear();
                // if the installment's annual month is before the start date's month, it is not available until next year
                // OR if the installment's annul month is the same month as the installment month but the installment date is before the start date's date, that date is not available until next year
                dateNotAvailableUntilNextYear = (month < startDateMonth) || (month === startDateMonth && dayOfMonth < startDateDayOfMonth);
                if (dateNotAvailableUntilNextYear) {
                    // because the month is not available until next year, we up the start date by 1 year
                    startDate.setYear(startDateYear + 1);
                }
                // set the start date's day and month to the expected day and month
                startDate.setDate(dayOfMonth);
                startDate.setMonth(month);
            } else if (dayOfMonthProvided) {
                // if the installment's day of month is before the start date's day of month, it is not available until next month
                if (dayOfMonth < startDate.getDate()) {
                    // because the start date is not available until next month, we up the start date by 1 month
                    startDate.setMonth(startDate.getMonth() + 1);
                }
                // we set the start date's date to match the installment's day of month
                startDate.setDate(dayOfMonth);
            }

            // END DATE CALCULATION: depending on the frequency, we add the number of installments in months, quaters, or years to the start date to determine the end date
            switch (frequency) {
            case 2: // monthly
                // 1 installment = 1 month
                endDate.setMonth(startDate.getMonth() + installmentCount);
                break;
            case 3: // quaterly
                // 1 installment = 3 months
                endDate.setMonth(startDate.getMonth() + (3 * installmentCount));
                break;
            case 4: // annually
                // 1 installment = 1 year
                endDate.setYear(startDate.getFullYear() + installmentCount);
                break;
            }

            return endDate;
        }

    };

}());
