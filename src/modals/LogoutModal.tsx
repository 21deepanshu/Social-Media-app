import { Typography, Button, Modal, Box } from "@mui/material";

interface LogoutModalProps {
  openLogoutModal: boolean;
  setOpenLogoutModal: (open: boolean) => void;
  handleLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ openLogoutModal, setOpenLogoutModal, handleLogout }) => {
  return (
    <Modal open={openLogoutModal} onClose={() => setOpenLogoutModal(false)}>
      <Box className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-24">
        <Typography variant="h6" className="mb-4 text-center font-bold">
          Confirm Logout
        </Typography>
        <p className="text-gray-600 text-center">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-between mt-4">
          <Button variant="outlined" onClick={() => setOpenLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
