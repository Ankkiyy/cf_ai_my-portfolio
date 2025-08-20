import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import rootReducer from "./reducers/index";
import { whitelist } from "./reducers/index";

const persistConfig = {
  key: "root",
  storage,
  whitelist: whitelist,
  debug: process.env.NODE_ENV === 'development', // Add debug in development
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_ENCRYPTION_KEY || "AnkkiyyIsBoss_DefaultKey_2024",
      onError: (error) => {
        console.error("Encryption error:", error);
        // Clear storage on encryption error
        storage.removeItem('persist:root');
      },
    }),
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
