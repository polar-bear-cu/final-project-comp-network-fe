import { X } from "lucide-react";

interface AddFriendPopupProps {
  setOpenAddFriendPopup: (bool: boolean) => void;
}

const AddFriendPopup = ({ setOpenAddFriendPopup }: AddFriendPopupProps) => (
  <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex justify-center items-center z-50">
    <div
      className="bg-white dark:bg-card rounded-xl w-[80%] h-[80%] p-6 relative shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer"
        onClick={() => setOpenAddFriendPopup(false)}
      >
        <X size={20} />
      </button>
      <p>This is Add Friend Popup</p>
    </div>
  </div>
);

export default AddFriendPopup;
