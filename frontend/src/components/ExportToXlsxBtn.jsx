import React from 'react';
import * as XLSX from 'xlsx';
import { getCurrentDateFormatted } from '../utils/scripts';
import { Button } from 'react-bootstrap';
import { RiFileExcel2Line } from "react-icons/ri";

const ExportToXlsx = ({ jsonData, fileName }) => {

    const preprocessData = (data) => {
        // Deep clone the data to avoid mutating the original
        const clonedData = JSON.parse(JSON.stringify(data));

        // Iterate through each object in the array
        clonedData.forEach(obj => {
            // Iterate through each key in the object
            Object.keys(obj).forEach(key => {
                // Check if the value is an array
                if (Array.isArray(obj[key])) {
                    // Convert array to string
                    obj[key] = obj[key].join(', '); // You can choose any string representation you prefer
                }
            });
        });

        return clonedData;
    };

    const exportToXlsx = () => {
        // Preprocess JSON data to convert arrays to strings
        const preprocessedData = preprocessData(jsonData);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert the JSON data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(preprocessedData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'גיליון1');

        // Generate XLSX file and trigger download
        XLSX.writeFile(workbook, `${fileName} - ${getCurrentDateFormatted()}.xlsx`);
    };

    return (
        <Button style={{width:'100%'}} variant='success' onClick={exportToXlsx}>
            ייצא לאקסל {<RiFileExcel2Line size={'25px'} className='pe-1' />}
        </Button>
    );
};

export default ExportToXlsx;
