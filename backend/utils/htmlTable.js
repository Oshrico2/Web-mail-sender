const getTableHTML = (data) => {
  const htmlTable = `
            <html>
            <head>
                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        background-color: #E6DDC4;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <table>
                    <tr>
                        <th>#</th>
                        ${data[0]
                          .map((header) => `<th>${header}</th>`)
                          .join("")}
                    </tr>
                    ${data
                      .slice(1)
                      .map(
                        (row, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            ${row
                              .map(
                                (cell) =>
                                  `<td>${cell !== undefined ? cell : ""}</td>`
                              )
                              .join("")}
                        </tr>
                    `
                      )
                      .join("")}
                </table>
            </body>
            </html>
        `;
};
export default getTableHTML;
