import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

import AuthInput from "../components/AuthInput";
import AuthScreen from "../components/AuthScreen";
import CarryButton from "../components/CarryButton";

import { carryColors as colors } from "../constants/theme";
import { registerUser } from "../services/authStorage";

const initialForm = {
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  contactNumber: "",
  password: "",
  confirmPassword: "",
};

const fields = [
  {
    key: "firstname",
    label: "First Name",
    placeholder: "Enter your first name",
    icon: "person-outline",
    autoCapitalize: "words",
  },
  {
    key: "lastname",
    label: "Last Name",
    placeholder: "Enter your last name",
    icon: "person-outline",
    autoCapitalize: "words",
  },
  {
    key: "username",
    label: "Username",
    placeholder: "Choose a username",
    icon: "at-outline",
  },
  {
    key: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    icon: "mail-outline",
    keyboardType: "email-address",
  },
  {
    key: "contactNumber",
    label: "Phone Number",
    placeholder: "09XXXXXXXXX",
    icon: "call-outline",
    keyboardType: "phone-pad",
  },
  {
    key: "password",
    label: "Password",
    placeholder: "Create a password",
    icon: "lock-closed-outline",
    secure: true,
  },
  {
    key: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    icon: "lock-closed-outline",
    secure: true,
  },
];

export default function RegisterScreen() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function validateForm() {
    if (Object.values(form).some((value) => !value.trim())) {
      return "Please complete all fields.";
    }

    if (form.username.trim().length < 3) {
      return "Username must contain at least 3 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    const phone = form.contactNumber.trim();

    if (!/^09\d{9}$/.test(phone)) {
      return "Enter a valid 11-digit Philippine mobile number.";
    }

    if (form.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  }

  async function handleRegister() {
    if (loading) return;

    const error = validateForm();

    if (error) {
      Alert.alert("Registration Error", error);
      return;
    }

    setLoading(true);

    try {
      await registerUser(form);

      Alert.alert(
        "Account Created!",
        "Your Carry account has been created. You can now log in.",
        [
          {
            text: "Go to Login",
            onPress: () => router.replace("/login"),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error.message || "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen
      title="Create an Account"
      subtitle="Join Carry and bring your wallet everywhere."
    >
      {/* REGISTRATION FIELDS */}
      {fields.map((field) => (
        <AuthInput
          key={field.key}
          label={field.label}
          placeholder={field.placeholder}
          icon={field.icon}
          keyboardType={field.keyboardType}
          autoCapitalize={field.autoCapitalize}
          secure={field.secure}
          value={form[field.key]}
          onChangeText={(value) => updateField(field.key, value)}
          editable={!loading}
        />
      ))}

      {/* REGISTER BUTTON */}
      <View style={styles.buttonContainer}>
        <CarryButton
          title={loading ? "Creating Account..." : "Register"}
          onPress={handleRegister}
          disabled={loading}
          showArrow={!loading}
        />
      </View>

      {/* LOGIN LINK */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>

        <Pressable onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Log In</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 28,
  },

  footerText: {
    fontSize: 14,
    color: colors.muted,
  },

  link: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
