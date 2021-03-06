'use strict';

angular.module('jakenotjacobApp').controller('adminCtrl', function ($scope, $location, $routeParams, $cookies) {

  var dataRef = new Firebase("https://jakenotjacob.firebaseio.com");
  var auth = new FirebaseSimpleLogin(dataRef, function(error, user) {
    if (error) {
      alert("Run Jake Run!")
      console.log(error);
    } else if (user) {
      // user authenticated with Firebase
      console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
    } else {
      // user is logged out
      $location.path("/donthackme/login");
    }
  });


  $scope.post = {};

  //Will need to authenticate on this page. simple-login?

  $scope.leeroyJenkins = function(){
    if(!$scope.post.date){
      var newpost = {title: $scope.post.title, body: $scope.post.body, date: new Date().getTime(), comments: [], likes: 0};
      dataRef.child('posts').child(newpost.date).setWithPriority(newpost, newpost.date);
    } else{
      if(!$scope.post.comments){
        $scope.post.comments = [];
      }
      var newpost = {title: $scope.post.title, body: $scope.post.body, date: $scope.post.date, comments: $scope.post.comments, likes: $scope.post.likes};
      dataRef.child('posts').child(newpost.date).setWithPriority(newpost, newpost.date);
    }
  }

  $scope.editPost = function(){
    $scope.post = this.post;
  }

  $scope.selectProject = function(){
    $scope.selectedProject = this.project;
  }

  $scope.updateProjectCurrentGoal = function(){
    dataRef.child(this.selectedProject.key).child("current_goal").set({text:this.selectedProject.current_goal.text, percent: this.selectedProject.current_goal.percent});
  }
  
  $scope.postUpdate = function(){
    dataRef.child(this.selectedProject.key).child("updates").push({date: new Date().getTime(), text: $scope.newUpdate});
  };

  $scope.updateMeta = function(){
    dataRef.child(this.selectedProject.key).child("description").set({text: this.selectedProject.description.text, link: this.selectedProject.description.link});
  }

  $scope.newFile = function(){
    dataRef.child(this.selectedProject.key).child("files").push($scope.newFile);    
  }

  //gets a lists of posts. Need a way to select on to edit. 
  dataRef.on('value', function(data){
    setScopeData(data.val());
  })

  function setScopeData (data){
    $scope.data = data;
    $scope.projects = _.omit(data, 'posts');
    if(!$scope.$$phase){
      $scope.$apply();
    }
  }

});
