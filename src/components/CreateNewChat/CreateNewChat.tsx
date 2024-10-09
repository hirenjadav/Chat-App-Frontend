import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoComplete } from "primereact/autocomplete";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";

export default function CreateNewChat() {
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const [friendList, setFriendList] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [userList, setuserList] = useState("");

  const navigate = useNavigate();

  const searchFriend = () => {
    setShowLoading(true);
    httpServices
      .get(API_ENDPOINT_CONSTANTS.FRIENDS)
      .then((response) => {
        console.log(response);
        if (response["status"] == "success") {
          localStorage.setItem("userData", JSON.stringify(response["data"]));
          localStorage.setItem("token", response["data"]["accessToken"]);
          navigate("/chat");
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: response?.data?.errorDescription
              ? response?.data?.errorDescription
              : "Something Went Wrong",
          });
        }
      })
      .finally(() => setShowLoading(false));
  };

  return (
    <div>
      <AutoComplete
        value={searchField}
        placeholder="Search Chat"
        className="w-100"
        inputClassName="w-100 rounded-4"
        suggestions={friendList}
        completeMethod={searchFriend}
        onChange={(e) => setSearchField(e.value)}
      />
    </div>
  );
}