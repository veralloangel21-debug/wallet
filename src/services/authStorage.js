import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "wallet_registered_users";
const SESSION_KEY = "wallet_logged_in_user";

async function getUsers() {
  const storedUsers = await AsyncStorage.getItem(USERS_KEY);
  return storedUsers ? JSON.parse(storedUsers) : [];
}

export async function registerUser(form) {
  const users = await getUsers();

  const username = form.username.trim();
  const email = form.email.trim().toLowerCase();

  const usernameExists = users.some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );

  if (usernameExists) {
    throw new Error("This username is already taken.");
  }

  const emailExists = users.some((user) => user.email.toLowerCase() === email);

  if (emailExists) {
    throw new Error("This email is already registered.");
  }

  const newUser = {
    id: Date.now().toString(),
    firstname: form.firstname.trim(),
    lastname: form.lastname.trim(),
    username,
    email,
    contactNumber: form.contactNumber.trim(),
    password: form.password,
  };

  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

  return newUser;
}

export async function loginUser(username, password) {
  const users = await getUsers();

  const user = users.find(
    (item) =>
      item.username.toLowerCase() === username.trim().toLowerCase() &&
      item.password === password,
  );

  if (!user) {
    return null;
  }

  const { password: unusedPassword, ...safeUser } = user;

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));

  return safeUser;
}

export async function getCurrentUser() {
  const storedUser = await AsyncStorage.getItem(SESSION_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

export async function logoutUser() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function findUserByUsername(input) {
  const username = String(input || "")
    .trim()
    .replace(/^@/, "")
    .toLowerCase();

  if (!username) return null;

  const users = await getUsers();

  const user = users.find((item) => item.username.toLowerCase() === username);

  if (!user) return null;

  // Never return the stored password.
  return {
    id: user.id,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
  };
}

export async function updateCurrentUserProfile(form) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Please log in first.");
  }

  const firstname = String(form.firstname || "").trim();
  const lastname = String(form.lastname || "").trim();
  const email = String(form.email || "")
    .trim()
    .toLowerCase();
  const contactNumber = String(form.contactNumber || "").trim();

  // VALIDATE ACCOUNT INFORMATION
  if (!firstname || !lastname || !email || !contactNumber) {
    throw new Error("Please complete all fields.");
  }

  if (firstname.length > 50 || lastname.length > 50) {
    throw new Error("Names must not exceed 50 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  if (!/^09\d{9}$/.test(contactNumber)) {
    throw new Error("Enter a valid 11-digit Philippine mobile number.");
  }

  // LOAD REGISTERED ACCOUNTS
  const users = await getUsers();

  const index = users.findIndex(
    (user) => String(user.id) === String(currentUser.id),
  );

  if (index === -1) {
    throw new Error("Registered account could not be found.");
  }

  // PREVENT DUPLICATE EMAILS
  const emailExists = users.some(
    (user, i) => i !== index && user.email.toLowerCase() === email,
  );

  if (emailExists) {
    throw new Error("This email is already registered.");
  }

  // UPDATE ONLY ALLOWED FIELDS
  const updatedUser = {
    ...users[index],
    firstname,
    lastname,
    email,
    contactNumber,
  };

  users[index] = updatedUser;

  // SAVE UPDATED REGISTERED ACCOUNT
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

  // UPDATE THE LOGGED-IN SESSION
  const { password, ...safeUser } = updatedUser;

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));

  return safeUser;
}
