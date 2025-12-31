import React, { useEffect, useState } from "react";

import {
  PageWrap,
  WalletBox,
  HeaderRow,
  BalanceCard,
  BalanceAmount,
  ExpenseSection,
  SectionTitle,
  ExpertCard,
  ExpertLeft,
  Avatar,
  ExpertInfo,
  ExpertRight,
  AmountBox,
  TopupSection,
  AddBalanceBtn,
  QuickAddRow,
  QuickAddBtn
} from "./Wallet.styles";

import { FaUserCircle } from "react-icons/fa";
import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";

// ✅ CONTEXTS
import { useWallet } from "../../../../shared/context/WalletContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { getAllExperts } from "../../../../shared/services/expertService";

const WalletPage = () => {
  const { balance, addMoney } = useWallet();
  const { user } = useAuth(); // user?.id

 const userId = user?.id;

  const [experts, setExperts] = useState([]);
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [topupHistory, setTopupHistory] = useState([]);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAmount, setPopupAmount] = useState(null);

  const [filterType, setFilterType] = useState("thisMonth");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
  if (!userId) return;   // 🛑 no API call without login
  loadExperts();
}, [userId]);


  const loadExperts = async () => {
    const data = await getAllExperts();

    // fallback safe data
    const expense = (data || []).slice(0, 6).map((ex) => ({
      id: ex.id,
      name: ex.name || "Expert",
      role: ex.role || "Consultant",
      avatar: ex.img || "/avatar.png",
      amount: Math.floor(Math.random() * 500) + 100,
      date: new Date()
    }));

    setExperts(data || []);
    setExpenseHistory(expense);
    setFilteredExpenses(expense);

    const topups = (data || []).slice(0, 3).map((ex) => ({
      id: ex.id,
      amount: Math.floor(Math.random() * 1000) + 100,
      mode: "UPI",
      date: new Date()
    }));

    setTopupHistory(topups);
  };

  /* ================= FILTER ================= */

  useEffect(() => {
    applyFilters();
  }, [filterType, customRange, expenseHistory]);

  const sameMonth = (d1, d2) =>
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const applyFilters = () => {
    const now = new Date();

    if (filterType === "thisMonth") {
      setFilteredExpenses(expenseHistory.filter((e) => sameMonth(e.date, now)));
    } else if (filterType === "lastMonth") {
      const last = new Date();
      last.setMonth(last.getMonth() - 1);
      setFilteredExpenses(expenseHistory.filter((e) => sameMonth(e.date, last)));
    } else if (filterType === "custom") {
      if (!customRange.from || !customRange.to) return;
      const from = new Date(customRange.from);
      const to = new Date(customRange.to);
      setFilteredExpenses(
        expenseHistory.filter((e) => e.date >= from && e.date <= to)
      );
    } else {
      setFilteredExpenses(expenseHistory);
    }
  };

  /* ================= POPUP ================= */

  const openPopup = (amount = null) => {
    setPopupAmount(amount);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setPopupAmount(null);
  };

  /* ================= ADD MONEY ================= */

  const handleAddMoney = async (amount) => {
    await addMoney(userId, amount);
    closePopup();
  };

  /* ================= UI ================= */

  return (
    <PageWrap>
      <WalletBox>
        {/* HEADER */}
        <HeaderRow>
          <img src="/logo.png" alt="logo" height="42" />
          <span className="wallet-label">WALLET</span>
        </HeaderRow>

        {/* BALANCE */}
        <BalanceCard>
          <h3>WALLET BALANCE:</h3>
          <BalanceAmount>
            ₹{balance || 0} <span>INR</span>
          </BalanceAmount>
        </BalanceCard>

        {/* EXPENSE HISTORY */}
        <ExpenseSection>
          <SectionTitle>
            <span>EXPENSE HISTORY BY EXPERT</span>

            <div className="filter">
              {["thisMonth", "lastMonth", "custom", "all"].map((f) => (
                <button
                  key={f}
                  className={filterType === f ? "active" : ""}
                  onClick={() => setFilterType(f)}
                >
                  {f === "thisMonth"
                    ? "This Month"
                    : f === "lastMonth"
                    ? "Last Month"
                    : f === "custom"
                    ? "Custom Range"
                    : "All Time"}
                </button>
              ))}
            </div>
          </SectionTitle>

          {filterType === "custom" && (
            <div style={{ marginBottom: 14 }}>
              <input
                type="date"
                value={customRange.from}
                onChange={(e) =>
                  setCustomRange({ ...customRange, from: e.target.value })
                }
              />
              <input
                type="date"
                value={customRange.to}
                onChange={(e) =>
                  setCustomRange({ ...customRange, to: e.target.value })
                }
                style={{ marginLeft: 10 }}
              />
            </div>
          )}

          {filteredExpenses.length === 0 && (
            <p style={{ color: "#9bdfff" }}>No expenses found</p>
          )}

          {filteredExpenses.map((item) => (
            <ExpertCard key={item.id}>
              <ExpertLeft>
                <Avatar src={item.avatar} />
                <ExpertInfo>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                  <small>{item.date.toDateString()}</small>
                </ExpertInfo>
              </ExpertLeft>

              <ExpertRight>
                <AmountBox>₹{item.amount}</AmountBox>
              </ExpertRight>
            </ExpertCard>
          ))}
        </ExpenseSection>

        {/* TOPUP */}
        <TopupSection>
          <SectionTitle>BALANCE TOP-UP HISTORY</SectionTitle>

          {topupHistory.length === 0 && (
            <p style={{ color: "#9bdfff" }}>No top-ups yet</p>
          )}

          {topupHistory.map((item) => (
            <ExpertCard key={item.id}>
              <ExpertLeft>
                <FaUserCircle size={46} color="#a8f7ff" />
                <ExpertInfo>
                  <strong>₹{item.amount}</strong>
                  <small>User</small>
                  <small>{item.date.toDateString()}</small>
                </ExpertInfo>
              </ExpertLeft>

              <ExpertRight>
                <AmountBox>Added: {item.mode}</AmountBox>
              </ExpertRight>
            </ExpertCard>
          ))}

          <AddBalanceBtn onClick={() => openPopup(null)}>
            ADD BALANCE
          </AddBalanceBtn>

          <QuickAddRow>
            {[50, 100, 200, 500, 1000, 2000, 5000].map((amt) => (
              <QuickAddBtn key={amt} onClick={() => openPopup(amt)}>
                ₹{amt} +
              </QuickAddBtn>
            ))}
          </QuickAddRow>
        </TopupSection>
      </WalletBox>

      {popupOpen && (
        <AddBalancePopup
          amountPreset={popupAmount}
          onClose={closePopup}
          onConfirm={handleAddMoney}
        />
      )}
    </PageWrap>
  );
};

export default WalletPage;
