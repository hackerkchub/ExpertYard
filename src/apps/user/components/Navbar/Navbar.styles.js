import styled from "styled-components";
import { Link } from "react-router-dom";

const NAVY = "#000080";
const YELLOW = "#FFC107";

export const Nav = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background:
    radial-gradient(circle at 8% 0%, rgba(255, 193, 7, 0.16), transparent 28%),
    radial-gradient(circle at 90% 0%, rgba(0, 0, 128, 0.12), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(246, 248, 255, 0.9));
  border-bottom: 1px solid rgba(0, 0, 128, 0.1);
  backdrop-filter: blur(20px) saturate(165%);
  -webkit-backdrop-filter: blur(20px) saturate(165%);
  box-shadow: 0 16px 40px rgba(0, 0, 128, 0.08);

  &::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    background: linear-gradient(90deg, ${NAVY}, ${YELLOW}, ${NAVY});
    opacity: 0.9;
  }
`;

export const Container = styled.div`
  position: relative;
  max-width: 1240px;
  width: 100%;
  height: 70px;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 28px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(10px, 2vw, 22px);

  @media (max-width: 768px) {
    height: 64px;
    padding: 0 16px;
  }

  @media (max-width: 480px) {
    height: 60px;
    gap: 8px;
    padding: 0 12px;
  }
`;

export const NavbarSpacer = styled.div`
  height: 70px;

  @media (max-width: 768px) {
    height: 64px;
  }

  @media (max-width: 480px) {
    height: 60px;
  }
`;

export const BrandBox = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  text-decoration: none;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;

  .back-btn-mobile {
    display: none;
    width: 38px;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-radius: 13px;
    background: #f8fafc;
    border: 1px solid rgba(226, 232, 240, 0.9);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
    transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

    svg {
      color: ${NAVY} !important;
    }
  }

  &:hover .back-btn-mobile {
    background: rgba(0, 0, 128, 0.06);
    border-color: rgba(0, 0, 128, 0.16);
    transform: translateX(-1px);
  }

  @media (max-width: 768px) {
    .back-btn-mobile {
      display: inline-flex;
    }

    .hide-logo-on-mobile {
      display: none !important;
    }
  }
`;

export const BrandLogo = styled.img`
  width: 150px;
  max-width: 32vw;
  height: 42px;
  object-fit: contain;
  object-position: left center;
  flex-shrink: 0;
  border-radius: 12px;
  background: transparent;
  mix-blend-mode: multiply;
  filter: drop-shadow(0 7px 14px rgba(0, 0, 128, 0.1));

  @media (min-width: 1025px) {
    width: 176px;
    max-width: 176px;
    height: 44px;
  }

  @media (max-width: 768px) {
    width: 128px;
    max-width: 34vw;
    height: 38px;
  }

  @media (max-width: 480px) {
    width: 112px;
    height: 34px;
  }
`;

export const BrandName = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: ${NAVY};

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;

  @media (max-width: 991px) {
    display: none;
  }
`;

export const NavList = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 46px;
  padding: 5px;
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(248, 250, 255, 0.72));
  border: 1px solid rgba(0, 0, 128, 0.1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 12px 28px rgba(0, 0, 128, 0.06);
`;

export const NavItem = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 15px;
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #000080, #1212a6)" : "transparent"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#1f2937")};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  svg {
    font-size: 15px;
    color: ${({ $active }) => ($active ? YELLOW : "#64748b")};
    transition: transform 0.2s ease, color 0.2s ease;
  }

  &::after {
    content: "";
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: -5px;
    height: 2px;
    border-radius: 999px;
    background: ${YELLOW};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0.35)});
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  &:hover {
    color: ${NAVY};
    background: rgba(0, 0, 128, 0.08);
    transform: translateY(-1px);
  }

  &:hover svg {
    color: ${NAVY};
    transform: translateY(1px);
  }

  ${({ $active }) =>
    $active &&
    `
      box-shadow: 0 12px 22px rgba(0, 0, 128, 0.2);

      &:hover {
        color: #ffffff;
        background: linear-gradient(135deg, #000080, #1212a6);
      }

      &:hover svg {
        color: ${YELLOW};
      }
    `}
`;

export const RightActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
  flex-shrink: 0;

  @media (max-width: 480px) {
    gap: 7px;
  }
`;

export const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  button,
  .wallet-btn {
    position: relative;
    width: 42px;
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 0, 128, 0.1);
    border-radius: 15px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 255, 0.78));
    color: #334155;
    cursor: pointer;
    box-shadow: 0 10px 22px rgba(0, 0, 128, 0.06);
    transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease, border-color 0.2s ease,
      box-shadow 0.2s ease;

    svg {
      font-size: 18px;
    }

    &:hover {
      background: rgba(0, 0, 128, 0.07);
      color: ${NAVY};
      border-color: rgba(0, 0, 128, 0.18);
      transform: translateY(-2px);
      box-shadow: 0 14px 28px rgba(0, 0, 128, 0.1);
    }
  }

  .wallet-btn {
    color: ${NAVY};
    background: linear-gradient(180deg, #fff6cf, rgba(255, 255, 255, 0.9));
    border-color: rgba(255, 193, 7, 0.5);
    box-shadow: 0 12px 24px rgba(255, 193, 7, 0.16);
  }

  @media (max-width: 768px) {
    gap: 5px;

    > button:not(.essential) {
      display: none;
    }

    button,
    .wallet-btn {
      width: 38px;
      height: 38px;
      border-radius: 13px;
    }
  }

  @media (max-width: 360px) {
    .wallet-btn {
      display: none;
    }
  }
`;

export const WalletIconWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
`;

export const WalletBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -9px;
  max-width: 66px;
  padding: 3px 7px;
  border-radius: 999px;
  border: 2px solid #ffffff;
  background: linear-gradient(135deg, #ffd23f, ${YELLOW});
  color: #111827;
  font-size: 10px;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 8px 18px rgba(255, 193, 7, 0.35);

  @media (max-width: 480px) {
    max-width: 54px;
    padding: 3px 6px;
    font-size: 9px;
  }
`;

export const LanguageSwitcher = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  min-height: 38px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(248, 250, 255, 0.86);
  border: 1px solid rgba(0, 0, 128, 0.1);
  box-shadow: 0 10px 22px rgba(0, 0, 128, 0.05);

  @media (max-width: 480px) {
    min-height: 34px;
  }
`;

export const LanguageOption = styled.button`
  width: auto !important;
  height: 30px !important;
  min-width: 34px;
  padding: 0 9px !important;
  border-radius: 999px !important;
  border: 0 !important;
  background: ${({ $active }) =>
    $active ? `linear-gradient(135deg, ${NAVY}, #1212a6) !important` : "transparent !important"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#475569")} !important;
  box-shadow: ${({ $active }) =>
    $active ? "0 8px 16px rgba(0, 0, 128, 0.16) !important" : "none !important"};
  font-size: 11px !important;
  font-weight: 900 !important;
  letter-spacing: 0.01em;

  &:hover {
    transform: none !important;
    color: ${({ $active }) => ($active ? "#ffffff" : NAVY)} !important;
    background: ${({ $active }) =>
      $active ? `linear-gradient(135deg, ${NAVY}, #1212a6) !important` : "rgba(0, 0, 128, 0.07) !important"};
  }

  @media (max-width: 480px) {
    min-width: 30px;
    height: 28px !important;
    padding: 0 7px !important;
    font-size: 10px !important;
  }
`;

export const AuthButton = styled.button`
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, ${NAVY}, #1212a6);
  color: #ffffff;
  min-height: 42px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 850;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  box-shadow: 0 14px 28px rgba(0, 0, 128, 0.22);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 30px rgba(0, 0, 128, 0.26);
  }

  @media (max-width: 768px) {
    min-height: 38px;
    padding: 0 14px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    font-size: 13px;
  }
`;

export const MobileIcon = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(0, 0, 128, 0.12);
  border-radius: 15px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 255, 0.82));
  color: ${NAVY};
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 128, 0.07);
    border-color: rgba(0, 0, 128, 0.18);
    transform: translateY(-1px);
  }

  @media (max-width: 991px) {
    display: inline-flex;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    border-radius: 13px;
  }
`;

export const MobileMenu = styled.div`
  position: fixed;
  top: 78px;
  right: clamp(12px, 2vw, 24px);
  width: min(338px, calc(100vw - 24px));
  display: grid;
  gap: 9px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 128, 0.12);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 193, 7, 0.14), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 249, 255, 0.98)),
    #ffffff;
  box-shadow: 0 28px 58px rgba(0, 0, 128, 0.18);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  z-index: 10001;

  &::before {
    content: "";
    position: absolute;
    top: -7px;
    right: 18px;
    width: 14px;
    height: 14px;
    transform: rotate(45deg);
    background: #ffffff;
    border-left: 1px solid rgba(0, 0, 128, 0.12);
    border-top: 1px solid rgba(0, 0, 128, 0.12);
  }

  @media (max-width: 768px) {
    top: 70px;
  }

  @media (max-width: 480px) {
    top: 64px;
    right: 12px;
    width: calc(100vw - 24px);
    border-radius: 20px;
  }
`;

export const MobileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 46px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(248, 250, 255, 0.9);
  color: #1f2937;
  font-size: 14px;
  font-weight: 760;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 128, 0.08);
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  svg {
    flex: 0 0 auto;
    font-size: 18px;
    color: ${NAVY};
  }

  &:hover,
  &:active {
    background: rgba(0, 0, 128, 0.07);
    border-color: rgba(0, 0, 128, 0.16);
    color: ${NAVY};
    transform: translateX(2px);
  }
`;
