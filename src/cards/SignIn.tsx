import { Box, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { useCallback, useState } from "react";
import useFirebase from "../hooks/useFirebase";

const SignIn = () => {
  const { signIn, verifyOtp: verify } = useFirebase();
  const auth = getAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ phone: "", otp: "" });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const onlyNums = value.replace(/[^0-9]/g, "");
    const id = e.target.id;
    if (id === "otp") {
      setOtp(onlyNums);
    }
    if (id === "phone-number") {
      setPhone(onlyNums);
    }
  };

  const getOtp = useCallback(() => {
    if (phone.length !== 10) {
      setError((prev) => ({ ...prev, phone: "Enter a valid phone number" }));
      return;
    } else {
      setError((prev) => ({ ...prev, phone: "" }));
    }

    setLoading(true);
    const verifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    );
    signIn("+91" + phone, verifier)
      .then(() => setOtpSent(true))
      .catch((e) => {
        console.error(e);
        setError((prev) => ({ ...prev, phone: "Error while sending otp" }));
      })
      .finally(() => setLoading(false));
  }, [auth, phone, signIn]);

  const verifyOtp = useCallback(() => {
    if (otp.length !== 6) {
      setError((prev) => ({ ...prev, otp: "Enter a valid otp" }));
      return;
    } else {
      setError((prev) => ({ ...prev, otp: "" }));
    }
    verify(otp).catch((e) => {
      console.error(e);
      setError((prev) => ({ ...prev, otp: "Failed to validate OTP" }));
    });
  }, [otp, verify]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "60%",
      }}
    >
      <div id="recaptcha-container" />
      <Typography variant="h6" mb={3} sx={{ textAlign: "center" }}>
        Login
      </Typography>
      <TextField
        id="phone-number"
        label="Phone number"
        variant="outlined"
        value={phone}
        onChange={onChange}
        disabled={otpSent}
        error={!!error.phone}
        helperText={error.phone}
      />
      {otpSent && (
        <TextField
          id="otp"
          label="OTP"
          variant="outlined"
          value={otp}
          onChange={onChange}
          sx={{ marginTop: "24px" }}
          error={!!error.otp}
          helperText={error.otp}
        />
      )}
      <LoadingButton
        loading={loading}
        variant="contained"
        id="sign-in-button"
        sx={{ marginTop: "48px" }}
        onClick={() => {
          if (otpSent) {
            verifyOtp();
          } else {
            getOtp();
          }
        }}
      >
        {otpSent ? "Verify" : "Get Otp"}
      </LoadingButton>
    </Box>
  );
};

export default SignIn;
