import type { ErrorNotifProps } from "@/types";

const ErrorNotif: React.FC<ErrorNotifProps> = ({ error }) => {
  return (
    <>
      <div className="w-screen h-screen">
        <div className="w-11/12 mx-auto h-full flex justify-center items-center">
          <div className="relative h-14 w-fit flex items-center gap-2 py-3 px-5 rounded-lg text-base font-medium [transition:all_0.5s_ease] border-solid border border-[#f85149] text-[#b22b2b] [&amp;_svg]:text-[#b22b2b] group bg-[linear-gradient(#f851491a,#f851491a)]">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="28"
              width="28"
              className="h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
            <p className="text-lg">{error}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorNotif;
