import {
  RiSearchLine,
  RiMenuLine,
  RiCloseFill,
  RiArrowLeftLine,
} from "react-icons/ri";
import { useUser } from "../authentication/useUser";
import { useConversations } from "./useConversations";
import Signout from "../authentication/Signout";
import ConversationItem from "./ConversationItem";
import { useEffect, useRef, useState } from "react";
import SearchView from "../userSearch/SearchView";
import Loader from "../../components/Loader";
import { useUi } from "../../contexts/UiContext";
import Dropdown from "../../components/DropdownMenu";
import { HiOutlineUserCircle } from "react-icons/hi2";

function MainSidebarContents() {
  const { conversations, isPending } = useConversations();
  const { openAccountView, isSearchView, openSearchView, closeSearchView } =
    useUi();
  const { user } = useUser();
  const { fullname, username, avatar_url } = user.user_metadata;
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const searchInputRef = useRef(null);

  useEffect(() => {
    setQuery("");
    if (!isSearchView && searchInputRef.current) {
      searchInputRef.current.blur();
    }
  }, [isSearchView]);

  function handleMenuBtnClick() {
    // if is searching then close search view else open menu
    if (isSearchView) {
      closeSearchView();
    } else {
      setIsMenuOpen((prev) => !prev);
    }
  }

  return (
    <div className="relative z-30 grid h-dvh h-screen h-svh select-none grid-cols-1 grid-rows-[auto_1fr] overflow-hidden">
      <div className="border-b border-borderShade p-2 dark:border-borderShade-dark">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="relative">
            <button
              className="relative z-50 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-lg hover:bg-black/10 dark:hover:bg-lightSlate/10"
              onClick={handleMenuBtnClick}
            >
              {isSearchView ? (
                <RiArrowLeftLine />
              ) : isMenuOpen ? (
                <RiCloseFill />
              ) : (
                <RiMenuLine />
              )}
            </button>

            {isMenuOpen && (
              <>
                {/* Overlay */}
                <div
                  onMouseDown={handleMenuBtnClick}
                  onTouchStart={handleMenuBtnClick}
                  className={`${
                    isMenuOpen
                      ? "pointer-events-auto visible"
                      : "pointer-events-none invisible"
                  }  fixed left-0 top-0 z-40 h-dvh h-screen h-svh w-dvw w-screen w-svw opacity-0 transition-all duration-200 ease-in-out`}
                ></div>

                {/* DropdownMenu */}

                <Dropdown />
              </>
            )}
          </div>

          {/* Profile */}
          <div
            className="mr-auto grid cursor-pointer grid-cols-[2.5rem_1fr] items-center gap-4 truncate rounded-lg p-2 hover:bg-black/10 dark:hover:bg-lightSlate/10"
            onClick={() => openAccountView()}
          >
            <span className="h-11 w-11 overflow-hidden rounded-full text-black  dark:text-white">
              {avatar_url ? (
                <img
                  draggable="false"
                  src={avatar_url}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <HiOutlineUserCircle
                  size={55}
                  viewBox="2 2 24 24"
                  opacity={0.5}
                  strokeWidth="1"
                />
              )}
            </span>

            <span className="flex flex-col truncate">
              <span className="truncate">{fullname}</span>
              <span className="truncate text-sm opacity-70">@{username}</span>
            </span>
          </div>

          <Signout />
        </div>

        <div className="relative">
          <input
            className="flex w-full grow items-center justify-between self-stretch overflow-hidden rounded-full border border-borderShade bg-lightSlate p-2 pl-9 outline-none transition-all duration-200 ease-in-out focus:ring-2 focus:ring-darkViolet dark:border-borderShade-dark dark:bg-lightSlate-dark dark:focus:ring-textViolet-dark"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            onClick={() => openSearchView()}
            placeholder="Search people"
            ref={searchInputRef}
          />

          <span className="pointer-events-none absolute left-3 top-3 text-xl opacity-40">
            <RiSearchLine />
          </span>
        </div>
      </div>

      <div className="h-full  overflow-auto">
        {isSearchView && <SearchView query={query} />}

        {!isSearchView && (
          <div className="grid h-full grid-rows-[auto_1fr]">
            <h2 className="border-borderShadep border-b p-2 text-lg dark:border-borderShade-dark">
              Chats
            </h2>

            <div className="h-full overflow-auto p-2">
              {isPending && (
                <span className="mt-8 flex flex-col items-center justify-center">
                  <Loader size="medium" text="Loading chats" />
                </span>
              )}

              {!isPending &&
                conversations?.map((conv) => (
                  <ConversationItem
                    key={conv?.friendInfo?.id}
                    conversation={conv}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainSidebarContents;
