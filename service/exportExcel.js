import ExcelJS from 'exceljs';
import PlaceDTO from '../dto/PlaceDTO.js';
import path from 'path';
import fs from 'fs';

// Fungsi untuk membuat file Excel
export async function exportToExcel(businesses, date, keyword) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Header kolom
    worksheet.columns = [
        { header: 'Place ID', key: 'placeId', width: 20 },
        { header: 'Place Name', key: 'storeName', width: 30 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Address', key: 'address', width: 30 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Website', key: 'bizWebsite', width: 30 },
        { header: 'Google URL', key: 'googleUrl', width: 40 },
        { header: 'Rating', key: 'ratingText', width: 20 }
    ];

    // Isi data dari businesses
    businesses.forEach(business => {
        const placeDTO = new PlaceDTO(
            business.placeId,
            business.address,
            business.category,
            business.phone,
            business.googleUrl,
            business.bizWebsite,
            business.storeName,
            business.ratingText
        );
        worksheet.addRow(placeDTO);
    });

    // Menghapus spasi dari string keyword
    keyword = keyword.replace(/\s+/g, '-');

    // Mengubah format tanggal menjadi "yyyyMMdd"
    date = date.slice(0, 4) + date.slice(5, 7) + date.slice(8, 10);

    const fileName = `${keyword}-${date}.xlsx`;
    await workbook.xlsx.writeFile(fileName);

    return fileName;

}