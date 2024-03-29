angular.module('todo', ['ionic'])

 //The Projects factory handles saving and loading projects
 // from local storage, and also lets us save and load the
 //last active project index.

.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})
.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate,$ionicActionSheet) {

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }


  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modals for new tasks and settings
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });
  $ionicModal.fromTemplateUrl('settings.html', function(modal) {
   $scope.settingsModal = modal;
 }, {
   scope: $scope
 });
  // Work in progress
  $scope.deleteItem = function(index) {
    $timeout(function () {
        $scope.activeProject.tasks.splice(index, 1)
    });
};
  $scope.deleteParentList = function(index) {
    $scope.projects.splice(index, 1);
  //Using a timeout function within the function to check if we have remove last element
  //if we have then prompt user for another parent list
  $timeout(function() {
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });
};

  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate
    });
    $scope.taskModal.hide();
    $scope.settingsModal.hide();

    //Save all projects
    Projects.save($scope.projects);

    task.title = "";
    task.description="";
    task.dueDate=new Date();
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.openSettings = function() {
    $scope.settingsModal.show();
  };

  $scope.closeSettings = function() {
    $scope.settingsModal.hide();
  };
  //right now the app is not on the store this is added for a future release
  //http://www.fizerkhan.com/blog/posts/Rate-this-app-in-Ionic-application.html
  //happy not to take marks for this 
/* $scope.rateUs = function () {
  if ($ionicPlatform.is('ios')) {
        window.open('itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id511364723?ls=1&mt=8'); // or itms://
    } else if ($ionicPlatform.is('android')) {
        window.open('market://details?id=<package_name>');
    }
}
*/

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });

});
