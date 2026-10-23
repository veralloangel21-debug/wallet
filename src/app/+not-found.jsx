import { Redirect } from 'expo-router';

// If an old Expo Go URL or unknown route is opened, return to Login.
export default function NotFoundScreen() {
  return <Redirect href="/" />;
}
