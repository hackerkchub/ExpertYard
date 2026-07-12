import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../../config/appConfig";

let openingCall = false;

export default function useNativeIncomingCall() {
    const navigate = useNavigate();

    useEffect(() => {

        const openCall = () => {

            if (openingCall)
                return;

            const call = window.__NATIVE_INCOMING_CALL__;

            if (!call?.callId)
                return;

            openingCall = true;

            try {

                console.log("Native Incoming Call", call);

                const base =
                    APP_CONFIG.APP_TYPE === "expert"
                        ? "/expert"
                        : "/user";

                navigate(
                    `${base}/voice-call/${call.callId}`,
                    {
                        replace: true,
                        state: {
                            native: true,
                            callerName: call.callerName,
                            callType: call.callType,
                            target: call.targetUrl,
                            userId: call.userId,
                            expertId: call.expertId
                        }
                    }
                );

                delete window.__NATIVE_INCOMING_CALL__;

            } finally {

                openingCall = false;

            }

        };

        window.addEventListener(
            "nativeIncomingCall",
            openCall
        );

        // Cold start support
        if (window.__NATIVE_INCOMING_CALL__) {
            openCall();
        }

        return () => {

            window.removeEventListener(
                "nativeIncomingCall",
                openCall
            );

        };

    }, [navigate]);

}