import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { carryColors as colors } from "../constants/theme";

const quickAmounts = [100, 250, 500, 1000];

export default function SendMoneyForm({
  recipient,
  amount,
  note,
  onRecipientChange,
  onAmountChange,
  onNoteChange,
}) {
  return (
    <View>
      <Text style={styles.label}>Send to</Text>

      <View style={styles.inputBox}>
        <Ionicons name="person-outline" size={21} color={colors.primary} />

        <TextInput
          style={styles.input}
          placeholder="Recipient username or wallet ID"
          placeholderTextColor={colors.muted}
          value={recipient}
          onChangeText={onRecipientChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Text style={styles.label}>Amount</Text>

      <View style={styles.amountBox}>
        <Text style={styles.peso}>₱</Text>

        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={onAmountChange}
        />
      </View>

      <View style={styles.quickAmounts}>
        {quickAmounts.map((value) => (
          <Pressable
            key={value}
            onPress={() => onAmountChange(String(value))}
            style={styles.amountChip}
          >
            <Text style={styles.chipText}>
              ₱{value.toLocaleString("en-PH")}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Note (Optional)</Text>

      <TextInput
        style={[styles.inputBox, styles.noteInput]}
        placeholder="What's this payment for?"
        placeholderTextColor={colors.muted}
        value={note}
        onChangeText={onNoteChange}
        maxLength={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 22,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    minHeight: 58,
    gap: 12,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },

  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    borderRadius: 15,
    paddingHorizontal: 18,
    minHeight: 76,
  },

  peso: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "700",
  },

  amountInput: {
    flex: 1,
    color: colors.text,
    fontSize: 30,
    fontWeight: "700",
    paddingLeft: 10,
  },

  quickAmounts: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },

  amountChip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  chipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
  },

  noteInput: {
    color: colors.text,
    paddingVertical: 16,
    fontSize: 14,
  },
});
