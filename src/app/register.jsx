import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '../components/Logo.jsx';
import InputField from '../components/InputField.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import { colors, shadow } from '../constants/theme';

const fields = [
  { key: 'firstname', label: 'Firstname', placeholder: 'Enter your firstname' },
  { key: 'lastname', label: 'Lastname', placeholder: 'Enter your lastname' },
  { key: 'username', label: 'Username', placeholder: 'Username' },
  { key: 'password', label: 'Password', placeholder: 'Password', secureTextEntry: true },
  { key: 'confirmPassword', label: 'Confirm Password', placeholder: 'Confirm Password', secureTextEntry: true },
  { key: 'email', label: 'Email', placeholder: 'Enter your email', keyboardType: 'email-address' },
  { key: 'contactNumber', label: 'Contact Number', placeholder: 'Enter your contact number', keyboardType: 'phone-pad' },
];

const initialState = fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {});

export default function RegisterScreen() {
  const router = useRouter();
  const [values, setValues] = useState(initialState);

  const handleChange = (key) => (text) =>
    setValues((prev) => ({ ...prev, [key]: text }));

  const handleSubmit = () => {
    // Register API call goes here once the backend is wired up.
    router.push('/index');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.form, styles.card]}>
        <Logo backgroundColor={colors.registerAccent} />
        <Text style={styles.brandTitle}>E-WALLET</Text>

        <Text style={styles.title}>Create a User Account</Text>
        <Text style={styles.subtitle}>Please enter your information</Text>

        {fields.map((field) => (
          <InputField
            key={field.key}
            label={field.label}
            placeholder={field.placeholder}
            keyboardType={field.keyboardType}
            secureTextEntry={field.secureTextEntry}
            value={values[field.key]}
            onChangeText={handleChange(field.key)}
          />
        ))}

        <PrimaryButton
          title="CREATE ACCOUNT"
          backgroundColor={colors.primaryBlue}
          onPress={handleSubmit}
          style={styles.button}
        />

        <TouchableOpacity onPress={() => router.push('/index')} style={styles.link}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.bgLight,
    flexGrow: 1,
    paddingBottom: 50,
  },
  form: {
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: colors.cardWhite,
    borderRadius: 24,
    padding: 24,
    paddingTop: 30,
    ...shadow,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.placeholder,
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: 25,
  },
  button: {
    marginTop: 20,
  },
  link: {
    marginTop: 16,
    alignSelf: 'center',
  },
  linkText: {
    color: colors.linkIndigo,
    fontWeight: '500',
  },
});