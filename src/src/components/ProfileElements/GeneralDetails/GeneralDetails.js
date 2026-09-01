import React from 'react'
import profilePic from "../../../assets/images/profile.svg"
import editIcon from "../../../assets/icons/edit_pfp.svg"
import verified_icon from "../../../assets/icons/verified_icon.svg"
import { Box, Select, Button, Input, InputGroup, Image, HStack, Text, VStack } from "@chakra-ui/react";

const GeneralDetails = (GeneralDetailsObj) => {

    const InputStyle = {
        padding: "12px 15px",
        _placeholder: { color: "black" },
        color: "black",
        borderRadius: "12px",
        width: "100%",
        height: "48px",
        boxShadow: "0px 1px 2px rgba(0,0,0,5%)",
        border: "none",
        iconcolor: "#8B8D97"
    };
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
                        <Box position="relative" width={"95px"} height={"95px"}>
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
                        </Box>

                        {/* Manufacturer Logo Text */}
                        <Text fontSize="10px" marginTop={"10px"} color="#8C8C91" fontWeight="400">
                            Manufacturer Logo
                        </Text>
                    </VStack>

                    <VStack flexWrap={"wrap"} gap={"1.25rem"} align={"start"}>
                        <HStack>
                            <VStack align={"start"} marginRight={"0.45rem"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    Registered Company Name<sup>*</sup>
                                </Text>
                                <Input sx={InputStyle} placeholder={GeneralDetailsObj?.CompanyName} />
                            </VStack>

                            <VStack align={"start"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    Type of Company<sup>*</sup>
                                </Text>
                                <Select sx={InputStyle} width={"165px"} _placeholder={{ color: "black", fontSize: "14px" }}>
                                    <option style={{ fontSize: "16px", color: "black" }} value="partnership_firm">
                                        Partnership Firm
                                    </option>
                                </Select>
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
                                    _placeholder={{ color: "black" }}
                                    color="black"
                                    placeholder={GeneralDetailsObj?.EmailAddress}
                                    flex="1"

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

                        <VStack width={"100%"} align={"start"} marginRight={"0.45rem"}>
                            <Text fontSize={"14px"} color={"#8C8C91"}>
                                Drug Manufacturing License<sup>*</sup>
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
                                    _placeholder={{ color: "black" }}
                                    color="black"
                                    placeholder={GeneralDetailsObj?.ManufacturingLicenseId}
                                    flex="1"
                                />
                            </HStack>

                        </VStack>

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
                                {/* Email Input taking full width */}
                                <Input
                                    variant={"unstyled"}
                                    type="email"
                                    padding="12px 10px"
                                    border="none"
                                    _focus={{ border: "none", outline: "none" }}
                                    _active={{ border: "none", outline: "none" }}
                                    _placeholder={{ color: "black" }}
                                    color="black"
                                    placeholder={GeneralDetailsObj?.WholesaleLicenseId || GeneralDetailsObj?.ManufacturingLicenseId}
                                    flex="1"
                                />
                            </HStack>

                        </VStack>

                    </VStack>

                    <VStack flexWrap={"wrap"} gap={"1.25rem"} align={"start"}>
                        <HStack>
                            <VStack align={"start"} marginRight={"0.45rem"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    Phone Number<sup>*</sup>
                                </Text>
                                <InputGroup>
                                    <Select
                                        sx={InputStyle}
                                        fontSize="14px"
                                        height="48px"
                                        iconcolor="#8B8D97"

                                        width="100px"
                                        defaultValue="+91"
                                    >
                                        <option value="+91">+91</option>
                                    </Select>
                                    <Input
                                        sx={InputStyle}
                                        iconcolor="#8B8D97"
                                        fontSize="14px"
                                        type='tel' placeholder={GeneralDetailsObj?.PhoneNumber}
                                    />
                                </InputGroup>
                            </VStack>

                            <VStack align={"start"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    PAN<sup>*</sup>
                                </Text>
                                <Input sx={InputStyle} type='tel' placeholder={GeneralDetailsObj?.PAN} />
                            </VStack>
                        </HStack>
                        <HStack width={"100%"}>

                            <VStack flex={1} align={"start"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    GST Number<sup>*</sup>
                                </Text>
                                <Input sx={InputStyle} type='tel' placeholder={GeneralDetailsObj?.GST}
                                />
                            </VStack>
                            <VStack flex={1} align={"start"}>
                                <Text fontSize={"14px"} color={"#8C8C91"}>
                                    CIN No.<sup>*</sup>
                                </Text>
                                <Input sx={InputStyle} type='tel' placeholder={GeneralDetailsObj?.CIN}
                                />
                            </VStack>

                        </HStack>
                        <VStack align={"start"} width={"100%"}>
                            <Text fontSize={"14px"} color={"#8C8C91"}>
                                FSSAI License (for Nutraceuticals, Optional)
                            </Text>
                            <Input sx={InputStyle} type='tel' placeholder={GeneralDetailsObj?.FSSAI}
                            />
                        </VStack>
                    </VStack>

                </HStack>


            </VStack>
        </HStack>

    )
}

export default GeneralDetails