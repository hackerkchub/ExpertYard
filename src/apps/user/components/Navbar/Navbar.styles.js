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

  @media (min-width: 769px) {
    background: #ffffff;
    border-bottom: 1px solid rgba(226, 232, 240, 0.92);
    box-shadow: 0 8px 26px rgba(15, 23, 42, 0.045);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;

    &::before {
      display: none;
    }

    .desktop-only-location {
      flex: 0 0 210px;
      min-width: 0;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }

    .desktop-only-location .g9-location-selector-container {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    &.user-common-mobile-header {
      background: rgba(255, 255, 255, 0.96);
      border-bottom: 1px solid rgba(0, 0, 128, 0.08);
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
    }

    &.user-common-mobile-header::before {
      background: linear-gradient(90deg, ${NAVY}, #2563eb);
      opacity: 0.85;
    }

    &.user-common-mobile-header .mobile-menu-trigger {
      display: none !important;
    }
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
  gap: clamp(8px, 1.5vw, 16px);

  @media (min-width: 769px) {
    max-width: 1440px;
    height: 84px;
    padding: 0 28px;
    gap: 14px;
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
    color: #111827;
    font-size: 17px;
    line-height: 1.2;
    font-weight: 850;
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
    border: 1px solid rgba(0, 0, 128, 0.12);
    border-radius: 13px;
    background: #ffffff;
    color: ${NAVY};
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);

    svg {
      width: 19px;
      height: 19px;
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
    max-width: none;
    min-width: 280px;
  }

  .navbar-global-search .g9-global-search__form {
    min-height: 52px;
    height: 52px;
    padding: 6px 7px 6px 14px;
    border-radius: 18px;
    background: #f8fafc;
    border-color: rgba(203, 213, 225, 0.92);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.64);
  }

  .navbar-global-search .g9-global-search__icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
  }

  .navbar-global-search .g9-global-search__submit {
    height: 38px;
    min-width: 86px;
    border-radius: 13px;
    font-size: 0.84rem;
  }

  .navbar-global-search .g9-global-search__clear {
    width: 30px;
    height: 30px;
  }

  .navbar-global-search .g9-search-dropdown {
    top: calc(100% + 8px);
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
  border-radius: 15px;
  background: linear-gradient(135deg, ${NAVY}, #1212a6);
  color: #ffffff;
  min-width: 92px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 0 0 auto;
  padding: 0 16px;
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

  svg {
    width: 18px;
    height: 18px;
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

  svg {
    width: 17px;
    height: 17px;
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
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 128, 0.1);
  border-radius: 16px;
  background: #ffffff;
  color: #334155;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(0, 0, 128, 0.06);
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: rgba(0, 0, 128, 0.07);
    color: ${NAVY};
    border-color: rgba(0, 0, 128, 0.18);
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(0, 0, 128, 0.1);
  }

  &.desktop-notification-button::after {
    content: "";
    position: absolute;
    top: 9px;
    right: 10px;
    width: 8px;
    height: 8px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: #ef4444;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const HeaderWalletPill = styled.button`
  min-width: 128px;
  height: 46px;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(255, 193, 7, 0.48);
  border-radius: 16px;
  background: linear-gradient(180deg, #fff7d6, rgba(255, 255, 255, 0.94));
  color: #172033;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(255, 193, 7, 0.13);
  font-size: 13px;
  font-weight: 850;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    color: ${NAVY};
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 193, 7, 0.7);
    box-shadow: 0 16px 28px rgba(255, 193, 7, 0.18);
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 128, 0.1);
  border-radius: 15px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 255, 0.78));
  color: #334155;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(0, 0, 128, 0.06);
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease,
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

  &.mobile-profile-shortcut {
    display: none;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    border-radius: 13px;

    &.mobile-profile-shortcut {
      display: inline-flex;
    }

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
  width: min(360px, calc(100vw - 30px));
  height: 100vh;
  display: grid;
  align-content: start;
  gap: 9px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 128, 0.12);
  border-radius: 0 24px 24px 0;
  background:
    radial-gradient(circle at top left, rgba(255, 193, 7, 0.14), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 249, 255, 0.98)),
    #ffffff;
  box-shadow: 0 28px 58px rgba(0, 0, 128, 0.18);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  z-index: 10001;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: min(86vw, 340px);
    max-width: calc(100vw - 20px);
    height: 100dvh;
    max-height: 100dvh;
    padding: 14px 14px calc(18px + env(safe-area-inset-bottom, 0px));
    border-radius: 0 22px 22px 0;
    overscroll-behavior: contain;
  }

  @media (max-width: 480px) {
    width: min(88vw, 318px);
    border-radius: 0 20px 20px 0;
  }

  @media (max-width: 340px) {
    width: calc(100vw - 16px);
    padding: 12px 12px calc(16px + env(safe-area-inset-bottom, 0px));
  }
`;

export const MobileMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(2px);
`;

export const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 50px;
  margin-bottom: 8px;

  button {
    width: 38px;
    height: 38px;
    border: 1px solid rgba(0, 0, 128, 0.12);
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.9);
    color: ${NAVY};
    cursor: pointer;
  }

  @media (max-width: 768px) {
    button {
      min-width: 44px;
      width: 44px;
      height: 44px;
    }
  }

  @media (max-width: 420px) {
    gap: 8px;
  }
`;

export const MobileMenuSection = styled.div`
  display: grid;
  gap: 8px;
  padding: 10px 0;
  border-top: 1px solid rgba(0, 0, 128, 0.08);
`;

export const MobileMenuTitle = styled.div`
  color: #667085;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const MobileMenuFooter = styled(MobileMenuSection)`
  margin-top: auto;
  padding-bottom: 0;
`;

export const MenuWalletValue = styled.span`
  margin-left: auto;
  color: ${NAVY};
  font-size: 0.82rem;
  font-weight: 900;
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

  @media (min-width: 769px) {
    &.mobile-only-menu-item {
      display: none;
    }
  }

  @media (max-width: 768px) {
    min-height: 48px;
  }

  @media (max-width: 360px) {
    gap: 9px;
    min-height: 46px;
    padding: 11px 12px;
    font-size: 13px;
  }
`;
