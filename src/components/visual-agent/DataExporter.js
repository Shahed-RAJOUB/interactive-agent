import * as XLSX from "xlsx";

export const exportToExcel = (data, fileName = "data.xlsx") => {
    if (!data || data.length === 0) {
        alert("No data to export!");
        return;
    }

    // Reorder columns and ensure headers
    const formattedData = data.map((row) => ({
        Time: row.time,
        Nose_X: row.nose_x,
        Nose_Y: row.nose_y,
        LeftEye_X: row.leftEye_x,
        LeftEye_Y: row.leftEye_y,
        RightEye_X: row.rightEye_x,
        RightEye_Y: row.rightEye_y,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HeadMovement");
    XLSX.writeFile(workbook, fileName);
};
