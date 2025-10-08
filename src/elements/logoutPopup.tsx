import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LogoutPopupProps {
  setOpenLogoutPopup: (bool: boolean) => void;
  handleLogout: () => void;
}

const LogoutPopup = ({
  setOpenLogoutPopup,
  handleLogout,
}: LogoutPopupProps) => {
  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-white dark:bg-card rounded-xl w-[300px] p-6 relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer"
          onClick={() => setOpenLogoutPopup(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-primary dark:text-white">
          Log out
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-6">
          Are you sure you want to log out?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="cursor-pointer text-primary dark:text-white"
            onClick={() => setOpenLogoutPopup(false)}
          >
            Cancel
          </Button>
          <Button className="cursor-pointer text-white" onClick={handleLogout}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
