(function ($) {


 // Create an instance of the DonationService
  var ds = new BLACKBAUD.api.DonationService(
  $('.BBDonationApiContainer').data('partid')),
         serverMonth = part.parents(".BBDonationApiContainer").attr("serverMonth") - 1,
         serverDay = part.parents(".BBDonationApiContainer").attr("serverDay"),
         serverYear = part.parents(".BBDonationApiContainer").attr("serverYear"),
         ServerDate = new Date(serverYear, serverMonth, serverDay);
		 
var donationAmount = getDonationAmount();
        var numberOfInstallments = part.find("#number-of-installments").val();
        var installmentAmount = ds.getRecurringGiftInstallmentAmount(donationAmount, numberOfInstallments);
        var installmentAmt = installmentAmount;

  //Create the donation object we'll send
  //In order to simplify our examples, some of this information is hard-coded.
  var donation = {
  MerchantAccountId: '00000000-0000-0000-0000-000000000000',
  };

  // Create our success handler
  var success = function (returnedDonation) {
  console.log(returnedDonation);
  };   

  // Create our error handler
  var error = function (returnedErrors) {
  console.log('Error!');
  };
 


    if ($('form[data-formtype="bbCheckout"]').length <= 0) {
        var form = '<form method=\'get\' id=\"paymentForm\" data-formtype=\'bbCheckout\' data-disable-submit=\'false\' novalidate><\/form>';
        $('body').append(form);
    }


    $("#paymentForm").submit(function paymentComplete(e) {
        // prevent form from refreshing and show the transaction token
        e.preventDefault();
    });

	
	    var  SrtDt,
        publicKey,
        
        donationData,
        EditorContent,
        ServerDate,
        checkoutGenericError = "There was an error while performing the operation.The page will be refreshed";
		
		function getDonationAmount() {
        if (part.find("#amtOther").prop("checked")) {
            return part.find("#txtAmount").val();
        } else {
            return part.find("[name='radioAmount']:checked").val();
        }
    }
	
	 //Handle Generic error 
    function handleError(errorMessage) {
        $("#bbspLoadingOverlay").hide();
        alert(checkoutGenericError);
        location.reload(true);
    }

    //#region CCCheckoutPayment

    function GetPaymentType() {
        paymentMethod = part.find("[name='paymentMethod']:checked").val();
        return paymentMethod;
    }

    function GetPublicKey() {
       
        onPublicKeySuccess = function (reply) {
                publicKey = JSON.parse(reply.Data).PublicKey;
             
            };
        onPublicKeyFailure = function (d) {
             
            };

            ds.getCheckoutPublicKey(onPublicKeySuccess, onPublicKeyFailure);

   
    }


    function GetEditorInformation(partId) {

        onEditorContentSuccess = function onSuccess(content) {
            donation.MerchantAccountId = content.MerchantAccountID;
            EditorContent = content;
        };

        onEditorContentFailure = function onFail(error) {
        };

        ds.getADFEditorContentInformation(partId, onEditorContentSuccess, onEditorContentFailure);

    }


    function getUrlVars(url) {
        var vars = [], hash;
        var hashes = url.slice(url.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    this.makePayment = function () {
        opened = false;

        var checkout = new SecureCheckout(handleCheckoutComplete, handleCheckoutError, handleCheckoutCancelled, handleCheckoutLoaded);
        var donor = data.Donor;
        donationData = {
            "key": publicKey,
            'Amount': (part.find("#recMonthly").prop("checked")) ? installmentAmt : getDonationAmount(),
            'UseCaptcha': EditorContent.RecaptchRequired,
            'BillingAddressCity': donor.Address.City,
            'BillingAddressCountry': donor.Address.Country,
            'BillingAddressLine': donor.Address.StreetAddress,
            'BillingAddressPostCode': donor.Address.PostalCode,
            'BillingAddressState': donor.Address.State,
            'BillingAddressEmail': donor.EmailAddress,
            'BillingAddressFirstName': donor.FirstName + " " +donor.MiddleName,
            'BillingAddressLastName': donor.LastName,
            'Cardholder': donor.FirstName + " " + donor.LastName,
            'ClientAppName': 'BBIS',
            'MerchantAccountId': EditorContent.MerchantAccountID,
            'IsEmailRequired': true,
            'PrimaryColor': EditorContent.PrimaryFontColor,
            'SecondaryColor': EditorContent.SecondaryFontColor,
            'FontFamily': EditorContent.FontType,
            'IsNameVisible': true,
          'UseVisaCheckout': EditorContent.UseVisaPass,
          'UseMasterpass': EditorContent.UseMasterPass,
          'UseApplePay': EditorContent.UseApplePay,
        };
       

        //check server date and start date here -- if same then make transaction today
        if (data.Gift && data.Gift.Recurrence && !data.Gift.Recurrence.ProcessNow) {
            donationData.CardToken = EditorContent.DataKey;
            return checkout.processStoredCard(donationData);
        }
        else {

            return checkout.processCardNotPresent(donationData);
        }
    }

    function isProcessNow() {
        var recStartDate = part.find("#start-date").val()
        var frequency = part.find("#frequency").val();
        var dayOfMonth = part.find('#day-of-month').val();
        var dayOfWeek = part.find("#day-of-week").val();
        var month = part.find('#month').val();

        var startDateIsTodayDate = false;

        var recurrrentStartDate = new Date(recStartDate);

        var isProcessedNow = false;

        var serverDate = new Date(ServerDate);


        if (
            recurrrentStartDate.getFullYear() === serverDate.getFullYear() &&
            recurrrentStartDate.getMonth() === serverDate.getMonth() &&
            recurrrentStartDate.getDate() === serverDate.getDate()
        ) {
            startDateIsTodayDate = true;
        }
        else {

            return false;
        }

        //Weekly Frequency
        if (frequency == 1) {
            isProcessedNow = startDateIsTodayDate && dayOfWeek == serverDate.getDay();
        }
        //Mothly and Quarterly frequency
        else if (frequency == 2 || frequency == 3) {
            isProcessedNow = startDateIsTodayDate && dayOfMonth == serverDate.getDate();
        }
        //Annually frequency
        else if (frequency == 4) {

            isProcessedNow =
                startDateIsTodayDate
                && dayOfMonth == serverDate.getDate()
                && month == serverDate.getMonth() + 1;
        }
        //Every 4 weeks
        else if (frequency == 7) {
            isProcessedNow = startDateIsTodayDate;
        }
        else {
            isProcessedNow = false;
        }

        return isProcessedNow;


    };

    handleDonationCreated = function (data) {
        var orderID = JSON.parse(data.Data).OrderId;
    }

    this.handleDonationCreateFailed = function (error) {
        handleError(error);
    }

    this.handlePaymentComplete = function (data) {
        $("#bbspLoadingOverlay").hide();
        //confirmation message show here
        part.find(".form").hide();
        part.find(".confirmation").show();

        part.find(".confirmation").html(JSON.parse(data.Data).confirmationHTML);
    }

    function handleCheckoutLoaded() {

        if (!opened) {

            opened = true;
            var url = $("#bbCheckoutPaymentIframe").prop('src');
            var tid = getUrlVars(url)["t"];

            //save transaction id in global variable. Will be used throughout the transaction
            this.transactionIDl = tid;

            if (tid) {
                data.TokenId = tid;
                ds.checkoutDonationCreate(data, handleDonationCreated, handleDonationCreateFailed);
                return false;
            }
        }

        return false;
    }

    function UnBindPaymentCheckoutEvents() {
        $(document).unbind("checkoutComplete");
        $(document).unbind("checkoutLoaded");
        $(document).unbind("checkoutError");
        $(document).unbind("checkoutCancel");
    }

    function handleCheckoutComplete(event, tranToken) {
        $("#bbspLoadingOverlay").show();
        if (tranToken) {
            data.TokenId = tranToken;
            ds.checkoutDonationComplete(data, handlePaymentComplete, handleDonationCreateFailed);
        }
        else {
            handleError();
        }
        return false;
    }

    handleCheckoutError = function (event, errorMsg, errorCode) {
        handleError(errorMsg);
    }

    //Cancel Donation if user close checkout popup
    function handleCheckoutCancelled() {
        try {
            ds.checkoutDonationCancel(data, onSuccess, onFail);
        }
        catch (e) {
            //do not store this error. Already stored from server side
        }
        UnBindPaymentCheckoutEvents();
    }

	function sendData() {
        if (EditorContent && EditorContent.MACheckoutSupported && GetPaymentType() == 0) {
            ProcessCCPayment();
        }
    }
	
	 //use this method for credit card payment through popup
    function ProcessCCPayment() {
        
        data = donation;

              onValidationSuccess = function (result) {
            makePayment();
            return false;
        };
        onValidationFailed = function (error) {
            console.log(error);
        };

        ds.valiateDonationRequest(data, onValidationSuccess, onValidationFailed);

    }
	
	       
        GetEditorInformation($('.BBDonationApiContainer').data('partid'));
        GetPublicKey();
		
		
	// Attach our event listener to the donate button
		 $('.btn-donate').click(function(e) {
      
      // Stop the button from submitting the form
      e.preventDefault(); 
	  sendData();
	  });
		
}(jQuery));