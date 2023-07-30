const request = require('supertest');
const app = require('../app');

// Random Test Values
const randomEmail = () => `${Math.random().toString(36).substring(7)}@test.com`;
const randomCourseId = () => Math.floor(Math.random() * 2) + 1;
const randomMediaImageID = () => Math.floor(Math.random() * 1) + 1;
const randomMediaVideoID = () => Math.floor(Math.random() * 2) + 1;
const randomModuleID = () => Math.floor(Math.random() * 2) + 1;

describe('GET /api/about', () => {
    it('should retrieve about information', async () => {
        const response = await request(app).get('/api/about');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('company', 'Suncorp-Metway');
    });
});

describe('POST /api/user/login', () => {
    it('should log in successfully with valid credentials', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({ email: 'mike@gmail.com', password: 'password' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should return an error when logging in with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({ email: 'invalid@user.com', password: 'invalidpassword' });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'Incorrect email or password');
    });
});

describe('POST /api/user/register', () => {
    it('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send({ email: randomEmail(), password: 'test' });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created');
    });

    it('should return an error if username is already taken', async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send({ email: 'mike@gmail.com', password: 'test' });

        expect(response.statusCode).toBe(409);
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'User already exists');
    });
});

describe('GET /api/learningmodules', () => {
    it('should retrieve all available courses information', async () => {
        const response = await request(app).get('/api/learningmodules');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('available courses');
    });

    it('should retrieve single course information', async () => {
        const response = await request(app).get(`/api/learningmodules/${courseID}`);
    
        expect(response.statusCode).toBe(200);
    
        const foundCourse = response.body['available courses'].find(course => course.course_id === courseID);
    
        expect(foundCourse).not.toBeNull();
        expect(foundCourse).toHaveProperty('course_id', courseID);
    });
    
});

describe('GET /api/learningmodules/media', () => {
    const imageID = randomMediaImageID()
    const videoID = randomMediaVideoID()

    it('should retrieve a media image for a course', async () => {
        const imageID = 1; // Make sure this ID exists in your database
        const response = await request(app).get(`/api/learningmodules/media?image=${imageID}`);
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('image', `http://127.0.0.1:443/api/learningModules/${imageID}/image`);
    });
    

    it('should retrieve a media video for a course', async () => {
        const videoID = 1; // Make sure this ID exists in your database
        const response = await request(app).get(`/api/learningmodules/media?video=${videoID}`);
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('video', `http://127.0.0.1:443/api/learningModules/${videoID}/video`);
    });
    

    it('should give an error, when both image and video id is passed', async () => {
        const imageID = 1; // Make sure this ID exists in your database
        const videoID = 2; // Make sure this ID exists in your database
        const response = await request(app).get(`/api/learningmodules/media?image=${imageID}&video=${videoID}`);
    
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'Bad request, please specify an image ID OR video ID');
    });
    
});

// TODO(Geoffrey): This endpoint does not exist anymore. Please update
// describe('GET /api/learningmodules/{moduleID}/viewContent', () => {
//     const moduleID = randomModuleID()

//     it('should retrieve the contents of a module', async () => {
//         const moduleID = 1; // Ensure this module ID exists in your database
//         const response = await request(app).get(`/api/learningmodules/${moduleID}/viewContent`);
    
//         expect(response.statusCode).toBe(200);
//         expect(response.body).toHaveProperty('module_information');
//     });
    

//     it('should give error, for an unrecognised module', async () => {
//         const moduleID = 999; // Use a non-existing module ID for this test
//         const response = await request(app).get(`/api/learningmodules/${moduleID}/viewContent`);
    
//         expect(response.statusCode).toBe(404);
//         expect(response.body).toHaveProperty('error', true);
//         expect(response.body).toHaveProperty('message', 'Module not found');
//     });
    
});