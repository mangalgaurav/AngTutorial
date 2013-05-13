var TodoApp = angular.module("TodoApp", ["ngResource"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            when('/new', { controller: CreateCtrl, templateUrl: 'details.html' }).
            when('/edit/:ItemId', { controller: EditCtrl, templateUrl: 'details.html' }).
            otherwise({ redirectTo: '/' });
    });


TodoApp.factory('Todo', function ($resource) {
    return $resource('/AngTutorial/api/Todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

var ListCtrl = function ($scope, $location, Todo) {
    $scope.search = function () {
        Todo.query({
            q: $scope.query,
            sort: $scope.sort_order,
            desc: $scope.is_desc,
            limit: $scope.limit,
            offset: $scope.offset
        },
        function (data) {
            $scope.more = data.length === 10;
            $scope.items = $scope.items.concat(data);
        });
    };

    $scope.sort = function (col) {
        if ($scope.sort_order === col) {
            $scope.is_desc = !$scope.is_desc;
        }
        else {
            $scope.sort_order = col;
            $scope.is_desc = false;
        }
        $scope.reset();
    };

    $scope.show_more = function () {
        $scope.offset += $scope.limit;
        $scope.search();
    };

    $scope.has_more = function () {
        return $scope.more;
    };

    $scope.reset = function () {
        $scope.limit = 10;
        $scope.offset = 0;
        $scope.items = [];
        $scope.more = true;
        $scope.search();
    };


    $scope.delete = function () {
        var id = this.todo.Id;
        Todo.delete({ id: id }, function () {
            this.$("#todo_" + id).fadeOut();
        });

    };
    $scope.sort_order = "Priority";
    $scope.is_desc = false;
    $scope.reset();
};

var CreateCtrl = function ($scope, $location, Todo) {
    $scope.heading = "Add";
    $scope.save = function () {
        Todo.save($scope.item, function () {
            $location.path('/');
        });
    };
};

var EditCtrl = function ($scope, $routeParams, $location, Todo) {
    $scope.heading = "Edit";
    $scope.item = Todo.get({ id: $routeParams.ItemId });
    $scope.save = function () {
        Todo.update({ id: $scope.item.Id }, $scope.item, function () {
            $location.path('/');
        });
    };
};
