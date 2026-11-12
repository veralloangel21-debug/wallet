import AsyncStorage from "@react-native-async-storage/async-storage";

function getKey(userId) {
  return `carry_read_notifications_${String(userId)}`;
}

export async function getReadNotifications(userId) {
  if (!userId) return [];

  const saved = await AsyncStorage.getItem(getKey(userId));

  if (!saved) return [];

  const parsed = JSON.parse(saved);

  return Array.isArray(parsed) ? parsed : [];
}

export async function markNotificationRead(userId, id) {
  const previous = await getReadNotifications(userId);

  const updated = [...new Set([...previous, String(id)])];

  await AsyncStorage.setItem(getKey(userId), JSON.stringify(updated));

  return updated;
}

export async function markAllNotificationsRead(userId, ids) {
  const previous = await getReadNotifications(userId);

  const updated = [...new Set([...previous, ...ids.map(String)])];

  await AsyncStorage.setItem(getKey(userId), JSON.stringify(updated));

  return updated;
}
