import { useMessages } from "./useMessages";
import MessageItem from "./MessageItem";
import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import useScrollBehavior from "./useScrollBehavior";

function Messages() {
  const {
    pages,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage,
    error,
  } = useMessages();

  const topRef = useRef(null);
  const bottomRef = useRef();
  const lastPageBtm = useRef(null);
  const [topElement, setTopElement] = useState(null);

  const isIntersectingTop = useIntersectionObserver(topElement);
  const isIntersectingBtm = useIntersectionObserver(bottomRef.current);

  // Top ref depends on hasNextPage so we need to update it when it changes
  useEffect(() => {
    if (topRef.current) {
      // Set the top element after 1 second to avoid fetching the next page immediately when user loads the page first time.
      const timeoutId = setTimeout(() => {
        setTopElement(topRef.current);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [hasNextPage]);

  // Fetch next page when the bottom ref is in view
  useEffect(() => {
    if (isIntersectingTop && hasNextPage) {
      fetchNextPage();
    }
  }, [isIntersectingTop, hasNextPage, fetchNextPage]);

  ////////////
  // Scroll behavior hook
  ////////////
  useScrollBehavior({
    pages,
    bottomRef,
    lastPageBtm,
    isIntersectingTop,
    isIntersectingBtm,
  });

  /////////////
  // show an error message when there is an error
  /////////////

  if (error)
    return (
      <span className="flex items-center justify-center opacity-60">
        ⚠️ {error.message}
      </span>
    );

  /////////////
  // show a loader when fetching the first page
  /////////////

  if (isLoading)
    return (
      <span className="mb-4 flex items-center justify-center">
        <Loader size="medium" text="Loading messages" />
      </span>
    );

  return (
    <div
      tabIndex={-1}
      className="mx-auto grid w-full max-w-3xl grid-cols-1 grid-rows-[auto] items-end overflow-y-auto px-4"
    >
      {pages && !pages[0] && (
        <span className="my-4 flex select-none items-center justify-center opacity-60">
          No messages yet
        </span>
      )}

      {pages && pages[0] && (
        <>
          {hasNextPage && (
            <span ref={topRef}>{isFetchingNextPage && <Loader />}</span>
          )}

          {pages.map((page, index) =>
            page.length ? (
              <span key={index} className="flex w-full flex-col">
                {page.map((message) => (
                  <MessageItem key={message.id} message={message} />
                ))}

                {index === 0 && <span ref={lastPageBtm}></span>}
              </span>
            ) : (
              <span
                key={index}
                className="mx-auto my-4 h-2 w-2 select-none  rounded bg-lightSlate opacity-60 dark:bg-lightSlate-dark"
              ></span>
            ),
          )}
        </>
      )}

      <span ref={bottomRef}></span>
    </div>
  );
}

export default Messages;
