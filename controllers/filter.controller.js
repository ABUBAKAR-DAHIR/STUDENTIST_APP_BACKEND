const Note = require("../models/Notes.models");

async function filterFolder(req, res) {
    try {
        const {university, year, semester, faculty, subject} = req.body
        if(!university || !year || !semester || !faculty || !subject) return res.status(400).send("Missing fields")
        
        let notes = await Note.find().lean()

        if(notes.length > 0){
            let notesArray = notes.map((note) => note.fileUrl)
            return res.status(200).json({message: "Notes found", notesArray})
        }
        else{
            return res.status(404).send("No Notes found")
        }
    } 
    catch (error) {
        console.error("Error occurred: " + error.message);
        return res.status(500).send("Error occurred: " +  error.message)
    }
}

async function getNotesByPrefix(req, res) {
    try {
        const {prefix} = req.body
        if(!prefix) return res.status(400).send("Missing fields")
        
        let notes = await Note.find({
            fileUrl: {$regex: `^${prefix}`, $options: 'i'}
        }).lean()

        if(notes.length <= 0){
            return res.status(404).send("No Notes found")
        }
        
        let data = {}
        const subjectSet = new Set()
        const topicSet = new Set()
        
        notes.forEach((note) => {
            const parts = note.fileUrl.split('/')
            let subject = parts[parts.length-2]
            let topic = parts[parts.length-1]

            if(subject) subjectSet.add(subject)
            if(topic) topicSet.add(topic)

        })

        data = {
            subjects: Array.from(subjectSet),
            topics: Array.from(topicSet)
        }

        return res.status(200).json({message: "Notes found", data})
    } 
    catch (error) {
        console.error("Error occurred: " + error.message);
        return res.status(500).send("Error occurred: " +  error.message)
    }
}




// IMP
// let notes = await Note.find({
//     university, year, semester, faculty, subject
// }).lean();

module.exports = {
    filterFolder,
    getNotesByPrefix
}

// const Note = require("../models/Notes.models.js");

// async function getPdfUrl(req, res) {
//     try {
//         const {university, year, semester, faculty, subject, fileName} = req.body
//         if(!university || !year || !semester || !faculty || !subject || !fileName) return res.status(400).json({ok: false, message: "Missing fields"})
        
//         let note = await Note.findOne({
//             university: university,
//             year: year,
//             semester: semester,
//             faculty: faculty,
//             subject: subject,
//             fileName: fileName
//         }).lean()

//         if(!note){
//             return res.status(404).json({ok: false, message: "No Notes found"})
//         }

//         return res.status(200).json({ok: true, message: "Notes found", fileUrl: note.fileUrl})
        
//     } 
//     catch (error) {
//         console.error("Error occurred: " + error.message);
//         return res.status(500).json({ok:false, message: "Error occurred: " +  error.message})
//     }
// }

// async function getSubjects(req, res) {
//     try {
//         const {university, year, semester, faculty} = req.body
//         if(!university || !year || !semester || !faculty) return res.status(400).json({ok: false, message: "Missing fields"})
        
//         let subjects = await Note.find({
//             university: university,
//             year: year,
//             semester: semester,
//             faculty: faculty
//         }).lean()

//         if(subjects.length <= 0){
//             return res.status(404).json({ok: false, message: "No Subjects found"})
//         }

//         let subjectsArray = subjects.map((note) => note.subject)
//         return res.status(200).json({ok: true, message: "subjects found", subjectsArray})
        
//     } 
//     catch (error) {
//         console.error("Error occurred: " + error.message);
//         return res.status(500).json({ok:false, message: "Error occurred: " +  error.message})
//     }
// }

// async function getUnits(req, res) {
    
// }


// // IMP
// // let notes = await Note.find({
// //     university, year, semester, faculty, subject
// // }).lean();

// module.exports = {
//     getPdfUrl,
//     getSubjects
// }