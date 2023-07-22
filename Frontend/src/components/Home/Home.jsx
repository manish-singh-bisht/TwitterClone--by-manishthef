import React, { useEffect } from "react";
import Loader from "../Loader/Loader";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import TweetBoxInHome from "./TweetBoxInHome";
import LikeUnlike from "../../context/Actions/LikeUnlike";
import Post from "../CommonPostComponent/Post";
import PostsOfFollowingAndMe from "../../context/Actions/PostsOfFollowingAndMe";
import RetweetPost from "../../context/Actions/RetweetPost";
import RetweetComment from "../../context/Actions/RetweetComment";
import CommentLikeUnlike from "../../context/Actions/CommentLikeUnlike";

const Home = () => {
    const { dispatchPostOfFollowingAndMe, ACTIONS, statePostOfFollowingAndMe, state, dispatchLikeUnlike, posts, setPosts, dispatchRetweetPost, dispatchRetweetComment, dispatchCommentLikeUnlike } = useGlobalContext();

    const { loading } = statePostOfFollowingAndMe;

    const profile = state.user && state.user.profile && state.user.profile.image.url ? state.user.profile.image.url : null;

    //For getting post of users that the current loggedin user follows.
    async function PostOfFollowingUsersAndMe() {
        const data = await PostsOfFollowingAndMe({ dispatchPostOfFollowingAndMe, ACTIONS });
        setPosts(data);
    }

    useEffect(() => {
        PostOfFollowingUsersAndMe();
    }, []);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="sticky inset-0 z-10 flex h-[7rem] w-[44vw] flex-col gap-2 border-2  bg-white/60  backdrop-blur-md  ">
                        <h1 className="mx-2 mt-2  text-2xl font-bold">Home</h1>

                        <div className="flex h-full items-center justify-center  ">
                            <div className="flex h-full w-fit cursor-pointer flex-col items-center  justify-center  px-20 hover:border-2 hover:bg-gray-200">
                                <div className=" mt-[0.65rem]  text-center font-bold">Following</div>
                                <div className=" mt-[1.2rem] w-[4.8rem] rounded-3xl border-[0.15rem] border-blue-500  "></div>
                            </div>
                        </div>
                    </div>

                    <main className="grid grid-cols-[44vw_auto]  ">
                        <div className={` flex h-[100%] flex-col border-l border-r`}>
                            <TweetBoxInHome profile={profile} />
                            {posts && posts.length > 0 ? (
                                posts.map((item) => {
                                    const post = item.originalPost ? item.originalPost : item;
                                    const ownerRetweet = item.userRetweeted ? item.userRetweeted : null;
                                    const ownerImage = post.owner.profile && post.owner.profile.image.url ? post.owner.profile.image.url : null;
                                    const imageInPost = post.images ? post.images : null;

                                    //item.originalPost?.comment ,ensures that its a comment retweet, because in post model for the post text it is "tweet" and in comment model for the post text it is "comment".

                                    return (
                                        <Post
                                            key={`${post._id}+${item.createdAt}`}
                                            postId={post._id}
                                            POSTID={item.originalPost?.comment ? item.originalPost?.post : null}
                                            tweet={post.tweet || post.comment}
                                            ownerRetweet={ownerRetweet}
                                            isCommentRetweet={item.originalPost?.comment ? true : false}
                                            likes={post.likes}
                                            postImage={imageInPost}
                                            retweets={post.retweets}
                                            comments={item.originalPost?.comment ? post.children : post.comments}
                                            ownerName={post.owner.name}
                                            ownerImage={ownerImage}
                                            ownerId={post.owner._id}
                                            handle={post.owner.handle}
                                            timeCreated={post.createdAt}
                                            handler={item.originalPost?.comment ? CommentLikeUnlike : LikeUnlike}
                                            dispatch={item.originalPost?.comment ? dispatchCommentLikeUnlike : dispatchLikeUnlike}
                                            dispatchRetweet={item.originalPost?.comment ? dispatchRetweetComment : dispatchRetweetPost}
                                            handlerRetweet={item.originalPost?.comment ? RetweetComment : RetweetPost}
                                            state={state}
                                            ACTIONS={ACTIONS}
                                            mentions={post.mentions}
                                            fromHome={true}
                                            threadChildren={post.children}
                                        />
                                    );
                                })
                            ) : (
                                <div>Follow someone to see their tweets</div>
                            )}
                        </div>
                    </main>
                </>
            )}
        </>
    );
};

export default Home;
