import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer, { RootState } from "./root";
import { ajax } from "rxjs/ajax";
import { fromFetch } from "rxjs/fetch";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const dependencies = {
  ajax,
  fromFetch,
};

export type Dependencies = typeof dependencies;

const defaultMiddleware = getDefaultMiddleware({
  serializableCheck: {
    // Ignore these field paths in all actions.
    ignoredActionPaths: [
      "payload.payload.file",
      "payload.file",
      "payload.kvalitetsavvikUtredning",
      "payload.kvalitetsavvikVedtak",
      "payload.kvalitetsavvikOversendelsesbrev",
    ],
  },
});

const middleware = [...defaultMiddleware];

const reduxStore = configureStore({
  reducer,
  devTools: true,
  middleware,
});

export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default reduxStore;
