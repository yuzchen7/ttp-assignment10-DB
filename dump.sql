DROP TABLE if exists t_User;
CREATE table t_User (
    user_id serial,
    fname text not NULL,
    lname text not NULL,
    PRIMARY KEY(user_id)
);

INSERT INTO
    t_User (fname, lname) 
values 
    ('John', 'Jackson'), 
    ('Amir', 'Mason'), 
    ('Owain', 'Logan'),
    ('Howard', 'Hudson')
;


DROP TABLE if exists t_Category;
CREATE table t_Category (
    category_id serial,
    category_type text not NULL,
    primary key (category_id)
);

INSERT INTO 
    t_Category (category_type)
VALUES
    ('emoji'),
    ('animal'),
    ('art'),
    ('animation')
;

DROP TABLE if exists t_Image;
CREATE table t_Image (
    image_id serial,
    image_path TEXT NOT NULL,
    PRIMARY KEY(image_id)
);

INSERT INTO
    t_Image (image_path)
VALUES
    ('./images/user/animal.jpg'),
    ('./images/user/emoji.jpg'),
    ('./images/user/animation.jpg'),
    ('./images/user/art.jpg')
;


DROP TABLE if exists User_mtm_Image;
CREATE table User_mtm_Image (
    record_id serial,
    user_id INTEGER NOT NULL,
    image_id INTEGER NOT NULL,
    category_id INTEGER,
    PRIMARY KEY(record_id),
    FOREIGN KEY(user_id) REFERENCES t_User(user_id),
    FOREIGN KEY(image_id) REFERENCES t_Image(image_id),
    FOREIGN KEY(category_id) REFERENCES t_Category(category_id)
);

INSERT INTO 
    User_mtm_Image (user_id, image_id, category_id)
VALUES
    (1, 1, 1),
    (1, 2, 2),
    (2, 3, 3),
    (3, 4, 4)
;


select 
    umi.user_id,
    u.fname,
    u.lname,
    umi.image_id,
    umi.category_id
from 
    User_mtm_Image umi 
inner join 
    t_user u 
on 
    umi.user_id = u.user_id;


select 
    umi.user_id,
    u.fname,
    u.lname,
    i.image_path,
    umi.category_id
from 
    User_mtm_Image umi 
inner join 
    t_user u 
on 
    umi.user_id = u.user_id
inner join
    t_Image i
on 
    umi.image_id = i.image_id
;


select 
    umi.user_id,
    u.fname,
    u.lname,
    i.image_path,
    c.category_type
from 
    User_mtm_Image umi 
inner join 
    t_user u 
on 
    umi.user_id = u.user_id
inner join
    t_Image i
on 
    umi.image_id = i.image_id
inner join
    t_Category c
on
    umi.category_id = c.category_id
;

