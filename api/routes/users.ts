const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../authorize.ts');

function validDate(date){
    let valid = false;
    const t = date.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
    if(t!==null){
        const y = +t[1];
        const m = +t[2];
        const d = +t[3];
        const tempDate = new Date(y, m - 1, d);
        valid = (tempDate.getFullYear() === y && tempDate.getMonth() === m-1)
    }
    return valid
}

/* Register new user */
router.post('/register', function(req, res, next) {
    // get body values
    const email = req.body.email
    const password = req.body.password

    // Handle input
    if(!email || !password){
        res.status(400).json({
            error: true,
            message: "Request body incomplete, both email and password are required"
        })
        return
    }

    // Query DB for request
    req.db.from('users').select('*').where('email','=',email).then(
        (users) => {
            // Check if user exists
            if(users.length > 0){
                res.status(409).json({
                    error: true,
                    message: 'User already exists'
                })
                return
            }

            // Add new user to DB with encrypted password
            const hash = bcrypt.hashSync(password, 10)
            req.db.from('users').insert({email: email, password_hash: hash}).then(
                () => {
                    res.status(201).json({
                        message: 'User created'
                    })
                }
            )
        }
    )
});

/* Login user */
router.post('/login', function(req, res, next){
    const email = req.body.email
    const pass = req.body.password

    // Verify input
    if(!email || !pass){
        res.status(400).json({error: true, message: "Request body incomplete, both email and password are required"})
        return
    }
    // Query DB for request
    req.db.from('users').select('*').where({email}).then(
        (users) => {
            // If user not found in DB
            if(users.length === 0){
                res.status(401).json({
                    error: true,
                    message: "Incorrect email or password"
                })
                return
            }
            else{
                return bcrypt.compare(pass, users[0].password_hash, null).then(
                    (match) => {
                        if(!match){
                            res.status(401).json({
                                error: true,
                                message: "Incorrect email or password"
                            })
                            return
                        }
                        // Return JWT token for valid login
                        const expiresIn = 60*60*24
                        const exp = Date.now() + expiresIn * 1000
                        const token = jwt.sign({email, exp}, process.env.SECRET_KEY)
                        res.status(200).json({
                            token: token,
                            token_type : 'Bearer',
                            expires_in: expiresIn
                        })
                    })
            }
        })
});

/* Get User profile */
router.get('/api/user/:email/profile', auth, function(req, res, next){
    const email = req.params.email

    // Disallow additional params
    if(req.query.length > 1){
        res.status(400).json({
            error: true,
            message: "Invalid query parameters. Query parameters are not permitted."
        })
        return
    }

    if(!req.isAuthorized){
        // Check user in DB
        req.db.from('users').select('email','first_name','last_name').where({email}).then(
            (data) => {
                if(data.length === 0){
                    res.status(404).json({
                        error: true,
                        message: "User not found"
                    })
                    return
                }
                res.status(200).json({
                    email: data[0].email,
                    firstName: data[0].first_name,
                    lastName: data[0].last_name
                })
            }
        )
    }
    else{
        const jwtVerify = jwt.verify(req.token, process.env.SECRET_KEY)

        req.db.from('users').select('email','first_name','last_name','dob','address').where({email}).then(
            (data) => {
                if(data.length === 0){
                    res.status(404).json({
                        error: true,
                        message: "User not found"
                    })
                    return
                }
                if(jwtVerify.email !== email){
                    res.status(200).json({
                        email: data[0].email,
                        firstName: data[0].first_name,
                        lastName: data[0].last_name
                    })
                    return
                }
                res.status(200).json({
                    email: data[0].email,
                    firstName: data[0].first_name,
                    lastName: data[0].last_name,
                    dob: data[0].dob,
                    address: data[0].address
                })
            }
        )
    }
})

/* Update User profile */
router.put('/api/user/:email/profile', auth, function(req, res, next){
    const email = req.params.email
    const userData = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        dob: req.body.dob,
        address: req.body.address
    }

    // check for authorized request
    if(!req.isAuthorized){
        res.status(401).send({
            error: true,
            message: 'Authorization header (\'Bearer token\') not found'
        })
        return
    }

    // incomplete input data
    if(!userData.first_name || !userData.last_name || !userData.dob || !userData.address){
        res.status(400).json({
            error: true,
            message: 'Request body incomplete: firstName, lastName, dob and address are required.'
        })
        return
    }

    // accept only strings
    if(typeof userData.first_name !== 'string' || typeof userData.last_name !== 'string' || typeof userData.address !== 'string' ){
        res.status(400).json({
            error: true,
            message: 'Request body invalid: firstName, lastName and address must be strings only.'
        })
        return
    }

    // check dob is valid
    if(!validDate(userData.dob.replaceAll('-','/'))){
        res.status(400).json({
            error: true,
            message: 'Invalid input: dob must be a real date in format YYYY-MM-DD.'
        })
        return
    }

    // check dob not in future
    const today = new Date(userData.dob);
    const valid = new Date();
    if(today > valid){
        res.status(400).json({
            error: true,
            message: 'Invalid input: dob must be a date in the past.'
        })
        return
    }

    // check if valid email of user
    const jwtVerify = jwt.verify(req.token, process.env.SECRET_KEY)
    if(jwtVerify.email !== email){
        res.status(403).json({
            error: true,
            message: 'Forbidden'
        })
        return
    }

    // insert into DB and retrieve updated data
    req.db.from('users').update(userData).where({email}).then(
        () => {
            req.db.from('users').first('*').where({email}).then(
                (data) => {
                    res.status(200).json({
                        email: data.email,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        dob: data.dob,
                        address: data.address
                    })
                }
            )
        }
    )
})

module.exports = router;
