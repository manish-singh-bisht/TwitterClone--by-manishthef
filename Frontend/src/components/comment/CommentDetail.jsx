import React, { Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeftArrow } from "../SVGs/SVGs";
import axios from "axios";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import LikeUnlike from "../../context/Actions/LikeUnlike";
import Loader from "../Loader/Loader";
import CommentLikeUnlike from "../../context/Actions/CommentLikeUnlike";
import Post from "../CommonPostComponent/Post";
import RetweetPost from "../../context/Actions/RetweetPost";
import RetweetComment from "../../context/Actions/RetweetComment";
import PostBookmark from "../../context/Actions/PostBookmark";
import CommentBookmark from "../../context/Actions/CommentBookmark";

const CommentCard = React.lazy(() => import("./CommentCard"));
const ActiveComment = React.lazy(() => import("./ActiveComment"));

const CommentDetail = () => {
    const componentRef = useRef(null); //when clicking on comment, it scrolls to the comment clicked and not to top.
    const { ACTIONS, state, dispatchLikeUnlike, stateComment, stateCommentDelete, dispatchCommentLikeUnlike, dispatchRetweetPost, dispatchRetweetComment, dispatchBookmarkTweet, dispatchBookmarkComment } = useGlobalContext();

    //For navigating to a particular section that is to the comment that openend this component
    const navigate = useNavigate();
    const { commentId } = useParams();

    const [post, setPost] = useState();
    const [comment, setComment] = useState([]);
    const [parentCollection, setParentCollection] = useState([]); //for getting the parent/parents
    const [parentCollectionId, setParentCollectionId] = useState([]); //for getting parent/parents id only
    const [active, setActive] = useState(); //sets the current active comment's id

    useEffect(() => {
        const getCommentById = async () => {
            const { data } = await axios.get(`http://localhost:4000/api/v1/comment/${commentId}`, { withCredentials: true });
            setPost(data.comment.post);
            setComment(data.comment);

            if (data.comment.parent !== undefined && !parentCollection.some((item) => item._id === data.comment.parent._id)) {
                setParentCollection((prevCollection) => [...prevCollection, data.comment.parent]);
                setParentCollectionId((prevCollection) => [...prevCollection, data.comment.parent._id]);
            } else {
                if (parentCollectionId.includes(active)) {
                    const index = parentCollectionId.indexOf(active);
                    const updatedParentCollection = parentCollection.slice(0, index);
                    const updatedParentCollectionId = parentCollectionId.slice(0, index);
                    setParentCollection(updatedParentCollection);
                    setParentCollectionId(updatedParentCollectionId);
                }
            }
        };

        getCommentById();

        componentRef?.current?.scrollIntoView();
    }, [commentId, stateComment, stateCommentDelete.message]);

    function handleClick() {
        navigate(`/${post.owner.name}/${post._id}`, {
            replace: true,
            state: {
                sectionId: commentId,
                tweet: post.tweet,
                handle: post.owner.handle,
                ownerName: post.owner.name,
                timeCreated: post.createdAt,
                ownerImage: post.owner.profile && post.owner.profile.image.url ? post.owner.profile.image.url : null,
                postImage: post.images ? post.images : null,
                mentions: post.mentions,
                isThread: post.children?.length > 0 ? true : false,
            },
        });
    }

    return (
        post !== undefined && (
            <main className="grid grid-cols-[44vw_auto]   ">
                <div className=" flex max-h-[full] min-h-[1400px] flex-col  border-l  border-r ">
                    <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-7 bg-white/60 backdrop-blur-md ">
                        <div onClick={handleClick}>
                            <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                                <LeftArrow className="h-[65%] w-[65%] " />
                            </div>
                        </div>
                        <div className="text-[1.6rem] font-bold">Tweet</div>
                    </div>
                    {/* Parent Post */}
                    <div className="relative  ">
                        <Post
                            key={post._id}
                            isComment={false}
                            fromTweetDetail={true}
                            postId={post._id}
                            tweet={post.tweet}
                            likes={post.likes}
                            retweets={post.retweets}
                            bookmarks={post.bookmarks}
                            postImage={post.images ? post.images : null}
                            commentsChildren={post.comments}
                            ownerName={post.owner.name}
                            ownerImage={post.owner.profile && post.owner.profile.image.url ? post.owner.profile.image.url : null}
                            ownerId={post.owner._id}
                            handle={post.owner.handle}
                            timeCreated={post.createdAt}
                            handler={LikeUnlike}
                            dispatch={dispatchLikeUnlike}
                            dispatchRetweet={dispatchRetweetPost}
                            handlerRetweet={RetweetPost}
                            state={state}
                            ACTIONS={ACTIONS}
                            mentions={post.mentions}
                            handlerBookmark={PostBookmark}
                            dispatchBookmark={dispatchBookmarkTweet}
                            isThread={post.children?.length > 0 ? true : false}
                        />
                        <div className="absolute left-[2.37rem] top-[4.2rem] h-[calc(100%-3.85rem)]   w-fit border-2"></div>
                    </div>
                    {/* Parent Comments */}
                    {parentCollection &&
                        parentCollection.length > 0 &&
                        parentCollection.map((item) => {
                            return (
                                <div className="relative" key={item._id}>
                                    <Post
                                        key={item._id}
                                        activeHandler={(val) => {
                                            setActive(val);
                                        }}
                                        isParent={true}
                                        isComment={true}
                                        fromCommentDetail={true}
                                        postId={item._id} //this is the parent comment id
                                        POSTID={post._id} //this is the post id
                                        tweet={item.comment}
                                        likes={item.likes}
                                        bookmarks={item.bookmarks}
                                        retweets={item.retweets}
                                        ownerName={item.owner.name}
                                        ownerImage={item.owner.profile && item.owner.profile.image.url ? item.owner.profile.image.url : null}
                                        ownerId={item.owner._id}
                                        postImage={item.images ? item.images : null}
                                        handle={item.owner.handle}
                                        timeCreated={item.createdAt}
                                        commentsChildren={item.children}
                                        dispatch={dispatchCommentLikeUnlike}
                                        state={state}
                                        ACTIONS={ACTIONS}
                                        handler={CommentLikeUnlike}
                                        dispatchRetweet={dispatchRetweetComment}
                                        handlerRetweet={RetweetComment}
                                        mentions={item.mentions}
                                        handlerBookmark={CommentBookmark}
                                        dispatchBookmark={dispatchBookmarkComment}
                                    />
                                    <div className="absolute left-[2.37rem] top-[4.2rem]  h-[calc(100%-3.8rem)] border-2"></div>
                                </div>
                            );
                        })}

                    <Suspense fallback={<Loader />}>
                        <ActiveComment commentId={commentId} postId={post._id} parent={commentId} ref={componentRef} />

                        {comment.children && comment.children.length > 0 && <CommentCard comments={comment.children} postId={comment.children.post} parent={comment.children.parent} fromCommentDetail={true} isParentPresent={true} POSTID={post._id} />}
                    </Suspense>
                </div>
            </main>
        )
    );
};

export default CommentDetail;
