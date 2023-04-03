const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5001;
// Import Routes
const CabangRoute = require("./Master/routes/Cabang/CabangRoute.js");
const UserRoute = require("./User/routes/UserRoute.js");
const HakAksesRoute = require("./User/routes/HakAkses/HakAksesRoute.js");
const AuthRoute = require("./User/routes/AuthRoute.js");
const SettingRoute = require("./Setting/routes/SettingRoute.js");
const GroupStokRoute = require("./Master/routes/GroupStok/GroupStokRoute.js");
const StokRoute = require("./Master/routes/Stok/StokRoute.js");

const app = express();
app.use(cors());
app.use(express.json());
// Use Routes
app.use(UserRoute);
app.use(HakAksesRoute);
app.use("/auth", AuthRoute);
app.use(CabangRoute);
app.use(SettingRoute);
app.use(GroupStokRoute);
app.use(StokRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
