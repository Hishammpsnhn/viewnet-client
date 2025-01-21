import React from "react";
import HistoryCard from "./movie/HistoryCard";

const Details = () => {
  return (
    <div className="ml-4">
      <h2 className="text-xl font-semibold">Season 1</h2>
      <div className="flex w-full gap-5 overflow-x-scroll scrollbar-hidden p-5">
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
      </div>
      
      <h2 className="text-xl font-semibold">Season 2</h2>
      <div className="flex w-full gap-5 overflow-x-scroll scrollbar-hidden p-5">
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
      </div>

      <h2 className="text-xl font-semibold">Movie Details</h2>
      <p className="mt-2 text-gray-600">
        This section contains detailed information about the movie, such as its
        plot, cast, and production details.
      </p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Producer</h3>
        <p className="text-gray-600">John Doe</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Cast</h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li>Jane Smith as Lead Role</li>
          <li>Mike Johnson as Supporting Role</li>
          <li>Emily Davis as Supporting Role</li>
          <li>Chris Brown as Villain</li>
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Director</h3>
        <p className="text-gray-600">Alice Williams</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Release Date</h3>
        <p className="text-gray-600">January 25, 2025</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Genre</h3>
        <p className="text-gray-600">Action, Adventure, Drama</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Duration</h3>
        <p className="text-gray-600">120 minutes</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Rating</h3>
        <p className="text-gray-600">8.5/10</p>
      </div>
    </div>
  );
};

export default Details;
