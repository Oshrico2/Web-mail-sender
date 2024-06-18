const formatDates = (data) => {
    for (const item of data) {
      if(item['תאריך שינוי']){
        const milliseconds1 = (item["תאריך שינוי"] - 25569) * 86400 * 1000;
        const date1 = new Date(milliseconds1);
        
        item["תאריך שינוי"] = date1.toLocaleDateString("he-IL", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      }
      const milliseconds2 = (item["תאריך יצירה"] - 25569) * 86400 * 1000;
      const date2 = new Date(milliseconds2);
      item["תאריך יצירה"] = date2.toLocaleDateString("he-IL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
    return data
  };

  const getCurrentDateFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  export {formatDates, getCurrentDateFormatted};