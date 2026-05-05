const connection = require("../db");

exports.validateVendor = (req, res) => {
  const { companyCode, vendorCode, orderType, orderNumber } = req.body;

  // Step 1: Check if Company exists
  const checkCompany = `SELECT * FROM vendor_data WHERE LOWER(companyCode) = LOWER(?)`;

  connection.query(checkCompany, [companyCode], (err, companyResult) => {
    if (err) return res.status(500).json({ success: false, message: "DB Error at Step 1" });

    if (companyResult.length === 0) {
      return res.json({ success: false, message: "Company not found ❌" });
    }

    // Step 2: Check if Vendor exists for that Company
    const checkVendor = `SELECT * FROM vendor_data WHERE LOWER(companyCode) = LOWER(?) AND vendorCode = ?`;

    connection.query(checkVendor, [companyCode, vendorCode], (err, vendorResult) => {
      if (err) return res.status(500).json({ success: false, message: "DB Error at Step 2" });

      if (vendorResult.length === 0) {
        return res.json({ success: false, message: "Invalid Vendor for this Company ❌" });
      }

      // Step 3: Check if Order Type matches
      const checkType = `SELECT * FROM vendor_data WHERE LOWER(companyCode) = LOWER(?) AND vendorCode = ? AND orderType = ?`;

      connection.query(checkType, [companyCode, vendorCode, orderType], (err, typeResult) => {
        if (err) return res.status(500).json({ success: false, message: "DB Error at Step 3" });

        if (typeResult.length === 0) {
          return res.json({ success: false, message: "Invalid Order Type ❌" });
        }

        // Step 4: Final Check (Order Number + Expire Date)
        const finalCheck = `SELECT * FROM vendor_data WHERE LOWER(companyCode) = LOWER(?) AND vendorCode = ? AND orderType = ? AND orderNumber = ?`;

        connection.query(finalCheck, [companyCode, vendorCode, orderType, orderNumber], (err, finalResult) => {
          if (err) return res.status(500).json({ success: false, message: "DB Error at Step 4" });

          if (finalResult.length === 0) {
            return res.json({ success: false, message: "Invalid Order Number ❌" });
          }

          // --- DATE VALIDATION LOGIC ---
          const record = finalResult[0];
          const expireDate = new Date(record.expire_date);
          const today = new Date();

          // Time remove karein comparison ke liye
          today.setHours(0, 0, 0, 0);
          expireDate.setHours(0, 0, 0, 0);

          if (expireDate < today) {
            return res.json({ 
              success: false, 
              message: `Order Expired! ⚠️ (Expired on: ${record.expire_date})` 
            });
          }

          // Sab sahi hai aur date bhi valid hai
          return res.json({ 
            success: true, 
            message: `All validations passed ✅ (Valid until: ${record.expire_date})` 
          });
        });
      });
    });
  });
};