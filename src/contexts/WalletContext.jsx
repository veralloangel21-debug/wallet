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

const WalletContext = createContext(null);

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

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const userIdRef = useRef(null);
  const walletRef = useRef(null);
  const savingRef = useRef(false);

  // LOAD WALLET FOR THE LOGGED-IN USER
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
        const sender = await getCurrentUser();

        if (!sender) {
          throw new Error("Please log in first.");
        }

        const recipient = await findUserByUsername(recipientName);

        if (!recipient) {
          throw new Error("Recipient account not found.");
        }

        const senderId = String(sender.id || sender.username);
        const recipientId = String(recipient.id || recipient.username);

        if (
          senderId === recipientId ||
          sender.username.toLowerCase() === recipient.username.toLowerCase()
        ) {
          throw new Error("You cannot send money to yourself.");
        }

        const senderWallet =
          userIdRef.current === senderId && walletRef.current
            ? walletRef.current
            : await loadWallet(senderId);

        const recipientWallet = await loadWallet(recipientId);

        if (senderWallet.balanceCents < cents) {
          throw new Error("Insufficient demo wallet balance.");
        }

        const transferId =
          `transfer-${Date.now()}-` + Math.random().toString(36).slice(2, 8);

        const createdAt = new Date().toISOString();
        const transferNote = String(note || "").trim();

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

        // Save sender first, then recipient.
        await saveWallet(senderId, updatedSender);

        try {
          await saveWallet(recipientId, updatedRecipient);
        } catch (error) {
          // Best-effort rollback for this local demo.
          try {
            await saveWallet(senderId, senderWallet);
          } catch (rollbackError) {
            throw new Error(
              "Demo storage is inconsistent. Do not retry " +
                "until the account balances are checked.",
            );
          }

          throw new Error(
            "Transfer could not be saved. Demo balance restored.",
          );
        }

        userIdRef.current = senderId;
        walletRef.current = updatedSender;
        setWallet(updatedSender);

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
