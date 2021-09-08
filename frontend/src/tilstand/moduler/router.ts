import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

//==========
// Type defs
//==========

//==========
// Reducer
//==========
export const routerSlice = createSlice({
  name: "oppgaver",
  initialState: {
    prevRoute: "",
  },
  reducers: {
    SETT: (state, action) => {
      state.prevRoute = action.payload;
    },
  },
});

export default routerSlice.reducer;

//==========
// Actions
//==========
export const { SETT } = routerSlice.actions;
export const routingRequest = createAction<string>("routing/SETT");
