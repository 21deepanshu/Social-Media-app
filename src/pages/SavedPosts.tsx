import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import PostCard from "../components/PostCard";

const SavedPosts = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [savedPosts, setSavedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchSavedPosts = async () => {
            const userRef = doc(db, "users", user.email);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const savedPostIds = userSnap.data().savedPosts || [];
                const postsPromises = savedPostIds.map((postId: string) =>
                    getDoc(doc(db, "posts", postId)).then((docSnap) => {
                        if (docSnap.exists()) {
                            return { id: docSnap.id, ...docSnap.data() };
                        }
                    })
                );

                const posts = await Promise.all(postsPromises);
                setSavedPosts(posts.filter(Boolean));
            }

            setLoading(false);
        };

        fetchSavedPosts();
    }, [user]);

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center pt-10 px-4">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (<>
                {savedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-10">
                        {savedPosts.map((post) => <PostCard key={post.id} post={post} />)}
                    </div>

                ) : (
                    <p className="text-gray-500 text-center text-3xl h-screen">
                        You haven't saved any posts yet.
                    </p>
                )}
            </>
            )}
        </div>
    );
};

export default SavedPosts;
