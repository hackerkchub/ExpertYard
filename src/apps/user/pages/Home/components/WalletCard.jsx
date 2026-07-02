import React from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Gift,
  Plus,
  ArrowRight,
} from "lucide-react";

export default function WalletCard({
  balance = 0,
  compact = false,
}) {

  if (compact) {
    return (

      <section className="sidebar-wallet">

        <div className="sidebar-wallet-head">

          <h3>My Wallet</h3>

          <Link to="/user/wallet-history">
            View
          </Link>

        </div>

        <div className="sidebar-wallet-balance">

          <div className="sidebar-wallet-icon">

            <Wallet size={26} />

          </div>

          <div>

            <h2>
              ₹{Number(balance).toLocaleString()}
            </h2>

            <small>
              Available Balance
            </small>

          </div>

        </div>

        <div className="sidebar-wallet-offer">

          <div className="sidebar-wallet-gift">

            <Gift size={24} />

          </div>

          <div>

            <strong>
              Get 10% Extra
            </strong>

            <p>
              Add money & get bonus instantly.
            </p>

          </div>

        </div>

        <Link
          to="/user/wallet"
          className="sidebar-wallet-btn"
        >

          <Plus size={18} />

          Add Money To Wallet

        </Link>

      </section>

    );
  }

  return (

    <section className="home-section">

      <div className="wallet-card">

        <div className="wallet-left">

          <div className="wallet-icon">

            <Wallet size={34} />

          </div>

          <div className="wallet-info">

            <small>
              MY WALLET
            </small>

            <h2>
              ₹{Number(balance).toLocaleString()}
            </h2>

            <p>
              Use your wallet balance for faster expert consultations.
            </p>

          </div>

        </div>

        <div className="wallet-actions">

          <Link
            to="/user/wallet"
            className="wallet-primary-btn"
          >

            <Plus size={18} />

            Add Money

          </Link>

          <Link
            to="/user/wallet-history"
            className="wallet-secondary-btn"
          >

            <ArrowRight size={18} />

            History

          </Link>

        </div>

      </div>

    </section>

  );

}