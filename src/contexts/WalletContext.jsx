import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { findUserByUsername, getCurrentUser } from "../services/authStorage";

import { loadWallet, saveWallet } from "../services/walletStorage";

import { formatPeso } from "../utils/currency";

const WalletContext = createContext(null);

// DEMO TRANSFER LIMITS (IN CENTAVOS)
const DAILY_LIMIT_CENTS = 1000000; // ₱10,000
const MONTHLY_LIMIT_CENTS = 5000000; // ₱50,000

// VALIDATE THE AMOUNT
function parseAmount(amount) {
  const input = String(amount).trim();

  if (!/^\d+(\.\d{1,2})?$/.test(input)) {
    throw new Error("Enter a valid amount with up to 2 decimals.");
  }

  const cents = Math.round(Number(input) * 100);

  if (!Number.isSafeInteger(cents) || cents <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  if (cents > 10000000) {
    throw new Error("Maximum demo transaction is ₱100,000.");
  }

  return cents;
}

// CALCULATE DAILY AND MONTHLY OUTGOING TRANSACTIONS
function getOutgoingUsage(transactions, now) {
  let dailyUsed = 0;
  let monthlyUsed = 0;

  for (const item of transactions ?? []) {
    if (item.type !== "expense") continue;

    const amount = Number(item.amountCents);
    const date = new Date(item.createdAt);

    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      Number.isNaN(date.getTime()) ||
      date > now
    ) {
      continue;
    }

    const sameMonth =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth();

    if (sameMonth) {
      monthlyUsed += amount;

      const sameDay = date.getDate() === now.getDate();

      if (sameDay) {
        dailyUsed += amount;
      }
    }
  }

  return {
    dailyUsed,
    monthlyUsed,
  };
}

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const userIdRef = useRef(null);
  const walletRef = useRef(null);
  const savingRef = useRef(false);

  // LOAD THE CURRENT USER'S WALLET
  const refreshWallet = useCallback(async () => {
    setLoading(true);

    try {
      const user = await getCurrentUser();

      if (!user) {
        userIdRef.current = null;
        walletRef.current = null;

        setWallet(null);
        return;
      }

      const userId = String(user.id || user.username);

      const savedWallet = await loadWallet(userId);

      userIdRef.current = userId;
      walletRef.current = savedWallet;

      setWallet(savedWallet);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWallet().catch(console.warn);
  }, [refreshWallet]);

  // ADD DEMO MONEY
  const addMoney = useCallback(async (amount, source, note = "") => {
    if (savingRef.current) {
      throw new Error("Another transaction is in progress.");
    }

    const cents = parseAmount(amount);
    const sourceName = String(source || "").trim();

    if (!sourceName) {
      throw new Error("Please enter a money source.");
    }

    savingRef.current = true;

    try {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Please log in first.");
      }

      const userId = String(user.id || user.username);

      const current =
        userIdRef.current === userId && walletRef.current
          ? walletRef.current
          : await loadWallet(userId);

      const updated = {
        balanceCents: current.balanceCents + cents,

        transactions: [
          {
            id: `topup-${Date.now()}`,
            type: "income",
            category: "topup",
            title: `Added from ${sourceName}`,
            amountCents: cents,
            note: String(note || "").trim(),
            createdAt: new Date().toISOString(),
            status: "completed",
          },
          ...current.transactions,
        ],
      };

      await saveWallet(userId, updated);

      userIdRef.current = userId;
      walletRef.current = updated;

      setWallet(updated);

      return updated;
    } finally {
      savingRef.current = false;
    }
  }, []);

  // SEND MONEY BETWEEN LOCAL DEMO ACCOUNTS
  const sendMoney = useCallback(
    async (recipientUsername, amount, note = "") => {
      if (savingRef.current) {
        throw new Error("Another transaction is in progress.");
      }

      const cents = parseAmount(amount);

      const recipientName = String(recipientUsername || "")
        .trim()
        .replace(/^@/, "");

      if (!recipientName) {
        throw new Error("Enter the recipient's username.");
      }

      savingRef.current = true;

      try {
        // GET THE SENDER
        const sender = await getCurrentUser();

        if (!sender) {
          throw new Error("Please log in first.");
        }

        // FIND THE RECEIVER
        const recipient = await findUserByUsername(recipientName);

        if (!recipient) {
          throw new Error("Recipient account not found.");
        }

        const senderId = String(sender.id || sender.username);

        const recipientId = String(recipient.id || recipient.username);

        // PREVENT SELF TRANSFERS
        if (
          senderId === recipientId ||
          String(sender.username).toLowerCase() ===
            String(recipient.username).toLowerCase()
        ) {
          throw new Error("You cannot send money to yourself.");
        }

        // LOAD SENDER WALLET
        const senderWallet =
          userIdRef.current === senderId && walletRef.current
            ? walletRef.current
            : await loadWallet(senderId);

        // CHECK AVAILABLE BALANCE
        if (senderWallet.balanceCents < cents) {
          throw new Error("Insufficient demo wallet balance.");
        }

        // CHECK DAILY AND MONTHLY LIMITS
        const now = new Date();

        const { dailyUsed, monthlyUsed } = getOutgoingUsage(
          senderWallet.transactions,
          now,
        );

        // DAILY LIMIT VALIDATION
        if (dailyUsed + cents > DAILY_LIMIT_CENTS) {
          const remaining = Math.max(0, DAILY_LIMIT_CENTS - dailyUsed);

          throw new Error(
            `Daily transfer limit exceeded. ` +
              `You can send up to ` +
              `${formatPeso(remaining)} more today.`,
          );
        }

        // MONTHLY LIMIT VALIDATION
        if (monthlyUsed + cents > MONTHLY_LIMIT_CENTS) {
          const remaining = Math.max(0, MONTHLY_LIMIT_CENTS - monthlyUsed);

          throw new Error(
            `Monthly transfer limit exceeded. ` +
              `You can send up to ` +
              `${formatPeso(remaining)} more this month.`,
          );
        }

        // LOAD RECEIVER WALLET
        const recipientWallet = await loadWallet(recipientId);

        // CREATE TRANSFER DETAILS
        const transferId =
          `transfer-${Date.now()}-` + Math.random().toString(36).slice(2, 8);

        const createdAt = now.toISOString();

        const transferNote = String(note || "").trim();

        // UPDATE SENDER WALLET
        const updatedSender = {
          balanceCents: senderWallet.balanceCents - cents,

          transactions: [
            {
              id: transferId,
              type: "expense",
              category: "transfer",
              title: `Sent to @${recipient.username}`,
              amountCents: cents,
              note: transferNote,
              createdAt,
              status: "completed",
            },
            ...senderWallet.transactions,
          ],
        };

        // UPDATE RECEIVER WALLET
        const updatedRecipient = {
          balanceCents: recipientWallet.balanceCents + cents,

          transactions: [
            {
              id: transferId,
              type: "income",
              category: "transfer",
              title: `Received from @${sender.username}`,
              amountCents: cents,
              note: transferNote,
              createdAt,
              status: "completed",
            },
            ...recipientWallet.transactions,
          ],
        };

        // SAVE SENDER WALLET FIRST
        await saveWallet(senderId, updatedSender);

        // SAVE RECEIVER WALLET
        try {
          await saveWallet(recipientId, updatedRecipient);
        } catch (error) {
          // TRY TO RESTORE SENDER'S BALANCE
          try {
            await saveWallet(senderId, senderWallet);
          } catch (rollbackError) {
            throw new Error(
              "Demo storage is inconsistent. " +
                "Do not retry until the account " +
                "balances are checked.",
            );
          }

          throw new Error(
            "Transfer could not be saved. " + "Demo balance restored.",
          );
        }

        // UPDATE CURRENT WALLET STATE
        userIdRef.current = senderId;
        walletRef.current = updatedSender;

        setWallet(updatedSender);

        // RETURN TRANSFER INFORMATION
        return {
          ...updatedSender,
          transferId,
          recipientUsername: recipient.username,
        };
      } finally {
        savingRef.current = false;
      }
    },
    [],
  );

  return (
    <WalletContext.Provider
      value={{
        wallet,
        loading,
        refreshWallet,
        addMoney,
        sendMoney,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }

  return context;
}
