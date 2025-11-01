import * as path from "path";
import * as XLSX from "xlsx";

const file = path.join(__dirname, "input", "exemplo.xlsx");
const wb = XLSX.readFile(file);
console.log("Sheets:", wb.SheetNames);
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
console.log("Header row:", data[0]);
console.log("First data row:", data[1]);
