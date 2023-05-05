import React, { useEffect, useState } from "react";
import useAnimation from "../../../CustomHooks/useAnimation";
import { HeartLike, HeartUnlike } from "../../SVGs/SVGs";

const LikeUnlikePost = ({ likes, ACTIONS, dispatch, state, handler, postId }) => {
    //For like and unlike of post
    const [isLiked, setIsLiked] = useState(false);
    const [liked, setLiked] = useState(likes.length);

    //ANIMATION FOR THE NUMBER NEXT TO LIKE/UNLIKE USING CUSTOM HOOK
    const [animationLikes, likedValue, handleLikesAnimation] = useAnimation(isLiked, setIsLiked, liked, setLiked);

    const likeHandler = async () => {
        handleLikesAnimation();
        await handler({ dispatch, ACTIONS, postId });
    };

    //For keeping the heart red or unred even after refreshing the page
    useEffect(() => {
        console.log(likes);
        likes.forEach((item) => {
            if (item._id === state.user._id) {
                setIsLiked(true);
            }
        });
    }, []);
    return (
        <>
            <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-red-100 group-hover:text-red-500" onClick={likeHandler}>
                {isLiked ? <HeartLike /> : <HeartUnlike />}
            </button>
            <span className={`group-hover:text-red-500 ${animationLikes}`}>{likedValue > 0 ? likedValue : null}</span>
        </>
    );
};

export default LikeUnlikePost;
