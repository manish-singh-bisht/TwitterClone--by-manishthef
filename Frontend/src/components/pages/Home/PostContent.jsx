import React from "react";
import Avatar from "../Avatar";
import { Link, useNavigate } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";
import { Bookmark, Comments, Retweets } from "../../SVGs/SVGs";
import LikeUnlikePost from "./LikeUnlikePost";
import { usePostTime } from "../../../CustomHooks/usePostTime";

const PostContent = ({
    postId,
    tweet,
    ownerName,
    ownerId,
    ownerImage: profile,
    postImage,
    postVideo,
    handle,
    timeCreated,
    likes,
    comments,
    isDelete,
    isAccount,
    handler,
    dispatch,
    state,
    ACTIONS,
    isComment,
    fromTweetDetail,
    fromCommentDetail,
    commentsChildren,
    activeHandler,
    isParent,
    comment,
}) => {
    const formattedTime = usePostTime(Date.parse(timeCreated));

    //For navigating to TweetDetail/CommentDetail with data
    const navigate = useNavigate();
    const commentId = postId;
    const newUrl = !isComment ? `/${ownerName}/${postId}` : `/${ownerName}/comment/${commentId}`;

    const handleClick = () => {
        isParent && activeHandler(commentId);
        navigate(newUrl, { replace: true, state: { tweet, ownerName, handle, timeCreated, ownerId, profile, postImage, postVideo, isDelete, isAccount } });
    };

    const photos = ["https://source.unsplash.com/random/1200x600", "https://source.unsplash.com/random/900x900"];
    //Grid layout for different numbers of image,used below
    let gridClass = "";
    switch (photos.length) {
        case 0:
            gridClass = "";
            break;
        case 1:
            gridClass = "w-full h-full";
            break;
        case 2:
            gridClass = "grid-cols-2 grid-rows-1";
            break;
        case 3:
            gridClass = "grid-cols-2 grid-rows-2";
            break;
        case 4:
            gridClass = "grid-cols-2 grid-rows-2";
            break;
        default:
            break;
    }

    return (
        <>
            <div onClick={handleClick} className="relative m-2 flex cursor-pointer gap-2 hover:bg-gray-50">
                <Avatar profile={profile} />

                <div className="relative mr-2 flex w-[87%] flex-col  gap-2">
                    <Link
                        to={`/user/${ownerId}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="absolute flex w-fit  items-center gap-1 text-[1.1rem] font-bold ">
                        <span className="hover:underline">{ownerName}</span>
                        <span className="text-[0.9rem] font-normal text-gray-700">{`@${handle}`}</span>
                        <span className="mt-[-0.4rem] flex items-center justify-center  text-[0.8rem]">.</span>
                        <span className="flex text-[0.9rem] font-normal text-gray-700">{`${formattedTime}`}</span>
                    </Link>
                    <pre className={` mt-10 max-w-[98%] whitespace-pre-wrap break-words  `}>{tweet}</pre>
                    <div className={`grid max-w-[98%]  ${gridClass}  ${photos.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${photos.length > 0 ? `border-[0.05rem]` : ``}`}>
                        {photos.length > 0 && photos.map((photo, index) => <PhotoGallery key={index} photos={photos} photo={photo} index={index} />)}
                    </div>
                </div>
            </div>

            <div className="my-4 ml-[4.25rem] flex w-[87.5%] gap-20   border-2">
                <div className="group flex w-[3rem] items-center justify-around">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                        <Comments />
                    </button>
                    {fromTweetDetail || fromCommentDetail ? (
                        <span className="group-hover:text-blue-500">{commentsChildren.length > 0 ? commentsChildren.length : null}</span>
                    ) : (
                        <span className="group-hover:text-blue-500">{comments.length > 0 ? comments.length : null}</span>
                    )}
                </div>

                <div className="group flex w-[3rem] items-center justify-around">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500">
                        <Retweets />
                    </button>
                    <span className="group-hover:text-green-500">{likes.length}</span>
                </div>
                <div className=" group flex w-[3rem] items-center justify-around  ">
                    <LikeUnlikePost likes={likes} ACTIONS={ACTIONS} dispatch={dispatch} state={state} handler={handler} postId={postId} />
                </div>
                <div className="group flex w-[3rem] items-center justify-around ">
                    <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                        <Bookmark />
                    </button>
                    <span className="group-hover:text-blue-500"></span>
                </div>
            </div>
        </>
    );
};

export default PostContent;
