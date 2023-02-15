const express = require('express');
const multer = require('multer');

const XLSX = require('xlsx');
const extractData = require('../libs/data-extractor');

const conf = require('./conf')
const router = express.Router();

router.use(express.json())
router.use(multer({storage: multer.memoryStorage()}).single('file'));

router.post('/', (req, res) => {
    const instructions = eval(req.body.instructions);
    const file = req.file;
    const workbook = XLSX.read(file.buffer);
    console.log(workbook.SheetNames);
    res.send(extractData(instructions, workbook));
});

module.exports = router;
