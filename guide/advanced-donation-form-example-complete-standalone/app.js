'use strict';

// Create our Angular application
angular.module('bbADF', ['ui.bootstrap'])
  .controller('DonationController', ['$scope', function($scope) {
    
    // Controls the available gift types presented.
    $scope.types = [
      {
        id: 'single',
        label: 'Single Gift'
      },
      {
        id: 'recurring',
        label: 'Recurring Gift'
      }
    ];
    
    // Controls the available amounts presented.
    $scope.amounts = [
      {
        amount: 5,
        label: '$5'
      },
      {
        amount: 10,
        label: '$10'
      },
      {
        amount: 25,
        label: '$25'
      },
      {
        amount: 'other',
        label: 'Other'
      }
    ];
    
    $scope.Donor = {};    
    $scope.Gift = {
      
      // These are not related to the necessary values for the API
      // You can use them to set defaults
      SelectedAmount: '',
      SelectedType: ''
    };
    
    $scope.minDate = new Date();
    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[opened] = true;
    };
    
    $scope.log = function() {
      console.log(this);
    };
    
  }])
  .service('CountryService', function($http) {
    console.log('service running');
  });





/*
// Let's be good developers and not pollute the global namespace
(function($) {

  // Let's make sure the DOM is ready
  $(function() {
    
    var donationCountriesLoading = $('.donor-countries-loading'),
        donationStatesLoading = $('.donor-states-loading');
    
    var donationPartId = 9111,
        donationPartConfig = {
          url: 'http://chs6bobbyear02.blackbaud.global/',
          crossDomain: true
        };

    var countryService = new BLACKBAUD.api.CountryService(donationPartConfig),
        donationService = new BLACKBAUD.api.DonationService(donationPartId, donationPartConfig),
        donationApp = {
          
          init: function() {
            this.getCountries();
          },
          
          bind: function() {

          },
          
          getCountries: function() {
            countryService.getCountries(
              function(response) {
                
              },
              function(response) {
                console.log(response);
              }
            );
          }
        };
    
    donationApp.init();

    // Create an instance of the DonationService
    var ds = new BLACKBAUD.api.DonationService();

    // Create the donation object we'll send
    // In order to simplify our examples, some of this information is hard-coded.
    var donation = {
      MerchantAccountId: '00000000-0000-0000-0000-000000000000',
      Gift: {
        PaymentMethod: 0,
        Designations: [
          {
            Amount: 5.00,
            DesignationId: '00000000-0000-0000-0000-000000000000'
          }
        ]
      }
    };

    // Create our success handler
    var success = function(returnedDonation) {
      console.log(returnedDonation);
    };

    // Create our error handler
    var error = function(returnedErrors) {
      console.log('Error!');
    };

    // Attach our event listener to the donate button
    $('.btn-donate').click(function(e) {

      // Stop the button from submitting the form
      e.preventDefault(); 

      // Add the information our user has typed
      donation.Donor = {
        FirstName: $('#first-name').val(),
        LastName: $('#last-name').val(),
        Address: {
          StreetAddress: $('#address').val(),
          City: $('#city').val(),
          State: $('#state').val(),
          PostalCode: $('#zip').val(),
          Country: $('#country').val()
        }
      };

      // Submit our donation
      ds.createDonation(donation, success, error);
    });

  });
  
}(jQuery));
*/