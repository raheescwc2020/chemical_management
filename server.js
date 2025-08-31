const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Use mysql2 with Promises

const app = express();
app.use(cors());
app.use(express.json());




// MySQL Connection Details
const pool = mysql.createPool({
  user: 'rahees',           // Replace with your MySQL root user
  host: 'localhost',      // Your MySQL host (default is localhost)
  database: 'chemical_data', // Replace with your database name
  password: 'raihan',       // Replace with your MySQL root password
  port: 3306              // Default port for MySQL
});

// Route to get employees

/* 
app.get('/api/chemical_2025', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM chemical_consumption_2025`);
    res.json(rows);
  } catch (err) {
    // Log the full error object for detailed debugging
    // This will show you exactly what went wrong, such as a bad connection or a typo.
    console.error('Error fetching data from the database:', err);
    
    // Determine the response message based on the environment
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = isProduction ? 'An unexpected error occurred.' : err.message;
    
    // Send a 500 status code with a descriptive error message
    res.status(500).json({ error: errorMessage });
  }
});
 */



app.get('/api/chemical_2025', async (req, res) => {
  const sqlQuery = `
    SELECT
      WarehouseName,
      Nameofchemical,
      -- Consolidated Opening Balance for APRIL ONLY
      SUM(CASE WHEN Month = 'April 2025' THEN CAST(OpeningBalance_Qty AS DECIMAL(10, 2)) ELSE 0 END) AS Opening_Balance_Qty_April,
      SUM(CASE WHEN Month = 'April 2025' THEN CAST(OpeningBalance_Value AS DECIMAL(10, 2)) ELSE 0 END) AS Opening_Balance_Value_April,
      -- Consolidated Closing Balance for JULY ONLY
      SUM(CASE WHEN Month = 'July 2025' THEN CAST(TotalQtyAvailableonClosing AS DECIMAL(10, 2)) ELSE 0 END) AS Closing_Balance_Qty_July,
      SUM(CASE WHEN Month = 'July 2025' THEN CAST(TotalValueofChemicalonClosing AS DECIMAL(10, 2)) ELSE 0 END) AS Closing_Balance_Value_July,
      -- Sum of all other fields for the entire period (April to July)
      SUM(CAST(ConsumptiononRegularOperations_Qty AS DECIMAL(10, 2))) AS Total_ConsumptiononRegularOperations_Qty,
      SUM(CAST(ConsumptiononRegularOperations_Value AS DECIMAL(10, 2))) AS Total_ConsumptiononRegularOperations_Value,
      SUM(CAST(PCSConsumption_Qty AS DECIMAL(10, 2))) AS Total_PCSConsumption_Qty,
      SUM(CAST(PCSConsumption_Value AS DECIMAL(10, 2))) AS Total_PCSConsumption_Value,
      SUM(CAST(TotalChemicalConsumption_Value AS DECIMAL(10, 2))) AS Total_TotalChemicalConsumption_Value,
      SUM(CAST(TotalChemicalConsumption_Qty AS DECIMAL(10, 2))) AS Total_TotalChemicalConsumption_Qty,
      SUM(CAST(ReceiptofChemicalsfromRObuffer_Qty AS DECIMAL(10, 2))) AS Total_ReceiptofChemicalsfromRObuffer_Qty,
      SUM(CAST(ReceiptofChemicalsfromRObuffer_Value AS DECIMAL(10, 2))) AS Total_ReceiptofChemicalsfromRObuffer_Value,
      SUM(CAST(ReceiptofChemicalsWithinWHunderROKochi_Qty AS DECIMAL(10, 2))) AS Total_ReceiptofChemicals_WithinROKochi_Qty,
      SUM(CAST(ReceiptofChemicals_WithinWHunderROKochi_Value AS DECIMAL(10, 2))) AS Total_ReceiptofChemicals_WithinROKochi_Value,
      SUM(CAST(ReceiptofChemical_FromOutsideROKochi_Qty AS DECIMAL(10, 2))) AS Total_ReceiptofChemical_FromOutside_Qty,
      SUM(CAST(ReceiptofChemical_FromOutsideROKochi_Value AS DECIMAL(10, 2))) AS Total_ReceiptofChemical_FromOutside_Value,
      SUM(CAST(TotalReceiptofChemicalattheWarehouse_Qty AS DECIMAL(10, 2))) AS Total_ReceiptofChemical_at_Warehouse_Qty,
      SUM(CAST(TotalReceiptofChemicalattheWarehouseValue AS DECIMAL(10, 2))) AS Total_ReceiptofChemical_at_Warehouse_Value,
      SUM(CAST(InterwhTransferofChemical_WithinROKochi_Qty AS DECIMAL(10, 2))) AS Total_InterwhTransfer_WithinROKochi_Qty,
      SUM(CAST(InterwhTransferofChemical_WithinROKochi_Value AS DECIMAL(10, 2))) AS Total_InterwhTransfer_WithinROKochi_Value,
      SUM(CAST(IntraWHTransfer_ToOutsideROKochi_Qty AS DECIMAL(10, 2))) AS Total_IntraWHTransfer_ToOutside_Qty,
      SUM(CAST(IntraWHTransfer_ToOutsideROKochi_Value AS DECIMAL(10, 2))) AS Total_IntraWHTransfer_ToOutside_Value,
      SUM(CAST(TotalTransferofChemcalfromWH_Qty AS DECIMAL(10, 2))) AS Total_TotalTransferofChemcal_from_WH_Qty,
      SUM(CAST(TotalTransferofChemcalfromWH_Value AS DECIMAL(10, 2))) AS Total_TotalTransferofChemcal_from_WH_Value,
      SUM(CAST(PuchaseofChemicalfromWH_Qty AS DECIMAL(10, 2))) AS Total_PuchaseofChemical_from_WH_Qty,
      SUM(CAST(PuchaseofChemicalfromWH_Value AS DECIMAL(10, 2))) AS Total_PuchaseofChemical_from_WH_Value,
      SUM(CAST(PurchaseofChemicalfromRO_Qty AS DECIMAL(10, 2))) AS Total_PurchaseofChemical_from_RO_Qty,
      SUM(CAST(PurchaseofChemicalfromRO_Value AS DECIMAL(10, 2))) AS Total_PurchaseofChemical_from_RO_Value,
      SUM(CAST(TotalPurchaseofChemicalatWH_Qty AS DECIMAL(10, 2))) AS Total_PurchaseofChemical_at_WH_Qty,
      SUM(CAST(TotalPurchaseofChemicalatWH_Value AS DECIMAL(10, 2))) AS Total_PurchaseofChemical_at_WH_Value
    FROM
      chemical_consumption_2025
    WHERE
      Month IN ('April 2025', 'May 2025', 'June 2025', 'July 2025')
    GROUP BY
      WarehouseName, Nameofchemical
      HAVING
  SUM(
    COALESCE(CAST(OpeningBalance_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(OpeningBalance_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(TotalQtyAvailableonClosing AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(TotalValueofChemicalonClosing AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(ConsumptiononRegularOperations_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(ConsumptiononRegularOperations_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(PCSConsumption_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(PCSConsumption_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(TotalChemicalConsumption_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(TotalChemicalConsumption_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(ReceiptofChemicalsfromRObuffer_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(ReceiptofChemicalsfromRObuffer_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(ReceiptofChemicalsWithinWHunderROKochi_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(ReceiptofChemicals_WithinWHunderROKochi_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(ReceiptofChemical_FromOutsideROKochi_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(ReceiptofChemical_FromOutsideROKochi_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(TotalReceiptofChemicalattheWarehouse_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(TotalReceiptofChemicalattheWarehouseValue AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(InterwhTransferofChemical_WithinROKochi_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(InterwhTransferofChemical_WithinROKochi_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(IntraWHTransfer_ToOutsideROKochi_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(IntraWHTransfer_ToOutsideROKochi_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(TotalTransferofChemcalfromWH_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(TotalTransferofChemcalfromWH_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(PuchaseofChemicalfromWH_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(PuchaseofChemicalfromWH_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(PurchaseofChemicalfromRO_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(PurchaseofChemicalfromRO_Value AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(TotalPurchaseofChemicalatWH_Qty AS DECIMAL(10, 2)), 0) +
    COALESCE(CAST(TotalPurchaseofChemicalatWH_Value AS DECIMAL(10, 2)), 0)
  ) > 0`;
  
  try {
    const [rows] = await pool.query(sqlQuery);
    res.json(rows);
  } catch (err) {
    // Log the full error object for detailed debugging on the server side
    console.error('Error fetching data from the database:', err);

    // Determine the response message based on the environment
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = isProduction ? 'An unexpected error occurred.' : err.message;

    // Send a 500 status code with a descriptive error message
    res.status(500).json({ error: errorMessage });
  }
}); 

app.get('/api/chemical-wise-consumption', async (req, res) => {

  const currentConsumables = `SELECT * from  chemical_consumption_2025`;
  try {
    const [rows] = await pool.query(currentConsumables);
    res.json(rows);
  } catch (err) {
    // Log the full error object for detailed debugging on the server side
    console.error('Error fetching data from the database:', err);

    // Determine the response message based on the environment
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = isProduction ? 'An unexpected error occurred.' : err.message;

    // Send a 500 status code with a descriptive error message
    res.status(500).json({ error: errorMessage });
  }

});

app.listen(3005, () => {
  console.log('Server running on port 3005');
});
