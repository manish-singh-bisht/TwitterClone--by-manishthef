import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadUserWhenToken from "./context/actions/LoadUserWhenToken";

import Sidebar from "./components/Sidebar/Sidebar";
import Loader from "./components/Loader/Loader";
import { useGlobalContext } from "./CustomHooks/useGlobalContext";

const Home = React.lazy(() => import("./components/Home/Home"));
const LoginSignUpMainPage = React.lazy(() => import("./components/Login_Register/LoginSignUpMainPage"));
const SignUpOption = React.lazy(() => import("./components/Login_Register/SignUpOption"));
const TweetDetail = React.lazy(() => import("./components/TweetDetail/TweetDetail"));
const CommentDetail = React.lazy(() => import("./components/comment/CommentDetail"));
const Test = React.lazy(() => import("./components/pages/Test"));

const App = () => {
    const {
        dispatch,
        ACTIONS,
        state: { isAuthenticated },
    } = useGlobalContext();

    async function loadUser() {
        await LoadUserWhenToken({ dispatch, ACTIONS });
    }
    useEffect(() => {
        loadUser();
    }, []);

    return (
        <BrowserRouter>
            <div className={`${isAuthenticated ? "grid grid-cols-[24rem_auto] " : ""}`}>
                <div>{isAuthenticated && <Sidebar />}</div>
                <div>
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route exact path="/" element={isAuthenticated ? <Home /> : <LoginSignUpMainPage />} />
                            <Route exact path="/login" element={isAuthenticated ? <Home /> : <LoginSignUpMainPage />} />
                            <Route exact path="/signUp" element={isAuthenticated ? <Home /> : <LoginSignUpMainPage />} />
                            <Route exact path="/:ownerName/:postId" element={isAuthenticated ? <TweetDetail /> : <LoginSignUpMainPage />} />
                            <Route exact path="/:ownerName/comment/:commentId" element={isAuthenticated ? <CommentDetail /> : <LoginSignUpMainPage />} />
                            <Route exact path="/user/:ownerId" element={<Test />} />
                            <Route exact path="/Explore" element={<Test />} />
                            <Route exact path="/test" element={<Test />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
