import { useEffect, useState } from "react";
import CountUp from "react-countup";
import axios from "axios";
import { FaUsers, FaProjectDiagram, FaHandshake, FaStar, FaCheck, FaPlay } from "react-icons/fa";

export const Analytics = () => {
  const [data, setData] = useState({
    totalContributors: 0,
    totalProjectOwners: 0,
    totalCollaborations: 0,
    averageRating: 0,
    activeCollaborations: 0,
    completedCollaborations: 0,
  });

  useEffect(() => {
    axios.get("http://localhost:5247/api/analytics")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
      });
  }, []);

  return (
    <div className="p-6 rounded-lg bg-gray-900 shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Through Our Project Partner Web App</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Box Component */}
        {[
          { title: "Project Owners", value: data.totalProjectOwners, icon: <FaUsers />, color: "bg-blue-500" },
          { title: "Contributors", value: data.totalContributors, icon: <FaProjectDiagram />, color: "bg-green-500" },
          { title: "Collaborations", value: data.totalCollaborations, icon: <FaHandshake />, color: "bg-yellow-500" },
          { title: "Active Collaborations", value: data.activeCollaborations, icon: <FaPlay />, color: "bg-purple-500" },
          { title: "Completed Collaborations", value: data.completedCollaborations, icon: <FaCheck />, color: "bg-red-500" },
          { title: "Avg Rating", value: data.averageRating, icon: <FaStar />, color: "bg-teal-500", decimals: 1 },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-md flex items-center transition-transform transform hover:scale-105 hover:shadow-xl ${item.color}`}
          >
            <div className="text-3xl mr-4">{item.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <CountUp
                start={0}
                end={item.value}
                duration={2}
                decimals={item.decimals || 0}
                separator=","
                className="text-2xl font-bold"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
