var WIDTH_SM = 576;

var cursor = 1;

function windowRefresh() {
    /*
    if($(window).width() < WIDTH_SM) {
        if(cursor == 0) {
            $('#tasklist').removeClass('hidden');
            $('#taskcontrol').addClass('hidden');
        } else {
            $('#tasklist').addClass('hidden');
            $('#taskcontrol').removeClass('hidden');
        }
    } else {
        $('#tasklist').removeClass('hidden');
        $('#taskcontrol').removeClass('hidden');
    }
    */
}

$(window).on('resize', windowRefresh);

$(function() {
    windowRefresh();
    
    $('.btn-delete').click(deleteTask);
    $('.btn-check').click(completeTask);
    $('.btn-uncheck').click(uncompleteTask);
    $('#task-add-title').keyup(event => {
        if(event.keyCode === 13) {
            addTask();
        }
    });
    $('#task-add-save-button').click(addTask);
    $('.btn-save').click(editTask);
    
    
    /* Remove all tasks
    $.ajax({        
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: '/api/test_remove_all_tasks',
        method: 'POST'
    })*/
});


// task 수정
function editTask() {
    let task_id = $(this).attr('task-id');
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: '/api/edit_task/' + task_id,
        method: 'POST',
        data: {
            title: $('#edit-title-' + task_id).val(),
            text: $('#edit-content-' + task_id).val(),
            priority: $('#edit-priority-' + task_id).val(),
            expire_date: $('#edit-date-' + task_id).val(),
        }
    }).done(function(response) {
        if(response.result == 0) {
            $('#task-title-text-' + task_id).val($('#edit-title-' + task_id).val());
            location.reload();
        } else {
            console.log('Unknown edit response');
            console.log(response);
        }
    });
}

// 완료 버튼 클릭
function completeTask() {
    let task_id = $(this).attr('task-id');
    $('#task-title-text-' + task_id).addClass('text-complete');
    setTimeout(() => {
        $('#task-box-' + task_id).addClass('hidden');
    }, 300);
    
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: '/api/complete_task/' + task_id,
        method: 'POST'
    }).done(function(response) {
        insertTask(response.html);
        location.reload();
    });
}

// 완료 취소 버튼 클릭
function uncompleteTask() {
    let task_id = $(this).attr('task-id');
    $('#task-title-text-' + task_id).addClass('text-complete');
    setTimeout(() => {
        $('#task-box-' + task_id).addClass('hidden');
    }, 300);
    
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: '/api/uncomplete_task/' + task_id,
        method: 'POST'
    }).done(function(response) {
        insertTask(response.html);
        location.reload();
    });
}

// 삭제 버튼 클릭
function deleteTask() {
    let task_id = $(this).attr('task-id');
    $('#task-title-text-' + task_id).addClass('text-complete');
    
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: '/api/delete_task/' + task_id,
        method: 'POST'
    }).done(function(response) {
        if(response.result == 0) {
            setTimeout(() => {
                $('#task-container-' + task_id).remove();
            }, 300);
        } else {
            console.log('Unknown delete response');
            console.log(response);
        }
    });
}

function addTask() {
    $.ajax({
        headers: {"X-CSRFToken": getCookie("csrftoken")},
        url: '/api/add_task',
        method: 'POST',
        data: {
            title: $('#task-add-title').val(),
            text: $('#task-add-content-text').val(),
            priority: parseInt($('#task-add-priority').val()),
            expire_date: $('#task-add-date').val()
        }
    }).done(function(response) {
        $('#task-add-title').val('');
        $('#task-add-content-text').val('');
        $('#task-add-date').val('');
        $('#task-add-priority').val('');
        if(response.result == 0) {
            insertTask(response);
            location.reload();
        } else {
            console.log('Unknown add_task response', response.result);
            console.log(resopnse);
        }
    });
}

function insertTask(response) {
    // response.result, response.id, response.html
    $('#task-list').append(response.html)
}

function getCookie(c_name)
{
    if (document.cookie.length > 0)
    {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
 }
