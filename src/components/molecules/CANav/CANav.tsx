import kz from "@/assets/icon/kazakhstan-1.svg";
import uzb from "@/assets/icon/uzbekistan-1.svg";
import tjk from "@/assets/icon/tajikistan.svg";
import trk from "@/assets/icon/turkmnst.svg";
import { Link } from "react-router-dom";

function CANav() {
  return (
    <div className="flex items-center justify-center h-full ">
      <div className="w-12 h-40 flex flex-col justify-between items-center bg-white rounded-lg ">
        <Link
          to="/central/kazakhstan"
          className="rounded-t-lg hover:bg-gray-300 w-full h-full"
        >
          <div className="flex-1 w-full flex items-center justify-center ">
            <img
              src={kz}
              alt="Kazakhstan"
              className="w-10 h-10 object-contain rounded-md "
            />
          </div>
        </Link>
        <Link
          to="/central/uzbekistan"
          className="hover:bg-gray-300 w-full h-full"
        >
          <div className="flex-1 w-full flex items-center justify-center">
            <img
              src={uzb}
              alt="Uzbekistan"
              className="w-10 h-10 object-contain rounded-lg"
            />
          </div>
        </Link>
        <Link
          to="/central/tadjikistan"
          className="hover:bg-gray-300 w-full h-full"
        >
          <div className="flex-1 w-full flex items-center justify-center ">
            <img
              src={tjk}
              alt="Tajikistan"
              className="w-10 h-10 object-contain"
            />
          </div>
        </Link>
        <Link
          to="/central/turkmenistan"
          className="rounded-b-lg hover:bg-gray-300 w-full h-full"
        >
          <div className="flex-1 w-full flex items-center justify-center rounded-lg">
            <img
              src={trk}
              alt="Turkmenistan"
              className="w-10 h-10 object-contain"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default CANav;
