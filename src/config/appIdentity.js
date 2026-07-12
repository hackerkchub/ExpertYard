import { APP_CONFIG } from "./appConfig";

export const APP_TYPES = Object.freeze({
  WEB: "web",
  USER: "user",
  EXPERT: "expert",
});

class AppIdentity {
  getType() {
    return APP_CONFIG.APP_TYPE || APP_TYPES.WEB;
  }

  isWeb() {
    return this.getType() === APP_TYPES.WEB;
  }

  isUserApp() {
    return this.getType() === APP_TYPES.USER;
  }

  isExpertApp() {
    return this.getType() === APP_TYPES.EXPERT;
  }

  getAppName() {
    return APP_CONFIG.APP_NAME;
  }
}

export default new AppIdentity();