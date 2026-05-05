const connection = require("../db");  

exports.validateVendor = (req, res) => {
  const { companyCode, vendorCode, orderType, orderNumber } = req.body;

  const query = `
    SELECT * FROM vendor_data 
    WHERE LOWER(companyCode) = LOWER(?) 
    AND vendorCode = ?
    AND orderType = ?
    AND orderNumber = ?
  `;

  connection.query(
    query,
    [companyCode, vendorCode, orderType, orderNumber],
    (err, result) => {
      if (err) {
        console.log("❌ SQL ERROR:", err);
        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      if (result.length === 0) {
        return res.json({
          success: false,
          message: "Invalid details ❌"
        });
      }

      return res.json({
        success: true,
        message: "All validations passed ✅"
      });
    }
  );
};