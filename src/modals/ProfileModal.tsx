import { Typography, Button, Modal, Box } from "@mui/material";

interface ProfileModalProps {
    openProfileModal: boolean;
    setOpenProfileModal: (open: boolean) => void;
    user?: { email?: string; name?: string } | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ openProfileModal, setOpenProfileModal, user }) => {
    return (
        <Modal open={openProfileModal} onClose={() => setOpenProfileModal(false)}>
            <Box className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-24">
                <Typography variant="h6" className="mb-2 text-center font-bold mt-2">
                    User Profile
                </Typography>
                <p className="text-gray-600 mt-1">
                    <strong>Email:</strong> {user?.email || "Not Available"}
                </p>
                <p className="text-gray-600 mt-1">
                    <strong>Name:</strong> {user?.name || "Not Available"}
                </p>
                <Button
                    fullWidth
                    variant="contained"
                    className="mt-4"
                    onClick={() => setOpenProfileModal(false)}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default ProfileModal;
