const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  address: { type: String, required: true },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export default Admin;
