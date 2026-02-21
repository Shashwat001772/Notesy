const mongoose = require('mongoose');

// Connecting directly to one shard node to bypass replica set negotiation
const uri = "mongodb://godmode:GodMode123@notesy-shard-00-00.pnvauvw.mongodb.net:27017/test?authSource=admin&ssl=true";

mongoose.connect(uri, {
  tlsInsecure: true, // Bypasses local antivirus/SSL interception
  serverSelectionTimeoutMS: 5000 
})
.then(() => console.log("✅ CONNECTED!"))
.catch(err => {
  console.log("❌ TYPE:", err.name);
  console.log("❌ MSG:", err.message);
});