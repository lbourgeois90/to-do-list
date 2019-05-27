console.log('in JS');

$(document).ready(onReady);

function onReady(){
    console.log('in JQ');

    // click event for addtaskbutton to run function addTask
    $('#addTaskButton').on('click', function(event){
        event.preventDefault();
        addTask();
    })

    //click event for deletebutton to run function deleteAlert
    $('#toDoTable').on('click', '#deleteButton', deleteAlert);

    //click event for completedTaskButton that runs on checkbox
    $('#toDoTable').on('click', '#checkboxunchecked', completedTask)

    //on load of DOM runs getToDoList to get data from database and append to DOM
    getToDoList();
}

// function addTask-- POST request to add new task to database-- runs validation first before task is added
function addTask(){
    if( validate() ) {
        let task = $('#taskInput').val();
        const status = 'Incomplete';

        $.ajax({
            method: 'POST',
            url: '/toDoList',
            data: { task, 
                status}
        }).then( function (response){
            getToDoList();
            clearInputs();
        }).catch( function(error){
            console.log('Error sending task!');
            alert(`Sorry! There was an error adding your task!`);
        })
    }
    else {
        alert(`Please complete all input fields!`);
    }
}

//function getToDoList-- GET request that will receive values/info from database -- will then run render function to display on DOM
function getToDoList(){
    $.ajax({
        method: 'GET',
        url: '/toDoList'
    }).then( function(response){
        let list = response;
        console.log('To-Do List is', list);
        render(list);
    }).catch( function(error){
        console.log('Unable to GET to-do list from server');
        alert(`Sorry! Was unable to retrieve to-do list!`);
    })
}

//function deleteTask-- DELETE request that deletes specified task from DB and thus from DOM on re-render
function deleteTask(taskId){
    console.log(`in delete function`);
    $.ajax({
        method: 'DELETE',
        url:`/toDoList/${taskId}`
    }).then( function(response) {
        getToDoList();
    }).catch( function(error) {
        console.log('Could not delete task', error);
        alert(`Sorry! Could not delete your task!`);
    })
}

//function deleteAlert-- SWAL alert that asks user if they would like to delete task before deleteTask function is run
function deleteAlert(){
    console.log('in delete alert');
    let deleteButton = $(this);
    let deletedRow = deleteButton.closest('tr');
    let taskId = deletedRow.data('id');
    console.log( 'Task id is', taskId);

    swal({
        title: "Are you sure you want to delete this task?",
        buttons:true,
        dangerMode: true,
    }).then( function(value){
        if (value === true){
            deleteTask(taskId);
        }//end if
    })//end swal
}//end delete alert

//function completedTask--PUT request that will update DB to change task to being completed-- functions based on if checked
function completedTask(){
    console.log('in completedTask');
    console.log($(this));
    if( $(this).is(':checked')){
    let $tr = $(this).closest('tr');
    let taskId= $tr.data('id');
    console.log(taskId);
    $.ajax({
        method: 'PUT',
        url: `/toDoList/${taskId}`,
        data: taskId
    }).then( function (response) {
        getToDoList();
    }).catch( function (response) {
        console.log('Error updating completed status');
        alert(`Sorry! Error updating completed status`);
    })
    }//end if
    else {
        alert(`Unable to complete task!`);
    }//end else
}//end completedTask


//function render-- uss database info to append information to the DOM
function render(list){
    $('#toDoTable').empty();
    for( let task of list){
        let $tr;
        if( task.status === 'Incomplete'){
        $tr = $(`<tr>
        <td><label class="label-big-check">
        <input type="checkbox" id="checkboxunchecked">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${task.task}
        <label for="checkboxunchecked" class="check-title"></label>
        </td>
        <td>${task.status}</td>
        <td>
        <button id="deleteButton">Delete Task!</button>
        </td>
       
        </tr>`)
        }//end if
        else{
            $tr = $(`<tr id="completed">
            <td><label class="label-big-check">
            <input type="checkbox" id="checkboxchecked" checked disabled="disabled">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${task.task}
            <label for="checkboxchecked" class="check-title"></label>
            </td>
        <td>${task.status}</td>
        <td>
        <button id="deleteButton">Delete Task!</button>
        </td>
        </tr>`)
        }//end else
        $('#toDoTable').append($tr);
        $tr.data(task);
    }//end for loop
}//end render function

//function clearInputs--clears input field on DOM once submitted
function clearInputs(){
    $('#taskInput').val('');
}

//function validate-- validates inputs AKA does not allow user to submit input values if the value is empty
function validate(){
    let task = $('#taskInput').val();
    if (task !== '' ){
        return true;
    }
    return false;
}
