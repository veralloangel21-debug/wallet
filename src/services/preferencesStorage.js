import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_PREFERENCES = {
  hideBalance: false,
};

function getStorageKey(userId) {
  return `carry_preferences_${String(userId)}`;
}

export async function loadPreferences(userId) {
  if (!userId) {
    return { ...DEFAULT_PREFERENCES };
  }

  const saved = await AsyncStorage.getItem(getStorageKey(userId));

  if (!saved) {
    return { ...DEFAULT_PREFERENCES };
  }

  const parsed = JSON.parse(saved);

  return {
    hideBalance: parsed?.hideBalance === true,
  };
}

export async function savePreferences(userId, preferences) {
  if (!userId) {
    throw new Error("Please log in first.");
  }

  const updated = {
    hideBalance: preferences.hideBalance === true,
  };

  await AsyncStorage.setItem(getStorageKey(userId), JSON.stringify(updated));

  return updated;
}
