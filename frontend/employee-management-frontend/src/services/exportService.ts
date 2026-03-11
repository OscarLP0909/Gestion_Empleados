import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Contract } from "../types/contract";
import type { Employee } from "../types/employee";

export const exportService = {
    exportEmployeesToPDF: (employees: Employee[]) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Título
        doc.setFontSize(20);
        doc.text("Listado de Empleados", pageWidth / 2, 20, { align: "center" });

        // Fecha
        doc.setFontSize(10);
        doc.text(
            `Generado: ${new Date().toLocaleDateString("es-ES")}`,
            pageWidth / 2,
            30,
            { align: "center" }
        );

        // Tabla
        const tableData = employees.map((emp) => [
            emp.name,
            emp.surname,
            emp.nif,
            emp.email,
            emp.phone || "-",
            emp.city || "-",
            emp.province || "-",
        ]);

        autoTable(doc, {
            head: [["Nombre", "Apellido", "NIF", "Email", "Teléfono", "Ciudad", "Provincia"]],
            body: tableData,
            startY: 40,
            theme: "grid",
            styles: { fontSize: 9 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        doc.save(`Empleados_${new Date().getTime()}.pdf`);
    },

    exportContractsToPDF: (contracts: Contract[], employees: Map<string, Employee>) => {
        const doc = new jsPDF("l"); // landscape
        const pageWidth = doc.internal.pageSize.getWidth();

        // Título
        doc.setFontSize(20);
        doc.text("Listado de Contratos", pageWidth / 2, 20, { align: "center" });

        // Fecha
        doc.setFontSize(10);
        doc.text(
            `Generado: ${new Date().toLocaleDateString("es-ES")}`,
            pageWidth / 2,
            30,
            { align: "center" }
        );

        // Tabla
        const tableData = contracts.map((contract) => {
            const emp = employees.get((contract as any).employeeId);
            const employeeName = emp ? `${emp.name} ${emp.surname}` : "N/A";

            return [
                employeeName,
                contract.department,
                contract.position,
                contract.contractType,
                contract.workdayType,
                contract.salaryAmount.toFixed(2),
                contract.status,
                new Date(contract.startDate).toLocaleDateString("es-ES"),
                contract.endDate
                    ? new Date(contract.endDate).toLocaleDateString("es-ES")
                    : "-",
            ];
        });

        autoTable(doc, {
            head: [
                [
                    "Empleado",
                    "Departamento",
                    "Puesto",
                    "Tipo",
                    "Jornada",
                    "Salario (€)",
                    "Estado",
                    "Inicio",
                    "Fin",
                ],
            ],
            body: tableData,
            startY: 40,
            theme: "grid",
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        doc.save(`Contratos_${new Date().getTime()}.pdf`);
    },

    exportReportToPDF: (
        stats: any,
        statusData: any[],
        departmentData: any[],
        typeData: any[]
    ) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPosition = 20;

        // Título
        doc.setFontSize(20);
        doc.text("Reporte de Recursos Humanos", pageWidth / 2, yPosition, {
            align: "center",
        });

        // Fecha
        yPosition += 10;
        doc.setFontSize(10);
        doc.text(
            `Generado: ${new Date().toLocaleDateString("es-ES")}`,
            pageWidth / 2,
            yPosition,
            { align: "center" }
        );

        // Estadísticas generales
        yPosition += 15;
        doc.setFontSize(14);
        doc.text("Estadísticas Generales", 20, yPosition);

        yPosition += 10;
        doc.setFontSize(10);
        const statsTable = [
            ["Total de Contratos", stats.totalContracts.toString()],
            ["Total de Empleados", stats.totalEmployees.toString()],
            ["Contratos Activos", stats.activeContracts.toString()],
            ["Contratos Pendientes", stats.pendingContracts.toString()],
            ["Gasto Total en Nómina", `${stats.totalSalary.toFixed(2)} €`],
            ["Tasa de Aprobación", `${stats.approvalRate}%`],
        ];

        autoTable(doc, {
            head: [["Concepto", "Valor"]],
            body: statsTable,
            startY: yPosition,
            theme: "grid",
            styles: { fontSize: 9 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
        });

        // Estado de contratos
        yPosition = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Estado de Contratos", 20, yPosition);

        yPosition += 10;
        const statusTableData = statusData.map((d) => [d.name, d.value.toString()]);
        autoTable(doc, {
            head: [["Estado", "Cantidad"]],
            body: statusTableData,
            startY: yPosition,
            theme: "grid",
            styles: { fontSize: 9 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
        });

        // Contratos por departamento
        yPosition = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Contratos por Departamento", 20, yPosition);

        yPosition += 10;
        const departmentTableData = departmentData.map((d) => [d.name, d.value.toString()]);
        autoTable(doc, {
            head: [["Departamento", "Cantidad"]],
            body: departmentTableData,
            startY: yPosition,
            theme: "grid",
            styles: { fontSize: 9 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
        });

        doc.save(`Reporte_RRHH_${new Date().getTime()}.pdf`);
    },
};