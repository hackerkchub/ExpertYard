import lazyWithRetry from "../../../utils/lazyWithRetry";
import { Route, Routes } from "react-router-dom";

import AppNotFound from "../../../routes/AppNotFound";
import LazyRoute from "../../../routes/LazyRoute";
import MinimalLayout from "../layouts/MinimalLayout";
import MainLayout from "../layouts/MainLayout";
import UserRouteBoundary from "../layouts/UserRouteBoundary";
import ScrollToTop from "../components/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";

const HomePage = lazyWithRetry(() => import("../pages/Home/Home"));
const SearchResultsPage = lazyWithRetry(() => import("../pages/Search/SearchResultsPage"));
const ExpertList = lazyWithRetry(() => import("../pages/ExpertList/ExpertList"));
const ExpertProfile = lazyWithRetry(() => import("../pages/ExpertProfile/ExpertProfile"));
const CallChatExpert = lazyWithRetry(() => import("../pages/CallChat/CallChatExpert"));
const UserAuth = lazyWithRetry(() => import("../pages/UserAuth/UserAuth"));
const WalletPage = lazyWithRetry(() => import("../pages/Wallet/Wallet"));
const Chat = lazyWithRetry(() => import("../pages/Chat/Chat"));
const UserChatHistory = lazyWithRetry(() => import("../pages/chat-history/UserChatHistory"));
const MyOffer = lazyWithRetry(() => import("../pages/MyOffers/MyOffer"));
const VoiceCall = lazyWithRetry(() => import("../pages/voice-call/VoiceCall"));
const VideoCall = lazyWithRetry(() => import("../pages/video-call/VideoCall"));
const VideoMediaTestPage = lazyWithRetry(() => import("../../../shared/components/VideoMediaTestPage"));
const Categories = lazyWithRetry(() => import("../pages/Category/Categories"));
const SubcategoryPage = lazyWithRetry(() => import("../pages/Subcategory/SubcategoryPage"));
const AboutUs = lazyWithRetry(() => import("../pages/About-Us/AboutUs"));
const HowItWorks = lazyWithRetry(() => import("../pages/how-it-work/HowItWorks"));
const Reviews = lazyWithRetry(() => import("../pages/reviews/Reviews"));
const ExpertGuidelines = lazyWithRetry(() => import("../pages/Expert-Guideline/ExpertGuidelines"));
const TermsAndConditions = lazyWithRetry(() => import("../pages/T&C/T&C"));
const PrivacyPolicy = lazyWithRetry(() => import("../pages/Privacy-Policy/PrivacyPolicy"));
const RefundCancellation = lazyWithRetry(() => import("../pages/refund&cancellation/RefundCancellation"));
const FAQ = lazyWithRetry(() => import("../pages/FAQ/Faq"));
const ContactUs = lazyWithRetry(() => import("../pages/Contact-Us/ContactUs"));
const Careers = lazyWithRetry(() => import("../pages/Careers/Career"));
const FindExpertsPage = lazyWithRetry(() => import("../pages/FooterPages/FindExperts"));
const BecomeExpertPage = lazyWithRetry(() => import("../pages/FooterPages/BecomeExpert"));
const EarningsModelPage = lazyWithRetry(() => import("../pages/FooterPages/EarningsModel"));
const SupportPage = lazyWithRetry(() => import("../pages/FooterPages/Support"));
const MarketingPage = lazyWithRetry(() => import("../pages/Marketing"));
const AllServices = lazyWithRetry(() => import("../pages/AllServicesByCatId/AllServices"));
const MasterServicesCatalogPage = lazyWithRetry(() => import("../pages/MasterService/MasterServicesCatalogPage"));
const ServiceDetails = lazyWithRetry(() => import("../pages/AllServicesByCatId/ServiceDetails"));
const MyBookings = lazyWithRetry(() => import("../pages/AllServicesByCatId/MyBookings"));
const UserProfile = lazyWithRetry(() => import("../pages/user-profile/UserProfile"));
const UserNotificationPage = lazyWithRetry(() => import("../pages/notification/UserNotificationPage"));
const UserInquiriesPage = lazyWithRetry(() => import("../pages/Inquiry/UserInquiriesPage"));
const ReelsPage = lazyWithRetry(() => import("../pages/Reels/ReelsPage"));
const DynamicBookingWizard = lazyWithRetry(() => import("../pages/Booking/DynamicBookingWizard"));
const UserWorkspacePage = lazyWithRetry(() => import("../pages/Workspace/UserWorkspacePage"));
const MasterServiceDetailPage = lazyWithRetry(() => import("../pages/MasterService/MasterServiceDetailPage"));
const MasterServiceSlugPage = lazyWithRetry(() => import("../pages/MasterService/MasterServiceSlugPage"));

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
            <Route path="refund-cancellation" element={withLazyRoute(<RefundCancellation />)} />
            <Route path="faq" element={withLazyRoute(<FAQ />)} />
            <Route path="contact" element={withLazyRoute(<ContactUs />)} />
            <Route path="careers" element={withLazyRoute(<Careers />)} />
            <Route path="find-experts" element={withLazyRoute(<FindExpertsPage />)} />
            <Route path="become-expert" element={withLazyRoute(<BecomeExpertPage />)} />
            <Route path="earnings-model" element={withLazyRoute(<EarningsModelPage />)} />
            <Route path="support" element={withLazyRoute(<SupportPage />)} />
            <Route path="marketing" element={withLazyRoute(<MarketingPage />)} />
            <Route path="all-services" element={withLazyRoute(<MasterServicesCatalogPage />)} />
            <Route path="all-master-services" element={withLazyRoute(<MasterServicesCatalogPage />)} />
            <Route path="service/:slug" element={withLazyRoute(<MasterServiceSlugPage />)} />
            <Route path="services/:categorySlug/:subcategorySlug/:masterServiceSlug" element={withLazyRoute(<MasterServiceSlugPage />)} />
            <Route path="service-details/:slug" element={withLazyRoute(<MasterServiceSlugPage />)} />
            <Route path="booking/:slug" element={withLazyRoute(<DynamicBookingWizard />)} />
            <Route path="workspace/:bookingId" element={withLazyRoute(<UserWorkspacePage />)} />
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
              path="my-orders"
              element={
                <ProtectedRoute>
                  <LazyRoute>
                    <MyBookings />
                  </LazyRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="my-bookings"
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
