const express = require('express');
const multer = require('multer');

const XLSX = require('xlsx');
const extractData = require('../libs/data-extractor');

const { PrismaClient } = require('@prisma/client');

const router = express.Router();

router.use(express.json())
router.use(multer({storage: multer.memoryStorage()}).single('file'));

router.post('/', async (req, res) => {
    // TODO: валидировать входные данные
    const instructions = eval(req.body.instructions);
    const file = req.file;

    const workbook = XLSX.read(file.buffer);
    const sheetNames = workbook.SheetNames;

    let data = [];

    if (Array.isArray(instructions[0])) {
        instructions.forEach((instructions_for_sheet, i) => {
            const worksheet = workbook.Sheets[sheetNames[i]];
            data.push(extractData(instructions_for_sheet, worksheet));
        });
    } else {
        const worksheet = workbook.Sheets[sheetNames[0]];
        data.push(extractData(instructions, worksheet));
    }

    const prisma = new PrismaClient();

    data.forEach(async (sheet_data, i) => {
        const table_name = sheetNames[i];

        sheet_data.forEach(async (row) => {
            if (table_name === 'Object') {
                await prisma.object.create({
                    data: row,
                });
            }
            if (table_name === 'Well') {
                await prisma.well.create({
                    data: row,
                });
            }
        });
    });

    await prisma.$disconnect();

    return res.send(data);
});

module.exports = router;
