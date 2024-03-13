const fs = require("fs");
const prompt = require("prompt-sync")();

const convertJsonToCsv = (jsonData) => {
  let csv = "";

  // Encabezados
  csv += "Nombre;Nota media\n";

  // Calculamos la media de cada alumno
  const studentAverages = {};
  jsonData.forEach((item) => {
    if (!studentAverages[item.name]) {
      studentAverages[item.name] = { sum: 0, count: 0 };
    }
    studentAverages[item.name].sum += item.mark;
    studentAverages[item.name].count++;
  });

  // Ordenamos las medias de mayor a menor
  const sortedAverages = Object.entries(studentAverages)
    .map(([name, { sum, count }]) => ({ name, average: sum / count }))
    .sort((a, b) => b.average - a.average);

  // Generamos las filas del CSV
  sortedAverages.forEach((student) => {
    csv += `${student.name};${student.average.toFixed(2)}\n`;
  });

  return csv;
};

const filePath = prompt("Introduce la ruta de un fichero JSON: ");

fs.readFile(filePath, (readError, data) => {
  if (readError) {
    console.log("Ha ocurrido un error leyendo el fichero");
  } else {
    try {
      const parsedData = JSON.parse(data);
      const csv = convertJsonToCsv(parsedData);

      const filePathOutput = prompt("Introduce la ruta del fichero a generar: ");
      fs.writeFile(filePathOutput, csv, (error) => {
        if (error) {
          console.log("Ha ocurrido un error escribiendo el fichero");
        } else {
          console.log("Fichero guardado correctamente!");
        }
      });
    } catch (parseError) {
      console.log("Ha ocurrido un error PARSEANDO el fichero");
    }
  }
});
