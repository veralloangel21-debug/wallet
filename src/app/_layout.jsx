import { Stack } from "expo-router";
import { WalletProvider } from "../contexts/WalletContext";

export default function RootLayout() {
  return (
    <WalletProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </WalletProvider>
  );
}
