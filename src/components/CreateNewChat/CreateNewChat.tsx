import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import FontIconWrapper from "../FontIconWrapper";
import { CONVERSATION_TYPES } from "../../constants/conversationTypes.constant";
import { ChatDetailsMapper } from "../../models/chatDetails.model";
import { UserDetails } from "../../models/userDetails.model";
import { userDetailsSelector } from "../../state/userDetailsSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface CreateNewChatProps {
  inputDisabled: boolean;
}

export default function CreateNewChat({ inputDisabled }: CreateNewChatProps) {
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const [searchField, setSearchField] = useState("");
  const [userList, setuserList] = useState<any[]>([]);
  const navigate = useNavigate();
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails,
  );

  const phoneNumberRegExp: RegExp = /\b\d{10}\b/;
  const emailRegExp: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const searchFriend = (searchValue: string) => {
    setShowLoading(true);
    const filters = {
      search: searchValue,
    };

    httpServices
      .get(API_ENDPOINT_CONSTANTS.USERS, filters)
      .then((response) => {
        if (response["status"] == "success") {
          let list: any[] = response["data"];
          list = list.filter((x) => x.id != userDetails.id);
          if (!list.length) {
            if (emailRegExp.test(searchValue)) {
              list.push({
                id: null,
                fullName: `Start chat with ${searchValue}`,
                email: searchValue,
              });
            }

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

  const handleSuggestionSelect = (e: any) => {
    if (!e.value?.id) return;

    const newConversation = {
      conversationType: CONVERSATION_TYPES.PERSONAL,
      participantIds: [e.value.id],
    };

    httpServices
      .post(API_ENDPOINT_CONSTANTS.CRAETE_CHAT, newConversation)
      .then((response) => {
        if (response["status"] == "success") {
          setSearchField("");
          const mappedDetails = ChatDetailsMapper(response.data);
          navigate("/chat/" + mappedDetails.id);
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
    <div className="relative">
      <FontIconWrapper
        icon="fa-solid fa-magnifying-glass"
        className="absolute left-3 top-1/2 z-[1] -translate-y-1/2"
      />
      <AutoComplete
        value={searchField}
        placeholder="Search Chat"
        className="w-full"
        disabled={inputDisabled}
        loadingIcon="''"
        inputClassName="w-full ps-8 rounded-[15px]"
        field="fullName"
        suggestions={userList}
        completeMethod={(e) => searchFriend(e.query)}
        onChange={(e) => setSearchField(e.value)}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
}
