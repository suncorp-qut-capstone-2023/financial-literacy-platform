const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../authorize.ts');
const videos = require('../videos.json');
const fs = require('fs');
const path = require('path');

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

router.get('/:video_ID/video', (req, res) => {
    const video_ID = req.params.video_ID;

    const videoName = "../api/assets/video" + video_ID + ".mp4";

    console.log("result: " + fs.existsSync(path.resolve(videoName)) + "\n\n");

    if (fs.existsSync(path.resolve(videoName))) {
        return res.sendFile(path.resolve(videoName));
    } else {
        return res.status(404).json({
            error: true,
            message: "Module video not found"
        })
    }
});

router.get('/:material_ID/material', (req, res) => {
    const material_ID = req.params.material_ID;

    let videoURL = "";

    for (let i = 0; i < videos.available_courses.length; i++) {
        for (let j = 0; j < videos.available_courses[i].material.length; j++) {
            if (videos.available_courses[i].material[j].material_id == material_ID) {
                videoURL = videos.available_courses[i].material[j].material_video;
            }
        }
    }

    if (videoURL == "") {
        return res.status(404).json({
            error: true,
            message: "Module video not found"
        })
    }

    return res.status(200).json({
            "video_URL": videoURL
    });
});

/*const server=http.createServer((req,res)=>{
    // return res.end(req.url+req.method);
    if(req.method==='GET' && req.url==="/"){
        // res.writeHead(200);
        fs.createReadStream(path.resolve("index.html")).pipe(res);
        return;
    }
    if(req.method==='GET' && req.url==="/video"){
        const filepath = path.resolve("video.mp4");
        const stat = fs.statSync(filepath)
        const fileSize = stat.size
        const range = req.headers.range
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1] ?parseInt(parts[1], 10) :fileSize - 1
            const chunksize = (end - start) + 1
            const file = fs.createReadStream(filepath, {start,end})
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
          file.pipe(res);
        }else{
           const head = {
               'Content-Length': fileSize,
               'Content-Type': 'video/mp4',
           }
           res.writeHead(200, head);
           fs.createReadStream(path).pipe(res);
        }
    }
    else{
        res.writeHead(400);
        res.end("bad request");
    }
})*/

/* View all available learning modules */
router.get('/viewAll', function(req, res, next) {

    return res.json({
        "available courses": videos.available_courses
    });
});

/* View content of learning module */
router.get('/:moduleID/viewContent', auth, function(req, res, next){
    const module_ID = req.params.moduleID;

    let found = false;

    for (let i = 0; i < videos.available_courses.length; i++) {
        if(videos.available_courses[i].course_id == module_ID) {
            found = true;

            return res.status(200).json({
                "module_information": videos.available_courses[i]
            });
        }
    }

    if (found == false) {
        res.status(404).json({
            error: true,
            message: "Module not found"
        })
    }
});

module.exports = router;
