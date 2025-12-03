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
import { getAllExperts } from "../../services/expertService";
import AddBalancePopup from "../../components/AddBalancePopup/AddBalancePopup";

const WalletPage = () => {
  const [experts, setExperts] = useState([]);
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [topupHistory, setTopupHistory] = useState([]);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAmount, setPopupAmount] = useState(null);

  const [filterType, setFilterType] = useState("thisMonth");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  useEffect(() => {
    loadExperts();
  }, []);

  const randomAmount = () => (Math.random() * 5000 + 300).toFixed(0);
  const randomDate = () => {
    const d = new Date(Date.now() - Math.random() * 60 * 86400000);
    return d;
  };

  const loadExperts = async () => {
    const data = await getAllExperts();

    // EXPENSE HISTORY (random 6 experts)
    const expense = data.slice(0, 6).map((ex) => ({
      id: ex.id,
      name: ex.name,
      role: ex.role,
      avatar: ex.img,
      amount: parseInt(randomAmount()),
      date: randomDate()
    }));

    setExperts(data);
    setExpenseHistory(expense);
    setFilteredExpenses(expense);

    // TOPUP HISTORY (dummy)
    const topups = data.slice(10, 12).map((ex) => ({
      id: ex.id,
      name: ex.name,
      amount: (Math.random() * 1000 + 100).toFixed(0),
      method: "Credit Card",
      mode: "UPI",
      date: randomDate()
    }));

    setTopupHistory(topups);
  };

  /* -------------------------------
     FILTERS: This Month / Last Month / Custom Range
  --------------------------------*/
  useEffect(() => {
    applyFilters();
  }, [filterType, customRange]);

  const sameMonth = (date1, date2) =>
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const applyFilters = () => {
    const now = new Date();

    if (filterType === "thisMonth") {
      setFilteredExpenses(expenseHistory.filter((e) => sameMonth(e.date, now)));
    } 
    else if (filterType === "lastMonth") {
      const last = new Date();
      last.setMonth(last.getMonth() - 1);
      setFilteredExpenses(
        expenseHistory.filter((e) => sameMonth(e.date, last))
      );
    } 
    else if (filterType === "custom") {
      if (!customRange.from || !customRange.to) return;
      const from = new Date(customRange.from);
      const to = new Date(customRange.to);

      setFilteredExpenses(
        expenseHistory.filter((e) => e.date >= from && e.date <= to)
      );
    } 
    else {
      // all time
      setFilteredExpenses(expenseHistory);
    }
  };

  /* -------------------------------
     POPUP HANDLERS
  --------------------------------*/
  const openPopup = (amount = null) => {
    setPopupAmount(amount);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setPopupAmount(null);
  };

  return (
    <PageWrap>
      <WalletBox>

        {/* HEADER */}
        <HeaderRow>
          <img src="/logo.png" alt="logo" height="42" style={{ opacity: 0.95 }} />
          <span className="wallet-label">WALLET</span>
        </HeaderRow>

        {/* BALANCE CARD */}
        <BalanceCard>
          <h3>WALLET BALANCE:</h3>
          <BalanceAmount>
            ₹15,450.75 <span>INR</span>
          </BalanceAmount>
        </BalanceCard>

        {/* EXPENSE HISTORY */}
        <ExpenseSection>
          <SectionTitle>
            <span>EXPENSE HISTORY BY EXPERT</span>

            {/* FILTER BUTTONS */}
            <div className="filter">
              <button
                className={filterType === "thisMonth" ? "active" : ""}
                onClick={() => setFilterType("thisMonth")}
              >
                This Month
              </button>

              <button
                className={filterType === "lastMonth" ? "active" : ""}
                onClick={() => setFilterType("lastMonth")}
              >
                Last Month
              </button>

              <button
                className={filterType === "custom" ? "active" : ""}
                onClick={() => setFilterType("custom")}
              >
                Custom Range
              </button>

              <button
                className={filterType === "all" ? "active" : ""}
                onClick={() => setFilterType("all")}
              >
                All Time
              </button>
            </div>
          </SectionTitle>

          {/* SHOW DATE PICKERS IF CUSTOM RANGE */}
          {filterType === "custom" && (
            <div style={{ marginBottom: "14px", color: "#9bdfff" }}>
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
                style={{ marginLeft: "10px" }}
              />
            </div>
          )}

          {filteredExpenses.map((item) => (
            <ExpertCard key={item.id}>
              <ExpertLeft>
                <Avatar src={item.avatar} alt={item.name} />
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

        {/* TOP-UP HISTORY */}
        <TopupSection>
          <SectionTitle>BALANCE TOP-UP HISTORY</SectionTitle>

          {topupHistory.map((item) => (
            <ExpertCard key={item.id}>
              <ExpertLeft>
                <FaUserCircle size={46} color="#a8f7ff" style={{ opacity: 0.85 }} />
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

          {/* FULL POPUP (manual amount) */}
          <AddBalanceBtn onClick={() => openPopup(null)}>
            ADD BALANCE
          </AddBalanceBtn>

          {/* QUICK AMOUNT BUTTONS */}
          <QuickAddRow>
            {[50, 100, 200, 500, 1000, 2000, 5000].map((amt) => (
              <QuickAddBtn key={amt} onClick={() => openPopup(amt)}>
                ₹{amt} +
              </QuickAddBtn>
            ))}
          </QuickAddRow>
        </TopupSection>
      </WalletBox>

      {/* POPUP COMPONENT */}
      {popupOpen && (
        <AddBalancePopup
          amountPreset={popupAmount}
          onClose={closePopup}
        />
      )}
    </PageWrap>
  );
};

export default WalletPage;
