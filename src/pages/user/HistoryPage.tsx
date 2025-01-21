import React from "react";
import HistoryCard from "../../components/movie/HistoryCard";
import { IoIosArrowBack , IoIosArrowForward} from "react-icons/io";
import HistoryGraph from "../../components/HistoryGraph";
const HistoryPage = () => {
  return (
    <div className="ml-10">
       <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">Continue</h2>
        <IoIosArrowBack className="cursor-pointer" />
        <IoIosArrowForward className="cursor-pointer" />

        <div className="flex items-center gap-2 ml-10 cursor-pointer text-sm ">
          <span>See more</span>
          <IoIosArrowForward />
        </div>
      </div>

      <div className="flex w-full gap-5 overflow-x-scroll scrollbar-hidden p-5">
        <HistoryCard history={true} />
        <HistoryCard history={true} />
        <HistoryCard history={true} />
        <HistoryCard history={true} />
        <HistoryCard history={true} />
        <HistoryCard history={true} />
        <HistoryCard history={true} />
        <HistoryCard history={true} />
        <HistoryCard history={true} />
      </div>
      <HistoryGraph/>
    </div>
  );
};

export default HistoryPage;
