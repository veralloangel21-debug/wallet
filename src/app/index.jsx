import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Checkbox from '../components/Checkbox.jsx';
import InputField from '../components/InputField.jsx';
import Logo from '../components/Logo.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import { colors, shadow } from '../constants/theme.js';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Mock validation check
    if (email === 'admin' && password === 'admin123') {
      alert('Login successful!');

      router.replace('/home');

    } else {
      setError('Invalid email or incorrect password. Access denied.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Logo backgroundColor={colors.loginAccent} size={70} borderRadius={10} />

        <Text style={styles.title}>My E - WALLET</Text>
        <Text style={styles.subtitle}>Login to access your account</Text>

        <View style={styles.card}>
          <InputField
            label="Email address"
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.field}
            inputStyle={styles.plainInput}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={!passwordVisible}
            showIcon
            showPasswordToggle
            onToggleSecureTextEntry={() => setPasswordVisible((visible) => !visible)}
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.field}
            labelRight={
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            }
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Checkbox
            checked={rememberMe}
            onToggle={() => setRememberMe(!rememberMe)}
            label="Remember me on this device"
          />

          <PrimaryButton
            title="Sign In to Account"
            backgroundColor={colors.primaryIndigo}
            onPress={handleLogin}
            style={styles.button}
          />
        </View>

        <TouchableOpacity onPress={() => router.push('/register')} style={styles.link}>
          <Text style={styles.linkText}>New here? Create an account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.bgLoginLight,
    flexGrow: 1,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.cardWhite,
    borderRadius: 20,
    padding: 20,
    ...shadow,
  },
  field: {
    width: '100%',
    marginBottom: 16,
  },
  plainInput: {
    backgroundColor: colors.inputBgAlt,
    borderColor: colors.borderAlt,
    borderRadius: 10,
  },
  forgotPassword: {
    fontSize: 13,
    color: colors.linkIndigo,
    fontWeight: '500',
  },
  error: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 12,
  },
  
  button: {
    width: '100%',
    height: 40,
    paddingVertical: 0,
    borderRadius: 10,
    marginTop: 0,
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: colors.linkIndigo,
    fontWeight: '500',
  },
});
