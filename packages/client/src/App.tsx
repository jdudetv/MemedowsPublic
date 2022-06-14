import { useEffect, useState } from "react";
import clsx from "clsx";
import { doc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { ref } from "firebase/storage";
import { db } from "./data/services/firebase";
import { routes } from "~/routes";
import { setupObs } from "./obs/Main";

const App = () => {
  const [route, setRoute] = useState<keyof typeof routes>("redemptions");

  const RouteComponent = routes[route].component;

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="p-1">
        <button
          className="bg-blue-800 px-2 py-1 rounded-lg text-white font-md"
          onClick={setupObs}
        >
          Run OBS Setup
        </button>
        <button
          className="bg-blue-800 px-2 py-1 rounded-lg text-white font-md"
          onClick={async () => {
            for (let i = 0; i < 10; i++) {
              console.time("BLAH BLAH " + i);
              // await obs.createScene("BLAH BLAH " + i);
              console.timeEnd("BLAH BLAH " + i);
            }
          }}
        >
          Spawn 10
        </button>
      </div>
      <div className="bg-gray-800 w-full text-white flex flex-row flex-wrap">
        {Object.entries(routes).map(([key, data]) => (
          <span
            key={key}
            className={clsx(
              "px-4 py-2 cursor-pointer",
              key === route && "bg-gray-500"
            )}
            onClick={() => setRoute(key as any)}
          >
            {data.title}
          </span>
        ))}
      </div>
      <div className="flex-1 flex flex-col bg-gray-700">
        <RouteComponent />
      </div>
    </div>
  );
};

export default App;
