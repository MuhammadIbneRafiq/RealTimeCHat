import { RiSendPlaneFill } from "react-icons/ri";
import { useMessages } from "../features/hooks/useMessages";
import { useUser } from "../features/authentication/useUser";
import { useRef, useState } from "react";
import { useSendNewMessage } from "../features/hooks/useSendNewMessage";
import { v4 as uuid } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import { useAppData } from "../contexts/AppDataContext";

function MessageInputBar() {
  const { currentConversation, setCurrentConversation } = useAppData();
  // const { conversation_id } = currentConversation.messages.conversation_id;
  // console.log(currentConversationId);
  const [newMessage, setNewMessage] = useState("");
  const { isSending, sendNewMessage } = useSendNewMessage();
  const { user } = useUser();
  // const { data, isPending } = useMessages();
  const conversationId = currentConversation?.id;
  const friendUserId = currentConversation?.friend?.id;
  const myUserId = user.id;
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  function handleSendNewMessage(e) {
    e.preventDefault();
    inputRef.current.focus();

    if (!newMessage) return;

    const messageObj = {
      id: uuid(),
      conversation_id: conversationId,
      friendUserId,
      myUserId,
      content: newMessage,
    };

    // Make the actual request to the server
    sendNewMessage(messageObj, {
      // onSuccess: (newData) => {
      // when conversation id is null, it means the conversation is new
      // if (conversationId === null) {
      //   queryClient.setQueryData(
      //     ["friend", messageObj.friendUserId, conversationId],
      //     (prevData) => ({
      //       ...prevData,
      //       pages: prevData.pages
      //         .slice()
      //         .map((page, index) =>
      //           index === 0
      //             ? page.map((message) =>
      //                 message.id === newData.id ? newData : message,
      //               )
      //             : page,
      //         ),
      //       // we need to update the current conversation here
      //       // conversationId: data.conversation_id,
      //     }),
      //   );
      // }
      // },
    });

    const optimisticMessage = {
      id: messageObj.id,
      content: messageObj.content,
      created_at: new Date(),
      sender_id: messageObj.myUserId,
    };

    // Update the cache with the optimistic message
    // if there is no conversation id, it means the conversation is new and the first message can not be optimistic because to access the query data we need the conversation id as one of the query keys
    if (conversationId) {
      queryClient.setQueryData(
        ["friend", messageObj.friendUserId, conversationId],
        (prevData) => {
          // console.log(prevData);

          return {
            ...prevData,
            // add the optimistic message to the first page's data
            pages: prevData.pages
              .slice()
              .map((page, index) =>
                index === 0
                  ? !page
                    ? [optimisticMessage]
                    : [...page, optimisticMessage]
                  : page,
              ),
          };
        },
      );
    }

    setNewMessage("");
  }

  return (
    <div className="px-4 py-2">
      <form className="mx-auto grid max-w-3xl grid-cols-[1fr_auto] overflow-hidden rounded-full  border  bg-lightSlate shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] dark:border-borderShade-dark dark:bg-lightSlate-dark">
        <input
          className="h-12 w-full bg-transparent pl-4 pr-2 outline-none"
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          placeholder="Message"
        />

        <button
          className={`m-1 flex h-10 w-10 items-center justify-center rounded-full bg-lightViolet text-2xl text-white hover:bg-lightViolet/80 active:scale-95 dark:bg-lightViolet-dark `}
          disabled={isSending}
          onClick={handleSendNewMessage}
          type="submit"
        >
          {isSending ? <Loader size="small" /> : <RiSendPlaneFill />}
        </button>
      </form>
    </div>
  );
}

export default MessageInputBar;
