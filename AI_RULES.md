# G9Expert Frontend AI Development Rules

## 1. PROJECT SCOPE

This workspace contains the G9Expert frontend.

This AI agent is currently authorized to work ONLY on the frontend.

DO NOT modify:
- Backend/server code
- Database
- Production server configuration
- Android native code
- iOS native code
- Capacitor native configuration
- Socket.IO backend
- WebRTC backend
- Payment backend
- Wallet backend
- Authentication backend
- Production environment configuration

Unless the user explicitly requests it.

---

## 2. GOLDEN RULE

MAKE THE MINIMUM POSSIBLE CHANGE.

If the requested task can be solved by changing one or two
frontend files, do not modify additional files.

Do not refactor unrelated code.

Do not improve unrelated code.

Do not rename existing files/components/routes unless explicitly requested.

Do not rewrite existing architecture.

Preserve existing behavior.

---

## 3. NO DEPENDENCY CHANGES

DO NOT:

- install packages
- uninstall packages
- upgrade packages
- downgrade packages
- change package versions
- regenerate package-lock.json

unless the user explicitly requests a dependency change.

The currently working dependency versions must be preserved.

---

## 4. NO API CONTRACT CHANGES

Existing backend APIs are working.

DO NOT change:

- API endpoints
- HTTP methods
- request structures
- response expectations
- authentication headers
- x-client-role
- x-session-token
- token storage keys
- wallet API behavior
- payment API behavior

unless explicitly requested.

Reuse the existing API layer whenever possible.

---

## 5. AUTHENTICATION SAFETY

The following storage keys are existing contracts:

- user_token
- user
- expert_token
- expert
- admin_token

DO NOT rename, remove, migrate, or change their behavior.

Preserve the existing route-aware authentication logic.

Do not modify:

src/shared/api/axiosInstance.js

unless the task specifically requires it.

---

## 6. REALTIME / CALLING SAFETY

Treat these systems as HIGH RISK:

- Socket.IO
- WebRTC
- Voice calls
- Video calls
- Call billing
- Call signaling
- Native incoming call handling
- page visibility handling
- ICE candidate handling

DO NOT modify them unless explicitly requested.

Relevant files include:

src/shared/webrtc/
src/shared/socket/
useNativeIncomingCall
voicePeer.js
videoPeer.js

A UI change must not alter realtime behavior.

---

## 7. WALLET / PAYMENT SAFETY

Wallet and payment functionality is HIGH RISK.

DO NOT modify:

- wallet calculations
- deduction logic
- commission logic
- payment flow
- subscription billing
- expert earnings
- withdrawal logic

unless explicitly requested.

Frontend UI changes must preserve existing financial behavior.

---

## 8. LEGAL LOCK SAFETY

The legal document locking system is HIGH RISK.

Do not modify:

- LegalManager
- AppGuard
- applicationLocked
- BYPASS_ROUTES
- EXCLUDED_ROUTES

unless the task explicitly concerns legal document access or locking.

---

## 9. MULTI-APP BUILD SAFETY

The application supports:

- web
- user APK
- expert APK

Existing build modes must remain functional.

Do not remove or change:

VITE_APP_TYPE

unless explicitly requested.

Any route or shared component change must consider:

- web
- user
- expert

build behavior.

---

## 10. API CONFIGURATION SAFETY

Do not change the production API URL unless explicitly requested.

Existing API resolution must be preserved:

VITE_API_BASE_URL
→ window/location detection
→ existing fallback

Do not replace the existing API architecture with a new one.

---

## 11. UI CHANGE POLICY

For UI tasks:

1. Find the existing component.
2. Understand its current layout.
3. Identify the smallest required change.
4. Modify only the required frontend code.
5. Preserve desktop behavior.
6. Preserve mobile behavior unless mobile is the requested target.
7. Preserve accessibility and existing interactions.

Do not redesign the whole page for a small UI request.

---

## 12. BEFORE EDITING

Before changing code:

1. Inspect the relevant files.
2. Identify the exact cause.
3. Identify the minimum files required.
4. Do not edit unrelated files.

If the requested change appears to require a large architectural modification,
STOP and explain why before making the change.

---

## 13. AFTER EDITING

After completing a task:

1. Run the relevant frontend build.
2. Check for compilation errors.
3. Check for lint errors if available.
4. Review git diff.
5. Confirm no unrelated files were changed.

Always report:

- Files changed
- What changed
- Why it changed
- Build/test result
- Any potential side effects

---

## 14. DO NOT TOUCH UNRELATED CODE

If the task is:

"Fix button alignment"

Do NOT:

- refactor the page
- change API code
- change context
- change routing
- change authentication
- update dependencies
- redesign unrelated components

Only fix the button alignment.

---

## 15. PRODUCTION SAFETY

Never:

- delete production data
- modify production APIs
- expose secrets
- commit .env files
- print API keys
- print tokens
- modify backend configuration

Never assume that a "cleanup" or "optimization"
is safe without explicit approval.

---

## 16. TASK EXECUTION FORMAT

For every task use this process:

UNDERSTAND
↓
INSPECT
↓
PLAN MINIMUM CHANGE
↓
IMPLEMENT
↓
BUILD / TEST
↓
REVIEW DIFF
↓
REPORT

Do not skip inspection.

---

## 17. FINAL PRINCIPLE

Existing working functionality has priority over code improvement.

User's explicit request has priority over assumptions.

MINIMUM CHANGE > REFACTORING

PRESERVE EXISTING BEHAVIOR > IMPROVEMENT

EXPLICIT REQUEST > AI ASSUMPTION