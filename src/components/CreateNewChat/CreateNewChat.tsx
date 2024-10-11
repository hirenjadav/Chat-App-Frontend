import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import FontIconWrapper from "../FontIconWrapper";
import "./CreateNewChat.scss";
import { useNavigate } from "react-router-dom";

export default function CreateNewChat() {
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const [searchField, setSearchField] = useState("");
  const [userList, setuserList] = useState<any[]>([]);
  const navigate = useNavigate();

  const phoneNumberRegExp: RegExp = /\b\d{10}\b/;
  const emailRegExp: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const searchFriend = (searchValue: string) => {
    setShowLoading(true);
    const filters = {
      search: searchValue,
    };

    httpServices
      .get(API_ENDPOINT_CONSTANTS.FRIENDS, filters)
      .then((response) => {
        if (response["status"] == "success") {
          const list: any[] = response["data"];
          if (!list.length) {
            // if (emailRegExp.test(searchValue)) {
            //   list.push({
            //     id: null,
            //     fullName: `Start chat with ${searchValue}`,
            //     email: searchValue,
            //   });
            // }

            if (phoneNumberRegExp.test(searchValue)) {
              list.push({
                id: null,
                fullName: `Start chat with ${searchValue}`,
                phoneNumber: searchValue,
              });
            }
          }
          setuserList(list);
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

  const handleSuggestionSelect = (e) => {
    if(e.value?.id) {
      navigate('/chat/' + e.value.id);
    } else {
      navigate('/chat/new', { state: { phoneNumber: e.value.phoneNumber } });
    }
    setSearchField("");
  };

  return (
    <div className="new-chat-input-wrapper">
      <FontIconWrapper icon="fa-solid fa-magnifying-glass" />
      <AutoComplete
        value={searchField}
        placeholder="Search Chat"
        className="w-100"
        loadingIcon="''"
        inputClassName="w-100 rounded-5 input-field"
        field="fullName"
        suggestions={userList}
        completeMethod={(e) => searchFriend(e.query)}
        onChange={(e) => setSearchField(e.value)}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
}
