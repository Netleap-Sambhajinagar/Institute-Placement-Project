import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isStudentNavOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openStudentNav: (state) => {
      state.isStudentNavOpen = true;
    },
    closeStudentNav: (state) => {
      state.isStudentNavOpen = false;
    },
    toggleStudentNav: (state) => {
      state.isStudentNavOpen = !state.isStudentNavOpen;
    },
  },
});

export const { openStudentNav, closeStudentNav, toggleStudentNav } =
  uiSlice.actions;
export const selectIsStudentNavOpen = (state) => state.ui.isStudentNavOpen;

export default uiSlice.reducer;
