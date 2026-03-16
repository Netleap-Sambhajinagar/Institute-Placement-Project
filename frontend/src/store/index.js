import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import dashboardReducer from "./slices/dashboardSlice";
import jobsReducer from "./slices/jobsSlice";
import coursesReducer from "./slices/coursesSlice";
import internshipsReducer from "./slices/internshipsSlice";
import adminDashboardReducer from "./slices/adminDashboardSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    adminDashboard: adminDashboardReducer,
    jobs: jobsReducer,
    courses: coursesReducer,
    internships: internshipsReducer,
  },
});

export default store;
