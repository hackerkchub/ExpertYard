import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import AppNotFound from "../../../routes/AppNotFound";
import LazyRoute from "../../../routes/LazyRoute";
import MinimalLayout from "../layouts/MinimalLayout";
import MainLayout from "../layouts/MainLayout";
import UserRouteBoundary from "../layouts/UserRouteBoundary";
import ScrollToTop from "../components/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";

const HomePage = lazy(() => import("../pages/Home/Home"));
const SearchResultsPage = lazy(() => import("../pages/Search/SearchResultsPage"));
const ExpertList = lazy(() => import("../pages/ExpertList/ExpertList"));
const ExpertProfile = lazy(() => import("../pages/ExpertProfile/ExpertProfile"));
const CallChatExpert = lazy(() => import("../pages/CallChat/CallChatExpert"));
const UserAuth = lazy(() => import("../pages/UserAuth/UserAuth"));
const WalletPage = lazy(() => import("../pages/Wallet/Wallet"));
const Chat = lazy(() => import("../pages/Chat/Chat"));
const UserChatHistory = lazy(() => import("../pages/chat-history/UserChatHistory"));
const MyOffer = lazy(() => import("../pages/MyOffers/MyOffer"));
const VoiceCall = lazy(() => import("../pages/voice-call/VoiceCall"));
const VideoCall = lazy(() => import("../pages/video-call/VideoCall"));
const VideoMediaTestPage = lazy(() => import("../../../shared/components/VideoMediaTestPage"));
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
const FindExpertsPage = lazy(() => import("../pages/FooterPages/FindExperts"));
const BecomeExpertPage = lazy(() => import("../pages/FooterPages/BecomeExpert"));
const EarningsModelPage = lazy(() => import("../pages/FooterPages/EarningsModel"));
const SupportPage = lazy(() => import("../pages/FooterPages/Support"));
const MarketingPage = lazy(() => import("../pages/Marketing"));
const AllServices = lazy(() => import("../pages/AllServicesByCatId/AllServices"));
const ServiceDetails = lazy(() => import("../pages/AllServicesByCatId/ServiceDetails"));
const MyBookings = lazy(() => import("../pages/AllServicesByCatId/MyBookings"));
const UserProfile = lazy(() => import("../pages/user-profile/UserProfile"))
const UserNotificationPage = lazy(() => import("../pages/notification/UserNotificationPage"));
const UserInquiriesPage = lazy(() => import("../pages/Inquiry/UserInquiriesPage"));
const ReelsPage = lazy(() => import("../pages/Reels/ReelsPage"));

const withLazyRoute = (node) => <LazyRoute>{node}</LazyRoute>;

export default function UserAppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<UserRouteBoundary />}>
          <Route element={<MainLayout />}>
            <Route index element={withLazyRoute(<HomePage />)} />
            <Route path="search" element={withLazyRoute(<SearchResultsPage />)} />
            <Route path="experts" element={withLazyRoute(<ExpertList />)} />
            <Route path="experts/:slug" element={withLazyRoute(<ExpertProfile />)} />
            <Route path="call-chat" element={withLazyRoute(<CallChatExpert />)} />
            <Route path="my-offers" element={withLazyRoute(<MyOffer />)} />
            <Route path="categories" element={withLazyRoute(<Categories />)} />
            <Route path="category/:categorySlug/experts" element={withLazyRoute(<CallChatExpert />)} />
            <Route path="category/:categoryId/subcategories" element={withLazyRoute(<SubcategoryPage />)} />
            <Route path="category/:categoryId/subcategory/:subcategoryId/experts" element={withLazyRoute(<CallChatExpert />)} />
            <Route path="category/:categorySlug/:subcategorySlug" element={withLazyRoute(<CallChatExpert />)} />
            <Route path="category/:slug" element={withLazyRoute(<SubcategoryPage />)} />
            <Route path="category/:slug/subcategory/:subcategoryId" element={withLazyRoute(<SubcategoryPage />)} />
            <Route path="categories/:slug" element={withLazyRoute(<SubcategoryPage />)} />
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
            <Route path="find-experts" element={withLazyRoute(<FindExpertsPage />)} />
            <Route path="become-expert" element={withLazyRoute(<BecomeExpertPage />)} />
            <Route path="earnings-model" element={withLazyRoute(<EarningsModelPage />)} />
            <Route path="support" element={withLazyRoute(<SupportPage />)} />
            <Route path="marketing" element={withLazyRoute(<MarketingPage />)} />
            <Route path="all-services" element={withLazyRoute(<AllServices />)} />
            <Route path="service-details/:slug" element={withLazyRoute(<ServiceDetails />)} />
            <Route path="my-booking/:id" element={withLazyRoute(<MyBookings />)} />
            <Route
              path="my-services"
              element={
                <ProtectedRoute>
                  <LazyRoute>
                    <MyBookings />
                  </LazyRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="my-inquiries"
              element={
                <ProtectedRoute>
                  <LazyRoute>
                    <UserInquiriesPage />
                  </LazyRoute>
                </ProtectedRoute>
              }
            />
            <Route path="reels" element={withLazyRoute(<ReelsPage />)} />
            <Route path="reels/:slug" element={withLazyRoute(<ReelsPage />)} />
            <Route
              path="notifications"
              element={
                <ProtectedRoute>
                  <LazyRoute>
                    <UserNotificationPage />
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
              path="user-profile"
              element={
                <ProtectedRoute>
                  <LazyRoute>
                    <UserProfile />
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

          <Route element={<MinimalLayout />}>
            <Route path="auth" element={withLazyRoute(<UserAuth />)} />
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
              path="video-call/:expertId"
              element={
                <ProtectedRoute>
                  <LazyRoute>
                    <VideoCall />
                  </LazyRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="video-media-test"
              element={withLazyRoute(<VideoMediaTestPage role="user-diagnostic" />)}
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
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <AppNotFound
              title="User page not found"
              description="The requested user route does not exist."
              homePath="/user"
              actionLabel="Go to user home"
            />
          }
        />
      </Routes>
    </>
  );
}
