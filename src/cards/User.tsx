import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { User } from "firebase/auth";
import React, { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import useFirebase from "../hooks/useFirebase";

type IProps = {
  user: User;
};

const UserCard: React.FC<IProps> = ({ user }) => {
  const [show, setShow] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout } = useFirebase();

  const copyTextToClipboard = async (text: string) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex" }}>
        {user.photoURL ? (
          <Avatar
            src={user.photoURL}
            alt="display-pic"
            sx={{ width: 64, height: 64 }}
          />
        ) : (
          <Avatar sx={{ bgcolor: deepOrange[500], width: 64, height: 64 }}>
            U
          </Avatar>
        )}
        <Box sx={{ marginLeft: "24px" }}>
          <Typography variant="h5">{user.displayName ?? "User"}</Typography>
          <Chip label={user.uid} variant="outlined" />
        </Box>
      </Box>
      <Button
        sx={{ marginTop: "24px" }}
        onClick={() => {
          user
            .getIdToken(true)
            .then((token) => copyTextToClipboard(token))
            .then(() => setShow(true))
            .catch((e) => console.log(e));
        }}
      >
        Copy token
      </Button>
      <Button
        variant="contained"
        sx={{ marginTop: "24px" }}
        onClick={() => setShowLogoutDialog(true)}
      >
        Log out
      </Button>
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        open={show}
        autoHideDuration={6000}
        onClose={() => setShow(false)}
        message="Token copied to clipboard"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={() => setShow(false)}
          >
            <CloseRoundedIcon />
          </IconButton>
        }
      />
      <Dialog
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Log out ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutDialog(false)}>Cancel</Button>
          <Button onClick={logout} autoFocus>
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserCard;
