# G9Expert Frontend Project Context

## Stack

- React 19
- Vite 7
- React Router
- styled-components
- MUI
- Socket.IO Client
- WebRTC
- Capacitor

## Application Types

VITE_APP_TYPE:

- web
- user
- expert

## Main Architecture

src/
├── apps/
│   ├── user/
│   ├── expert/
│   └── admin/
├── config/
├── core/
├── routes/
├── shared/
└── firebase/

## Important Shared Systems

src/shared/api/
src/shared/context/
src/shared/hooks/
src/shared/socket/
src/shared/webrtc/

## Authentication

user_token
expert_token
admin_token

Route-aware authentication is handled by:
src/shared/api/axiosInstance.js

## API

API configuration:
src/config/appConfig.js

Central API instance:
src/shared/api/axiosInstance.js

## Important Protected Systems

- Authentication
- Wallet
- Payment
- Subscription
- Socket.IO
- WebRTC
- Voice calls
- Video calls
- Legal lock
- Push notifications
- Capacitor integration

## Build Targets

Web:
npm run dev

User:
npm run build:user

Expert:
npm run build:expert