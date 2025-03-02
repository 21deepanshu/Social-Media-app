import { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Heart, MessageCircle, Bookmark, Send, Trash2 } from "lucide-react";

type PostType = {
    id: string;
    imageUrl: string;
    username: string;
    userId: string;
    likes: string[];
    comments: { user: string; text: string }[];
};

type PostCardProps = {
    post: PostType;
    onDelete?: (postId: string) => void;
};

const PostCard = ({ post, onDelete }: PostCardProps) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isOwner = user?.email === post.userId;
    const [liked, setLiked] = useState(user ? post.likes.includes(user.email) : false);
    const [saved, setSaved] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState("");
    useEffect(() => {
        const checkSavedStatus = async () => {
            if (user) {
                const userRef = doc(db, "users", user.email);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists() && userSnap.data().savedPosts?.includes(post.id)) {
                    setSaved(true);
                }
            }
        };
        checkSavedStatus();
    }, [user, post.id]);

    const handleLike = async () => {
        if (!user) return alert("Login to like posts");

        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
            likes: liked ? arrayRemove(user.email) : arrayUnion(user.email),
        });
        setLiked(!liked);
    };

    const handleSave = async () => {
        if (!user) {
            alert("Please log in to save posts.");
            return;
        }

        const userRef = doc(db, "users", user.email);

        try {
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, { savedPosts: [] });
            }
            await updateDoc(userRef, {
                savedPosts: saved ? arrayRemove(post.id) : arrayUnion(post.id),
            });

            setSaved(!saved);
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };

    const handleAddComment = async () => {
        if (!user) return alert("Login to comment!");

        if (!newComment.trim()) return;

        const postRef = doc(db, "posts", post.id);
        const commentData = { user: user.email, text: newComment };

        try {
            await updateDoc(postRef, {
                comments: arrayUnion(commentData),
            });

            setComments([...comments, commentData]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeletePost = async () => {
        if (!isOwner) return alert("You can only delete your own posts!");

        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "posts", post.id));
            if (onDelete) onDelete(post.id);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-4 mb-6 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                        {post.username.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-gray-800">{post.username}</h3>
                </div>

                {isOwner && (
                    <button onClick={handleDeletePost} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <img src={post.imageUrl} alt="Post" className="w-full h-60 object-cover rounded-lg" />

            <div className="flex items-center justify-between mt-4">
                <Heart
                    className={`cursor-pointer transition ${liked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
                    onClick={handleLike}
                />
                <MessageCircle className="cursor-pointer text-gray-500 hover:text-blue-500 transition" />
                <button onClick={handleSave} className="flex items-center gap-1 text-gray-600">
                    <Bookmark className={`w-5 h-5 ${saved ? "text-blue-500" : "text-gray-400"}`} />
                    {saved ? "Saved" : "Save"}
                </button>
            </div>

            <p className="text-gray-600 text-sm mt-2">{post.likes.length} {post.likes.length === 1 ? "like" : "likes"}</p>

            {/* Comment Section */}
            <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Comments</h4>
                <div className="space-y-2 max-h-28 overflow-y-auto">
                    {comments.length === 0 ? (
                        <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
                    ) : (
                        comments.map((comment, index) => (
                            <div key={index} className="bg-gray-100 p-2 rounded-md">
                                <p className="text-xs font-semibold">{comment.user}</p>
                                <p className="text-sm">{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Comment Input */}
                <div className="mt-3 flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 border p-2 rounded-md text-sm"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment} className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
