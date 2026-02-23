import React, { useEffect, useState } from "react";
import {
  FiPhone,
  FiUser,
  FiClock,
  FiShield,
  FiX
} from "react-icons/fi";
import { MdCallEnd } from "react-icons/md";
import { FaPhoneAlt, FaVideo } from "react-icons/fa";
import * as S from "../styles/IncomingCallPopup.styles";
import { soundManager } from "../../../shared/services/sound/soundManager";
import { SOUNDS } from "../../../shared/services/sound/soundRegistry";

export default function IncomingCallPopup({
  caller,
  onAccept,
  onReject,
  callType = "audio",
}) {
  const [ringtoneAnimation, setRingtoneAnimation] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [visible, setVisible] = useState(true);

  /* 🔁 Re-open popup when new caller comes */
  useEffect(() => {
    if (caller) {
      setVisible(true);
      setProcessing(false);
    }
  }, [caller]);

 useEffect(() => {
 if (caller && visible) {
  soundManager.stopAll();
  soundManager.play(SOUNDS.INCOMING_CALL, { loop: true });
}

  return () => {
    soundManager.stopAll();
  };
}, [caller, visible]);

  /* 🔄 Ring animation */
  useEffect(() => {
    const interval = setInterval(() => {
      setRingtoneAnimation(prev => !prev);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  if (!caller || !visible) return null;

const handleAccept = () => {
  if (processing) return;

  soundManager.stopAll();
  setVisible(false);
  setProcessing(true);
  onAccept();
};

const handleReject = () => {
  if (processing) return;

  soundManager.stopAll();
  setVisible(false);
  setProcessing(true);
  onReject();
};
  /* ❌ Close popup only (recommended UX) */
  const handleClose = () => {
  soundManager.stopAll();
  setVisible(false);
};

  return (
    <S.PopupWrapper>
      <S.GlassmorphismCard>

        {/* ❌ CLOSE BUTTON */}
        <S.CloseBtn onClick={handleClose}>
          <FiX size={18} />
        </S.CloseBtn>

        <S.AnimatedBackground />

        <S.CallHeader>
          <S.CallQuality>
            <FiShield /> Secure
          </S.CallQuality>
        </S.CallHeader>

        <S.CallerInfo>
          <S.AvatarContainer>
            <S.AvatarRing $ringing={ringtoneAnimation}>
              <S.AvatarWrapper>
                {caller.avatar ? (
                  <img src={caller.avatar} alt={caller.name} />
                ) : (
                  <FiUser size={40} />
                )}
              </S.AvatarWrapper>
            </S.AvatarRing>

            {callType === "video" && (
              <S.VideoBadge>
                <FaVideo />
              </S.VideoBadge>
            )}
          </S.AvatarContainer>

          <S.CallerDetails>
            <S.CallerName>{caller.name}</S.CallerName>
            <S.CallerTitle>{caller.title || "User"}</S.CallerTitle>

            <S.CallMeta>
              <S.MetaItem>
                <FiPhone />
                <span>{caller.phone || " "}</span>
              </S.MetaItem>

              <S.MetaItem>
                <FiClock />
                <span>Expected duration: 5-10 min</span>
              </S.MetaItem>
            </S.CallMeta>
          </S.CallerDetails>
        </S.CallerInfo>

        <S.ActionButtons>
          <S.AcceptButton
            onClick={handleAccept}
            disabled={processing}
            $fullWidth
          >
            <FaPhoneAlt />
            <span>{processing ? "Connecting..." : "Accept Call"}</span>
          </S.AcceptButton>

          <S.RejectButton
            onClick={handleReject}
            disabled={processing}
            $fullWidth
          >
            <MdCallEnd />
            <span>{processing ? "Ending..." : "Decline"}</span>
          </S.RejectButton>
        </S.ActionButtons>

        <S.EncryptionInfo>
          <FiShield size={12} />
          <span>End-to-end encrypted</span>
        </S.EncryptionInfo>

      </S.GlassmorphismCard>
    </S.PopupWrapper>
  );
}