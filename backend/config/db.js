  // Importera Mongoose-biblioteket
  const mongoose = require('mongoose');

  // Funktion för att ansluta till MongoDB-databasen
  const connectDB = async () => {
    try {
      // Försök att ansluta till databasen med URI från miljövariabeln MONGO_URI
      const conn = await mongoose.connect(process.env.MONGO_URI);

      // Logga anslutningens värd (host) om anslutningen lyckas
      console.log(`MongoDb connected: ${conn.connection.host}`);
    } catch (error) {
      // Logga eventuella fel som uppstår vid anslutning
      console.log(error);
    }
  };

  // Exportera funktionen så att den kan användas i andra delar av koden
  module.exports = connectDB;
