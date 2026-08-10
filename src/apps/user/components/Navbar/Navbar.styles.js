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
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);

  @media (min-width: 769px) {
    height: 58px;
    min-height: 58px;
    max-height: 58px;
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    background: #111827 !important;
    border-bottom: none !important;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15) !important;

    &.user-common-mobile-header {
      background: #111827 !important;
      border-bottom: none !important;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15) !important;

      * {
        color: #ffffff !important;
      }
    }
  }
`;

export const Container = styled.div`
  position: relative;
  max-width: 1600px;
  width: 100%;
  height: 58px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-sizing: border-box;

  @media (min-width: 769px) {
    max-width: 1600px;
    height: 58px;
    min-height: 58px;
    max-height: 58px;
    padding: 0 32px;
    gap: 16px;
    flex-wrap: nowrap;
    white-space: nowrap;
    align-items: center;
  }

  @media (max-width: 768px) {
    height: 64px;
    gap: 8px;
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    height: 60px;
    gap: 5px;
    padding: 0 8px;
  }
`;

export const HeaderBrandGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex-shrink: 0;

  @media (max-width: 768px) {
    &.mobile-hidden {
      display: none;
    }
  }

  @media (max-width: 480px) {
    gap: 5px;
  }
`;

export const HeaderMobileTitle = styled.div`
  display: none;

  @media (max-width: 768px) {
    min-width: 0;
    flex: 1 1 auto;
    display: block;
    color: #ffffff !important;
    font-size: 17px;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 420px) {
    font-size: 16px;
  }

  @media (max-width: 340px) {
    font-size: 15px;
  }
`;

export const HeaderBackButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none !important;
    border-radius: 13px;
    background: transparent !important;
    color: #ffffff !important;
    cursor: pointer;
    box-shadow: none !important;

    &:hover, &:active {
      background: rgba(255, 255, 255, 0.1) !important;
    }

    svg {
      width: 19px;
      height: 19px;
      color: #ffffff !important;
      stroke: #ffffff !important;
    }
  }

  @media (max-width: 420px) {
    width: 34px;
    height: 34px;
    border-radius: 12px;
  }
`;

export const HeaderMenuButton = styled.button`
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 128, 0.12);
  border-radius: 15px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 255, 0.82));
  color: ${NAVY};
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(0, 0, 128, 0.07);
    border-color: rgba(0, 0, 128, 0.18);
    transform: translateY(-1px);
  }

  &.mobile-menu-trigger {
    display: none;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    border-radius: 13px;
    background: transparent !important;
    border: none !important;
    color: #ffffff !important;
    box-shadow: none !important;

    svg {
      color: #ffffff !important;
      stroke: #ffffff !important;
    }

    &.mobile-menu-trigger {
      display: inline-flex;
    }
  }

  @media (max-width: 420px) {
    width: 34px;
    height: 34px;
    border-radius: 12px;
  }
`;

export const HeaderCategoryButton = styled.button`
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 0 0 auto;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 128, 0.12);
  border-radius: 15px;
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #000080, #1212a6)" : "rgba(255, 255, 255, 0.9)"};
  color: ${({ $active }) => ($active ? "#ffffff" : NAVY)};
  font-size: 14px;
  font-weight: 850;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(0, 0, 128, 0.07);
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

  svg {
    flex: 0 0 auto;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(0, 0, 128, 0.2);
  }

  @media (max-width: 640px) {
    min-height: 38px;
    padding: 0 8px;
    border-radius: 13px;
    font-size: 13px;

    span {
      display: none;
    }

    svg:last-child {
      display: none;
    }
  }

  @media (max-width: 420px) {
    min-height: 34px;
    padding: 0 7px;
  }

  @media (max-width: 420px) {
    span {
      display: none;
    }
  }
`;

export const HeaderCategoryMenuShell = styled.div`
  position: relative;
  flex: 0 0 auto;

  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const HeaderWalletButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 0, 128, 0.12);
    border-radius: 13px;
    background: #ffffff;
    color: ${NAVY};
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
    -webkit-tap-highlight-color: transparent;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 420px) {
    width: 34px;
    height: 34px;
    border-radius: 12px;

    svg {
      width: 17px;
      height: 17px;
    }
  }
`;

export const HeaderMobileLocation = styled.div`
  display: none;
  min-width: 0;

  @media (max-width: 768px) {
    flex: 0 1 auto;
    display: inline-flex;
    align-items: center;
    min-width: 0;
    max-width: min(42vw, 178px);

    .g9-location-selector-container {
      min-width: 0;
      width: 100%;
    }

    .g9-location-trigger-chip {
      width: 100%;
      max-width: 100%;
      min-height: 38px;
      padding: 0 10px;
      border-radius: 13px;
      gap: 6px;
      font-size: 12px;
      font-weight: 850;
      background: #ffffff;
      border-color: rgba(0, 0, 128, 0.12);
      color: ${NAVY};
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
    }

    .g9-location-trigger-chip .location-name {
      min-width: 0;
      max-width: none;
    }

    .g9-location-trigger-chip .clear-icon {
      display: none;
    }
  }

  @media (max-width: 480px) {
    max-width: min(40vw, 150px);

    .g9-location-trigger-chip {
      min-height: 34px;
      padding: 0 8px;
      border-radius: 12px;
      font-size: 11px;
    }
  }

  @media (max-width: 360px) {
    max-width: 116px;
  }
`;

export const HeaderCategoryMenu = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  z-index: 10002;
  width: min(560px, calc(100vw - 32px));
  padding-top: 2px;

  @media (max-width: 991px) {
    display: none;
  }
`;

export const HeaderCategoryMenuCard = styled.div`
  padding: 16px;
  border: 1px solid rgba(0, 0, 128, 0.1);
  border-radius: 22px;
  background:
    radial-gradient(circle at top right, rgba(255, 193, 7, 0.14), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
  box-shadow: 0 26px 58px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(18px);

  h3 {
    margin: 0 0 12px;
    color: ${NAVY};
    font-size: 0.86rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
`;

export const HeaderCategoryMenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

export const HeaderCategoryMenuItem = styled.button`
  min-width: 0;
  min-height: 70px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.86);
  color: #172033;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.04);
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  span {
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 14px;
    background: rgba(0, 0, 128, 0.08);
    color: ${NAVY};
    font-weight: 900;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  strong {
    min-width: 0;
    color: #172033;
    font-size: 0.86rem;
    line-height: 1.25;
    font-weight: 850;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &:hover,
  &:focus-visible {
    outline: none;
    transform: translateY(-1px);
    border-color: rgba(0, 0, 128, 0.18);
    background: #ffffff;
    box-shadow: 0 16px 30px rgba(0, 0, 128, 0.1);
  }
`;

export const HeaderCategoryMenuState = styled.div`
  padding: 18px 12px;
  border-radius: 16px;
  background: rgba(248, 250, 255, 0.92);
  color: #667085;
  text-align: center;
  font-size: 0.88rem;
  font-weight: 800;
`;

export const HeaderSearch = styled.div`
  flex: 1;
  min-width: 150px;
  max-width: 520px;

  @media (min-width: 769px) {
    flex: 1;
    min-width: 320px;
    max-width: 480px;
    margin-right: 28px;
  }

  .navbar-global-search .g9-global-search__form {
    min-height: 42px;
    height: 42px;
    max-height: 42px;
    padding: 4px 44px 4px 14px;
    border-radius: 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
    display: flex;
    align-items: center;
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .navbar-global-search .g9-global-search__form:focus-within {
    border-color: #000080;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(0, 0, 128, 0.08), 0 4px 12px rgba(0, 0, 128, 0.06);
  }

  .navbar-global-search .g9-global-search__form input {
    font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: #1e293b;
  }

  .navbar-global-search .g9-global-search__form input::placeholder {
    color: #94a3b8;
    font-weight: 500;
    font-size: 15px;
  }

  .navbar-global-search .g9-global-search__icon {
    width: 28px;
    height: 28px;
    border-radius: 10px;
    color: #000080;
    background: rgba(0, 0, 128, 0.06);
  }

  .navbar-global-search .g9-global-search__submit {
    height: 32px;
    min-width: 72px;
    border-radius: 10px;
    font-family: "Poppins", sans-serif;
    font-size: 13px;
    font-weight: 600;
    background: #000080;
  }

  .navbar-global-search .g9-global-search__clear {
    width: 28px;
    height: 28px;
  }

  .navbar-global-search .g9-search-dropdown {
    top: calc(100% + 6px);
  }

  @media (max-width: 991px) {
    display: none;
  }
`;

export const HeaderLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ $compact }) => ($compact ? "0" : "10px")};
  min-width: 0;
  flex-shrink: 0;

  @media (max-width: 480px) {
    gap: ${({ $compact }) => ($compact ? "0" : "7px")};
  }
`;

export const NavbarSpacer = styled.div`
  height: 58px;

  @media (min-width: 769px) {
    height: 58px;
  }

  @media (max-width: 768px) {
    height: 58px;
  }

  @media (max-width: 480px) {
    height: 50px;
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
  margin-right: 36px;
  -webkit-tap-highlight-color: transparent;
`;

export const BrandLogo = styled.img`
  width: 140px;
  max-width: 32vw;
  height: 32px;
  object-fit: contain;
  object-position: left center;
  flex-shrink: 0;
  border-radius: 8px;
  background: transparent;
  mix-blend-mode: multiply;

  @media (min-width: 769px) {
    width: auto;
    max-width: 150px;
    height: 32px;
    max-height: 32px;
  }

  @media (max-width: 768px) {
    width: 128px;
    max-width: 34vw;
    height: 38px;
  }

  @media (max-width: 480px) {
    width: 104px;
    max-width: 104px;
    height: 36px;
  }

  @media (max-width: 420px) {
    width: 92px;
    max-width: 92px;
    height: 34px;
  }

  @media (max-width: 350px) {
    width: 78px;
    max-width: 78px;
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
  gap: 2px;
  min-height: 38px;
  padding: 3px 4px;
  border-radius: 999px;
  background: rgba(248, 250, 255, 0.86);
  border: 1px solid rgba(0, 0, 128, 0.1);
  box-shadow: 0 10px 22px rgba(0, 0, 128, 0.05);

  @media (max-width: 480px) {
    min-height: 34px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export const LanguageIcon = styled.span`
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 999px;
  color: ${NAVY};
  background: rgba(0, 0, 128, 0.07);

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;

    svg {
      width: 13px;
      height: 13px;
    }
  }

  @media (max-width: 380px) {
    display: none;
  }
`;

export const LanguageOption = styled.button`
  width: auto !important;
  height: 30px !important;
  min-width: 31px;
  padding: 0 8px !important;
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
  border-radius: 14px;
  background: linear-gradient(135deg, ${NAVY} 0%, #1212a6 100%);
  color: #ffffff;
  min-width: 92px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 0 0 auto;
  padding: 0 20px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 128, 0.2);
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0, 0, 128, 0.28);
    background: linear-gradient(135deg, #000096 0%, #1515bf 100%);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  span {
    line-height: 1;
  }

  @media (max-width: 768px) {
    width: 38px;
    min-width: 38px;
    height: 38px;
    padding: 0;
    border-radius: 13px;

    span {
      display: none;
    }
  }

  @media (max-width: 420px) {
    width: 34px;
    min-width: 34px;
    height: 34px;
    border-radius: 12px;
  }
`;

export const MobileLanguageMenu = styled.div`
  position: relative;
  display: none;
  flex: 0 0 auto;

  @media (max-width: 640px) {
    display: inline-flex;
  }
`;

export const MobileLanguageButton = styled.button`
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 128, 0.1);
  border-radius: 13px;
  background: rgba(248, 250, 255, 0.92);
  color: ${NAVY};
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(0, 0, 128, 0.05);

  @media (max-width: 768px) {
    background: rgba(255, 255, 255, 0.15) !important;
    border: none !important;
    color: #ffffff !important;
    box-shadow: none !important;

    svg {
      color: #ffffff !important;
      stroke: #ffffff !important;
    }
  }

  @media (max-width: 420px) {
    width: 34px;
    height: 34px;
    border-radius: 12px;
  }
`;

export const MobileLanguageDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 10003;
  min-width: 92px;
  display: grid;
  gap: 4px;
  padding: 6px;
  border: 1px solid rgba(0, 0, 128, 0.1);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.16);

  button {
    min-height: 32px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: #334155;
    cursor: pointer;
    font-size: 12px;
    font-weight: 900;
    text-align: left;
    padding: 0 9px;
  }

  button.active,
  button:hover {
    background: rgba(0, 0, 128, 0.08);
    color: ${NAVY};
  }
`;

export const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;

  @media (max-width: 768px) {
    &.common-mobile-hidden {
      display: none;
    }
  }

  @media (max-width: 640px) {
    gap: 5px;
    margin-left: auto;
  }

  @media (max-width: 420px) {
    ${LanguageSwitcher} {
      min-height: 32px;
      padding: 2px 3px;
    }

    ${LanguageOption} {
      min-width: 27px;
      height: 26px !important;
      padding: 0 5px !important;
      font-size: 10px !important;
    }
  }
`;

export const HeaderDesktopIconButton = styled.button`
  position: relative;
  width: 42px;
  height: 42px;
  min-width: 42px;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #ffffff;
  color: #000080;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: #f8fafc;
    color: ${NAVY};
    border-color: rgba(0, 0, 128, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
  }

  &.desktop-notification-button::after {
    content: "";
    position: absolute;
    top: 8px;
    right: 9px;
    width: 7px;
    height: 7px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: #ef4444;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const HeaderWalletPill = styled.button`
  height: 42px;
  min-height: 42px;
  max-height: 42px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(255, 193, 7, 0.45);
  border-radius: 14px;
  background: linear-gradient(180deg, #fffcf0 0%, #ffffff 100%);
  color: #1e293b;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 193, 7, 0.1);
  font-family: "Poppins", sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    color: ${NAVY};
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 193, 7, 0.7);
    box-shadow: 0 6px 16px rgba(255, 193, 7, 0.18);
  }

  @media (max-width: 1120px) {
    min-width: 42px;
    padding: 0;

    span {
      display: none;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const HeaderProfileButton = styled.button`
  width: 42px;
  height: 42px;
  min-width: 42px;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  background: #ffffff;
  color: #334155;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    font-size: 18px;
  }

  &:hover {
    background: #ffffff;
    color: ${NAVY};
    border-color: #000080;
    transform: scale(1.03);
  }

  &.mobile-profile-shortcut {
    display: none;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    border-radius: 13px;
    background: transparent !important;
    border: none !important;
    color: #ffffff !important;
    box-shadow: none !important;

    &.mobile-profile-shortcut {
      display: inline-flex;
    }

    svg {
      width: 18px;
      height: 18px;
      color: #ffffff !important;
      stroke: #ffffff !important;
    }
  }

  @media (max-width: 420px) {
    width: 34px;
    height: 34px;
    border-radius: 12px;

    svg {
      width: 17px;
      height: 18px;
    }
  }

  @media (max-width: 420px) {
    width: 34px;
    height: 34px;
    border-radius: 12px;

    svg {
      width: 17px;
      height: 17px;
    }
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
    background: transparent !important;
    border: none !important;
    color: #ffffff !important;
    box-shadow: none !important;

    svg {
      color: #ffffff !important;
      stroke: #ffffff !important;
    }
  }

  @media (max-width: 420px) {
    width: 34px;
    height: 34px;
    border-radius: 12px;
  }
`;

export const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: min(280px, 80vw);
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 0 0 max(24px, calc(16px + env(safe-area-inset-bottom, 0px)));
  background: #0f172a;
  color: #f8fafc;
  border-radius: 0 16px 16px 0;
  box-shadow: 12px 0 45px rgba(0, 0, 0, 0.6);
  z-index: 10001;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  box-sizing: border-box;
  border-right: 1px solid rgba(255, 255, 255, 0.08);

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    width: min(280px, 80vw);
    height: 100dvh;
    max-height: 100dvh;
  }
`;

export const MobileMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
`;

export const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 64px;
  padding: max(16px, calc(12px + env(safe-area-inset-top, 0px))) 16px 16px 18px;
  background: linear-gradient(135deg, #020617 0%, #0f172a 100%);
  color: #ffffff;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  h4 {
    color: #ffffff !important;
  }

  span {
    color: #94a3b8 !important;
  }

  button {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s ease;

    &:active {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }
  }
`;

export const MobileMenuSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const MobileMenuTitle = styled.div`
  font-family: "Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 16px 16px 6px 16px;
  margin-top: 4px;
`;

export const MobileMenuFooter = styled(MobileMenuSection)`
  margin-top: auto;
  border-bottom: none;
  padding-bottom: 0;
`;

export const MenuWalletValue = styled.span`
  margin-left: auto;
  color: #fbbf24;
  font-size: 12px;
  font-weight: 700;
`;

export const MobileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 48px;
  height: 48px;
  padding: 0 16px 0 16px;
  border-radius: 0 24px 24px 0;
  margin: 2px 12px 2px 0;
  color: #f1f5f9;
  font-family: "Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.25px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  -webkit-tap-highlight-color: transparent;

  svg {
    flex: 0 0 auto;
    font-size: 20px;
    color: #94a3b8;
    transition: color 0.15s ease;
  }

  &:hover,
  &:active {
    background: linear-gradient(90deg, rgba(30, 58, 138, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
    color: #ffffff;
    font-weight: 700;
    border-left: 3px solid #fbbf24;

    svg {
      color: #fbbf24;
    }
  }

  @media (min-width: 769px) {
    &.mobile-only-menu-item {
      display: none;
    }
  }
`;
