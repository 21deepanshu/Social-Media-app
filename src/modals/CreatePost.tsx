import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Upload, Loader2, X } from "lucide-react";

const CreatePost = ({ closeModal }: any) => {
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setImage(e.target.files[0]);
    };

    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "social_media_uploads");

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/dvzir2lfu/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            return null;
        }
    };

    const handleUpload = async () => {
        if (!image || !user) return alert("Please select an image and log in.");
        setLoading(true);

        try {
            const imageUrl = await uploadToCloudinary(image);
            if (!imageUrl) throw new Error("Image upload failed");

            await addDoc(collection(db, "posts"), {
                userId: user.email,
                username: user.name || "Anonymous",
                imageUrl,
                likes: [],
                comments: [],
                createdAt: serverTimestamp(),
            });

            alert("Post created successfully!");
            setImage(null);
            closeModal();
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md relative">
                <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800" onClick={closeModal}>
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-lg font-semibold text-gray-800 mb-4">Create a Post</h2>
                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <Upload className="h-10 w-10 text-gray-500 mb-2" />
                    <span className="text-sm text-gray-500">
                        {image ? image.name : "Click to upload an image"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {image && (
                    <img src={URL.createObjectURL(image)} alt="Selected" className="mt-4 w-full h-40 object-cover rounded-md" />
                )}

                <button
                    onClick={handleUpload}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Create Post"}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;

