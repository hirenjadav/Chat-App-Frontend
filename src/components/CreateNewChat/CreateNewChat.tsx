import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import FontIconWrapper from "../FontIconWrapper";
import "./CreateNewChat.scss";
import { CONVESATION_TYPES } from "../../constants/conversationTypes.constant";
import { useDispatch, useSelector } from "react-redux";
import { chatDetailsActions } from "../../state/chatDetailsSlice";
import { ChatDetailsMapper } from "../../models/chatDetails.model";
import { UserDetails } from "../../models/userDetails.model";
import { userDetailsSelector } from "../../state/userDetailsSlice";

export default function CreateNewChat() {
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const [searchField, setSearchField] = useState("");
  const [userList, setuserList] = useState<any[]>([]);
  const dispatch = useDispatch();
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails
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

  const handleSuggestionSelect = (e) => {
    if (!e.value?.id) return;

    const newConversation = {
      conversationType: CONVESATION_TYPES.PERSONAL,
      participantIds: [e.value.id],
    };

    httpServices
      .post(API_ENDPOINT_CONSTANTS.CRAETE_CHAT, newConversation)
      .then((response) => {
        if (response["status"] == "success") {
          const mappedDetails = ChatDetailsMapper(response.data);
          dispatch(chatDetailsActions.setChatDetails(mappedDetails));
          setSearchField("");
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
