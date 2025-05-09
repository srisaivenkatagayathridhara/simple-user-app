const app = angular.module('userApp', []);

app.controller('MainCtrl', function ($scope, $http) {
  $scope.user = {};
  $scope.users = [];

  // Function to load users from the backend
  function loadUsers() {
    $http.get('http://localhost:3000/users')
      .then(function (res) {
        $scope.users = res.data;
      });
  }

  // Initial load of users
  loadUsers();

  // Function to submit the form and add a new user
  $scope.submitForm = function () {
    $http.post('http://localhost:3000/users', $scope.user)
      .then(function () {
        $scope.user = {}; // Reset form fields
        loadUsers();      // Refresh the user list
      })
      .catch(function (error) {
        alert('Error: ' + (error.data.message || 'Could not add user.'));
      });
  };
});