const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/vendors.json");

exports.validateVendor = (req, res) => {
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const { companyName, vendorCode, orderType, orderNumber } = req.body;


const companyData = data.filter(
  (item) =>
    item.companyName.toLowerCase() === companyName.toLowerCase()
);

if (companyData.length === 0) {
  return res.json({ success: false, message: "Company not found" });
}


const vendorData = companyData.filter(
  (item) => item.vendorCode === Number(vendorCode)
);

if (vendorData.length === 0) {
  return res.json({ success: false, message: "Invalid Vendor Code" });
}


const orderTypeData = vendorData.filter(
  (item) => item.orderType === orderType
);

if (orderTypeData.length === 0) {
  return res.json({ success: false, message: "Invalid Order Type" });
}


const finalMatch = orderTypeData.find(
  (item) => item.orderNumber === Number(orderNumber)
);

if (!finalMatch) {
  return res.json({ success: false, message: "Invalid Order Number" });
}

return res.json({
  success: true,
  message: "All validations passed ✅"
});
};