const { Pool } = require('pg');
const express = require('express');

const app = express();
var server = app.listen(8080, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log(server.address());
});

const connections = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'yuz.chen',
    password: '',
    database: 'dbtest'
});

connections.connect((err) => {
    if (err) {
        console.error('error connecting to postgres', err.stack);
        return;
    }
    console.log('connected to postgres');
});

const join2 = 'select umi.user_id,u.fname, u.lname, umi.image_id, umi.category_id from User_mtm_Image umi inner join t_user u on umi.user_id = u.user_id';
app.get('/join2', async (req, res) => {
    var obj = await connections.query(join2);
    obj = obj.rows;
    // console.log(obj);
    res.send(obj);
});


const join3 = 'select umi.user_id, u.fname, u.lname, i.image_path, umi.category_id from User_mtm_Image umi inner join t_user u on umi.user_id = u.user_id inner join t_Image i on umi.image_id = i.image_id';
app.get('/join3', async (req, res) => {
    var obj = await connections.query(join3);
    obj = obj.rows;
    // console.log(obj);
    res.send(obj);
});

const joinall = 'select umi.user_id, u.fname, u.lname, i.image_path, c.category_type from User_mtm_Image umi inner join t_user u on umi.user_id = u.user_id inner join t_Image i on umi.image_id = i.image_id inner join t_Category c on umi.category_id = c.category_id';
app.get('/joinall', async (req, res) => {
    var obj = await connections.query(joinall);
    obj = obj.rows;
    // console.log(obj);
    res.send(obj);
});