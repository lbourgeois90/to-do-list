const express = require('express');
const router = express.Router();

// DB CONNECTION
const pool = require('./pool');


//GET request to DB to obtain all rows from DB table "toDoList" to send to client-side
router.get('/', (req, res) => {
    pool.query(`SELECT * FROM "toDoList";`)
    .then((result) => {
        console.log(result.rows);
        res.send(result.rows);
    }).catch((error) => {
        console.log('ERROR in SERVER GET', error);
        res.sendStatus(500);
    })
})

//POST request-- receives data from client to add to database table "toDoList"
router.post('/', (req, res) => {
    let task = req.body;
    console.log('adding task', task);
    let sqlText = `INSERT INTO "toDoList" ("task" , "status") VALUES ($1, $2);`;

    pool.query(sqlText, [task.task, task.status])
    .then((response) => {
        res.sendStatus(201);
    }).catch( (error) => {
        console.log('Failed to POST', error);
        res.sendStatus(500);
    })
})

//DELETE request-- receives task id from client-- that id is then used to delete row from table based on corresponding id
router.delete('/:id', (req, res) => {
    let taskId = req.params.id;
    console.log('Deleting Task', taskId);
    let sqlText = `DELETE FROM "toDoList" WHERE "id" = $1;`;
    pool.query(sqlText, [taskId])
    .then((result) => {
        res.sendStatus(200);
    }).catch( (error) => {
        console.log('Failed to DELETE', error);
        res.sendStatus(500);
    })
})

//PUT request-- updates "toDoList" table in database based on received data id-- changes "status" to complete if checked
router.put('/:id', (req, res) => {
    let taskId = req.params.id;
    let taskData = req.body;
    console.log('Updating task status', taskData);

    let sqlText = `UPDATE "toDoList" SET "status" = 'Completed' WHERE "id" = $1;`;
    pool.query(sqlText, [taskId])
    .then( (result) => {
        res.sendStatus(200);
    }).catch( (error) => {
        console.log('Failed to update task status', error);
        res.sendStatus(500);
    })
})

module.exports = router;
