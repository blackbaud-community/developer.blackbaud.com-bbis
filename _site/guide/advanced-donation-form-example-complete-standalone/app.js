'use strict';

// Create our Angular application
angular.module('bbADF', ['ui.bootstrap', 'ngMessages'])
.controller('DonationController', function($scope, CountryService) {

  // Controls the available donor types
  $scope.defaults = {
    isAdmin: true,
    type: '', // single | recurring
    payments: '', // credit | later
    amount: 0, // dollar amount | other
    tribute: 'none' // none, etc
  };

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

  $scope.payments = [
    {
      id: 'credit',
      label: 'Credit Card'
    },
    {
      id: 'later',
      label: 'Bill Me Later'
    }
  ];

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

  $scope.designations = [
    {
      id: '0001',
      label: 'Designation 1'
    },
    {
      id: '0002',
      label: 'Designation 2'
    }
  ];
  
  $scope.tributes = [
    {
      id: '0001',
      label: 'Tribute 1'
    },
    {
      id: '0002',
      label: 'Tribute 2'
    }
  ];

  // Calendar manipulation
  $scope.minDate = new Date();
  $scope.open = function($event, opened) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope[opened] = true;
  };

  // Temporarily debugging
  $scope.log = function() {
    console.log(this);
  };
  
  // Request the states for a particular country
  $scope.getStates = function() {
    CountryService.getStates($scope.Donor.Address.Country.Id).success(function(data) {
      $scope.states = data;
    }).error(function() {
      alert('Error loading states.');
    });
  }

  CountryService.getCountries('').success(function(data) {
    $scope.countries = data;
  }).error(function() {
    $scope.donationForm.donorCountry.$setValidity('server', false);
  });

})
.service('CountryService', function($http) {

  // Request countries
  this.getCountries = function(baseurl) {
    return $http.get(baseurl + 'Country');
  }

  // Request states when a country is selected
  this.getStates = function(id) {
    return $http.get('Country/' + id + '/State');
  };

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