import { Box, Button, Image, useToast } from "@chakra-ui/react";
import axios from "axios";
import { Config } from "../../Utils/Config";
import defaultProfilePic from "../../../assets/images/profile.svg"; 
import editIcon from "../../../assets/icons/edit_pfp.svg";

const ProfileImage = ({ type, profilePic, setProfilePic }) => {
  const toast = useToast();




  const handleImageChange = async (e) => {
 console.log("handleImageChange triggered", e.target.files);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];


      console.log("Selected file:", file);
    console.log("type value:", type); 
      // Preview update
      const reader = new FileReader();
      reader.onload = (upload) => {
        setProfilePic(upload.target.result);
      };
      reader.readAsDataURL(file);

      // Backend API call
      try {
        const formData = new FormData();
       formData.append("image", file); 
        formData.append("type", type);


      for (let [key, value] of formData.entries()) {
  console.log("FormData key:", key, "value:", value);
}


        const response = await axios.post(
          Config.imageUpdate_url,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          toast({
            title: "Profile Image Updated",
            description: "Your profile picture was updated successfully.",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Update failed",
            description: "Unexpected server response.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        toast({
          title: "Upload failed",
          description: err?.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box position="relative" width="95px" height="95px">
      <Image
        src={profilePic || defaultProfilePic} //  fallback if no profilePic
        boxSize="100px"
        borderRadius="full"
        border="3px solid white"
        boxShadow="xs"
        width="95px"
        aspectRatio="1/1"
        objectFit="contain"
      />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        id="profile-upload"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      {/* Button opens file picker */}
      <Button
        as="label"
        htmlFor="profile-upload"
        position="absolute"
        bottom="0"
        left="50%"
        transform="translate(-50%, 50%)"
        borderRadius="full"
        size="sm"
        bg="white"
        border="2px solid rgba(11,12,20,25%)"
        p={1}
        cursor="pointer"
      >
        <Image src={editIcon} boxSize="15px" />
      </Button>
    </Box>
  );
};

export default ProfileImage;