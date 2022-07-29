import { Box, Card, Container } from "@mui/material";
import useFirebase from "./hooks/useFirebase";
import SignIn from "./cards/SignIn";
import UserCard from "./cards/User";

const App = () => {
  const { user } = useFirebase();

  const isLoggedin = !!user;

  return (
    <Box
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            padding: "48px 24px",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          {!isLoggedin ? <SignIn /> : <UserCard user={user} />}
        </Card>
      </Container>
    </Box>
  );
};

export default App;
