import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import FontIconWrapper from "../FontIconWrapper";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { userDetailsSelector } from "../../state/userDetailsSlice";
import { useSelector } from "react-redux";
import { AutoComplete } from "primereact/autocomplete";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import { UserDetails } from "../../models/userDetails.model";
import { CONVERSATION_TYPES } from "../../constants/conversationTypes.constant";
import { ChatDetailsMapper } from "../../models/chatDetails.model";
import { useNavigate } from "react-router-dom";

export default function CreateNewGroup() {
  const [visible, setVisible] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [userSuggestionList, setUserSuggestionList] = useState<any[]>([]);
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails,
  );

  const [createGroup, setCreateGroup] = useState({
    name: "",
    members: [],
  });

  useEffect(() => {
    if (!visible)
      setCreateGroup({
        name: "",
        members: [],
      });
  }, [visible]);

  const onInputChange = (event: any, field: "name" | "members") => {
    let value = null;
    if (field == "name") value = event.target.value;
    if (field == "members") value = event.value;
    setCreateGroup({
      ...createGroup,
      [field]: value,
    });
  };

  const searchUsers = (searchValue: string) => {
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
          list = list.filter(
            (user) => !userSuggestionList.some((u) => u.id == user.id),
          );
          setUserSuggestionList(list);
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

  const handleCreateNewGroup = () => {
    if (!createGroup.name) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Group Name Missing",
      });
      return;
    }

    if (createGroup.members.length < 2) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Select at least two members",
      });
      return;
    }

    const newConversation = {
      conversationType: CONVERSATION_TYPES.GROUP,
      name: createGroup.name,
      participantIds: createGroup.members.map((x) => x.id),
    };

    httpServices
      .post(API_ENDPOINT_CONSTANTS.CRAETE_CHAT, newConversation)
      .then((response) => {
        if (response["status"] == "success") {
          setVisible(false);
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

  const footerContent = () => {
    return (
      <div className="flex items-center justify-end gap-x-3">
        <Button
          onClick={() => setVisible(false)}
          label="Cancel"
          outlined
        ></Button>

        <Button onClick={handleCreateNewGroup} label="Create" />
      </div>
    );
  };

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        rounded
        text
        raised
        severity="info"
      >
        <FontIconWrapper icon="fa-solid fa-plus" />
      </Button>

      <Dialog
        header="Create Group"
        visible={visible}
        closable={false}
        footer={footerContent}
        style={{
          minWidth: "400px",
          width: "50vw",
          maxWidth: "700px",
        }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <label>Group Name</label>
            <InputText
              value={createGroup.name}
              placeholder="Enter group name"
              className="w-100"
              onInput={(e) => onInputChange(e, "name")}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label>Group Members</label>
            <AutoComplete
              inputId="membersInputId"
              placeholder="Search users"
              value={createGroup.members}
              multiple
              className="w-full"
              loadingIcon="''"
              field="fullName"
              pt={{
                container: {
                  className: "w-full",
                },
              }}
              suggestions={userSuggestionList}
              completeMethod={(e) => searchUsers(e.query)}
              onChange={(e) => onInputChange(e, "members")}
            />
          </div>
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
}
