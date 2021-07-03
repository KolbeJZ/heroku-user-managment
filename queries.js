// const { app } = require('express');
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
    // ssl: {
    //     rejectUnauthorized: false
    // }
});
pool.connect();
const createUser = (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let age = req.body.age;
    let queryString = `insert into users (first_name, last_name, email, user_age) values('${firstName}', '${lastName}', '${email}', ${age})`;
    pool.query(
        queryString, 
        (err, result) => {
            if (err) {
                throw err;
            } else {
                res.redirect('/table');
            }
        }
    );
};

const displayUsers = (req, res) => {
    pool.query(
        'SELECT * FROM users', 
        (err, result) => {
            if (err) {
                throw err;
            }
            res.render('users', {users: result.rows});
        }
    );
};

const deleteUser = (req, res) => { 
    let userId = req.body.userId;
    pool.query(
        'delete from users where id = $1', 
        [userId], 
        (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/table');
        }
    );
}; 

let sorter = false
const sortUsers = (req, res) => {
    function compareAsc(a, b) { 
        const userA = a.first.toLowerCase();
        const userB = b.first.toLowerCase();

        let comparison = 0;
        if (userA > userB) {
            comparison = 1;
        } else if (userA < userB) {
            comparison = -1;
        }
        return comparison;
    }
    function compareDes(a, b) { 
        const userA = a.first.toLowerCase();
        const userB = b.first.toLowerCase();

        let comparison = 0;
        if (userA > userB) {
            comparison = -1;
        } else if (userA < userB) {
            comparison = 1;
        }
        return comparison;
    }
    if (!sorter) {
        pool.query('select * from users', (err, results) => {
            let newList = results.rows.sort(compareAsc)
            res.render('index', {users: newList })
        })
        sorter = true
    } else {
        pool.query('select * from users', (err, results) => {
            let newList = results.rows.sort(compareDes)
            res.render('index', {users: newList })
        })
        sorter = false
    
    }
}

const search = (req, res) => {
    let searchStr = req.body.search.trim();
    pool.query(
        `select * from users where first_name ilike '${searchStr}%'`,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.render('users', {users: result.rows}); 
        }
    );
};

const getUser = (req, res) => {
    let id = req.params.userId;
    pool.query(
        'select * from users where id = $1',
        [id],
        (err, result) => {
            if (err) {
                throw err;
            }
            let userInfo = result.rows[0];
            console.log(result.rows);
            res.render('edit', {
                firstNameField: userInfo.first_name,
                lastNameField: userInfo.last_name,
                emailField: userInfo.email,
                ageField: userInfo.user_age,
                userId: id
            });
        }
    );
};

const editUser = (req, res) => {
    let id  = req.params.userId;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let age = req.body.age;
    pool.query(
        'update users set first_name = $1, last_name = $2, email = $3, user_age = $4 where id = $5',
        [firstName, lastName, email, age, id],
        (err, results) => {
            if (err) {
                throw err;
            } else {
                res.redirect('/table');
            }
        }
    );
}

module.exports = {
    createUser,
    displayUsers, 
    deleteUser, 
    sortUsers,
    search,
    getUser,
    editUser
};