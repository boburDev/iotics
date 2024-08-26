const mongoose = require('mongoose');

module.exports.connectDB = async (app, PORT, DB) => {
    try {
        await mongoose.connect(DB)
        app.listen(PORT, async () => console.log(`Server run: ${PORT}`));
    } catch (error) {
        console.log('Serverda xatolik yuz berdi', error.message);
        process.exit(1);
    }
};
