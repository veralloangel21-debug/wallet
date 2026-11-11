import { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { carryColors as colors } from "../constants/theme";
import CarryButton from "./CarryButton";

export default function RequestMoneyModal({ visible, onClose, onShare }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  function handleRequest() {
    const input = amount.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(input) || Number(input) <= 0) {
      Alert.alert(
        "Invalid Amount",
        "Enter an amount greater than zero, with up to 2 decimals.",
      );
      return;
    }

    onShare(Number(input), note.trim());
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Request Money</Text>

          <Text style={styles.subtitle}>
            Create a demo payment request to share.
          </Text>

          <Text style={styles.label}>Amount</Text>

          <TextInput
            style={styles.input}
            placeholder="₱0.00"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Note (Optional)</Text>

          <TextInput
            style={styles.input}
            placeholder="What's this request for?"
            placeholderTextColor={colors.muted}
            value={note}
            onChangeText={setNote}
            maxLength={100}
          />

          <View style={styles.buttons}>
            <CarryButton title="Share Request" onPress={handleRequest} />

            <Pressable onPress={onClose} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    padding: 22,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.muted,
    marginTop: 8,
    marginBottom: 20,
    fontSize: 13,
  },
  label: {
    color: colors.text,
    fontWeight: "600",
    marginBottom: 9,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 18,
    fontSize: 15,
  },
  buttons: {
    gap: 12,
    marginTop: 8,
  },
  cancel: {
    padding: 12,
    alignItems: "center",
  },
  cancelText: {
    color: colors.muted,
    fontWeight: "600",
  },
});
