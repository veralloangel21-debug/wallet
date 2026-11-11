import AsyncStorage from "@react-native-async-storage/async-storage";

const STARTING_BALANCE = 1250000; // ₱12,500.00 in centavos

function walletKey(userId) {
  return `carry_demo_wallet_${userId}`;
}

export async function loadWallet(userId) {
  const saved = await AsyncStorage.getItem(walletKey(userId));

  if (saved) {
    return JSON.parse(saved);
  }

  return {
    balanceCents: STARTING_BALANCE,
    transactions: [],
  };
}

export async function saveWallet(userId, wallet) {
  await AsyncStorage.setItem(walletKey(userId), JSON.stringify(wallet));
}
