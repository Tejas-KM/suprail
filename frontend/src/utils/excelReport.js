/**
 *
 * @param {Object} params
 * @param {Array} params.projects - Array of project objects
 * @param {Object} params.user - Current user object
 */
export function downloadProjectExcelReport({ projects, user }) {
  if (!projects || projects.length === 0) {
    console.warn("No projects found for report generation.");
    return;
  }

  // Pipe sizes in fixed order
  const pipeSizes = [
    "20", "25", "32", "40", "50", "63", "75", "90", "110", "125", "140", "160",
    "180", "200", "225", "250", "280", "315", "400", "450"
  ];

  
  const header = [
    "Project Name",
    "Analysis Date",
    "Analyzed By",
    "Vehicle Number",
    "Total Pipes",
    ...pipeSizes.map((s) => `${s}mm Count`),
  ];

  
  const rows = projects.map((project) => {
    const pipeCounts = pipeSizes.map((size) => {
      const found = (project.productCount || []).find((it) => it.name === size);
      return found ? Number(found.count) : 0;
    });
    const total = pipeCounts.reduce((a, b) => a + b, 0);

    return [
      project.name || "",                                                   
      project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "", 
      user?.name || "",                                                     
        project.vehicleNumber || "",                                          
      total,                                                                
      ...pipeCounts                                                         
    ];
  });

 
  const tableStyles = `font-family: Arial, Helvetica, sans-serif; border-collapse: collapse; width: 100%;`;
  const headerStyle = `background:#4F81BD;color:#FFFFFF;font-weight:bold;text-align:center;padding:6px;border:1px solid #ccc;`;
  const cellStyle = `padding:6px;border:1px solid #ccc;text-align:center;`;
  const yellowBg = `background:#FFFF00;`;
  const goldBg = `background:#FFD700;`;

  let html = `<!doctype html><html><head><meta charset="utf-8"></head><body><table style="${tableStyles}">`;

  // Render header
  html += '<thead><tr>';
  header.forEach((h) => {
    html += `<th style="${headerStyle}">${h}</th>`;
  });
  html += '</tr></thead><tbody>';

  // Rows
  const totalIndex = header.indexOf("Total Pipes");
  rows.forEach((row) => {
    html += "<tr>";
    row.forEach((val, colIndex) => {
      const isNumber = typeof val === "number" || (!isNaN(val) && val !== "" && val !== null);
      let style = cellStyle;

      if (isNumber && Number(val) > 0) {
        if (colIndex === totalIndex) style += goldBg; // highlight total
        else if (colIndex > totalIndex) style += yellowBg; // highlight non-zero pipe counts
      }

      const display = val == null ? "" : val;
      html += `<td style="${style}">${display}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table></body></html>";

  // Trigger Excel download
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const filename = `Projects_Report_${new Date().toISOString().slice(0, 10)}.xls`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
