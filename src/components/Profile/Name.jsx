import { useEffect, useRef, useState } from "react";
import { useUser } from "../../features/authentication/useUser";
import { RiCheckFill, RiEdit2Line } from "react-icons/ri";
import { updateProfile } from "../../services/apiProfileUpdate";

function Name() {
  const { user, updateUser } = useUser();
  const {
    user_metadata: { fullname },
  } = user;

  const [newName, setNewName] = useState(fullname || "");
  const [isEditing, setIsEditing] = useState(false);

  // Highest length of a name is 25 characters
  const MAX_NAME_LENGTH = 25;
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  function handleUpdate() {
    if (!isEditing) return setIsEditing(true);

    const trimmedName = newName.trim();

    if (trimmedName === "") return console.log("The field cannot be empty.");
    if (trimmedName === fullname) return setIsEditing(false);

    if (isEditing) {
      updateProfile({ data: { fullname: trimmedName } });
      updateUser();
      setIsEditing(false);
      return;
    }
  }

  return (
    <div className="mt-8">
      <p className="text-textViolet dark:text-textViolet-dark select-none text-sm font-bold  tracking-wider opacity-80">
        Name
      </p>
      <div className=" flex h-10 items-center justify-between gap-2">
        {isEditing ? (
          <>
            <input
              type="text"
              ref={inputRef}
              value={newName}
              onChange={(e) => {
                e.target.value.length <= MAX_NAME_LENGTH &&
                  setNewName(e.target.value);
              }}
              onBlur={handleUpdate}
              className="border-textViolet dark:border-textViolet-dark h-full w-full rounded-md border-b-2 bg-slate-700 px-2 text-base outline-none"
            />
            <span className="w-8 select-none text-sm opacity-60">
              {MAX_NAME_LENGTH - newName.length}
            </span>
          </>
        ) : (
          <p className="truncate px-2 text-base">{newName}</p>
        )}

        <button
          onClick={handleUpdate}
          disabled={newName === ""}
          className="text-textViolet dark:text-textViolet-dark rounded-full p-3 text-xl hover:bg-slate-700/90 disabled:pointer-events-none disabled:text-slate-700/90"
        >
          {isEditing ? <RiCheckFill /> : <RiEdit2Line />}
        </button>
      </div>
    </div>
  );
}

export default Name;
