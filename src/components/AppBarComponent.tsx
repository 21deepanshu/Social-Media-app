import { useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import LogoutModal from "../modals/LogoutModal";
import ProfileModal from "../modals/ProfileModal";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { logoutUser } from "../redux/slices/auth";

const AppBarComponent = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutUser());
      setOpenLogoutModal(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar className="flex justify-between">
          <Typography variant="h6" className="font-bold cursor-pointer" onClick={() => user && navigate("/feed")}>
            My Social App
          </Typography>

          {user ? (
            <div className="flex space-x-4">
              <Button color="inherit" component={Link} to="/my-posts">
                My Posts
              </Button>
              <Button color="inherit" component={Link} to="/saved-posts">
                Saved Posts
              </Button>
              <Button color="inherit" onClick={() => setOpenProfileModal(true)}>
                Profile
              </Button>
              <Button color="inherit" onClick={() => setOpenLogoutModal(true)}>
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/">
                Register
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <ProfileModal
        openProfileModal={openProfileModal}
        setOpenProfileModal={setOpenProfileModal}
        user={user}
      />

      <LogoutModal
        openLogoutModal={openLogoutModal}
        setOpenLogoutModal={setOpenLogoutModal}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default AppBarComponent;
