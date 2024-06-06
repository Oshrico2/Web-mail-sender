import React from 'react';
import * as XLSX from 'xlsx';
import { getCurrentDateFormatted } from '../utils/scripts';
import { Button } from 'react-bootstrap';
import { RiFileExcel2Line } from "react-icons/ri";

const ExportToXlsx = ({ jsonData, fileName }) => {


    const exportToXlsx = () => {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert the JSON data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(jsonData);

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
