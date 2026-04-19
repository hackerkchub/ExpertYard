import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import LazyRoute from "../../../routes/LazyRoute";
import MainLayout from "../layouts/MainLayout";
import ScrollToTop from "../components/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";

const HomePage = lazy(() => import("../pages/Home/Home"));
const ExpertList = lazy(() => import("../pages/ExpertList/ExpertList"));
const ExpertProfile = lazy(() => import("../pages/ExpertProfile/ExpertProfile"));
const CallChatExpert = lazy(() => import("../pages/CallChat/CallChatExpert"));
const UserAuth = lazy(() => import("../pages/UserAuth/UserAuth"));
const WalletPage = lazy(() => import("../pages/Wallet/Wallet"));
const Chat = lazy(() => import("../pages/Chat/Chat"));
const UserChatHistory = lazy(() => import("../pages/chat-history/UserChatHistory"));
const MyOffer = lazy(() => import("../pages/MyOffers/MyOffer"));
const VoiceCall = lazy(() => import("../pages/voice-call/VoiceCall"));
const Categories = lazy(() => import("../pages/Category/Categories"));
const SubcategoryPage = lazy(() => import("../pages/Subcategory/SubcategoryPage"));
const AboutUs = lazy(() => import("../pages/About-Us/AboutUs"));
const HowItWorks = lazy(() => import("../pages/how-it-work/HowItWorks"));
const Reviews = lazy(() => import("../pages/reviews/Reviews"));
const ExpertGuidelines = lazy(() => import("../pages/Expert-Guideline/ExpertGuidelines"));
const TermsAndConditions = lazy(() => import("../pages/T&C/T&C"));
const PrivacyPolicy = lazy(() => import("../pages/Privacy-Policy/PrivacyPolicy"));
const FAQ = lazy(() => import("../pages/FAQ/Faq"));
const ContactUs = lazy(() => import("../pages/Contact-Us/ContactUs"));
const Careers = lazy(() => import("../pages/Careers/Career"));
const AllServices = lazy(() => import("../pages/AllServicesByCatId/AllServices"));
const ServiceDetails = lazy(() => import("../pages/AllServicesByCatId/ServiceDetails"));
const MyBookings = lazy(() => import("../pages/AllServicesByCatId/MyBookings"));

const withLazyRoute = (node) => <LazyRoute>{node}</LazyRoute>;

export default function UserAppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={withLazyRoute(<HomePage />)} />
          <Route path="experts" element={withLazyRoute(<ExpertList />)} />
          <Route path="experts/:expertId" element={withLazyRoute(<ExpertProfile />)} />
          <Route path="call-chat" element={withLazyRoute(<CallChatExpert />)} />
          <Route path="auth" element={withLazyRoute(<UserAuth />)} />
          <Route path="my-offers" element={withLazyRoute(<MyOffer />)} />
          <Route path="categories" element={withLazyRoute(<Categories />)} />
          <Route path="about" element={withLazyRoute(<AboutUs />)} />
          <Route path="how-it-works" element={withLazyRoute(<HowItWorks />)} />
          <Route path="reviews" element={withLazyRoute(<Reviews />)} />
          <Route path="guidelines" element={withLazyRoute(<ExpertGuidelines />)} />
          <Route path="terms" element={withLazyRoute(<TermsAndConditions />)} />
          <Route path="subcategories/:categoryId" element={withLazyRoute(<SubcategoryPage />)} />
          <Route path="privacy" element={withLazyRoute(<PrivacyPolicy />)} />
          <Route path="faq" element={withLazyRoute(<FAQ />)} />
          <Route path="contact" element={withLazyRoute(<ContactUs />)} />
          <Route path="careers" element={withLazyRoute(<Careers />)} />
          <Route path="all-services" element={withLazyRoute(<AllServices />)} />
          <Route path="service-details/:id" element={withLazyRoute(<ServiceDetails />)} />
          <Route path="my-booking/:id" element={withLazyRoute(<MyBookings />)} />
          <Route
            path="voice-call/:expertId"
            element={
              <ProtectedRoute>
                <LazyRoute>
                  <VoiceCall />
                </LazyRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="wallet"
            element={
              <ProtectedRoute>
                <LazyRoute>
                  <WalletPage />
                </LazyRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="chat"
            element={
              <ProtectedRoute>
                <LazyRoute>
                  <Chat />
                </LazyRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="chat/:room_id"
            element={
              <ProtectedRoute>
                <LazyRoute>
                  <Chat />
                </LazyRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="chat-history"
            element={
              <ProtectedRoute>
                <LazyRoute>
                  <UserChatHistory />
                </LazyRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="chat-history/:session_id"
            element={
              <ProtectedRoute>
                <LazyRoute>
                  <UserChatHistory />
                </LazyRoute>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
              }}
            >
              <h1>404 - Page Not Found</h1>
              <p>The page you&apos;re looking for doesn&apos;t exist.</p>
            </div>
          }
        />
      </Routes>
    </>
  );
}
