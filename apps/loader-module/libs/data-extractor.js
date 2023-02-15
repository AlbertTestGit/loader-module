const XLSX = require('xlsx');

function parseRange(str) {
    const result = [];

    const parts = str.split(',');
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].indexOf('-') > 0) {
            const range = parts[i].split('-');
            const start = parseInt(range[0]);
            const end = parseInt(range[1]);
            for (let j = start; j <= end; j++) {
                result.push(j);
            }
        } else {
            result.push(parseInt(parts[i]));
        }
    }

    return result;
}

function selectByRange(arr, range) {
    return arr.filter((_, index) => range.includes(index + 1));
}

function extractData(instructions, workbook) {
    let data_to_upload = [];

    const sheetNames = workbook.SheetNames;

    if (Array.isArray(instructions[0])) {
        console.log('Массив массивов');
    } else {
        const worksheet = workbook.Sheets[sheetNames[0]];

        let xlsx_json = XLSX.utils.sheet_to_json(worksheet, { raw: false, header: 1, blankrows: true });

        let headers = [];
        let data = [];
        let data_types = [];

        const usecols = instructions.filter(instruction => 'usecols' in instruction)[0]?.['usecols'];
        if (usecols) {
            const range = parseRange(usecols);
            xlsx_json.forEach((row, i) => {
                xlsx_json[i] = selectByRange(row, range);
            });
        }

        instructions.forEach(instruction => {
            const instruction_name = Object.keys(instruction)[0];
            const instruction_value = instruction[instruction_name];

            // TODO: take
            if (instruction_name === 'take') {
                if (instruction_value === 'headers') {
                    headers = xlsx_json[0];
                    data_types = xlsx_json[1];
                    xlsx_json = xlsx_json.slice(1);
                }
                if (instruction_value === 'data') {
                    data = xlsx_json;
                }
            }

            // TODO: skip
            if (instruction_name === 'skip') {
                xlsx_json = xlsx_json.slice(instruction_value);
            }

            // TODO: usecols
            if (instruction_name === 'usecols') { }
        });

        data.forEach(row => {
            let obj = {};

            row.forEach((cell, i) => {
                const cell_type = data_types[i].split('.')[0].toLowerCase();

                if (cell_type === 'date') {
                    obj[headers[i]] = new Date(cell);
                } else {
                    obj[headers[i]] = cell;
                }

                // obj[headers[i]] = cell_type === 'list' ? cell.replaceAll(' ', '').split(',') : cell;
            });

            data_to_upload.push(obj);
        });

        return data_to_upload;
    }
}

module.exports = extractData;
