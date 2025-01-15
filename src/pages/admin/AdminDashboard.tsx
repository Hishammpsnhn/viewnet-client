import React from "react";
import UploadCard from "../../components/admin/uploadCard/UplaodCard";
import NumberCard from "../../components/admin/NumberCard/NumberCard";
import HistoryCard from "../../components/movie/HistoryCard";
interface Task {
  title: string;
  desc: string;
  navigate: string;
}
const task: Task[] = [
  {
    title: "Upload And Publish a Movie",
    desc: "Upload Movie",
    navigate: "/upload/movie",
  },
  {
    title: "Upload And Publish Series",
    desc: "Upload Series",
    navigate: "/upload/movie",
  },
  {
    title: "Start Live Streaming",
    desc: "Go To Live",
    navigate: "/",
  },
];
const AdminDashboard = () => {
  return (
    <div className=" container mx-auto px-16 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {task.map((item) => (
          <UploadCard
            key={item.title}
            title={item.title}
            desc={item.desc}
            navigation={item.navigate}
          />
        ))}
      </div>

      {/* Number Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <NumberCard />
        <NumberCard />
        <NumberCard />
      </div>

      {/* History Cards Section */}
      <h1 className="text-white text-3xl font-bold mb-5">Trending </h1>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
      </div>
      <h1 className="text-white text-3xl font-bold  mb-5 mt-10">Trending </h1>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
      </div>
    </div>
  );
};

export default AdminDashboard;
