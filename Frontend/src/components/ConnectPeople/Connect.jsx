import React, { useEffect, useState } from "react";
import { LeftArrow } from "../SVGs/SVGs";
import axios, { all } from "axios";
import Avatar from "../Avatar/Avatar";

const Connect = () => {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const getAllusers = async () => {
            const { data } = await axios.get(`http://localhost:4000/api/v1/users`, { withCredentials: true });
            setAllUsers(data.users);
        };
        if (window.location.pathname !== "/connect") {
            getAllusers();
        }
    }, []);

    return (
        <div className=" max-h-[full] min-h-[1400px]  border-l border-r">
            <div className=" sticky inset-0 z-10 flex h-[3.5rem] items-center gap-5 bg-white/60 backdrop-blur-md ">
                <div>
                    <div className="m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:border-2 hover:bg-gray-200 active:bg-gray-300">
                        <LeftArrow className="h-[65%] w-[65%] " />
                    </div>
                </div>
                <div className="text-[1.6rem] font-bold">Connect</div>
            </div>
            <div className="mx-5 my-2 text-[1.6rem] font-bold">Suggested for you</div>

            {allUsers.map((user) => {
                return (
                    <button className="flex w-full items-center justify-between  py-2 px-3 hover:bg-gray-50">
                        <div className="flex items-start gap-2 ">
                            <div>
                                <Avatar profile={user.profile && user.profile.image && user.profile.image.url ? user.profile.image.url : null} />
                            </div>
                            <div className="b flex w-full  flex-col items-start ">
                                <div className="text-[1.03rem] font-semibold">{user.name}</div>
                                <div className=" mt-[-0.2rem] text-gray-500">@{user.handle}</div>
                                <div className="mt-[0.5rem] text-left ">{user.description}</div>
                            </div>
                        </div>
                        <button className="rounded-full bg-black px-4 py-1 font-semibold text-white hover:text-gray-300 active:text-gray-400 ">Follow</button>
                    </button>
                );
            })}
        </div>
    );
};

export default Connect;
