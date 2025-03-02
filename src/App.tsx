import { Routes, Route } from "react-router-dom";
import AppBarComponent from "./components/AppBarComponent";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Feed from "./pages/Feed";
import MyPosts from "./pages/MyPosts";
import SavedPosts from "./pages/SavedPosts";


function App() {
  return (
    <>    
    <AppBarComponent />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/saved-posts" element={<SavedPosts />} />
        </Route>
      </Routes>
    </>

  );
}

export default App;
