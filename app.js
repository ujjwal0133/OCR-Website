const express = require('express');
const app = express();
const multer = require('multer');
const tesseract = require('tesseract.js');
const sharp = require('sharp');
const dotenv = require('dotenv');
const cors = require('cors')
const path = require('path')
// const mongoose = require('mongoose');

dotenv.config();

app.use(cors());

app.use(
  express.static(
    path.join(__dirname, 'public')
  )
);

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Could not connect to MongoDB:', err));   

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


// const demoSchema = new mongoose.Schema({
//     text: String,
//     createdAt: { type: Date, default: Date.now }
// });

// const Demo = mongoose.model('Demo', demoSchema);

app.get('/api', (req, res) => {
    res.json(
        {
            message : 'THIS IS A DEMO OCR APPLICATION'
        }

    );
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');  
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);  
//     }
// });

const upload = multer();

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log('file has not arrived in the request')
        return res.status(400).send('No file uploaded.');
    }

     sharp(req.file.buffer)
    .resize({ width: 2000 })
    .toBuffer()

    .then((buffer) => tesseract.recognize(
        buffer,
        'eng'
    ))

    .then(result => {
        res.json({ text: result.data.text });
    })

    .catch(err => {
        console.error(err);
        res.status(500).send('Error processing image.');
    });

    console.log('File is being uploaded');

});

app.use((req, res) => {
    res.sendFile(
        path.join(__dirname, 'public', 'index.html')
    );
});