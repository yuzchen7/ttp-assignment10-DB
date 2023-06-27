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
    res.send(obj);
});


const join3 = 'select umi.user_id, u.fname, u.lname, i.image_path, umi.category_id from User_mtm_Image umi inner join t_user u on umi.user_id = u.user_id inner join t_Image i on umi.image_id = i.image_id';
app.get('/join3', async (req, res) => {
    var obj = await connections.query(join3);
    obj = obj.rows;
    res.send(obj);
});

const joinall = 'select umi.user_id, u.fname, u.lname, i.image_path, c.category_type from User_mtm_Image umi inner join t_user u on umi.user_id = u.user_id inner join t_Image i on umi.image_id = i.image_id inner join t_Category c on umi.category_id = c.category_id';
app.get('/joinall', async (req, res) => {
    var obj = await connections.query(joinall);
    obj = obj.rows;
    // console.log(obj);
    res.send(obj);
});

app.use(express.urlencoded({ extended : false }));
app.use(express.json());

app.post('/new', async (req, res) => {
    console.log(req.body);

    try {
        await connections.query('BEGIN')
    
        // check if category_type is already defined
        var res_cate = await connections.query('select * from t_Category where category_type = $1', [req.body.category_type]);
        var category_id;
        if (res_cate.rowCount == 0) {
            await connections.query('insert into t_Category(category_type) values ($1)', [req.body.category_type]);
            res_cate = await connections.query('select * from t_Category where category_type = $1', [req.body.category_type]);
            res_cate = res_cate.rows;
            category_id = res_cate[0].category_id;
        } else {
            res_cate = res_cate.rows;
            category_id = res_cate[0].category_id;
        }
        console.log('category_id =', category_id);


        // check if user is already defined
        var res_user = await connections.query('select * from t_user where fname = $1 and lname = $2', [req.body.fname, req.body.lname]);
        var user_id;
        if (res_user.rowCount == 0) {
            await connections.query('insert into t_User(fname, lname) values ($1, $2)', [req.body.fname, req.body.lname]);
            res_user = await connections.query('select * from t_User where fname = $1 and lname = $2', [req.body.fname, req.body.lname]);
            res_user = res_user.rows;
            user_id = res_user[0].user_id;
        } else {
            res_user = res_user.rows; 
            user_id = res_user[0].user_id;
        }
        console.log('user_id = ', user_id);


        // check if image is already defined
        var res_img = await connections.query('select * from t_image where image_path = $1', [req.body.image_path]);
        var image_id;
        if (res_img.rowCount == 0) {
            await connections.query('insert into t_Image(image_path) values ($1)', [req.body.image_path]);
            res_img = await connections.query('select * from t_Image where image_path = $1', [req.body.image_path]);
            res_img = res_img.rows;
            image_id = res_img[0].image_id;
        } else {
            res_img = res_img.rows;
            image_id = res_img[0].image_id;
        }
        console.log('image_id = ', image_id);


        // check if main table has the record
        // if no, then insert into main table
        var res_main =  await connections.query('select * from User_mtm_Image where user_id = $1 and image_id = $2 and category_id = $3', [user_id, image_id, category_id]);
        if (res_main.rowCount == 0) {
            await connections.query('insert into User_mtm_Image(user_id, image_id, category_id) values ($1, $2, $3)', [user_id, image_id, category_id]);
        }

        await connections.query('COMMIT')
        res.status(201).send('insert new record ok');

    } catch (err) {
        await connections.query('ROLLBACK')
        res.status(500).send('insert new record fail');
        throw err;
    }
});
