import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import PostCard from "../components/PostCard";

const MyPosts = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "posts"),
            where("userId", "==", user.email)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPosts(userPosts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center pt-10 px-4">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (<>
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-10">
                        {posts.map((post) => <PostCard key={post.id} post={post} />)}
                    </div>

                ) : (
                    <p className="text-gray-500 text-center w-[100%] text-3xl">You haven't posted anything yet.</p>
                )}
            </>
            )}
        </div>
    );
};

export default MyPosts;
