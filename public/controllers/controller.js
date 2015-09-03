var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl',['$scope', '$http', function($scope, $http){


    //Load All Task On Page Load
    getAllTaskWithQuery();


   //User List
    $scope.users = [
        
        { name: 'Erez Avital', userName:'ereza'},
        { name: 'Baruch Bayuch', userName: 'baruchb'},
        { name: 'Keren Levy', userName: 'kerenl'}
    ];

    //Remove Task
    $scope.removeTask = function(task){

        console.log('Remove task request TaskID: ' + task._id + ' User Name: ' + task.user );

        $http.delete('/api/tasks/'+task._id).success(getAllTaskWithQuery('?user='+task.user));

    };

    //Add Task
    $scope.addTask = function(currentUser, taskText){

        if(currentUser == null)
        {
            alert('Select User First');
            return;
        }

        console.log("Try to Add New Task " + taskText + ' for user: '+ currentUser.userName);

        $http.post('/api/tasks',
            {
                task: taskText,
                user: currentUser.userName
            }).success(function(){

                $scope.formData.text ="";

                getAllTaskWithQuery('?user='+currentUser.userName)

            });


    };

    //Get User Tasks
    $scope.changeUser = function(currentUser){

        var query = '';

        if(currentUser.userName !== 'allUsers'){
            query = '?user=' + currentUser.userName ;
            console.log('Change User Request: ' + currentUser.userName );
        }
        else {
            query = "";
            console.log('Change User Request: All ');
        }







        getAllTaskWithQuery(query);
    };

    //Change Task Status
    $scope.changeTaskStatus = function(isChecked, task) {

        console.log('Change Status Request: Task_ID: ' +  task._id + ' isChecked: ' + isChecked );

        $http.put('/api/tasks/'+task._id , {
            _id: task._id,
            tasks : task.task,
            user: task.user,
            taskComplted : isChecked
        }).success(getAllTaskWithQuery('?user='+task.user));

    }

    //Get All Task with query
    function getAllTaskWithQuery(query){

        $http.get('/api/tasks/' + query).success(function(response){

            console.log('Get All Task with query: ' + JSON.stringify(response));

            $scope.tasklist = response;

        });
    }
}]);