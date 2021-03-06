'use strict';

angular.module('jakenotjacobApp').controller('blogCtrl', function ($scope, $location) {

  var dataRef = new Firebase("https://jakenotjacob.firebaseio.com");
  dataRef.child('posts').limit(5).once('value', function(data){
    setScopeData(data.val());
  });

  function setScopeData (data){
    //some hack because firebase ordering is jacked and I hate their 'sort by priority filter'
    $scope.posts = _.sortBy(data, function(datum){
      return datum.date * -1;
    });
    if(!$scope.$$phase){
      $scope.$apply();
    }
  }

  $scope.toPost = function(){
    $location.path("/blog/post/" + this.post.date);
  }

  $scope.saveNewComment = function(newComment){
    if(!this.post.comments){
      this.post.comments = [];
    }
    this.post.comments.push(newComment);
    dataRef.child('posts').child(this.post.date).child('comments').push(newComment);
  }

  $scope.likePost = function(){
    this.post.likes = this.post.likes + 1;
    dataRef.child('posts').child(this.post.date).child('likes').set(this.post.likes);
  }

});
