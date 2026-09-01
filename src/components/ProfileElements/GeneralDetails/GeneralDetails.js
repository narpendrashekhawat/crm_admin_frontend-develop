import React, {useState, useEffect} from 'react'
import { Box, Select, Button, Input, InputGroup, Image, HStack, Text, VStack,  Menu,  MenuButton,  MenuList,  MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import profilePic from "../../../assets/images/profile.svg"
import editIcon from "../../../assets/icons/edit_pfp.svg"
import verified_icon from "../../../assets/icons/verified_icon.svg"
import ProfileImage from "../GeneralDetails/ProfileImage"


const GeneralDetails = ({isdrugLicense, iswholesaleLicense, GeneralDetailsObj, onChange = ()=>{} }) => {
    console.log(GeneralDetailsObj, "giuuiuiiuien");
const [companyType, setCompanyType] = useState("");
// const companyTypes = [
//     { value: "sole_proprietorship", label: "Sole Proprietorship" },
//     { value: "partnership_firm", label: "Partnership Firm" },
//     { value: "llp", label: "Limited Liability Partnership (LLP)" },
//     { value: "private_limited", label: "Private Limited Company" },
//     { value: "public_limited", label: "Public Limited Company" },
//     { value: "opc", label: "One Person Company (OPC)" },
//     { value: "section_8", label: "Section 8 Company" },
//     { value: "producer", label: "Producer Company" },
//     { value: "nidhi", label: "Nidhi Company" },
//     { value: "unlimited", label: "Unlimited Company" },
//     { value: "other", label: "Other" },
//   ];


    const InputStyle = {
        padding: "12px 15px",
        _placeholder: { color: "#bebcbcff" },
        color: "black",
        borderRadius: "12px",
        width: "100%",
        height: "48px",
        boxShadow: "0px 1px 2px rgba(0,0,0,5%)",
         border: "1px solid #bfc0c540 ",
        iconcolor: "#8B8D97"
    };


    const [profilePic, setProfilePic] = useState("");

  // Default profile 
  useEffect(() => {
    if (GeneralDetailsObj?.profilePicUrl) {
      setProfilePic(GeneralDetailsObj.profilePicUrl);
    }
  }, [GeneralDetailsObj]);
    
    return (
        <HStack height={"445px"} align={"start"}>
            <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
                <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
                <Box width="1px" height="full" backgroundColor="#DCDCDE" />
            </VStack>
            <VStack align={"start"} id='general'>
                <VStack align={"start"} gap={0} marginBottom={"1rem"}>
                    <Text fontSize={"18px"} color={"#0B0C14"}>Profile</Text>
                    <Text fontSize={"16px"} color={"#8C8C91"}>General Details</Text>
                </VStack>

                <HStack gap={"2.5rem"} align={"start"}>
                    <VStack position="relative">
                        {/* Profile Image */}
                        {/* <Box position="relative" width={"95px"} height={"95px"}>
                            <Image
                                src={profilePic}
                                boxSize="100px"
                                borderRadius="full"
                                border="3px solid white"
                                boxShadow="xs"
                                width={"95px"}
                                aspectRatio={"1/1"}
                                objectFit={"contain"}
                            />

                            <Button
                                position="absolute"
                                bottom="0"
                                left="50%"
                                transform="translate(-50%, 50%)"
                                borderRadius="full"
                                size="sm"
                                bg="white"
                                border="2px solid rgba(11,12,20,25%)"
                                p={1}
                                
                            >
                                <Image src={editIcon} boxSize="15px" />
                            </Button>
                        </Box> */}


                        <ProfileImage  profilePic={profilePic} setProfilePic={setProfilePic}  type={GeneralDetailsObj?.userType}  />

                        {/* Manufacturer Logo Text */}
                        <Text fontSize="10px" marginTop={"10px"} color="#8C8C91" fontWeight="400">
                             Logo
                        </Text>
                    </VStack>

                    <VStack flexWrap={"wrap"} gap={"1.25rem"} align={"start"}>
                        <HStack>
                            <VStack align={"start"} marginRight={"0.45rem"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    Registered Company Name<sup>*</sup>
                                </Text>
                                <Input sx={InputStyle}  type='text'  placeholder={GeneralDetailsObj?.companyName || "Enter company name"} value={GeneralDetailsObj?.companyName || ""} onChange={(e) => {
                                   onChange("firmName", e.target.value);   //  update actual backend field
                                   onChange("companyName", e.target.value); //  keep prepared object in sync if needed
                                 }} />
                            </VStack>

                            <VStack align={"start"} marginRight={"0.45rem"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    Owner Name<sup>*</sup>
                                </Text>
                                <Input sx={InputStyle}  type='text'  placeholder={GeneralDetailsObj?.ownerName || "Enter owner name"} value={GeneralDetailsObj?.ownerName || ""} onChange={(e) => {
                                   onChange("ownerName", e.target.value); //  keep prepared object in sync if needed
                                 }} />
                            </VStack>

                            <VStack align={"start"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                  Type of Company<sup>*</sup>
                                </Text>
                              
                                <Menu>
                                  <MenuButton sx={InputStyle} bg={"#fff"} fontWeight={"400"} as={Button} rightIcon={<ChevronDownIcon />}>
                                     {GeneralDetailsObj?.companyType || "Select Company Type"}
                                  </MenuButton>
                                   <MenuList>
                                    {[
                                      "Sole Proprietorship",
                                      "Partnership Firm",
                                      "Limited Liability Partnership (LLP)",
                                      "Private Limited Company",
                                      "Public Limited Company",
                                      "One Person Company (OPC)",
                                      "Section 8 Company",
                                      "Producer Company",
                                      "Nidhi Company",
                                      "Unlimited Company",
                                      "Other",
                                    ].map((type) => (
                                      <MenuItem
                                        key={type}
                                        onClick={() => onChange("companyType", type)}
                                      >
                                        {type}
                                      </MenuItem>
                                    ))}
                                  </MenuList>
                                </Menu>
                              </VStack>

                        </HStack>

                        <VStack width={"100%"} align={"start"} marginRight={"0.45rem"}>
                            <Text fontSize={"14px"} color={"#8C8C91"}>
                                E-mail address<sup>*</sup>
                            </Text>
                            <HStack
                                sx={InputStyle}
                                width="100%"
                                borderRadius="12px"
                                height="48px"
                                dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                                border="1px solid #E2E8F0"
                                padding="0 12px"
                                justifyContent="space-between"
                            >
                                {/* Email Input taking full width */}
                                <Input
                                   
                                    variant={"unstyled"}
                                    type="email"
                                    padding="12px 10px"
                                    border="none"
                                    _focus={{ border: "none", outline: "none" }}
                                    _active={{ border: "none", outline: "none" }}
                                    _placeholder={{ color: "#bebcbcff" }}
                                    color="black"
                                    placeholder={GeneralDetailsObj?.email || "Enter email address"}
                                    flex="1"
                                    value={GeneralDetailsObj?.email || ""}
                                   onChange={(e) => onChange("email", e.target.value)}
                                />

                                {/* Email Verified section aligned to the right */}
                               {
                                    true ? (<HStack flexShrink={0}>
                                        <Image src={verified_icon} />
                                        <Text color="#759E38" fontSize="14px">Email Verified</Text>
                                    </HStack>) : (
                                        <HStack flexShrink={0}>
                                            <span style={{ background: "red", height: "15px", width: "15px", borderRadius: "50%", border: "1px dashed white" }}></span>
                                            <Text color="red" fontSize="14px">Email Not Verified</Text>
                                        </HStack>
                                    )
                                }

                            </HStack>

                        </VStack>
                           { isdrugLicense === true ? (
                        <VStack width={"100%"} align={"start"} marginRight={"0.45rem"}>
                            <Text fontSize={"14px"} color={"#8C8C91"}>
                                Drug License<sup>*</sup>
                            </Text>
                            <HStack
                                sx={InputStyle}
                                width="100%"
                                borderRadius="12px"
                                height="48px"
                                dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                                border="1px solid #E2E8F0"
                                padding="0 12px"
                                justifyContent="space-between"
                            >
                                <Input
                                 
                                    variant={"unstyled"}
                                    type="tel"
                                    padding="12px 10px"
                                    border="none"
                                    _focus={{ border: "none", outline: "none" }}
                                    _active={{ border: "none", outline: "none" }}
                                    _placeholder={{ color: "#bebcbcff" }}
                                    color="black"
                                    flex="1"
                                    placeholder={GeneralDetailsObj?.drugLicense || "Enter drugLicense number"}
                                    value={GeneralDetailsObj?.drugLicense || ""}
                                    onChange={(e) => onChange("drugLicense", e.target.value)}
                                />
                            </HStack>

                        </VStack>
                           ) : null}
                         { iswholesaleLicense === true ? (
                        <VStack width={"100%"} align={"start"} marginRight={"0.45rem"}>
                            <Text fontSize={"14px"} color={"#8C8C91"}>
                                Wholesale Drug License (Optional)
                            </Text>
                            <HStack
                                sx={InputStyle}

                                width="100%"
                                borderRadius="12px"
                                height="48px"
                                dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                                border="1px solid #E2E8F0"
                                padding="0 12px"
                                justifyContent="space-between"
                            >
                                <Input 
                                    variant={"unstyled"}
                                    type="text"
                                    padding="12px 10px"
                                    border="none"
                                    _focus={{ border: "none", outline: "none" }}
                                    _active={{ border: "none", outline: "none" }}
                                    _placeholder={{ color: "#bebcbcff" }}
                                    color="black"
                                    flex="1"
                                    placeholder={GeneralDetailsObj?.wholesaleLicense || "Enter wholesaleLicense number"}
                                    value={GeneralDetailsObj?.wholesaleLicense || ""}
                                    onChange={(e) => onChange("wholesaleLicense", e.target.value)}
                                />
                            </HStack>

                        </VStack>
                       ) : null}
                    </VStack>

                    <VStack flexWrap={"wrap"} gap={"1.25rem"} align={"start"}>
                        <HStack>
                            <VStack align={"start"} marginRight={"0.45rem"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    Phone Number<sup>*</sup>
                                </Text>
                                <Input sx={InputStyle} type='number'  placeholder={GeneralDetailsObj?.phone || "Enter phone number"} value={GeneralDetailsObj?.phone || ""} onChange={(e) => onChange("phone", e.target.value)} />
                               
                            </VStack>

                            <VStack align={"start"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    PAN<sup>*</sup>
                                </Text>
                                <Input sx={InputStyle} type='text' placeholder={GeneralDetailsObj?.PAN || "Enter PAN Number"} value={GeneralDetailsObj?.PAN || ""} onChange={(e) => onChange("PAN", e.target.value)} />
                            </VStack>
                        </HStack>
                        <HStack width={"100%"}>

                            <VStack flex={1} align={"start"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    GST Number<sup>*</sup>
                                </Text>
                                <Input sx={InputStyle} type='text' placeholder={GeneralDetailsObj?.GST || "Enter GST Number"} value={GeneralDetailsObj?.GST || ""} onChange={(e) => onChange("GST", e.target.value)}
                                />
                            </VStack>
                            <VStack flex={1} align={"start"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    CIN No.<sup>*</sup>
                                </Text>
                                <Input sx={InputStyle} type='text' placeholder={GeneralDetailsObj?.CIN || "Enter CIN Number"} value={GeneralDetailsObj?.CIN || ""} onChange={(e) => onChange("CIN", e.target.value)}
                                />
                            </VStack>

                        </HStack>
                        <VStack align={"start"} width={"100%"}>
                            <Text fontSize={"14px"} color={"#8C8C91"}>
                                FSSAI License (for Nutraceuticals, Optional)
                            </Text>
                            <Input sx={InputStyle} type='tel' placeholder={GeneralDetailsObj?.fssaiLicense || "Enter FSSAI License Number"}
                             value={GeneralDetailsObj?.fssaiLicense || ""}
                               onChange={(e) => onChange("fssaiLicense", e.target.value)}
                            />
                        </VStack>
                    </VStack>

                </HStack>


            </VStack>
        </HStack>

    )
}

export default GeneralDetails