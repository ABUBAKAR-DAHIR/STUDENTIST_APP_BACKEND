const bucket = require('../firebase/firebase.js')
const Note = require('../models/Notes.models.js')

async function uploadFile(req, res) {
    try{
        let file = req.file
        if(!file) return res.status(400).send("No file uploaded")
        const {universityIn, yearIn, semesterIn, facultyIn, subjectIn} = req.body
        if(!universityIn || !yearIn || !semesterIn || !facultyIn || !subjectIn) return res.status(400).send("Missing fields!!")
        

        let relativePath = file.originalname.trim().replace(/\s+/g, "_")
        let filePath = `${universityIn}/${yearIn}/${semesterIn}/${facultyIn}/${subjectIn}/${relativePath}`

        let fileUpload = bucket.file(filePath)
        

        let stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        })

        await new Promise((res, rej)=>{
            stream.on('error', rej)
            stream.on('finish', res) 
            stream.end(file.buffer)
        })

        await fileUpload.makePublic()
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`

        const fileData = {
            university: universityIn,
            year: yearIn,
            semester: semesterIn,
            faculty: facultyIn,
            subject: subjectIn,
            fileName: file.originalname, 
            fileUrl: publicUrl
        }

        await Note.updateOne(
            {
                university: universityIn,
                year: yearIn,
                semester: semesterIn,
                faculty: facultyIn,
                subject: subjectIn,
                fileName: file.originalname, 
                fileUrl: publicUrl
            },
            {$set: fileData},
            {upsert: true}
        )

        res.status(200).json({message: "File uploaded!", fileData})
        // res.status(200).json({message: "File uploaded!"})

    }
    catch(e){
        console.error(e);
        return res.status(500).send("Upload failed! " + e.message)
    }

}


async function uploadFolder(req, res){
    try{
        const files = req.files
        if(!files || files.length == 0) return res.status(400).send("No files Uploaded")
        const {universityIn, yearIn, semesterIn, facultyIn, subjectIn} = req.body
        if(!universityIn || !yearIn || !semesterIn || !facultyIn || !subjectIn) return res.status(400).send("Missing field(s)")
        
        let uploadedFiles = []
    
        for(let file of files){
            let relativePath = file.originalname.trim().replace(/\s+/g, '_')
            let filePath = `${universityIn}/${yearIn}/${semesterIn}/${facultyIn}/${subjectIn}/${relativePath}`
            let fileUpload = bucket.file(filePath)
            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            })
            
            
            await new Promise((res, rej)=>{
                stream.on('error', rej)
                stream.on('finish', res)
                stream.end(file.buffer)
            })
            
            await fileUpload.makePublic()
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`

    
    
            const noteData = {
                university: universityIn,
                year: yearIn,
                semester: semesterIn, 
                faculty: facultyIn,
                subject: subjectIn,
                fileName: file.originalname,
                fileUrl: publicUrl
            }

            await Note.updateOne(
                {
                university: universityIn,
                year: yearIn,
                semester: semesterIn,
                faculty: facultyIn,
                subject: subjectIn,
                fileName: file.originalname
                },
                {$set: noteData},
                {upsert: true}
            )
    
            uploadedFiles.push(noteData)
        }
    
        return res.status(200).json({message: "All files Uploaded!", uploadedFiles})
    }
    catch(e){
        console.error("Error: " + e.message);
        res.status(500).send("Error: " + e.message)
    }
}

async function deleteFolder(req, res) {
    try{
        const {university, year, semester, faculty, subject} = req.body
        if(!university || !year || !semester || !faculty || !subject) return res.status(400).send("Missing field(s)")
        
        let folderPath = `${university}/${year}/${semester}/${faculty}/${subject}/`
        
        let del_files = {
            university: university,
            year: year,
            semester: semester,
            faculty: faculty,
            subject: subject
        }
        let folder = await Note.find(del_files)
        if(folder.length > 0){
            let [files] = await bucket.getFiles({prefix: folderPath})
        
            await Promise.all(files.map((file) => file.delete()))
        
            await Note.deleteMany({
                university: university,
                year: year,
                semester: semester,
                faculty: faculty,
                subject: subject
            })
        
            res.status(200).send({message: "Folder deleted", folder})
        }
        else{
            res.status(400).send("Folder does not exist")
        }
    }
    catch(e){
        console.error(e.message);
        res.status(500).send("Error occurred: " + e.message)
    }
}

async function deleteFile(req, res) {
    try {
        const {university, year, semester, faculty, subject, fileName} = req.body
        if(!university || !year || !semester || !faculty || !subject || !fileName) return res.status(400).send("Missing field(s)")
        
        let file = {
            university: university,
            year: year,
            semester: semester,
            faculty: faculty,
            subject: subject,
            fileName: fileName
        }
        let filePath = `${university}/${year}/${semester}/${faculty}/${subject}/${fileName}`



        let isFile = await Note.findOne(file)
        if(! isFile) return res.status(400).send("No such file is here!")

        let fileDel = bucket.file(filePath)
        await fileDel.delete()
        await Note.deleteOne(file)
        return res.status(200).json({message: "File successfully deleted!", isFile})

        
        
    } catch (e) {
        console.error(e.message);
        return res.status(500).send("Error occurred: " + e.message)
    }
}

module.exports = {
    uploadFile,
    uploadFolder,
    deleteFolder,
    deleteFile
}