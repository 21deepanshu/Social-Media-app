import { useEffect, useState, useRef, useCallback } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, limit, startAfter } from "firebase/firestore";
import PostCard from "../components/PostCard";
import CreatePost from "../modals/CreatePost";

const POSTS_PER_PAGE = 5; // Number of posts per batch

const Feed = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(POSTS_PER_PAGE));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const newPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setPosts(newPosts);
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
            } else {
                setHasMore(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchMorePosts = async () => {
        if (!lastDoc || !hasMore) return;

        const q = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(POSTS_PER_PAGE)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const newPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setPosts((prevPosts) => [...prevPosts, ...newPosts]);
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
            } else {
                setHasMore(false);
            }
        });

        return () => unsubscribe();
    };

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchMorePosts();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center pt-10 px-4">
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed top-5 right-5 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition hover:bg-blue-700 mt-20"
            >
                + Create Post
            </button>

            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-10">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div key={post.id} ref={index === posts.length - 1 ? lastPostRef : null}>
                                <PostCard post={post} />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No posts available.</p>
                    )}
                </div>
            )}

            {isModalOpen && <CreatePost closeModal={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Feed;
